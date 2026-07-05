// ============================================================
//  Edge функция „moderate-post"
//  Пуска се автоматично при нов пост (Database Webhook, INSERT на feed_posts).
//  Проверява снимките през Sightengine и слага mod_status = approved / rejected.
//
//  Тайни ключове (Supabase → Edge Functions → moderate-post → Secrets):
//    SIGHTENGINE_USER    — „API user" от sightengine.com
//    SIGHTENGINE_SECRET  — „API secret" от sightengine.com
//  (SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY се подават автоматично.)
// ============================================================

const SE_USER = Deno.env.get("SIGHTENGINE_USER") ?? "";
const SE_SECRET = Deno.env.get("SIGHTENGINE_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

// Кои категории проверяваме.
const MODELS = "nudity-2.1,gore-2.0,weapon,offensive-2.0,recreational_drug";

// Прагове (0..1). Над тях снимката се спира. По-ниско = по-строго.
const T = {
  nudity: 0.6,   // сексуално съдържание / еротика
  gore: 0.6,     // кръв / насилие
  weapon: 0.7,   // оръжия
  offensive: 0.6,// обидни символи/жестове
  drugs: 0.7,    // наркотици
};

interface Verdict {
  unsafe: boolean;
  labels: Record<string, unknown>;
}

async function checkImage(url: string): Promise<Verdict> {
  const api = new URL("https://api.sightengine.com/1.0/check.json");
  api.searchParams.set("url", url);
  api.searchParams.set("models", MODELS);
  api.searchParams.set("api_user", SE_USER);
  api.searchParams.set("api_secret", SE_SECRET);

  const res = await fetch(api.toString());
  const data = await res.json();

  if (data.status !== "success") {
    // Технически проблем със Sightengine → не блокираме (report-ите са резервата).
    return { unsafe: false, labels: { error: data.error ?? data } };
  }

  const nud = data.nudity ?? {};
  const nudityScore = Math.max(
    nud.sexual_activity ?? 0,
    nud.sexual_display ?? 0,
    nud.erotica ?? 0,
    nud.very_suggestive ?? 0,
  );
  const gore = data.gore?.prob ?? 0;
  const weapon = typeof data.weapon === "object"
    ? (data.weapon.classes?.firearm ?? data.weapon.prob ?? 0)
    : (data.weapon ?? 0);
  const offensive = data.offensive?.prob ?? 0;
  const drugs = data.recreational_drug?.prob ?? 0;

  const unsafe =
    nudityScore >= T.nudity ||
    gore >= T.gore ||
    weapon >= T.weapon ||
    offensive >= T.offensive ||
    drugs >= T.drugs;

  return {
    unsafe,
    labels: { nudity: nudityScore, gore, weapon, offensive, drugs },
  };
}

async function setStatus(id: string, status: "approved" | "rejected", labels: unknown) {
  await fetch(`${SUPABASE_URL}/rest/v1/feed_posts?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ mod_status: status, mod_labels: labels }),
  });
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const record = body.record ?? body;
    const id: string | undefined = record?.id;
    if (!id) return new Response("no id", { status: 400 });

    // Събираме всички снимки на поста.
    const urls: string[] = Array.isArray(record.photo_urls) && record.photo_urls.length
      ? record.photo_urls
      : (record.photo_url ? [record.photo_url] : []);

    // Няма снимки → няма какво да проверяваме → одобряваме.
    if (urls.length === 0) {
      await setStatus(id, "approved", { note: "no photos" });
      return new Response("approved (no photos)", { status: 200 });
    }

    const results: Verdict[] = [];
    for (const u of urls) {
      try { results.push(await checkImage(u)); }
      catch (e) { results.push({ unsafe: false, labels: { error: String(e) } }); }
    }

    const unsafe = results.some((r) => r.unsafe);
    await setStatus(id, unsafe ? "rejected" : "approved", { images: results.map((r) => r.labels) });

    return new Response(unsafe ? "rejected" : "approved", { status: 200 });
  } catch (e) {
    return new Response(`error: ${String(e)}`, { status: 500 });
  }
});
