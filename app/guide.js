/* The Guide — chat-first Today. Owns the home route. The tiles live on at #/today ("Browse").
   The Guide asks, briefly, what kind of day it is, then picks one activity per pillar from the catalogue; the person does or skips.
   Voice in: Web Speech transcription on the device (nothing recorded). Voice out: ElevenLabs via /api/speak on a Listen button per reply, never automatic; device voice as fallback.
   Selection is the model's (netlify/functions/guide.js) with a rule-based fallback; the model never diagnoses, interprets or advises.
   Registers through window.ASCENT_PLUGINS before today.js so its home route wins. */
(function () {
  "use strict";
  window.ASCENT_PLUGINS = window.ASCENT_PLUGINS || [];
  window.ASCENT_PLUGINS.push(function (api) {
    const { route, h, em, screen, nav, mark, byId } = api;
    const D = window.ASCENT_DOMAINS, E = window.ASCENT_ENJOYMENT, R = window.ASCENT_RECOVERY, P = window.ASCENT_PROFILE;
    const S = () => api.state(); const save = api.save; const TD = () => window.ASCENT_TODAY;
    const G = () => { const s = S(); s.guide = s.guide || { days: {}, speak: true }; return s.guide; };
    const today = () => { const g = G(); const k = TD().dayKey(); g.days[k] = g.days[k] || { msgs: [], picks: null, why: null, skipped: [], questions: 0 }; return g.days[k]; };
    const CRISIS = /\b(suicid|kill myself|end my life|want to die|don'?t want to (be alive|live|be here)|self[- ]harm|hurt myself|not safe)\b/i;
    const MAX_Q = 1; // one question at most: greeting, maybe one question, then the picks

    // ---------- catalogue: what the Guide can pick from, given the state ----------
    function catalogue() {
      const s = S(); const day = TD().dayKey(); const out = []; const add = (id, pillar, title, minutes, href, suits, d) => out.push({ id, pillar, title, minutes, href, suits, d });
      if (!s.profile.done) add("profile", "development", "Take the Profile (baseline across all seven)", 12, "#/profile", "first day; nothing else counts until this is done", null);
      else {
        add("capability", "development", "Today's three challenges (Capability, over fear)", 10, "#/capability", "nervous, avoiding something, procrastinating, small and doable wanted", byId.capability);
        E.adventures.forEach(a => add("enj:" + a.id, "development", `Audio adventure: ${a.title} (${a.grade}, Enjoyment, over guilt)`, a.minutes, `#/enjoyment/play/${a.id}`, a.grade === "calm" ? "tired, wired, late, guilt about resting" : a.grade === "active" ? "flat, needs a lift, mid-day" : "weekend, time to spare, wants to be taken somewhere", byId.enjoyment));
        add("communication", "development", "One thirty-second set (Communication, over lies)", 2, "#/communication/set", "a hard conversation coming, something unsaid, board or co-founder", byId.communication);
        const dv = s.drive || {}; if (!(dv.values || []).length) add("drive:sort", "development", "Sort your values (Drive, over shame)", 6, "#/drive/sort", "first time in Drive; proving, hollow striving, why-bother", byId.drive);
        else { add("drive:feed", "development", "Feed one value (Drive, over shame)", 3, "#/drive/feed", "flat motivation, proving something, shame, needs one real thing", byId.drive); add("drive:goals", "development", "Audit one goal (Drive, over shame)", 5, "#/drive/goals", "goals feel like someone else's, comparing, proving", byId.drive); }
        const cn = s.connection || {}; if (!cn.baseline) add("connection:baseline", "development", "Status baseline, nine situations (Connection, over grief)", 3, "#/connection/baseline", "first time in Connection; conflict, team, people", byId.connection);
        else { add("connection:perform", "development", "Perform one status move, 60 s spoken (Connection, over grief)", 3, "#/connection/perform", "a conversation went wrong, team, co-founder, investor, wants to practise", byId.connection); add("connection:read", "development", "Read one status move (Connection)", 2, "#/connection/read", "low energy, quick, someone else's behaviour puzzled them", byId.connection); add("connection:replace", "development", "Replace a harmful move (Connection)", 2, "#/connection/replace", "caught themselves being sharp, envious, or passive", byId.connection); }
        const v = s.vision || { predictions: [], cards: {} }; const due = (v.predictions || []).filter(p => p.resolved == null && p.by && p.by <= day).length;
        if (due) add("vision:resolve", "development", `Resolve ${due} due prediction${due > 1 ? "s" : ""} (Vision, over illusion)`, 1, "#/vision", "a prediction came due", byId.vision);
        add("vision:predict", "development", "Log one prediction (Vision, over illusion)", 2, "#/vision/predict", "a decision, a forecast, optimism, uncertainty, a bet", byId.vision);
        if (window.ASCENT_VISION.cards.items.some(c => !(v.cards || {})[c.id])) add("vision:card", "development", "A base-rate card (Vision)", 1, "#/vision/card", "quick, curious, overconfident about numbers", byId.vision);
        add("vision:attack", "development", "Attack the thesis (Vision)", 5, "#/vision/attack", "doubt about the plan, before a pitch, too sure", byId.vision);
        add("vision:audit", "development", "Narrative audit (Vision)", 5, "#/vision/audit", "telling the story a lot, investors, wishful", byId.vision);
        const de = s.detachment || {}; if (!(de.inventories || []).length) add("detachment:inventory", "development", "Identity inventory (Detachment, over attachment)", 3, "#/detachment/inventory", "first time in Detachment; company is everything, can't switch off", byId.detachment);
        else { if (de.failure && de.failure.reads.length < 7 && !de.failure.reads.includes(day)) add("detachment:failure-read", "development", `Read the full failure, day ${de.failure.reads.length + 1} of 7 (Detachment)`, 2, "#/detachment/failure", "dread, catastrophising, holding on", byId.detachment); else if (!de.failure) add("detachment:failure", "development", "Write the full failure (Detachment)", 8, "#/detachment/failure", "fear of it all ending, can't sleep for it", byId.detachment); add("detachment:delegate", "development", "Delegate one thing (Detachment)", 2, "#/detachment/delegate", "doing everything, control, can't let go, exhausted", byId.detachment); add("detachment:absence", "development", "Plan an absence (Detachment)", 1, "#/detachment/absence", "never off, phone always on", byId.detachment); if (!de.letter) add("detachment:letter", "development", "Succession letter (Detachment)", 8, "#/detachment/letter", "thinking about what outlasts them, quiet evening", byId.detachment); }
      }
      add("checkin", "foundations", "Thirty-second check-in: sleep, movement, daylight, phone", 1, "#/foundations/checkin", "every day", null);
      add("dark", "foundations", "Set up Dull after dark on the phone", 2, "#/foundations/dark", "doomscrolling, phone in bed, late nights", null);
      add("plan", "foundations", "Change this week's Add and Limit", 2, "#/foundations/plan", "Monday, wants to change the week's two", null);
      R.rituals.concat((s.today && s.today.rituals) || []).forEach(r => add("rec:" + r.id, "recovery", `${r.name} ritual`, r.minutes, `#/recovery/do/${r.id}?t=${r.trigger[0]}`, r.trigger.map(t => (R.triggers.find(x => x.id === t) || {}).name || t).join(", ").toLowerCase(), r.author ? byId[(r.author || "").split("+")[0]] : null));
      return out;
    }
    const findItem = id => catalogue().find(c => c.id === id);
    function summary() { const t = TD(); const day = t.dayKey(); const s = S(); const d = new Date(); const done = [t.devDone(day) ? "Development (" + t.devDone(day) + ")" : null, t.foundDone(day) ? "Foundations check-in" : null, t.recDone(day) ? "Recovery ritual" : null].filter(Boolean).join(", "); const sc = s.profile.scores; const weakest = sc ? D.slice().sort((a, b) => sc[a.id] - sc[b.id])[0].name : null; const p = t.program(); const ch = s.character; const I = window.ASCENT_INTAKE; const chLine = ch ? ` Character: ${ch.title} (${I.classes[ch.need].name}, ${I.styles[ch.style].name.toLowerCase()}; fear ${window.ASCENT_CHARACTER.band(ch.fear).toLowerCase()}, hunger ${window.ASCENT_CHARACTER.band(ch.hunger).toLowerCase()}; off-hand ${I.styles[ch.latentStyle].name.toLowerCase()}, subclass ${I.classes[ch.latentNeed].name}). Home ground: ${I.classes[ch.need].home.join(", ")}.${ch.path ? " Road: " + ch.path.kind + (ch.path.destName ? " to " + ch.path.destName : "") + "; prefer: " + ch.path.gaps.flatMap(g => g.ids).join(", ") + "." : " Before the roads: one pick in three from the off-hand or subclass."}` : ""; return { time: d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) + " on " + d.toLocaleDateString(undefined, { weekday: "long" }), line: `Day ${p.idx} of ${t.WINDOW}, ${p.closed} closed.${weakest ? " Weakest capacity: " + weakest + "." : " Profile not yet taken."}${chLine}`, done: done || "nothing", questions: today().questions }; }

    // ---------- rule-based fallback ----------
    function fallbackPicks(text) {
      const t = TD(); const s = S(); const lower = (text || "").toLowerCase(); const hour = new Date().getHours(); const cat = catalogue();
      const trig = /win|went well|closed|signed|good news/.test(lower) ? "win" : /lost|loss|died|gone|quit|left us|churn/.test(lower) ? "loss" : /fight|argu|betray|fell out|rupture|shout/.test(lower) ? "rupture" : /fail|screwed|messed|mistake|ashamed|my fault/.test(lower) ? "fail" : /pitch|board|tomorrow|big (day|meeting|call)|before/.test(lower) ? "before" : /hard|awful|brutal|rough|terrible|exhaust/.test(lower) ? "hard" : hour >= 17 ? "day" : "day";
      const rec = R.rituals.filter(r => r.trigger.includes(trig)).map(r => "rec:" + r.id); const recRest = R.rituals.filter(r => !r.trigger.includes(trig)).map(r => "rec:" + r.id);
      const dev = []; const pick = t.pickDevelopment(); const byHref = cat.find(c => c.pillar === "development" && pick.href && c.href === pick.href) || cat.find(c => c.pillar === "development" && pick.href && pick.href.startsWith(c.href.split("/").slice(0, 2).join("/")));
      if (!s.profile.done) dev.push("profile"); else { const pref = (((s.character || {}).path || {}).gaps || []).flatMap(g => g.ids); const hit = cat.find(c => c.pillar === "development" && pref.some(id => c.id === id || (id.endsWith(":") && c.id.startsWith(id)))); if (hit) dev.push(hit.id); if (byHref && !dev.includes(byHref.id)) dev.push(byHref.id); cat.filter(c => c.pillar === "development" && !dev.includes(c.id)).sort(() => Math.random() - 0.5).slice(0, 2).forEach(c => dev.push(c.id)); }
      const fnd = t.foundDone(t.dayKey()) ? ["dark", "plan"] : ["checkin", "dark"];
      const why = { development: !s.profile.done ? "Nothing else counts until the baseline is taken." : "Where the rotation lands today.", foundations: "Thirty seconds, every day.", recovery: `For ${(R.triggers.find(x => x.id === trig) || {}).name.toLowerCase()}.` };
      return { say: s.profile.done ? "Here is today. Skip anything that does not fit." : "Start with the Profile; it tells me where to start you.", picks: { development: dev, foundations: fnd, recovery: rec.concat(recRest).slice(0, 3) }, why, source: "rules" };
    }
    function greeting() { const hour = new Date().getHours(); const t = TD(); const p = t.program(); const s = S(); const part = (hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening") + (s.character ? ", " + s.character.title.replace(/^The /, "") : ""); if (p.idx === 1) return `${part}. Tell me the day in a line and I will pick three things. Skip any of them. What kind of day has it been?`; return hour < 12 ? `${part}. What is today shaped like?` : `${part}. What happened today?`; }
    const chipsFor = () => { const hour = new Date().getHours(); return hour < 12 ? [["Nothing special", "Nothing special so far."], ["Big thing today", "Something big today: a pitch, a hard conversation."], ["Just pick", null]] : [["Nothing special", "Nothing in particular. An ordinary day."], ["A hard day", "A hard day. Everything at once."], ["Just pick", null]]; };

    // ---------- voice ----------
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const audioCache = new Map(); let currentAudio = null;
    function stopSpeech() { try { speechSynthesis.cancel(); } catch {} if (currentAudio) { try { currentAudio.pause(); } catch {} currentAudio = null; } }
    function speakDevice(text) { try { const u = new SpeechSynthesisUtterance(text); const voices = speechSynthesis.getVoices(); const pref = voices.find(v => /en[-_](GB|US)/.test(v.lang) && /Daniel|Samantha|Google UK English Male|Google US English|Alex|Karen|Moira/.test(v.name)) || voices.find(v => /^en/.test(v.lang)); if (pref) u.voice = pref; u.rate = 0.95; u.pitch = 0.95; speechSynthesis.speak(u); } catch {} }
    async function speak(text, onEnd) {
      if (!text) return; stopSpeech();
      try {
        let url = audioCache.get(text);
        if (!url) { const r = await fetch("/api/speak", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) }); if (!r.ok) throw new Error(String(r.status)); const blob = await r.blob(); if (!/audio/.test(blob.type) || blob.size < 1000) throw new Error("no audio"); url = URL.createObjectURL(blob); audioCache.set(text, url); }
        const a = new Audio(url); currentAudio = a; a.onended = () => { currentAudio = null; onEnd && onEnd(); }; await a.play();
      } catch { if ("speechSynthesis" in window) { speakDevice(text); setTimeout(() => onEnd && onEnd(), Math.min(20000, text.length * 60)); } else onEnd && onEnd(); }
    }

    // ---------- setup: the page before the daily flow exists ----------
    function setup(s, p) {
      const el = screen("home setup"); const step = !s.profile.done ? 1 : 2;
      el.append(h("div", { class: "wordmark" }, window.ASCENT_CONFIG.brand.app, h("small", {}, window.ASCENT_CONFIG.brand.tag)));
      el.append(h("p", { class: "eyebrow" }, "Mental fitness for founders"), h("h1", {}, em("Not your brain. *The parts of it that keep letting you down.*")), h("p", { class: "help" }, "Focus is not a muscle; it is what is left when fear, reward and attention are not hijacking it. It trains those parts the way a gym trains legs: three things a day, picked for you, each a few minutes."));
      const ol = h("ol", { class: "steps setup-steps" });
      [["The Profile", "Twelve minutes. Where the seven capacities stand today.", s.profile.done], ["Your build", "Twelve minutes, in as many sittings as you like. Lives to choose between; a character to play.", !!s.character], ["Three things a day: exercise, diet, recovery", "Picked for you. Skip any. Seven closed days in your first ten makes you a founding member.", false]].forEach(([n, l, done], i) => ol.append(h("li", { class: done ? "done" : i + 1 === step ? "now" : "" }, h("strong", {}, n), done ? " ✓" : "", h("div", { class: "fine", style: { marginTop: "2px" } }, l))));
      el.append(ol, h("div", { class: "spacer" }), h("div", { class: "actions" }, h("a", { class: "btn btn-primary", href: step === 1 ? "#/profile" : "#/intake" }, step === 1 ? "Begin · the Profile" : "Next · your build")));
      el.append(h("p", { class: "fine" }, "Training, not treatment. Nothing you answer leaves this device unless you ", h("a", { href: "#/account" }, "sign in"), " to keep it across devices."));
      return el;
    }

    // ---------- home ----------
    route(/^$/, () => {
      const t = TD(); const s = S(); const day = t.dayKey(); const p = t.program(); const dayState = today(); const g = G();
      if (p.won && !(s.today || {}).founding) { s.today.founding = Date.now(); save(); nav("/founding"); return screen(""); }
      if (!s.profile.done) return setup(s, p);
      const el = screen("home today guide");
      const menu = h("div", { class: "menu-row" }); menu.hidden = true;
      menu.append(h("a", { class: "btn btn-link", href: "#/today" }, "Browse"), h("a", { class: "btn btn-link", href: s.character ? "#/sheet" : "#/profile/report" }, s.character ? "Your build" : "Profile"), h("a", { class: "btn btn-link", href: "#/account" }, "Account"));
      el.append(h("div", { class: "wordmark" }, window.ASCENT_CONFIG.brand.app, h("button", { class: "more", "aria-label": "More", onclick: () => { menu.hidden = !menu.hidden; } }, "···")), menu);
      const dev = t.devDone(day), fnd = t.foundDone(day), rec = t.recDone(day); const closed = dev && fnd && rec;
      const dots = []; for (let i = 0; i < t.GOAL; i++) dots.push(h("span", { class: i < p.closed ? "on" : "" }));
      el.append(h("div", { class: "seven-ring" }, h("div", { class: "dots" }, ...dots), h("div", { class: "r-label" }, p.won ? "Seven days. The app is yours." : p.over ? `${p.closed} of ${t.GOAL} in your ten days` : `Day ${p.idx} of ${t.WINDOW} · ${p.closed} of ${t.GOAL} closed`)));
      const chat = h("div", { class: "chat" }); const picksBox = h("div", { class: "picks" }); const inputRow = h("div", { class: "chat-input" });
      if (!s.character) { const n = Object.keys((s.intake || {}).answers || {}).length; el.append(h("a", { class: "pillar resume", href: "#/intake" }, h("div", { class: "p-head" }, h("span", { class: "p-label" }, "Your build"), h("span", { class: "p-sub" }, n ? `${n} of ${window.ASCENT_INTAKE.order.length}` : "not started")), h("div", { class: "p-body" }, h("div", {}, h("div", { class: "p-title" }, n ? "Resume the inventory" : "Build your character"), h("div", { class: "p-line" }, "Twelve minutes in total, in as many sittings as you like. The daily picks sharpen once it is done."))))); }
      el.append(chat, picksBox, inputRow);
      let busy = false, rec_ = null;
      if (!dayState.msgs.length) { dayState.msgs.push({ role: "guide", text: greeting(), at: Date.now() }); save(); }
      function bubble(m) {
        if (m.role === "user") return h("div", { class: "bubble me" }, m.text);
        const btn = h("button", { class: "listen", "aria-label": "Listen", title: "Listen" }, "▶");
        btn.onclick = () => { if (btn.classList.contains("playing")) { stopSpeech(); btn.classList.remove("playing"); btn.textContent = "▶"; return; } document.querySelectorAll(".listen.playing").forEach(b => { b.classList.remove("playing"); b.textContent = "▶"; }); btn.classList.add("playing"); btn.textContent = "■"; speak(m.text, () => { btn.classList.remove("playing"); btn.textContent = "▶"; }); };
        return h("div", { class: "bubble guide" }, h("span", {}, m.text), btn);
      }
      function drawChat() { chat.innerHTML = ""; dayState.msgs.forEach(m => chat.append(bubble(m))); if (busy) chat.append(h("div", { class: "bubble guide thinking" }, "…")); }
      function drawPicks() {
        picksBox.innerHTML = "";
        if (closed) { picksBox.append(h("div", { class: "pillar done" }, h("div", { class: "p-head" }, h("span", { class: "p-label" }, "Today"), h("span", { class: "p-check" }, "✓")), h("div", { class: "p-body" }, h("div", {}, h("div", { class: "p-title" }, "Today is closed"), h("div", { class: "p-line" }, "Exercise, diet, recovery. Nothing else is asked of you."))))); return; }
        if (!dayState.picks) return;
        const order = [["development", "Exercise", dev], ["foundations", "Diet", fnd], ["recovery", "Recovery", rec]];
        const doneN = order.filter(o => o[2]).length; const next = order.find(o => !o[2]); if (!next) return;
        order.forEach(([k, label, v], i) => { if (!v || order.indexOf(next) < i) return; picksBox.append(h("div", { class: "done-row" }, h("span", { class: "p-label" }, `${i + 1} · ${label}`), h("span", {}, typeof v === "string" ? v : k === "recovery" ? t.ritualName(v.id) : "check-in"), h("span", { class: "p-check" }, "✓"))); });
        const [k, label] = next; const list = (dayState.picks[k] || []).filter(id => !dayState.skipped.includes(id)); const item = list.map(findItem).find(Boolean);
        if (!item) { picksBox.append(h("a", { class: "pillar", href: k === "development" ? "#/seven" : "#/" + k }, h("div", { class: "p-head" }, h("span", { class: "p-label" }, label), h("span", { class: "p-sub" }, `${order.indexOf(next) + 1} of 3`)), h("div", { class: "p-body" }, h("div", {}, h("div", { class: "p-title" }, "Pick your own"), h("div", { class: "p-line" }, "Nothing left on today's list for this one."))))); return; }
        const first = (dayState.picks[k] || [])[0] === item.id; const why = dayState.why && dayState.why[k] && first ? dayState.why[k] : "";
        picksBox.append(h("div", { class: "pillar pick" }, h("div", { class: "p-head" }, h("span", { class: "p-label" }, label), h("span", { class: "p-sub" }, `${order.indexOf(next) + 1} of 3`)), h("div", { class: "p-body" }, item.d ? mark(item.d) : null, h("div", { style: { flex: 1 } }, h("div", { class: "p-title" }, item.title.replace(/\s*\(.*\)$/, "")), h("div", { class: "p-line" }, `${item.minutes} min.${why ? " " + why : ""}`))), h("div", { class: "actions row", style: { marginTop: "10px" } }, h("a", { class: "btn btn-primary", href: item.href }, "Do it"), h("button", { class: "btn btn-link", onclick: () => { dayState.skipped.push(item.id); if (!list.slice(1).length) { const more = catalogue().filter(c => c.pillar === k && !dayState.skipped.includes(c.id) && !(dayState.picks[k] || []).includes(c.id)).slice(0, 2).map(c => c.id); dayState.picks[k] = (dayState.picks[k] || []).concat(more); } save(); drawPicks(); } }, "Skip"))));
      }
      function drawInput() {
        inputRow.innerHTML = "";
        if (closed || dayState.picks) return;
        const cs = h("div", { class: "chips" }); chipsFor().forEach(([l, text]) => cs.append(h("button", { class: "chip", onclick: () => text ? send(text) : applyResult(fallbackPicks(dayState.msgs.filter(m => m.role === "user").map(m => m.text).join(" "))) }, l))); inputRow.append(cs);
        const inp = h("input", { type: "text", placeholder: SR ? "Or say it" : "Or type it", maxlength: 600, onkeydown: e => { if (e.key === "Enter" && inp.value.trim()) { send(inp.value.trim()); inp.value = ""; } } });
        const mic = SR ? h("button", { class: "mic", "aria-label": "Speak", onclick: () => toggleMic(mic, inp) }, "●") : null;
        const sendBtn = h("button", { class: "btn btn-primary send", onclick: () => { if (inp.value.trim()) { send(inp.value.trim()); inp.value = ""; } } }, "→"); sendBtn.hidden = true;
        inp.addEventListener("input", () => { sendBtn.hidden = !inp.value.trim(); });
        inputRow.append(h("div", { class: "chat-row" }, mic, inp, sendBtn));
      }
      function toggleMic(btn, inp) {
        if (rec_) { try { rec_.stop(); } catch {} rec_ = null; btn.classList.remove("live"); return; }
        rec_ = new SR(); rec_.continuous = false; rec_.interimResults = true; rec_.lang = "en-US"; let finalText = "";
        rec_.onresult = ev => { let interim = ""; for (let i = ev.resultIndex; i < ev.results.length; i++) { const r = ev.results[i]; if (r.isFinal) finalText += (finalText ? " " : "") + r[0].transcript.trim(); else interim += r[0].transcript; } inp.value = finalText + (interim ? " " + interim : ""); };
        rec_.onerror = ev => { btn.classList.remove("live"); rec_ = null; if (ev.error === "not-allowed") inp.placeholder = "Microphone blocked. Type instead."; };
        rec_.onend = () => { btn.classList.remove("live"); rec_ = null; const v = inp.value.trim(); if (v) { send(v); inp.value = ""; } };
        stopSpeech(); try { rec_.start(); btn.classList.add("live"); } catch {}
      }
      async function send(text) {
        if (busy) return; dayState.msgs.push({ role: "user", text, at: Date.now() }); save();
        if (CRISIS.test(text)) { const say = "That is bigger than this app. Please call or text 988 now, or 911 if you are in danger. The Profile will carry a note so a clinician is the next step, not training."; s.profile.refer = true; dayState.msgs.push({ role: "guide", text: say, at: Date.now() }); save(); drawChat(); showCrisis(); return; }
        busy = true; drawChat(); drawInput();
        const userTurns = dayState.msgs.filter(m => m.role === "user").length; const mustPick = dayState.questions >= MAX_Q || userTurns >= MAX_Q + 1 || !!dayState.picks;
        let result;
        try { const r = await fetch("/api/guide", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: dayState.msgs.map(m => ({ role: m.role, text: m.text })), summary: summary(), catalogue: catalogue().map(c => ({ id: c.id, pillar: c.pillar, title: c.title, minutes: c.minutes, suits: c.suits })), mustPick }) }); if (!r.ok) throw new Error(String(r.status)); result = await r.json(); }
        catch { result = fallbackPicks(dayState.msgs.filter(m => m.role === "user").map(m => m.text).join(" ")); if (dayState.picks) result = { say: "Noted.", picks: dayState.picks, why: dayState.why }; }
        busy = false; applyResult(result);
      }
      function applyResult(result) {
        if (result.crisis) { s.profile.refer = true; dayState.msgs.push({ role: "guide", text: result.say, at: Date.now() }); save(); drawChat(); drawInput(); showCrisis(); return; }
        if (result.question) dayState.questions = (dayState.questions || 0) + 1;
        if (result.picks) { const hasAny = ["development", "foundations", "recovery"].some(k => (result.picks[k] || []).length); if (hasAny) { dayState.picks = result.picks; dayState.why = result.why || null; ["development", "foundations", "recovery"].forEach(k => { if (!(dayState.picks[k] || []).length) dayState.picks[k] = fallbackPicks(dayState.msgs.filter(m => m.role === "user").map(m => m.text).join(" ")).picks[k]; }); } }
        dayState.msgs.push({ role: "guide", text: result.say, at: Date.now() }); save(); drawChat(); drawPicks(); drawInput(); picksBox.scrollIntoView && dayState.picks && setTimeout(() => picksBox.scrollIntoView({ behavior: "smooth", block: "nearest" }), 200);
      }
      function showCrisis() { const ov = h("div", { class: "overlay", role: "dialog", "aria-modal": "true" }); ov.append(h("div", { class: "crisis-card" }, h("h2", {}, P.crisis.title), h("p", {}, P.crisis.body), h("div", { class: "crisis-lines" }, h("a", { href: "tel:988" }, "Call or text 988"), h("span", {}, "Text HOME to 741741 · Emergency: 911")), h("button", { class: "btn btn-primary", onclick: () => ov.remove() }, "I've read this"))); document.body.append(ov); }
      if (!dayState.picks && closed) {}
      drawChat(); drawPicks(); drawInput();
      if (!p.won) el.append(h("p", { class: "fine" }, `Close ${t.GOAL} of your first ${t.WINDOW} days and you are a founding member. Closing a day means all three, honestly. Nobody checks but you.`));
      window.addEventListener("hashchange", () => { stopSpeech(); if (rec_) { try { rec_.stop(); } catch {} } }, { once: true });
      return el;
    });
  });
})();
