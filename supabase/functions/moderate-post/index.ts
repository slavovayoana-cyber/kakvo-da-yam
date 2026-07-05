// ============================================================
//  Edge функция „moderate-post" (име в Supabase: hyper-processor)
//  Пуска се при нов пост (DB тригер feed_posts_moderate).
//  Проверява снимките през Sightengine и записва mod_status.
//
//  Записът се прави през RPC feed_set_moderation (SECURITY DEFINER),
//  защото подаваният ключ невинаги действа като service_role → RLS
//  връщаше 403 при директен PATCH.
//
//  Тайни (Edge Functions → Secrets):
//    SIGHTENGINE_USER, SIGHTENGINE_SECRET
//  (SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY се подават автоматично.)
// ============================================================

const SE_USER = Deno.env.get("SIGHTENGINE_USER") ?? "";
const SE_SECRET = Deno.env.get("SIGHTENGINE_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
  Deno.env.get("SERVICE_ROLE_KEY") ??
  "";
// Споделен таен код с DB функцията feed_set_moderation (не е потребителски ключ).
const DB_SECRET = "kdy_mod_a7f3c9e21b";

const MODELS = "nudity-2.1,gore-2.0,weapon,offensive-2.0,recreational_drug";
const T = { nudity: 0.6, gore: 0.6, weapon: 0.7, offensive: 0.6, drugs: 0.7 };

interface Verdict { unsafe: boolean; labels: Record<string, unknown>; }

async function checkImage(url: string): Promise<Verdict> {
  const api = new URL("https://api.sightengine.com/1.0/check.json");
  api.searchParams.set("url", url);
  api.searchParams.set("models", MODELS);
  api.searchParams.set("api_user", SE_USER);
  api.searchParams.set("api_secret", SE_SECRET);

  const res = await fetch(api.toString());
  const data = await res.json();
  if (data.status !== "success") return { unsafe: false, labels: { error: data.error ?? data } };

  const nud = data.nudity ?? {};
  const nudityScore = Math.max(
    nud.sexual_activity ?? 0, nud.sexual_display ?? 0, nud.erotica ?? 0, nud.very_suggestive ?? 0,
  );
  const gore = data.gore?.prob ?? 0;
  const weapon = typeof data.weapon === "object"
    ? (data.weapon.classes?.firearm ?? data.weapon.prob ?? 0) : (data.weapon ?? 0);
  const offensive = data.offensive?.prob ?? 0;
  const drugs = data.recreational_drug?.prob ?? 0;

  const unsafe = nudityScore >= T.nudity || gore >= T.gore || weapon >= T.weapon ||
    offensive >= T.offensive || drugs >= T.drugs;
  return { unsafe, labels: { nudity: nudityScore, gore, weapon, offensive, drugs } };
}

// Записва решението през SECURITY DEFINER RPC (заобикаля RLS). Връща HTTP статуса.
async function setStatus(id: string, status: string, labels: unknown): Promise<number> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/feed_set_moderation`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_id: id, p_status: status, p_labels: labels, p_secret: DB_SECRET }),
  });
  return res.status;
}

Deno.serve(async (req) => {
  try {
    if (!SERVICE_KEY || !SUPABASE_URL) {
      return new Response(`missing env: url=${!!SUPABASE_URL} key=${!!SERVICE_KEY}`, { status: 200 });
    }
    const body = await req.json();
    const record = body.record ?? body;
    const id: string | undefined = record?.id;
    if (!id) return new Response("no id in payload", { status: 200 });

    const urls: string[] = Array.isArray(record.photo_urls) && record.photo_urls.length
      ? record.photo_urls : (record.photo_url ? [record.photo_url] : []);

    if (urls.length === 0) {
      const code = await setStatus(id, "approved", { note: "no photos" });
      return new Response(`approved (no photos) | rpc=${code}`, { status: 200 });
    }

    const results: Verdict[] = [];
    for (const u of urls) {
      try { results.push(await checkImage(u)); }
      catch (e) { results.push({ unsafe: false, labels: { error: String(e) } }); }
    }
    const unsafe = results.some((r) => r.unsafe);
    const verdict = unsafe ? "rejected" : "approved";
    const code = await setStatus(id, verdict, { images: results.map((r) => r.labels) });

    return new Response(`${verdict} | rpc=${code}`, { status: 200 });
  } catch (e) {
    return new Response(`error: ${String(e)}`, { status: 200 });
  }
});
