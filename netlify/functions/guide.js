// Status 27 — the Guide. Netlify function.
// POST { messages:[{role:"user"|"guide", text}], summary:{...}, catalogue:[{id,pillar,title,minutes,suits}], mustPick:bool }
//   → { say, picks?:{development:[ids], foundations:[ids], recovery:[ids]}, crisis?:bool, source:"model" }
// The Guide listens briefly and selects from the catalogue. It never diagnoses, interprets, advises or coaches.
// Requires ANTHROPIC_API_KEY. Nothing is stored; the exchange is used for one reply and discarded.

const SYSTEM = `You are the Guide in Status 27, a mental-fitness app for founders designed by a psychiatrist. Your only job: find out, briefly, what kind of day this is, then choose today's three activities from the catalogue you are given — one Development, one Foundations, one Recovery — and hand them over. The person can skip any of them.

Voice. Plain, warm, unhurried, specific. Short sentences. At most 45 words per turn; usually fewer. No exclamation marks. No praise inflation, no "great question", no therapy register, no emojis. Sound like a good clinician making small talk at the door, not like a coach.

Hard rules.
- You never diagnose, interpret, reassure at length, give advice, or coach. You may acknowledge in one plain clause ("That is a loss, not a failure.") because that is routing, not treatment. You do not explore feelings, ask "how did that make you feel", or offer techniques in the chat. The activities are the treatment; you only select them.
- You get at most ONE question in the whole exchange, and only if what they said gives you nothing to pick on. Usually what they said is enough: pick. If the message says mustPick, pick now without asking. Never ask a second question. Never ask how they feel.
- The day always runs in the same order: Development, then Foundations, then Recovery. Say them in that order when you mention them.
- When you pick, choose ONLY ids from the catalogue, exactly as written, and give each pillar an ordered list of up to 3 ids (best first; the rest are what you offer if they skip). One line per pillar's first pick saying why it fits what they told you, in "why". Prefer items whose "suits" match the day. Respect the time of day and minutes: late evening → short and calm; before a big thing → the Threshold ritual; a win → Receive it; a loss → Releasing; a rupture → Four lines; nothing in particular → Shut the shop in the evening. Never pick something the summary says is already done today. The Profile and the character inventory are setup, not training, and never count as the day's Development.
- If the person mentions wanting to die, suicide, self-harm, or not being safe, set "crisis": true and say, plainly, that this is bigger than the app, that they should call or text 988 now (or 911 if in danger), and that the Profile will carry a note. Pick nothing.
- If the person asks you to chat, vent, or for advice: one warm sentence, then pick. You are the door, not the room.

Output ONLY JSON, exactly one of these shapes. Inside string values use single quotes, never double quotes, and no line breaks.
{"say":"...","question":true}
{"say":"...","picks":{"development":["id","id"],"foundations":["id"],"recovery":["id","id"]},"why":{"development":"...","foundations":"...","recovery":"..."}}
{"say":"...","crisis":true}`;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "POST only" };
  let body; try { body = JSON.parse(event.body || "{}"); } catch { return { statusCode: 400, body: "bad json" }; }
  const { messages, summary, catalogue, mustPick } = body;
  if (!Array.isArray(messages) || !Array.isArray(catalogue) || !catalogue.length) return { statusCode: 400, body: "messages and catalogue required" };
  if (JSON.stringify(body).length > 60000) return { statusCode: 413, body: "too long" };
  const key = process.env.ANTHROPIC_API_KEY; if (!key) return { statusCode: 503, body: JSON.stringify({ error: "no_key" }) };
  const ids = new Set(catalogue.map(c => c.id));
  const context = `Context (not from the person):\nLocal time: ${summary.time || "unknown"}. ${summary.line || ""}\nAlready done today: ${summary.done || "nothing"}.\n${mustPick ? "mustPick: you must pick now, no question." : `Questions asked so far: ${summary.questions || 0} of 1.`}\n\nCatalogue (pick only these ids):\n${catalogue.map(c => `- ${c.id} [${c.pillar}, ${c.minutes} min] ${c.title}${c.suits ? " — suits: " + c.suits : ""}`).join("\n")}`;
  const convo = messages.slice(-12).map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
  if (!convo.length || convo[0].role !== "user") convo.unshift({ role: "user", content: "(opens the app)" });
  // merge consecutive same-role turns
  const merged = []; convo.forEach(m => { const last = merged[merged.length - 1]; if (last && last.role === m.role) last.content += "\n" + m.content; else merged.push(Object.assign({}, m)); });
  merged[merged.length - 1].content += "\n\n" + context;
  if (merged[merged.length - 1].role !== "user") merged.push({ role: "user", content: context });
  async function call() {
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" }, body: JSON.stringify({ model: process.env.GUIDE_MODEL || process.env.GRADER_MODEL || "claude-sonnet-5-5", max_tokens: 500, system: SYSTEM, messages: merged }) });
    if (!r.ok) throw Object.assign(new Error("upstream"), { status: r.status });
    const data = await r.json(); const text = (data.content || []).map(c => c.text || "").join(""); const m = text.match(/\{[\s\S]*\}/); const raw = (m ? m[0] : text).replace(/[\u201C\u201D]/g, "'").replace(/\r?\n/g, " ");
    try { return JSON.parse(raw); } catch { const fixed = raw.replace(/"((?:[^"\\]|\\.)*?)"(\s*[:,}\]])/g, (a, b, c) => '"' + b.replace(/"/g, "'") + '"' + c); return JSON.parse(fixed); }
  }
  try {
    let out; try { out = await call(); } catch (e) { if (e.status) throw e; out = await call(); }
    const res = { say: String(out.say || "").slice(0, 600), source: "model" };
    if (out.crisis) res.crisis = true;
    else if (out.picks) { res.picks = {}; ["development", "foundations", "recovery"].forEach(p => { res.picks[p] = (out.picks[p] || []).map(String).filter(id => ids.has(id)).slice(0, 3); }); res.why = out.why || {}; }
    else res.question = true;
    return { statusCode: 200, headers: { "content-type": "application/json" }, body: JSON.stringify(res) };
  } catch (e) { return { statusCode: 502, body: JSON.stringify({ error: e.status ? "upstream" : "parse", detail: String(e.message || e) }) }; }
};
