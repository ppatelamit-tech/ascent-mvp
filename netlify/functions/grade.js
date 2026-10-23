// Ascent — Communication grader. Netlify function.
// POST { topic, transcript, seconds, first_sentence_at } → { total, scores:[6], notes:[6], strongest, source:"model" }
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

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "POST only" };
  let body;
  try { body = JSON.parse(event.body || "{}"); } catch { return { statusCode: 400, body: "bad json" }; }
  const { topic, transcript, seconds, first_sentence_at } = body;
  if (!transcript || typeof transcript !== "string" || transcript.length > 4000) return { statusCode: 400, body: "transcript required" };
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { statusCode: 503, body: JSON.stringify({ error: "no_key" }) };

  const user = `Topic: ${topic}\nDuration spoken: ${seconds || 30} seconds. First sentence ended at about ${first_sentence_at ?? "unknown"} seconds.\n\nTranscript:\n"""\n${transcript}\n"""`;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: process.env.GRADER_MODEL || "claude-sonnet-4-5", max_tokens: 600, system: RUBRIC, messages: [{ role: "user", content: user }] })
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
