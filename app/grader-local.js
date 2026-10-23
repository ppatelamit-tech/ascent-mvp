/* Ascent — offline estimate of the Communication rubric. Used when the grading function is unreachable or unconfigured.
   Heuristic only; labeled "offline estimate" in the UI. The model grader in netlify/functions/grade.js is the real one. */
window.ASCENT_LOCAL_GRADE = function (topic, transcript, seconds, firstSentenceAt) {
  const C = window.ASCENT_COMMUNICATION;
  const text = (transcript || "").trim();
  const lower = text.toLowerCase();
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);
  const notes = [];
  const scores = [];

  // 1 Hard thing first — proxy: a number/name/negative word in the first sentence and how early the first sentence ended
  const hardWords = /\b(missed|lost|fail|failed|wrong|lay ?offs?|cut|fired|replace|under|short|didn'?t|did not|no longer|can'?t|cannot|behind|late|mistake|lied|hid|hiding|afraid|runway|\d)/i;
  const first = sentences[0] || "";
  const apology = /^(so,?\s*)?(sorry|i'?m sorry|this is hard)/i.test(text);
  let s1 = 0;
  if (hardWords.test(first) && (firstSentenceAt == null || firstSentenceAt <= 10)) s1 = 3;
  else if (hardWords.test(sentences.slice(0, 2).join(" ")) && (firstSentenceAt == null || firstSentenceAt <= 20)) s1 = 2;
  else if (hardWords.test(text)) s1 = 1;
  if (apology && s1 > 0) s1--;
  scores.push(s1);
  notes.push(s1 === 3 ? "The hard thing was in your first sentence." : s1 === 0 ? "The hard thing was never stated plainly." : "The hard thing arrived, but not first.");

  // 2 Specificity — numbers, dates, capitalized names, months
  const nums = (text.match(/\b\d[\d,.]*\b/g) || []).length;
  const months = (text.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december|monday|tuesday|wednesday|thursday|friday|q[1-4])\b/gi) || []).length;
  const names = (text.match(/\b[A-Z][a-z]{2,}\b/g) || []).filter(w => !/^(I|The|We|So|And|But|Our|This|That|It|If|Next|Last)$/.test(w)).length;
  const concrete = nums + months + names;
  const s2 = concrete >= 4 ? 3 : concrete >= 2 ? 2 : concrete >= 1 ? 1 : 0;
  scores.push(s2); notes.push(`${nums} number${nums === 1 ? "" : "s"}, ${months} date${months === 1 ? "" : "s"}, ${names} name${names === 1 ? "" : "s"}.`);

  // 3 Directness — hedge count, passive voice proxy
  const found = C.hedges.filter(h => lower.includes(h));
  const hedgeCount = found.reduce((a, h) => a + (lower.split(h).length - 1), 0) + (apology ? 1 : 0);
  const passive = (lower.match(/\b(was|were|been|being|is|are) (\w+ed|decided|made|taken|told)\b/g) || []).length;
  const s3 = hedgeCount >= 4 || passive >= 3 ? 0 : hedgeCount >= 2 ? 1 : hedgeCount === 1 ? 2 : 3;
  scores.push(s3); notes.push(hedgeCount ? `${hedgeCount} hedge${hedgeCount === 1 ? "" : "s"}: ${found.map(h => `'${h}'`).join(", ")}${apology ? (found.length ? ", " : "") + "an apology preamble" : ""}.` : "No hedges.");

  // 4 Ownership
  const iCount = (lower.match(/\b(i|i'm|i've|i'd|my)\b/g) || []).length;
  const weHad = /\b(we had to|it was decided|the decision was|they|management)\b/i.test(text);
  const blame = /\b(because of (the team|them|him|her|the market)|their fault|if they had)\b/i.test(text);
  const s4 = blame ? 0 : iCount === 0 ? (weHad ? 0 : 1) : weHad ? 1 : /\bi (missed|decided|chose|got|was wrong|kept|hid|lied|failed|made)\b/i.test(text) ? 3 : 2;
  scores.push(s4); notes.push(s4 >= 2 ? `You used 'I' ${iCount} time${iCount === 1 ? "" : "s"} and owned the decision.` : "The decision was not owned in the first person.");

  // 5 Finished the thought
  const last = sentences[sentences.length - 1] || "";
  const ended = /[.!?]$/.test(text);
  const ask = /\b(i will|i'll|on monday|next week|by |let'?s|i need|i'?m asking|here'?s what|the plan is|tomorrow)\b/i.test(last);
  const repeated = sentences.length >= 2 && sentences[sentences.length - 1].toLowerCase().slice(0, 25) === sentences[0].toLowerCase().slice(0, 25);
  const s5 = !ended || words.length < 12 ? 0 : repeated ? 1 : ask ? 3 : 2;
  scores.push(s5); notes.push(s5 === 3 ? "You ended with a next step or an ask." : s5 === 0 ? "You trailed off or were cut short." : "You finished, without an ask.");

  // 6 Cost to the speaker
  const cost3 = /\b(i (lied|hid|was wrong|missed|failed|knew .* (dead|wrong|false)|kept .* (dead|wrong)|should have|didn'?t tell|misled|chose to))\b/i.test(text);
  const qualifier = /\b(but|however|to be fair|in fairness|although|that said)\b/i.test(text);
  const cost1 = /\b(i (could have|might have|wasn'?t perfect|underestimated|was slow))\b/i.test(text);
  const s6 = cost3 && !qualifier ? 3 : cost3 ? 2 : cost1 ? 1 : 0;
  scores.push(s6); notes.push(s6 === 3 ? "You said the thing that makes you look worst and did not qualify it." : s6 === 2 ? "You admitted the real thing, then qualified it." : s6 === 1 ? "You admitted a small thing." : "Nothing here cost you anything.");

  // strongest sentence: the one with the most concrete detail and an 'I'
  let strongest = "", best = -1;
  sentences.forEach(s => { const v = (s.match(/\d/g) || []).length * 2 + (/\bi\b/i.test(s) ? 2 : 0) + (hardWords.test(s) ? 2 : 0) - (C.hedges.some(h => s.toLowerCase().includes(h)) ? 3 : 0); if (v > best) { best = v; strongest = s; } });

  return { total: scores.reduce((a, b) => a + b, 0), scores, notes, strongest, source: "offline" };
};
