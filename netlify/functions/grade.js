// Ascent — Communication grader. Netlify function.
// POST { topic, transcript, seconds, first_sentence_at } → { total, scores:[6], notes:[6], strongest, source:"model" }
// POST { mode:"connection", scenario, transcript, seconds, target:{n,name,stance,valence,levers,note}, harmful } → { total, scores:[4], notes:[4], source }
// POST { mode:"counter", thesis } → { counters:[3], base_rate, steelman, test, source }
// Requires ANTHROPIC_API_KEY in the Netlify environment. Nothing is stored; the transcript is graded and discarded.

const RUBRIC = `You grade a founder's 30-second spoken answer. Return ONLY JSON.

Six dimensions, each 0-3. Total out of 18.

1. Hard thing first. 0 never said. 1 said after 20 s or only implied. 2 said between 10 and 20 s. 3 said in the first 10 seconds, in one sentence. (Use the timing data given; if the hard thing is in the first sentence, treat as first 10 s.)
2. Specificity. 0 no number, date, or name. 1 one concrete detail, rest abstract. 2 mostly concrete, one vague patch. 3 every claim carries a number, a date, or a name.
3. Directness. 0 four or more hedges, or passive voice throughout. 1 two or three hedges. 2 one hedge. 3 no hedges, active voice. Hedges: "I think", "kind of", "sort of", "maybe", "a bit", "probably", "to be honest", "I guess", "we'll see", "hopefully", "it's possible that", "a little", "you know". An apology preamble ("sorry, this is hard to say") counts as a hedge and also costs a point on Hard thing first.
4. Ownership. 0 blame, or "it was decided". 1 mixed: some "I", some "we had to". 2 "I" for the decision, "we" for the work. 3 "I" for the decision and its consequences, no softening.
5. Finished the thought. 0 cut off mid-sentence or trailed off. 1 finished but repeated the point. 2 finished with a clear last sentence. 3 finished early with a next step or an ask.
6. Cost to the speaker. 0 said nothing that costs them anything. 1 admitted a small thing. 2 admitted the real thing, then qualified it. 3 said the thing that makes them look worst, without qualifying it.

Never grade: accent, grammar, filler sounds (um, uh), tone, politeness, emotion, speed. A shaking voice that says the number in five seconds beats a smooth one that gets there at 25.

Output format, exactly:
{"scores":[n,n,n,n,n,n],"notes":["...","...","...","...","...","..."],"strongest":"..."}
Notes: one line each, second person, factual ("you said the number at 14 seconds", "three hedges: 'I think', 'kind of', 'probably'"). No praise, no advice, no rewrite. "strongest" = the single strongest sentence the speaker said, quoted verbatim from the transcript; empty string if none.`;

const CONNECTION_RUBRIC = `You grade a founder's 60-second attempt to enact a specific status move toward a counterpart. The move comes from a 27-cell grid: where the speaker stands relative to the other person (high / level / low), where the other person starts, and which way the speaker moves them (raise / hold / lower). Return ONLY JSON.

Four dimensions, each 0-3. Total out of 12.
1. Stance. Did the speaker hold the target position? High = speaks with authority and takes responsibility; Level = peer language, shared ownership; Low = asks, defers, brings things as questions. 0 opposite stance. 1 unclear. 2 mostly. 3 unmistakably.
2. Direction. Did the words move the other person the target way? Raise = credits, hands over, names their strength, asks their view; Hold = steadies without shifting; Lower = contains, corrects, deflates, with a reason. 0 moved them the opposite way. 1 no movement where movement was the target. 2 moved them, weakly. 3 clearly moved them the target way.
3. Lever. Did the speaker use one of the target's levers concretely? Explicit agreement = who does what by when; Shared stake = a specific 'we' with an object; Data = a number, a trial, a result; Asking their view = a real question before advice; The story = an arc from here to there; The room = who is present, who speaks; The rule = a limit that belongs to the rule, not the speaker. 0 none. 1 gestured at it. 2 used it. 3 used it with a specific (a date, a number, a name, a real question).
4. Hand-off. For Healing/Neutral/Risky targets: was the transfer of power or the limit said aloud and finished ('this is yours now', 'then it's done')? 0 clung to control or trailed off. 3 named the hand-off, with a name on it. For a Harmful target performed on purpose (the request says so): did they get it unmistakably, so they would recognize it in their own mouth? 0 too polite to learn from. 3 unmistakable.

Never grade: accent, grammar, filler, tone, politeness, emotion, speed.

Output format, exactly:
{"scores":[n,n,n,n],"notes":["...","...","...","..."]}
Notes: one line each, second person, factual, quoting the transcript where useful. No praise, no advice, no rewrite.`;

const COUNTER_SYSTEM = `You are an analyst asked to build the strongest case AGAINST a founder's thesis. You argue; you never advise, coach, reassure, or use the first person about the founder's choices. Return ONLY JSON:
{"counters":["...","...","..."],"base_rate":"...","steelman":"...","test":"..."}
counters: the three strongest, most specific objections a sceptical, well-informed investor would raise. Each one or two sentences, concrete, not generic.
base_rate: the single most relevant reference class and its approximate base rate, with the source named if you are confident of it; if not confident, say the rate is approximate.
steelman: the strongest version of the founder's own thesis, in two sentences, stated as an argument not as encouragement.
test: the one cheapest observation that would most sharply distinguish the thesis from the counters, phrased as a question that could be checked within a month. Not a plan, not advice: a question.`;

async function ask(key, system, user, max_tokens) {
  const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" }, body: JSON.stringify({ model: process.env.GRADER_MODEL || "claude-sonnet-5-5", max_tokens: max_tokens || 600, system, messages: [{ role: "user", content: user }] }) });
  if (!r.ok) throw Object.assign(new Error("upstream"), { status: r.status });
  const data = await r.json(); const text = (data.content || []).map(c => c.text || "").join(""); const m = text.match(/\{[\s\S]*\}/); return JSON.parse(m ? m[0] : text);
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "POST only" };
  let body;
  try { body = JSON.parse(event.body || "{}"); } catch { return { statusCode: 400, body: "bad json" }; }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { statusCode: 503, body: JSON.stringify({ error: "no_key" }) };
  const json = (o) => ({ statusCode: 200, headers: { "content-type": "application/json" }, body: JSON.stringify(o) });

  if (body.mode === "connection") {
    const { scenario, transcript, seconds, target, harmful } = body;
    if (!transcript || typeof transcript !== "string" || transcript.length > 6000 || !target) return { statusCode: 400, body: "transcript and target required" };
    const user = `Situation: ${scenario}\nTarget move: #${target.n} ${target.name} (${target.valence}). ${target.stance} Levers: ${(target.levers || []).join(", ")}. ${target.note}\n${harmful ? "This target is Harmful and the speaker was asked to perform it ON PURPOSE so they can recognize it. Grade dimension 4 as 'unmistakable or not'." : ""}\nDuration: ${seconds || 60} seconds.\n\nTranscript:\n"""\n${transcript}\n"""`;
    try { const out = await ask(key, CONNECTION_RUBRIC, user, 500); const scores = (out.scores || []).slice(0, 4).map(n => Math.max(0, Math.min(3, Math.round(Number(n) || 0)))); while (scores.length < 4) scores.push(0); const notes = (out.notes || []).slice(0, 4).map(String); while (notes.length < 4) notes.push(""); return json({ total: scores.reduce((a, b) => a + b, 0), scores, notes, source: "model" }); }
    catch (e) { return { statusCode: 502, body: JSON.stringify({ error: e.status ? "upstream" : "parse", detail: String(e.message || e) }) }; }
  }
  if (body.mode === "counter") {
    const { thesis } = body;
    if (!thesis || typeof thesis !== "string" || thesis.length > 2000) return { statusCode: 400, body: "thesis required" };
    try { const out = await ask(key, COUNTER_SYSTEM, `Thesis:\n"""\n${thesis}\n"""`, 900); return json({ counters: (out.counters || []).slice(0, 3).map(String), base_rate: String(out.base_rate || ""), steelman: String(out.steelman || ""), test: String(out.test || ""), source: "model" }); }
    catch (e) { return { statusCode: 502, body: JSON.stringify({ error: e.status ? "upstream" : "parse", detail: String(e.message || e) }) }; }
  }

  const { topic, transcript, seconds, first_sentence_at } = body;
  if (!transcript || typeof transcript !== "string" || transcript.length > 4000) return { statusCode: 400, body: "transcript required" };

  const user = `Topic: ${topic}\nDuration spoken: ${seconds || 30} seconds. First sentence ended at about ${first_sentence_at ?? "unknown"} seconds.\n\nTranscript:\n"""\n${transcript}\n"""`;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: process.env.GRADER_MODEL || "claude-sonnet-5-5", max_tokens: 600, system: RUBRIC, messages: [{ role: "user", content: user }] })
    });
    if (!r.ok) return { statusCode: 502, body: JSON.stringify({ error: "upstream", status: r.status }) };
    const data = await r.json();
    const text = (data.content || []).map(c => c.text || "").join("");
    const m = text.match(/\{[\s\S]*\}/);
    const out = JSON.parse(m ? m[0] : text);
    const scores = (out.scores || []).slice(0, 6).map(n => Math.max(0, Math.min(3, Math.round(Number(n) || 0))));
    while (scores.length < 6) scores.push(0);
    const notes = (out.notes || []).slice(0, 6).map(String); while (notes.length < 6) notes.push("");
    return { statusCode: 200, headers: { "content-type": "application/json" },
      body: JSON.stringify({ total: scores.reduce((a, b) => a + b, 0), scores, notes, strongest: String(out.strongest || ""), source: "model" }) };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: "parse", detail: String(e.message || e) }) };
  }
};
