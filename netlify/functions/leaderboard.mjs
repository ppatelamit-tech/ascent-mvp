// Ascent — Capability leaderboard. Netlify function on Netlify Blobs.
// Each player owns one key (players/<id>) holding a display name and a ledger of completions.
// A player only ever writes their own key, so there is no shared read-modify-write.
// GET  /api/leaderboard?window=week|month|all&id=<optional>  → { window, top:[{name,points,level,count}], you:{rank,points} }
// POST /api/leaderboard { id, name, ledger:[{at, tier}] }    → { ok, points }
import { getStore } from "@netlify/blobs";

const POINTS = { warm: 10, load: 25, edge: 60 };
const LEVELS = [0, 50, 150, 300, 500, 750, 1050, 1400, 1800, 2250, 2750, 3300, 3900, 4550, 5250];
const WINDOWS = { week: 7 * 864e5, month: 30 * 864e5, all: Infinity };
const level = p => LEVELS.reduce((l, t, i) => (p >= t ? i + 1 : l), 1);
const cleanId = s => /^[a-z0-9]{8,32}$/.test(String(s || "")) ? String(s) : null;
const cleanName = s => String(s || "").replace(/[^\p{L}\p{N} .'\-_]/gu, "").trim().slice(0, 24) || "Anonymous";
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export default async (req) => {
  const store = getStore({ name: "capability-leaderboard", consistency: "strong" });
  if (req.method === "POST") {
    let b; try { b = await req.json(); } catch { return json({ error: "bad json" }, 400); }
    const id = cleanId(b.id); if (!id) return json({ error: "bad id" }, 400);
    const name = cleanName(b.name);
    const now = Date.now();
    const ledger = (Array.isArray(b.ledger) ? b.ledger : []).slice(0, 2000)
      .map(x => ({ at: Number(x.at), tier: String(x.tier) }))
      .filter(x => POINTS[x.tier] && x.at > now - 400 * 864e5 && x.at <= now + 6e5);
    await store.setJSON("players/" + id, { name, ledger, updated: now });
    return json({ ok: true, points: ledger.reduce((a, x) => a + POINTS[x.tier], 0) });
  }
  if (req.method === "GET") {
    const url = new URL(req.url);
    const win = WINDOWS[url.searchParams.get("window")] ? url.searchParams.get("window") : "week";
    const me = cleanId(url.searchParams.get("id"));
    const since = Date.now() - WINDOWS[win];
    const { blobs } = await store.list({ prefix: "players/" });
    const rows = [];
    for (const { key } of blobs) {
      const p = await store.get(key, { type: "json" }); if (!p) continue;
      const inWin = (p.ledger || []).filter(x => x.at >= since);
      const points = inWin.reduce((a, x) => a + (POINTS[x.tier] || 0), 0);
      const allPoints = (p.ledger || []).reduce((a, x) => a + (POINTS[x.tier] || 0), 0);
      if (points > 0 || key === "players/" + me) rows.push({ id: key.slice(8), name: p.name, points, count: inWin.length, level: level(allPoints) });
    }
    rows.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
    const idx = me ? rows.findIndex(r => r.id === me) : -1;
    return json({ window: win, players: rows.length, top: rows.slice(0, 50).map(({ id, ...r }) => ({ ...r, you: id === me })), you: idx >= 0 ? { rank: idx + 1, points: rows[idx].points } : null });
  }
  return json({ error: "method" }, 405);
};

export const config = { path: "/api/leaderboard" };
