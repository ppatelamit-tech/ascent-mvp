/* Ascent MVP — single-file app. Vanilla JS, hash router, localStorage. No build step.
   Domains: data/domains.js · Profile: data/profile.js · Capability: data/capability.js · Communication: data/communication.js */
(function () {
  "use strict";
  const D = window.ASCENT_DOMAINS, P = window.ASCENT_PROFILE, CAP = window.ASCENT_CAPABILITY, COM = window.ASCENT_COMMUNICATION;
  const KEY = "ascent-mvp-v1";
  const app = document.getElementById("app");
  const byId = Object.fromEntries(D.map(d => [d.id, d]));

  // ---------- state ----------
  function fresh() { return { v: 1, started: Date.now(), profile: { answers: {}, pos: -1, safety: null, done: false, scores: null, refer: false }, capability: { blockStart: null, completions: [], readiness: [] }, communication: { sets: [] }, testMode: location.search.includes("test") }; }
  function load() { try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch { return null; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch {} }
  let st = load() || fresh();
  if (!st.profile || !st.capability || !st.communication) st = fresh();

  // ---------- dom helpers ----------
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const k in attrs || {}) { const v = attrs[k]; if (k === "class") el.className = v; else if (k.startsWith("on")) el.addEventListener(k.slice(2), v); else if (k === "style" && typeof v === "object") Object.assign(el.style, v); else if (v != null && v !== false) el.setAttribute(k, v === true ? "" : v); }
    kids.flat(Infinity).forEach(k => { if (k == null || k === false) return; el.appendChild(typeof k === "string" || typeof k === "number" ? document.createTextNode(String(k)) : k); });
    return el;
  }
  function em(text) { return text.split(/\*(.+?)\*/).map((p, i) => i % 2 ? h("span", { class: "display-em" }, p) : p); }
  function mark(d, lg) { // restrained animal mark: initial in the domain's colour; illustrated marks replace this (assets/marks/<id>.svg)
    const el = h("div", { class: "mark" + (lg ? " lg" : ""), style: { background: d.color + "22", color: d.color }, "aria-label": d.animal });
    const img = h("img", { src: `../assets/marks/${d.id}.svg`, alt: d.animal, style: { width: lg ? "50px" : "26px", height: lg ? "50px" : "26px" } });
    const fallback = h("span", { style: { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: lg ? "2.4rem" : "1.25rem", lineHeight: 1 } }, d.animal[0]);
    img.onerror = () => { img.replaceWith(fallback); };
    el.append(img); return el;
  }
  function topline(pct, where, onBack) { return h("div", { class: "topline" }, h("button", { class: "back", "aria-label": "Back", onclick: onBack || (() => history.back()) }, "←"), h("div", { class: "bar" }, h("div", { style: { width: pct + "%" } })), h("div", { class: "where" }, where)); }
  function screen(cls, ...kids) { return h("section", { class: "screen " + (cls || "") }, ...kids); }
  function nav(hash) { const target = "#" + hash; if (location.hash === target) render(); else location.hash = hash; }
  function fmtDate(ts) { return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" }); }
  function slider(prompt, low, high, init, onChange) {
    let v = init; const out = h("div", { class: "val" }, String(v));
    const r = h("input", { type: "range", min: 0, max: 10, step: 1, oninput: e => { v = Number(e.target.value); out.textContent = String(v); onChange && onChange(v); } }); r.value = v;
    return { el: h("div", {}, h("p", { class: "help", style: { marginTop: "22px" } }, prompt), h("div", { class: "slider" }, out, r, h("div", { class: "ends" }, h("span", {}, low), h("span", {}, high)))), get: () => v };
  }

  // ---------- router ----------
  const routes = [];
  function route(re, fn) { routes.push([re, fn]); }
  function render() {
    const hash = location.hash.replace(/^#\/?/, "") || "";
    for (const [re, fn] of routes) { const m = hash.match(re); if (m) { app.innerHTML = ""; try { app.append(fn(...m.slice(1))); } catch (e) { app.append(screen("", h("h1", {}, "Something went wrong"), h("p", { class: "help" }, String(e)), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => nav("/") }, "Home")))); console.error(e); } window.scrollTo(0, 0); return; } }
    nav("/");
  }
  window.addEventListener("hashchange", render);

  // ---------- home ----------
  route(/^$/, () => {
    const el = screen("home");
    el.append(h("div", { class: "wordmark" }, "Ascent", h("small", {}, "designed by a psychiatrist")));
    const pr = st.profile;
    if (pr.done && pr.scores) {
      const weakest = D.slice().sort((a, b) => pr.scores[a.id] - pr.scores[b.id])[0];
      el.append(h("h1", {}, em("Your *seven*")), h("p", { class: "help" }, `Profile taken ${fmtDate(pr.doneAt)}. Weakest capacity: ${weakest.name}. Start there, or start at the bottom of the stack.`));
    } else {
      el.append(h("h1", {}, em("Train the mind that *carries the company*")), h("p", { class: "help" }, "Seven capacities, each the working opposite of a block that stalls founders. Take the Profile first; it tells you where to start."));
      el.append(h("div", { class: "actions" }, h("a", { class: "btn btn-primary", href: "#/profile" }, pr.pos >= 0 ? "Continue the Profile" : "Take the Profile · 12 minutes")));
    }
    const ul = h("ul", { class: "domains" });
    D.forEach(d => {
      const sc = pr.scores ? pr.scores[d.id] : null;
      const live = d.status === "live";
      ul.append(h("li", {}, h("a", { class: "domain-card" + (live ? "" : " soon"), href: live ? `#/${d.id}` : `#/domain/${d.id}` },
        mark(d), h("div", {}, h("div", { class: "name" }, d.name, h("span", { style: { color: "var(--t-faint)", fontWeight: 400 } }, ` · over ${d.block.toLowerCase()}`)), h("div", { class: "sub" }, sc != null ? `${band(sc).name} · ${sc}` : d.line)),
        h("span", { class: "tag" + (live ? " live" : "") }, live ? "Train" : "Soon"))));
    });
    el.append(ul);
    if (pr.done) el.append(h("div", { class: "actions" }, h("a", { class: "btn", href: "#/profile/report" }, "See your Profile")));
    el.append(h("p", { class: "fine" }, "Ascent is training, not treatment. It does not diagnose, and using it does not make you anyone's patient. If you are struggling, a clinician is the right next step, and the Profile will say so when the numbers say so."));
    return el;
  });

  // ---------- locked domain ----------
  route(/^domain\/(\w+)$/, id => {
    const d = byId[id]; if (!d) return screen("", h("h1", {}, "Not found"));
    const el = screen("", topline(0, d.name, () => nav("/")));
    el.append(mark(d, true), h("p", { class: "eyebrow" }, `${d.name} · over ${d.block.toLowerCase()}`), h("h1", {}, d.line), h("p", { class: "help", style: { fontStyle: "italic" } }, `${d.animal}. ${d.body}`), h("p", { class: "help" }, d.trains));
    const sc = st.profile.scores ? st.profile.scores[d.id] : null;
    if (sc != null) el.append(h("div", { class: "callout" }, h("h3", {}, "Your reading"), `${band(sc).name} (${sc}). ${band(sc).note}`));
    el.append(h("div", { class: "callout" }, h("h3", {}, "Coming in the full app"), "This block ships after Capability and Communication have been through their first hundred founders."), h("div", { class: "spacer" }), h("div", { class: "actions" }, h("a", { class: "btn", href: "#/" }, "Back to the seven")));
    return el;
  });

  // ---------- profile ----------
  function band(score) { let b = P.bands[0]; P.bands.forEach(x => { if (score >= x.min) b = x; }); return b; }
  function scoreProfile() {
    const out = {};
    D.forEach(d => { const items = P.items.filter(i => i.d === d.id); let sum = 0, n = 0; items.forEach((it, k) => { const v = st.profile.answers[d.id + ":" + k]; if (typeof v !== "number") return; sum += it.rev ? v : 4 - v; n++; }); out[d.id] = n ? Math.round((sum / (n * 4)) * 100) : 0; });
    return out;
  }
  const order = []; D.forEach(d => P.items.filter(i => i.d === d.id).forEach((it, k) => order.push({ key: d.id + ":" + k, d: d.id, it, first: k === 0 })));

  route(/^profile$/, () => {
    const pr = st.profile;
    if (pr.done) { nav("/profile/report"); return screen(""); }
    if (pr.pos < 0) {
      const el = screen("", topline(0, "Profile", () => nav("/")));
      el.append(h("p", { class: "eyebrow" }, "Baseline"), h("h1", {}, em(P.intro.title)), h("p", { class: "help", style: { fontSize: "1.05rem", lineHeight: 1.6 } }, P.intro.body), h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { pr.pos = 0; pr.startedAt = Date.now(); save(); render(); } }, "Begin")));
      return el;
    }
    if (pr.pos >= order.length) return safetyScreen();
    const o = order[pr.pos], d = byId[o.d], i = pr.pos;
    const pct = Math.round((i / (order.length + 1)) * 100);
    if (o.first && !pr["seen:" + o.d]) {
      const el = screen("interlude", topline(pct, d.name, back));
      el.append(mark(d, true), h("p", { class: "eyebrow" }, `${d.name} · over ${d.block.toLowerCase()}`), h("h1", {}, d.animal), h("p", { class: "body" }, P.interludes[d.id]), h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { pr["seen:" + o.d] = true; save(); render(); } }, "Continue")));
      return el;
    }
    const el = screen("", topline(pct, `${d.name} · ${i + 1} of ${order.length}`, back));
    el.append(h("p", { class: "prefix" }, "In the past month…"), h("p", { class: "statement" }, o.it.t));
    const opts = h("div", { class: "options", role: "radiogroup" });
    P.scale.forEach((s, k) => opts.append(h("button", { class: "opt", role: "radio", "aria-checked": String(pr.answers[o.key] === k), onclick: () => { pr.answers[o.key] = k; pr.pos++; save(); render(); } }, h("span", { class: "dot" }), s)));
    el.append(opts, h("div", { class: "spacer" }));
    return el;
    function back() { if (pr.pos > 0) { pr.pos--; save(); render(); } else { pr.pos = -1; save(); render(); } }
  });
  function safetyScreen() {
    const pr = st.profile;
    const el = screen("", topline(98, "One more", () => { pr.pos--; save(); render(); }));
    el.append(h("p", { class: "prefix" }, P.safety.prefix), h("p", { class: "statement" }, P.safety.text));
    const opts = h("div", { class: "options", role: "radiogroup" });
    P.safety.options.forEach((s, k) => opts.append(h("button", { class: "opt", role: "radio", "aria-checked": "false", onclick: () => { pr.safety = k; pr.refer = k === P.safety.yes_index; finish(k === P.safety.yes_index); } }, h("span", { class: "dot" }), s)));
    el.append(opts, h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-link", onclick: () => { pr.safety = null; finish(false); } }, "Prefer not to say")));
    return el;
    function finish(crisis) { pr.scores = scoreProfile(); pr.done = true; pr.doneAt = Date.now(); save(); if (crisis) showCrisis(() => nav("/profile/report")); else nav("/profile/report"); }
  }
  function showCrisis(then) {
    const ov = h("div", { class: "overlay", role: "dialog", "aria-modal": "true" });
    ov.append(h("div", { class: "crisis-card" }, h("h2", {}, P.crisis.title), h("p", {}, P.crisis.body), h("div", { class: "crisis-lines" }, h("a", { href: "tel:988" }, "Call or text 988"), h("span", {}, "Text HOME to 741741 · Emergency: 911")), h("button", { class: "btn btn-primary", onclick: () => { ov.remove(); then(); } }, "I've read this. Continue")));
    document.body.append(ov);
  }
  route(/^profile\/report$/, () => {
    const pr = st.profile; if (!pr.done) { nav("/profile"); return screen(""); }
    const el = screen("", topline(100, "Your Profile", () => nav("/")));
    const sorted = D.slice().sort((a, b) => pr.scores[a.id] - pr.scores[b.id]);
    const weakest = sorted[0], strongest = sorted[sorted.length - 1];
    el.append(h("p", { class: "eyebrow" }, `Taken ${fmtDate(pr.doneAt)}`), h("h1", {}, em("Your *Profile*")), h("p", { class: "help" }, "Seven capacities, read once. Higher means the capacity, not the block, is carrying the weight. This is a reading, not a diagnosis."));
    const bars = h("div", { class: "bars" });
    D.forEach(d => { const s = pr.scores[d.id], b = band(s); bars.append(h("div", { class: "brow" }, mark(d), h("div", {}, h("div", { class: "lbl2" }, h("span", {}, h("strong", {}, d.name), h("span", { style: { color: "var(--t-faint)" } }, ` · ${d.animal}`)), h("span", {}, s)), h("div", { class: "track" }, h("div", { style: { width: s + "%", background: d.color } }))), h("div", { class: "band" }, b.name))); });
    el.append(bars);
    if (pr.refer) el.append(h("div", { class: "callout refer" }, h("h3", {}, "First, a clinician"), "Your answer to the last question means training is not the right first step. Please talk to a clinician this week. If you are in danger, call or text 988 now. Your Profile is still yours and the training will still be here."));
    const lowCount = D.filter(d => pr.scores[d.id] < 40).length;
    if (!pr.refer && lowCount >= 4) el.append(h("div", { class: "callout refer" }, h("h3", {}, "Consider a clinician alongside this"), `${lowCount} of seven capacities read Early. That pattern usually means something is pressing on all of them at once, and training alone tends not to move it. A clinician can help find the thing underneath while you train.`));
    el.append(h("div", { class: "callout accent" }, h("h3", {}, "Where to start"), h("strong", {}, `${weakest.name} (${band(pr.scores[weakest.id]).name}, ${pr.scores[weakest.id]})`), ` is carrying the least. ${weakest.trains}`, byId[weakest.id].status === "live" ? "" : ` Its block is not in the MVP yet; the two that are, Capability and Communication, are good first blocks for almost everyone.`));
    el.append(h("div", { class: "callout" }, h("h3", {}, "Strongest"), `${strongest.name} (${pr.scores[strongest.id]}). ${band(pr.scores[strongest.id]).note}`));
    el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("a", { class: "btn btn-primary", href: byId[weakest.id].status === "live" ? `#/${weakest.id}` : "#/capability" }, `Start ${byId[weakest.id].status === "live" ? weakest.name : "Capability"}`), h("a", { class: "btn", href: "#/" }, "See all seven"), st.testMode ? h("button", { class: "btn btn-link", onclick: () => { st.profile = fresh().profile; save(); nav("/"); } }, "Reset Profile (test)") : null));
    return el;
  });

  // ---------- capability ----------
  function weekOf(start, weeks) { if (!start) return 0; return Math.min(weeks, Math.floor((Date.now() - start) / (7 * 864e5)) + 1); }
  function capState() { const c = st.capability; c.priorities = c.priorities || []; c.completions = c.completions || []; c.readiness = c.readiness || []; c.daily = c.daily || {}; if (!c.playerId) c.playerId = Array.from(crypto.getRandomValues(new Uint8Array(12)), b => (b % 36).toString(36)).join(""); return c; }
  function capPoints(c) { return c.completions.reduce((a, k) => a + (CAP.points[k.tier] || 0), 0); }
  function capLevel(p) { return CAP.levels.reduce((l, t, i) => (p >= t ? i + 1 : l), 1); }
  function nextLevelAt(p) { const t = CAP.levels.find(t => t > p); return t == null ? null : t; }
  function dayKey(ts) { const d = new Date(ts || Date.now()); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
  function seeded(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; }; }
  function todaysThree() {
    const c = capState(); const key = dayKey();
    if (c.daily[key] && c.daily[key].length === 3 && c.daily[key].every(id => CAP.deck.some(x => x.id === id))) return c.daily[key].map(id => CAP.deck.find(x => x.id === id));
    const rnd = seeded(c.playerId + key); const done = new Set(c.completions.map(k => k.id)); const pri = c.priorities.length ? c.priorities : CAP.categories;
    const pick = tier => { let pool = CAP.deck.filter(x => x.tier === tier && pri.includes(x.cat) && !done.has(x.id)); if (!pool.length) pool = CAP.deck.filter(x => x.tier === tier && pri.includes(x.cat)); if (!pool.length) pool = CAP.deck.filter(x => x.tier === tier); return pool[Math.floor(rnd() * pool.length)]; };
    const three = CAP.tiers.map(t => pick(t.id)); c.daily = { [key]: three.map(x => x.id) }; save(); return three;
  }
  async function syncLeaderboard() { const c = capState(); if (!c.playerName) return; try { await fetch("/api/leaderboard", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: c.playerId, name: c.playerName, ledger: c.completions.map(k => ({ at: k.at, tier: k.tier })) }) }); } catch {} }
  function prioritiesScreen(firstTime) {
    const c = capState(); let sel = new Set(c.priorities);
    const el = screen("", topline(0, "Priorities", () => nav("/capability")));
    el.append(h("p", { class: "eyebrow" }, "Capability · over fear"), h("h1", {}, em(CAP.prioritiesIntro.title)), h("p", { class: "help" }, CAP.prioritiesIntro.body));
    const opts = h("div", { class: "options" }); const btn = h("button", { class: "btn btn-primary", onclick: () => { c.priorities = CAP.categories.filter(x => sel.has(x)); if (firstTime) c.blockStart = c.blockStart || Date.now(); c.daily = {}; save(); nav("/capability"); } }, firstTime ? "Show me today's three" : "Save");
    const upd = () => { btn.disabled = sel.size < CAP.daily.minPriorities; [...opts.children].forEach(o => o.setAttribute("aria-checked", String(sel.has(o.dataset.c)))); };
    CAP.categories.forEach(cat => opts.append(h("button", { class: "opt", role: "checkbox", "data-c": cat, onclick: () => { sel.has(cat) ? sel.delete(cat) : sel.add(cat); upd(); } }, h("span", { class: "dot", style: { borderRadius: "6px" } }), h("span", {}, h("strong", {}, cat), h("span", { style: { display: "block", fontSize: "0.85rem", color: "var(--t-faint)" } }, CAP.categoryNotes[cat])))));
    el.append(opts, h("div", { class: "spacer" }), h("div", { class: "actions" }, btn)); upd(); return el;
  }
  route(/^capability\/priorities$/, () => prioritiesScreen(false));
  route(/^capability$/, () => {
    const d = byId.capability, c = capState();
    if (!c.blockStart || c.priorities.length < CAP.daily.minPriorities) return prioritiesScreen(true);
    const el = screen("", topline(0, "Capability", () => nav("/")));
    el.append(h("div", { class: "hub-head" }, mark(d, true), h("div", {}, h("p", { class: "eyebrow", style: { marginTop: 0 } }, "Capability · over fear"), h("h1", { style: { marginTop: "4px" } }, d.line))));
    const pts = capPoints(c), lvl = capLevel(pts), next = nextLevelAt(pts), prev = CAP.levels[lvl - 1];
    const pct = next ? Math.round(((pts - prev) / (next - prev)) * 100) : 100;
    el.append(h("div", { class: "stat-row" }, h("div", { class: "stat" }, h("div", { class: "n" }, `L${lvl}`), h("div", { class: "l" }, next ? `${next - pts} to level ${lvl + 1}` : "top level")), h("div", { class: "stat" }, h("div", { class: "n" }, pts), h("div", { class: "l" }, "points")), h("div", { class: "stat" }, h("div", { class: "n" }, c.completions.length), h("div", { class: "l" }, "in the evidence file"))));
    el.append(h("div", { class: "track", style: { height: "8px", background: "var(--hairline)", borderRadius: "4px", overflow: "hidden", marginTop: "10px" } }, h("div", { style: { width: pct + "%", height: "100%", background: d.color, borderRadius: "4px" } })));
    const three = todaysThree(); const today = dayKey(); const doneToday = new Set(c.completions.filter(k => dayKey(k.at) === today).map(k => k.id));
    el.append(h("h2", {}, "Today's three"), h("p", { class: "help", style: { fontSize: "0.88rem", marginTop: "4px" } }, `From ${c.priorities.join(", ").toLowerCase()}. New three tomorrow. `, h("a", { href: "#/capability/priorities" }, "Change areas")));
    const list = h("ul", { class: "deck" });
    three.forEach(x => { const tier = CAP.tiers.find(t => t.id === x.tier); const done = doneToday.has(x.id); list.append(h("li", {}, h("button", { class: "card" + (done ? " done" : ""), onclick: () => { if (!done) nav("/capability/do/" + x.id); } }, h("span", { class: "cat" }, h("strong", { style: { color: "var(--t-strong)" } }, tier.name), h("br"), `${CAP.points[x.tier]} pts`, h("br"), x.cat), h("span", {}, x.t, done ? " ✓" : "")))); });
    el.append(list);
    const wk = weekOf(c.blockStart, CAP.block.weeks);
    el.append(h("h2", {}, CAP.block.lesson_titles[wk - 1] || CAP.block.lesson_titles[0]), h("p", { class: "help", style: { fontSize: "0.88rem" } }, `Week ${wk} lesson. Video arrives in the full app.`));
    el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("a", { class: "btn btn-primary", href: "#/capability/leaderboard" }, "Leaderboard"), h("a", { class: "btn", href: "#/capability/evidence" }, `Evidence file (${c.completions.length})`), h("a", { class: "btn btn-link", href: "#/capability/readiness" }, "Two taps: readiness and load")));
    return el;
  });
  route(/^capability\/deck$/, () => { nav("/capability"); return screen(""); });
  route(/^capability\/do\/(\w+)$/, id => {
    const x = CAP.deck.find(k => k.id === id); if (!x) { nav("/capability"); return screen(""); }
    const c = capState(); let step = 0, before = 5, after = 5; const tier = CAP.tiers.find(t => t.id === x.tier);
    const el = screen("", topline(0, "Challenge", () => nav("/capability")));
    const box = h("div", { style: { display: "contents" } }); el.append(box);
    const draw = () => { box.innerHTML = "";
      box.append(h("p", { class: "eyebrow" }, `${tier.name} · ${x.cat} · ${CAP.points[x.tier]} points`), h("p", { class: "statement" }, x.t));
      if (step === 0) { const s = slider(CAP.arousal.before, CAP.arousal.low, CAP.arousal.high, before, v => before = v); box.append(s.el, h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { before = s.get(); step = 1; draw(); } }, "Logged. I'm going to do it."), h("p", { class: "help", style: { fontSize: "0.82rem", textAlign: "center" } }, "Come back to this screen when it is done. It will be here."))); }
      else { const s = slider(CAP.arousal.after, CAP.arousal.low, CAP.arousal.high, after, v => after = v); const ta = h("textarea", { placeholder: CAP.notePrompt, maxlength: 240 });
        box.append(h("div", { class: "callout" }, h("h3", {}, "Before"), `${before} / 10`), s.el, ta, h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { after = s.get(); const was = capLevel(capPoints(c)); c.completions.unshift({ id: x.id, tier: x.tier, cat: x.cat, t: x.t, before, after, note: ta.value.trim(), at: Date.now() }); save(); syncLeaderboard(); const now = capLevel(capPoints(c)); nav(now > was ? "/capability/levelup/" + now : "/capability/evidence"); } }, `Done · +${CAP.points[x.tier]}`), h("button", { class: "btn btn-link", onclick: () => { step = 0; draw(); } }, "I didn't do it yet"))); }
    };
    draw(); return el;
  });
  route(/^capability\/levelup\/(\d+)$/, n => {
    const d = byId.capability; const el = screen("", topline(100, "Level up", () => nav("/capability")));
    el.append(mark(d, true), h("p", { class: "eyebrow" }, "Capability"), h("h1", {}, em(`Level *${n}*`)), h("p", { class: "help", style: { fontSize: "1.05rem" } }, "Not a feeling. A record. Read the evidence file when you forget."), h("div", { class: "spacer" }), h("div", { class: "actions" }, h("a", { class: "btn btn-primary", href: "#/capability/evidence" }, "See the evidence file"), h("a", { class: "btn", href: "#/capability" }, "Back")));
    return el;
  });
  route(/^capability\/leaderboard$/, () => {
    const c = capState(); let win = c.lbWindow || "week";
    const el = screen("", topline(0, "Leaderboard", () => nav("/capability")));
    el.append(h("h1", {}, em("*Leaderboard*")));
    if (!c.playerName) {
      el.append(h("p", { class: "help" }, "Pick a name to appear on the board. First name, a handle, anything. Only the name and your points leave the device; never the challenges or your notes."));
      const inp = h("input", { type: "text", placeholder: "Name on the board", maxlength: 24 });
      el.append(inp, h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: async () => { const v = inp.value.trim(); if (!v) return; c.playerName = v; save(); await syncLeaderboard(); render(); } }, "Join the board"), h("a", { class: "btn btn-link", href: "#/capability" }, "Not now")));
      return el;
    }
    const tabs = h("div", { class: "tiers" }); const body = h("div", {}); const me = h("p", { class: "help" });
    [["week", "This week"], ["month", "This month"], ["all", "All time"]].forEach(([k, l]) => tabs.append(h("button", { class: "chip", role: "radio", "aria-checked": String(k === win), onclick: () => { win = k; c.lbWindow = k; save(); load(); } }, l)));
    el.append(h("p", { class: "help" }, `You are ${c.playerName}. `, h("a", { href: "#", onclick: e => { e.preventDefault(); c.playerName = null; save(); render(); } }, "Change name")), tabs, me, body);
    async function load() {
      [...tabs.children].forEach((t, i) => t.setAttribute("aria-checked", String(["week", "month", "all"][i] === win)));
      body.innerHTML = ""; me.textContent = "Loading…";
      try {
        await syncLeaderboard();
        const r = await fetch(`/api/leaderboard?window=${win}&id=${c.playerId}`); if (!r.ok) throw new Error(String(r.status)); const data = await r.json();
        me.textContent = data.you ? `You: #${data.you.rank} of ${data.players} with ${data.you.points} points` : "No points in this window yet.";
        const ul = h("ul", { class: "evidence" });
        data.top.forEach((p, i) => ul.append(h("li", { style: { borderLeftColor: p.you ? "var(--em)" : "var(--hairline)", fontWeight: p.you ? 600 : 400, display: "grid", gridTemplateColumns: "32px 1fr auto", gap: "10px", alignItems: "center" } }, h("span", { style: { color: "var(--t-faint)" } }, `#${i + 1}`), h("span", {}, p.name, h("span", { style: { color: "var(--t-faint)", fontWeight: 400, fontSize: "0.8rem" } }, ` · L${p.level}`)), h("span", { class: "delta" }, `${p.points}`))));
        body.append(data.top.length ? ul : h("p", { class: "help" }, "Nobody on the board in this window yet. Do one today."));
      } catch { me.textContent = "The board is not reachable right now. Your points are safe on this device and will sync when it is."; }
    }
    load(); return el;
  });
  route(/^capability\/evidence$/, () => {
    const c = capState(); const el = screen("", topline(0, "Evidence", () => nav("/capability")));
    el.append(h("h1", {}, em("The *evidence file*")), h("p", { class: "help" }, c.completions.length ? "Read this when you do not feel confident. It is the record, and the record is the point." : "Empty so far. The first line is the hardest to write."));
    const ul = h("ul", { class: "evidence" });
    c.completions.forEach(k => { const dlt = k.before - k.after; ul.append(h("li", {}, h("div", {}, k.note || k.t), h("div", { class: "meta" }, h("span", {}, fmtDate(k.at)), h("span", {}, `${CAP.tiers.find(t => t.id === k.tier).name} · ${k.cat} · +${CAP.points[k.tier]}`), h("span", { class: "delta " + (dlt > 0 ? "down" : dlt < 0 ? "up" : "") }, `${k.before} → ${k.after}`)))); });
    el.append(ul, h("div", { class: "spacer" }), h("div", { class: "actions" }, h("a", { class: "btn btn-primary", href: "#/capability" }, "Today's three")));
    return el;
  });
  route(/^capability\/readiness$/, () => {
    const c = capState(); const el = screen("", topline(0, "Two taps", () => nav("/capability")));
    el.append(h("h1", {}, CAP.readiness.title), h("p", { class: "help" }, "Daily, two taps. The scoreboard moves between challenges."));
    const a = slider(CAP.readiness.q1, "0 · empty", "10 · full", 5), b = slider(CAP.readiness.q2, "0 · light", "10 · crushing", 5);
    el.append(a.el, b.el, h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { c.readiness.unshift({ ready: a.get(), load: b.get(), at: Date.now() }); save(); nav("/capability"); } }, "Log it")));
    if (c.readiness.length) el.append(h("p", { class: "fine" }, `Last ${Math.min(7, c.readiness.length)}: ` + c.readiness.slice(0, 7).map(r => `${r.ready}/${r.load}`).join(" · ") + " (ready/load)"));
    return el;
  });

  // ---------- communication ----------
  route(/^communication$/, () => {
    const d = byId.communication, c = st.communication;
    const el = screen("", topline(0, "Communication", () => nav("/")));
    el.append(h("div", { class: "hub-head" }, mark(d, true), h("div", {}, h("p", { class: "eyebrow", style: { marginTop: 0 } }, "Communication · over lies"), h("h1", { style: { marginTop: "4px" } }, d.line))));
    el.append(h("p", { class: "help" }, "You get a topic and thirty seconds. Speak. The set is graded on six things: the hard thing first, specificity, directness, ownership, finishing the thought, and what it cost you to say. Not graded, ever: accent, grammar, filler, tone."));
    const sets = c.sets;
    if (sets.length) {
      const last = sets.slice(0, 20).reverse();
      el.append(h("div", { class: "stat-row" }, h("div", { class: "stat" }, h("div", { class: "n" }, sets.length), h("div", { class: "l" }, "sets spoken")), h("div", { class: "stat" }, h("div", { class: "n" }, Math.round(sets.slice(0, 5).reduce((a, s) => a + s.total, 0) / Math.min(5, sets.length))), h("div", { class: "l" }, "avg of last 5, of 18")), h("div", { class: "stat" }, h("div", { class: "n" }, sets.filter(s => s.total >= COM.thresholds.pass).length), h("div", { class: "l" }, "passes"))));
      el.append(h("div", { class: "trend" }, ...last.map(s => h("span", { class: s.total >= COM.thresholds.pass ? "pass" : "", style: { height: Math.max(4, (s.total / 18) * 100) + "%" }, title: `${s.total}/18` }))));
    }
    const sr = ("webkitSpeechRecognition" in window) || ("SpeechRecognition" in window);
    el.append(h("p", { class: "fine" }, sr ? "Your browser can transcribe speech. Allow the microphone when asked. Nothing is recorded; the words are transcribed on your device and only the text is graded." : "This browser cannot transcribe speech; you will type instead. Chrome, Edge, or Safari on a phone can transcribe."));
    el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("a", { class: "btn btn-primary", href: "#/communication/set" }, "Start a set"), sets.length ? h("a", { class: "btn", href: "#/communication/history" }, "Past sets") : null));
    return el;
  });
  function pickTopic() { const c = st.communication; const used = new Set(c.sets.slice(0, 10).map(s => s.topicId)); const pool = COM.topics.filter(t => !used.has(t.id)); const arr = pool.length ? pool : COM.topics; return arr[Math.floor(Math.random() * arr.length)]; }
  route(/^communication\/set(?:\/(\w+))?$/, topicId => {
    const topic = COM.topics.find(t => t.id === topicId) || pickTopic();
    if (!topicId) { nav("/communication/set/" + topic.id); return screen(""); }
    const el = screen("", topline(0, "Set", () => { stopAll(); nav("/communication"); }));
    let phase = "ready", transcript = "", interim = "", t0 = 0, firstSentenceAt = null, rec = null, tick = null, secs = 0;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition; const canSpeak = !!SR;
    const ring = h("div", { class: "ring" }, h("div", { class: "t" }, String(COM.prep_seconds)));
    const live = h("div", { class: "live-text" }); const micNote = h("p", { class: "mic-note" });
    const ta = h("textarea", { placeholder: "Type what you would say, as you would say it. Thirty seconds of speech is about 70 to 90 words.", maxlength: 1200 }); ta.hidden = true;
    const acts = h("div", { class: "actions" });
    el.append(h("p", { class: "eyebrow" }, topic.cat), h("p", { class: "topic" }, topic.t), h("div", { class: "timer" }, ring, micNote), live, ta, h("div", { class: "spacer" }), acts);
    const setRing = (n, total, isLive) => { ring.style.setProperty("--pct", Math.round((1 - n / total) * 100) + "%"); ring.querySelector(".t").textContent = String(n); ring.classList.toggle("live", !!isLive); };
    function stopAll() { if (tick) clearInterval(tick); tick = null; if (rec) { try { rec.onend = null; rec.stop(); } catch {} rec = null; } }
    function startRec() {
      if (!canSpeak) return;
      rec = new SR(); rec.continuous = true; rec.interimResults = true; rec.lang = "en-US";
      rec.onresult = ev => { interim = ""; for (let i = ev.resultIndex; i < ev.results.length; i++) { const r = ev.results[i]; if (r.isFinal) { transcript += (transcript ? " " : "") + r[0].transcript.trim(); if (firstSentenceAt == null) firstSentenceAt = Math.round((Date.now() - t0) / 1000); } else interim += r[0].transcript; } live.textContent = transcript + (interim ? " " + interim : ""); };
      rec.onerror = e => { micNote.textContent = e.error === "not-allowed" ? "Microphone blocked. Type instead." : "Transcription hiccup (" + e.error + "). Keep going, or type."; ta.hidden = false; };
      rec.onend = () => { if (phase === "speaking") { try { rec.start(); } catch {} } };
      try { rec.start(); } catch {}
    }
    function draw() {
      acts.innerHTML = "";
      if (phase === "ready") { micNote.textContent = canSpeak ? "Five seconds to think, then thirty to speak." : "Five seconds to think, then thirty to type."; acts.append(h("button", { class: "btn btn-primary", onclick: () => { phase = "prep"; secs = COM.prep_seconds; setRing(secs, COM.prep_seconds); tick = setInterval(() => { secs--; setRing(secs, COM.prep_seconds); if (secs <= 0) { clearInterval(tick); begin(); } }, 1000); draw(); } }, "Ready"), h("button", { class: "btn btn-link", onclick: () => nav("/communication/set/" + pickTopic().id) }, "Different topic")); }
      else if (phase === "prep") { micNote.textContent = "Think."; }
      else if (phase === "speaking") { micNote.textContent = canSpeak ? "Speak. Say the hard thing first." : "Type. Say the hard thing first."; acts.append(h("button", { class: "btn", onclick: finish }, "I'm done"), canSpeak && ta.hidden ? h("button", { class: "btn btn-link", onclick: () => { ta.hidden = false; ta.focus(); draw(); } }, "Type instead") : null); }
      else if (phase === "grading") { micNote.textContent = "Grading…"; }
    }
    function begin() { phase = "speaking"; t0 = Date.now(); secs = COM.speak_seconds; setRing(secs, COM.speak_seconds, true); if (canSpeak) startRec(); else { ta.hidden = false; ta.focus(); } tick = setInterval(() => { secs--; setRing(secs, COM.speak_seconds, true); if (secs <= 0) finish(); }, 1000); draw(); }
    async function finish() {
      if (phase !== "speaking") return; phase = "grading"; const spoken = Math.min(COM.speak_seconds, Math.round((Date.now() - t0) / 1000)); stopAll(); draw();
      const spokenText = (transcript + (interim ? " " + interim : "")).trim();
      const text = ta.hidden ? spokenText : (ta.value.trim() || spokenText);
      if (!text || text.split(/\s+/).length < 5) { phase = "ready"; micNote.textContent = "Nothing came through. Try again, or type it."; ta.hidden = false; setRing(COM.prep_seconds, COM.prep_seconds); draw(); return; }
      let result;
      try { const r = await fetch("/api/grade", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ topic: topic.t, transcript: text, seconds: spoken, first_sentence_at: firstSentenceAt }) }); if (!r.ok) throw new Error(String(r.status)); result = await r.json(); }
      catch { result = window.ASCENT_LOCAL_GRADE(topic.t, text, spoken, firstSentenceAt); }
      const set = { topicId: topic.id, topic: topic.t, transcript: text, seconds: spoken, total: result.total, scores: result.scores, notes: result.notes, strongest: result.strongest, source: result.source, at: Date.now() };
      st.communication.sets.unshift(set); save(); nav("/communication/result/0");
    }
    draw(); return el;
  });
  function resultView(set, idx) {
    const el = screen("", topline(100, "Result", () => nav("/communication")));
    const pass = set.total >= COM.thresholds.pass, repeat = set.total >= COM.thresholds.repeat;
    el.append(h("p", { class: "eyebrow" }, fmtDate(set.at) + " · " + set.seconds + " s"), h("p", { class: "topic", style: { fontSize: "1.25rem" } }, set.topic));
    el.append(h("div", { class: "score" }, h("span", { class: "big" }, set.total), h("span", { class: "of" }, "of 18"), h("span", { class: "verdict" + (pass ? " pass" : "") }, pass ? "Pass" : repeat ? "Repeat once" : "Go again")));
    const ul = h("ul", { class: "dims" }); COM.dimensions.forEach((dn, i) => ul.append(h("li", {}, h("span", { class: "dn" }, dn), h("span", { class: "pts" }, set.scores[i]), h("span", { class: "note" }, set.notes[i])))); el.append(ul);
    if (set.strongest) el.append(h("p", { class: "fine", style: { marginBottom: "-10px" } }, "Your strongest sentence"), h("blockquote", { class: "quote" }, set.strongest));
    el.append(h("p", { class: "source" }, set.source === "model" ? "Graded against the rubric by the model grader." : "Offline estimate: the model grader was not reachable, so this is a heuristic reading of the same rubric. Treat it as rough."));
    el.append(h("details", { style: { marginTop: "14px", fontSize: "0.88rem", color: "var(--t-body)" } }, h("summary", {}, "What you said"), h("p", { style: { lineHeight: 1.5 } }, set.transcript)));
    el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, !pass ? h("a", { class: "btn btn-primary", href: "#/communication/set/" + set.topicId }, "Same topic, again") : null, h("a", { class: pass ? "btn btn-primary" : "btn", href: "#/communication/set" }, "Next topic"), h("a", { class: "btn btn-link", href: "#/communication" }, "Done for now")));
    return el;
  }
  route(/^communication\/result\/(\d+)$/, i => { const set = st.communication.sets[Number(i)]; if (!set) { nav("/communication"); return screen(""); } return resultView(set, Number(i)); });
  route(/^communication\/history$/, () => {
    const el = screen("", topline(0, "Past sets", () => nav("/communication"))); el.append(h("h1", {}, em("Past *sets*")));
    const ul = h("ul", { class: "evidence" }); st.communication.sets.forEach((s, i) => ul.append(h("li", { style: { cursor: "pointer", borderLeftColor: s.total >= COM.thresholds.pass ? "#2F6E4F" : "var(--accent)" }, onclick: () => nav("/communication/result/" + i) }, h("div", {}, s.topic), h("div", { class: "meta" }, h("span", {}, fmtDate(s.at)), h("span", { class: "delta" }, `${s.total} / 18`), h("span", {}, s.source === "model" ? "model" : "offline"))))); el.append(ul);
    return el;
  });

  // ---------- plugins ----------
  (window.ASCENT_PLUGINS || []).forEach(p => { try { p({ route, h, em, screen, topline, nav, mark, byId, slider, fmtDate, state: () => st, save }); } catch (e) { console.error(e); } });

  // ---------- boot ----------
  const tb = document.getElementById("testbar"); if (tb) { tb.hidden = !st.testMode; const r = document.getElementById("reset"); if (r) r.onclick = () => { st = fresh(); st.testMode = true; save(); nav("/"); render(); }; }
  render();
})();
