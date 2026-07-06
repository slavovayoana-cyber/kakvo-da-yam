// ============================================================
//  Edge функция „moderate-post" (име в Supabase: hyper-processor)
//  Пуска се при нов пост (DB тригер feed_posts_moderate).
//  Три изхода:
//    rejected  → явно неприлично (голота/насилие/оръжие/наркотици) — спряно
//    pending   → гранично (подсказваща/оголена кожа) — чака ТВОЕ одобрение
//    approved  → чисто — показва се веднага
//
//  Записът минава през RPC feed_set_moderation (SECURITY DEFINER).
//  Тайни: SIGHTENGINE_USER, SIGHTENGINE_SECRET (SUPABASE_* са автоматични).
// ============================================================

const SE_USER = Deno.env.get("SIGHTENGINE_USER") ?? "";
const SE_SECRET = Deno.env.get("SIGHTENGINE_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
  Deno.env.get("SERVICE_ROLE_KEY") ??
  "";
const DB_SECRET = "kdy_mod_a7f3c9e21b";

const MODELS = "nudity-2.1,gore-2.0,weapon,offensive-2.0,recreational_drug";

interface Shot { decision: "reject" | "review" | "ok"; labels: Record<string, unknown>; }

async function checkImage(url: string): Promise<Shot> {
  const api = new URL("https://api.sightengine.com/1.0/check.json");
  api.searchParams.set("url", url);
  api.searchParams.set("models", MODELS);
  api.searchParams.set("api_user", SE_USER);
  api.searchParams.set("api_secret", SE_SECRET);

  const res = await fetch(api.toString());
  const data = await res.json();
  if (data.status !== "success") return { decision: "review", labels: { error: data.error ?? data } };

  const nud = data.nudity ?? {};
  const explicit = Math.max(nud.sexual_activity ?? 0, nud.sexual_display ?? 0, nud.erotica ?? 0);
  const suggestive = Math.max(nud.very_suggestive ?? 0, nud.suggestive ?? 0);
  const gore = data.gore?.prob ?? 0;
  const weapon = typeof data.weapon === "object"
    ? (data.weapon.classes?.firearm ?? data.weapon.prob ?? 0) : (data.weapon ?? 0);
  const offensive = data.offensive?.prob ?? 0;
  const drugs = data.recreational_drug?.prob ?? 0;

  const labels = { explicit, suggestive, gore, weapon, offensive, drugs };

  // Явно неприлично → спираме напълно.
  if (explicit >= 0.5 || gore >= 0.6 || weapon >= 0.7 || drugs >= 0.7 || offensive >= 0.6) {
    return { decision: "reject", labels };
  }
  // Гранично (кожа/подсказващо/леко) → изчаква твоя преглед.
  if (explicit >= 0.15 || suggestive >= 0.4 || gore >= 0.3 || offensive >= 0.3 || drugs >= 0.4) {
    return { decision: "review", labels };
  }
  return { decision: "ok", labels };
}

// --- Проверка на текста за псувни/обиди (на български) ---
// Думите се сравняват като НАЧАЛО на дума (хваща и склонения), за да не
// хващаме грешно нормални думи (напр. „курабийки" не съвпада с „курв").
const BG_BAD_ROOTS = [
  "курв", "пичк", "путк", "гъз", "еб", "мамка", "майнат", "копел",
  "шиба", "педер", "педал", "негър", "негро", "идиот", "тъпак",
  "дебил", "кретен", "педофил", "фашист", "лайн", "боклук",
  "простак", "малоумник", "изверг",
];

function checkText(...parts: (string | null | undefined)[]): boolean {
  const text = parts.filter(Boolean).join(" ").toLowerCase();
  const tokens = text.split(/[^\p{L}]+/u).filter(Boolean);
  return tokens.some((tok) => BG_BAD_ROOTS.some((root) => tok.startsWith(root)));
}

async function setStatus(id: string, status: string, labels: unknown): Promise<number> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/feed_set_moderation`, {
    method: "POST",
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ p_id: id, p_status: status, p_labels: labels, p_secret: DB_SECRET }),
  });
  return res.status;
}

Deno.serve(async (req) => {
  try {
    if (!SERVICE_KEY || !SUPABASE_URL) return new Response(`missing env: url=${!!SUPABASE_URL} key=${!!SERVICE_KEY}`, { status: 200 });
    const body = await req.json();
    const record = body.record ?? body;
    const id: string | undefined = record?.id;
    if (!id) return new Response("no id in payload", { status: 200 });

    const urls: string[] = Array.isArray(record.photo_urls) && record.photo_urls.length
      ? record.photo_urls : (record.photo_url ? [record.photo_url] : []);

    // Проверка на текста (важи и когато няма снимка).
    const textBad = checkText(record.dish_name, record.comment, record.ingredients, record.steps);

    // Проверка на снимките.
    const shots: Shot[] = [];
    for (const u of urls) {
      try { shots.push(await checkImage(u)); }
      catch (e) { shots.push({ decision: "review", labels: { error: String(e) } }); }
    }

    // Най-строгото решение печели: спряна снимка → rejected;
    // гранична снимка ИЛИ псувня в текста → pending (за твой преглед).
    let verdict = "approved";
    if (shots.some((s) => s.decision === "reject")) verdict = "rejected";
    else if (textBad || shots.some((s) => s.decision === "review")) verdict = "pending";

    const code = await setStatus(id, verdict, { textBad, images: shots.map((s) => s.labels) });
    return new Response(`${verdict} | text=${textBad} | rpc=${code}`, { status: 200 });
  } catch (e) {
    return new Response(`error: ${String(e)}`, { status: 200 });
  }
});
