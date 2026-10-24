/* Development — the four later blocks: Drive (Hound), Connection (Elephant), Vision (Hawk), Detachment (Cat).
   Content in data/drive.js, data/connection.js, data/vision.js, data/detachment.js.
   Each block keeps a log of dated activities under its own state key; today.js reads those logs to close the Development pillar.
   Registers through window.ASCENT_PLUGINS. */
(function () {
  "use strict";
  window.ASCENT_PLUGINS = window.ASCENT_PLUGINS || [];
  window.ASCENT_PLUGINS.push(function (api) {
    const { route, h, em, screen, topline, nav, mark, byId, fmtDate } = api;
    const DR = window.ASCENT_DRIVE, CN = window.ASCENT_CONNECTION, VI = window.ASCENT_VISION, DE = window.ASCENT_DETACHMENT;
    const S = () => api.state(); const save = api.save;
    const dayKey = ts => { const d = new Date(ts || Date.now()); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
    const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const since = (arr, days) => { const cut = Date.now() - days * 864e5; return arr.filter(x => x.at >= cut); };
    function hub(d, sub) { return h("div", { class: "hub-head" }, mark(d, true), h("div", {}, h("p", { class: "eyebrow", style: { marginTop: 0 } }, `${d.name} · over ${d.block.toLowerCase()}`), h("h1", { style: { marginTop: "4px" } }, d.line))); }
    function chips(opts, value, onPick, lbl) { const c = h("div", { class: "chips" }); opts.forEach(([v, label]) => c.append(h("button", { class: "chip", role: "radio", "aria-checked": String(value === v), onclick: () => { onPick(v); [...c.children].forEach((x, i) => x.setAttribute("aria-checked", String(opts[i][0] === v))); } }, label))); return lbl ? h("div", {}, h("label", { class: "lbl" }, lbl), c) : c; }
    function ta(ph, val, rows) { const t = h("textarea", { placeholder: ph, maxlength: 2000 }); if (val) t.value = val; if (rows) t.style.minHeight = rows + "px"; return t; }
    function stat(n, l) { return h("div", { class: "stat" }, h("div", { class: "n" }, String(n)), h("div", { class: "l" }, l)); }
    function logIt(key, kind, extra) { const s = S(); s[key].log = s[key].log || []; s[key].log.unshift(Object.assign({ kind, at: Date.now() }, extra || {})); save(); }

    /* ================= DRIVE ================= */
    const dr = () => { const s = S(); s.drive = s.drive || { values: [], goals: [], feeds: [], log: [] }; return s.drive; };
    const valueOf = id => DR.values.find(v => v.id === id);
    function fedCounts(st) { const win = since(st.feeds, DR.score.window); const out = {}; st.values.forEach(v => out[v.id] = new Set(win.filter(f => f.valueId === v.id).map(f => dayKey(f.at))).size); return out; }
    function suggestValue(st) { const c = fedCounts(st); return st.values.slice().sort((a, b) => c[a.id] - c[b.id])[0]; }

    route(/^drive$/, () => {
      const d = byId.drive, st = dr(); const el = screen("", topline(0, "Drive", () => nav("/")));
      el.append(hub(d));
      if (st.values.length < 5) {
        el.append(h("p", { class: "help" }, DR.intro), h("div", { class: "callout" }, h("h3", {}, "Start with the sort"), DR.sort.intro), h("div", { class: "spacer" }), h("div", { class: "actions" }, h("a", { class: "btn btn-primary", href: "#/drive/sort" }, "Sort your values · 6 minutes")));
        return el;
      }
      const counts = fedCounts(st); const gap = st.values.filter(v => !counts[v.id]).length; const sug = suggestValue(st);
      const fedToday = st.feeds.some(f => dayKey(f.at) === dayKey());
      el.append(h("div", { class: "stat-row" }, stat(since(st.feeds, DR.score.window).length, `fed in ${DR.score.window} days`), stat(gap, "starved values"), stat(st.goals.filter(g => g.verdict).length, "goals audited")));
      el.append(h("div", { class: "callout accent" }, h("h3", {}, fedToday ? "Fed today" : `Today · feed ${valueOf(sug.id).name}`), fedToday ? "One a day is the cadence. More is fine; it is not required." : (sug.behavior || DR.feed.intro), h("div", { class: "actions row" }, h("a", { class: "btn btn-primary", href: "#/drive/feed" }, fedToday ? "Feed another" : "Feed it"))));
      el.append(h("h2", {}, "Your five"));
      const bars = h("div", { class: "bars" });
      st.values.forEach(v => bars.append(h("div", { class: "brow", style: { gridTemplateColumns: "1fr auto" } }, h("div", {}, h("div", { class: "lbl2" }, h("span", {}, h("strong", {}, valueOf(v.id).name), h("span", { style: { color: "var(--t-faint)" } }, v.def ? ` · ${v.def}` : "")), h("span", {}, `${counts[v.id]} / ${DR.score.window}`)), h("div", { class: "track" }, h("div", { style: { width: Math.min(100, counts[v.id] / DR.score.window * 100 * 2) + "%", background: d.color } }))), h("div", { class: "band" }, counts[v.id] ? "" : "gap"))));
      el.append(bars, h("p", { class: "fine" }, DR.score.intro));
      el.append(h("div", { class: "actions" }, h("a", { class: "btn", href: "#/drive/goals" }, `Goal audit (${st.goals.length})`), h("a", { class: "btn btn-link", href: "#/drive/sort" }, "Sort again")));
      if (st.feeds.length) { const ul = h("ul", { class: "evidence" }); st.feeds.slice(0, 7).forEach(f => ul.append(h("li", {}, f.note || valueOf(f.valueId).name, h("div", { class: "meta" }, h("span", {}, fmtDate(f.at)), h("span", {}, valueOf(f.valueId).name), h("span", { class: "delta " + (f.motivation === "toward" ? "down" : f.motivation === "prove" ? "up" : "") }, DR.feed.motivation.find(m => m[0] === f.motivation)[1]))))); el.append(h("h2", {}, "Fed"), ul); }
      return el;
    });

    route(/^drive\/sort$/, () => {
      const d = byId.drive, st = dr(); let round = 0, pool = DR.values.map(v => v.id), kept = new Set();
      const el = screen("", topline(0, "Values sort", () => nav("/drive"))); const box = h("div", {}); el.append(box);
      function drawRound() {
        box.innerHTML = ""; const target = DR.sort.rounds[round];
        box.append(h("p", { class: "eyebrow" }, `Round ${round + 1} of 3`), h("h1", {}, em(DR.sort.roundLines[round].replace(/(twelve|seven|five)/, "*$1*"))), h("p", { class: "help" }, round === 0 ? DR.sort.intro : "The ones you let go are not worthless. They are just not the engine."));
        const count = h("p", { class: "help", style: { fontWeight: 600 } }); const grid = h("div", { class: "chips" });
        const next = h("button", { class: "btn btn-primary", onclick: () => { pool = pool.filter(id => kept.has(id)); kept = new Set(); round++; if (round < DR.sort.rounds.length) drawRound(); else drawDefine(); } });
        const upd = () => { count.textContent = `${kept.size} of ${target} kept`; next.disabled = kept.size !== target; next.textContent = kept.size === target ? (round === 2 ? "These five" : "Next round") : `Keep exactly ${target}`; };
        pool.forEach(id => { const v = valueOf(id); grid.append(h("button", { class: "chip", role: "checkbox", "aria-checked": "false", title: v.hint, onclick: e => { kept.has(id) ? kept.delete(id) : kept.add(id); e.currentTarget.setAttribute("aria-checked", String(kept.has(id))); upd(); } }, v.name)); });
        box.append(count, grid, h("p", { class: "fine" }, "Hold a chip for its meaning. Keep is a tap."), h("div", { class: "spacer" }), h("div", { class: "actions" }, next)); upd();
      }
      function drawDefine() {
        box.innerHTML = ""; box.append(h("p", { class: "eyebrow" }, "Your five"), h("h1", {}, em("Define them, *in your words*")), h("p", { class: "help" }, DR.sort.definePrompt + " " + DR.sort.behaviorPrompt));
        const fields = pool.map(id => { const v = valueOf(id); const prev = st.values.find(x => x.id === id) || {}; const def = h("input", { type: "text", placeholder: `${v.name}: what it means to you`, value: prev.def || "", maxlength: 160 }); const beh = h("input", { type: "text", placeholder: DR.sort.behaviorPlaceholder, value: prev.behavior || "", maxlength: 160 }); box.append(h("h2", {}, v.name), h("p", { class: "fine", style: { marginTop: "-6px" } }, v.hint), def, beh); return { id, def, beh }; });
        box.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { if (fields.some(f => !f.beh.value.trim())) { alert("One behaviour for each of the five. Small is fine."); return; } st.values = fields.map(f => ({ id: f.id, def: f.def.value.trim(), behavior: f.beh.value.trim() })); st.sortedAt = Date.now(); logIt("drive", "sort"); nav("/drive"); } }, "Save the five")));
      }
      drawRound(); return el;
    });

    route(/^drive\/goals$/, () => {
      const st = dr(); const el = screen("", topline(0, "Goal audit", () => nav("/drive")));
      el.append(h("p", { class: "eyebrow" }, "Drive · goal audit"), h("h1", {}, em("Which value? *Who am I proving it to?*")), h("p", { class: "help" }, DR.audit.intro));
      const inp = h("input", { type: "text", placeholder: "A goal you are running on, as you'd say it", maxlength: 200 });
      el.append(inp, h("div", { class: "actions row" }, h("button", { class: "btn", onclick: () => { const t = inp.value.trim(); if (!t) return; st.goals.unshift({ id: uid(), text: t, serves: null, proving: "", verdict: null, rewrite: "", at: Date.now() }); save(); nav("/drive/goals"); } }, "Add goal")));
      st.goals.forEach(g => {
        const card = h("div", { class: "callout", style: { borderLeft: g.verdict ? `3px solid ${g.verdict === "drop" ? "var(--accent)" : "var(--em)"}` : "" } });
        card.append(h("h3", {}, g.text));
        card.append(chips([...st.values.map(v => [v.id, valueOf(v.id).name]), ["none", "None of them"]], g.serves, v => { g.serves = v; save(); }, DR.audit.servesPrompt));
        const pv = h("input", { type: "text", placeholder: DR.audit.provingPlaceholder, value: g.proving, maxlength: 120, oninput: e => { g.proving = e.target.value; save(); } });
        card.append(h("label", { class: "lbl" }, DR.audit.provingPrompt), pv);
        const rw = ta(DR.audit.rewritePlaceholder, g.rewrite, 70); rw.hidden = g.verdict !== "rewrite"; rw.oninput = () => { g.rewrite = rw.value; save(); };
        card.append(chips(DR.audit.verdicts.map(v => [v[0], v[1]]), g.verdict, v => { const first = !g.verdict; g.verdict = v; rw.hidden = v !== "rewrite"; save(); if (first) logIt("drive", "audit", { goal: g.id }); }, "Verdict"));
        card.append(rw, h("p", { class: "fine" }, g.verdict ? DR.audit.verdicts.find(v => v[0] === g.verdict)[2] : (g.proving && g.serves === "none" ? "A proof with no value behind it. That is the pattern." : "")));
        card.append(h("div", { class: "actions row" }, h("button", { class: "btn btn-link", onclick: () => { st.goals = st.goals.filter(x => x.id !== g.id); save(); nav("/drive/goals"); } }, "Remove")));
        el.append(card);
      });
      el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("a", { class: "btn btn-primary", href: "#/drive" }, "Done")));
      return el;
    });

    route(/^drive\/feed$/, () => {
      const st = dr(); if (st.values.length < 5) { nav("/drive"); return screen(""); }
      let pick = suggestValue(st).id, motivation = null; const el = screen("", topline(0, "Feed one", () => nav("/drive")));
      el.append(h("p", { class: "eyebrow" }, "Drive · today"), h("h1", {}, em("Feed *one*")), h("p", { class: "help" }, DR.feed.intro));
      const beh = h("p", { class: "statement" }); const upd = () => { beh.textContent = st.values.find(v => v.id === pick).behavior; };
      el.append(chips(st.values.map(v => [v.id, valueOf(v.id).name]), pick, v => { pick = v; upd(); }, "Which value"), beh); upd();
      const note = ta(DR.feed.notePlaceholder, "", 70);
      el.append(chips(DR.feed.motivation.map(m => [m[0], m[1]]), null, v => motivation = v, "Toward it, or to prove?"), note);
      el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { if (!motivation) { alert("Toward, to prove, or both. One tap."); return; } st.feeds.unshift({ valueId: pick, motivation, note: note.value.trim(), at: Date.now() }); logIt("drive", "feed", { valueId: pick }); nav("/drive"); } }, "Fed · done")));
      return el;
    });

    /* ================= CONNECTION ================= */
    const cn = () => { const s = S(); s.connection = s.connection || { baseline: null, log: [] }; s.connection.log = s.connection.log || []; return s.connection; };
    const E = n => CN.enactments.find(e => e.n === n);
    const lever = id => CN.levers.find(l => l.id === id);
    const stanceLine = e => `${CN.axes.you[e.you]}, ${CN.axes.other[e.other]}: ${CN.axes.shift[e.shift]}${e.toHigh ? " to high" : ""}.`;
    function eCard(e, full) { return h("div", { class: "callout", style: { borderLeft: `3px solid ${{ Healing: "var(--em)", Neutral: "#9AA3B2", Risky: "var(--accent)", Harmful: "#A34457" }[e.valence]}` } }, h("h3", {}, `#${e.n} ${e.name}`, h("span", { style: { color: "var(--t-faint)", fontWeight: 400 } }, ` · ${e.valence}`)), h("div", {}, stanceLine(e)), h("div", { class: "fine", style: { marginTop: "6px" } }, "Lever: " + e.levers.map(l => lever(l).name).join(", ")), full ? h("div", { style: { marginTop: "8px" } }, e.note) : null, full ? h("div", { class: "fine", style: { marginTop: "6px", fontStyle: "italic" } }, e.founder) : null); }
    function nextUnseen(items, kind) { const st = cn(); const seen = new Set(st.log.filter(l => l.kind === kind).map(l => l.id)); const pool = items.filter(i => !seen.has(i.id)); const arr = pool.length ? pool : items; return arr[Math.floor(Math.random() * arr.length)]; }
    function performItem(id) { const base = CN.perform.items.find(i => i.id === id.replace(/r$/, "")); if (!base) return null; if (/r$/.test(id) && base.replace) return { id, target: base.replace, t: base.t.replace(/Perform .*$/, "") + "This time, the replacement: say what you would actually say.", isReplacement: true }; return base; }

    route(/^connection$/, () => {
      const d = byId.connection, st = cn(); const el = screen("", topline(0, "Connection", () => nav("/")));
      el.append(hub(d), h("p", { class: "help" }, CN.intro));
      const perf = st.log.filter(l => l.kind === "perform"), reads = st.log.filter(l => l.kind === "read"), reps = st.log.filter(l => l.kind === "replace");
      if (!st.baseline) el.append(h("div", { class: "callout accent" }, h("h3", {}, "Start with the baseline"), "Nine situations, three minutes. It shows which clusters you reach for and which you never touch.", h("div", { class: "actions row" }, h("a", { class: "btn btn-primary", href: "#/connection/baseline" }, "Take the baseline"))));
      else { const b = st.baseline; const top = Object.entries(b.counts).sort((x, y) => y[1] - x[1]); const reach = top.filter(x => x[1] > 0).slice(0, 2).map(x => CN.clusters.find(c => c.id === x[0]).name); const never = CN.clusters.filter(c => !b.counts[c.id]).map(c => c.name); el.append(h("div", { class: "callout" }, h("h3", {}, "Your baseline"), `You reach for: ${reach.join(", ")}. `, never.length ? `Never touched: ${never.slice(0, 3).join(", ")}${never.length > 3 ? "…" : ""}. ` : "", `${b.harm} of nine answers were Harmful.`, h("div", { class: "actions row" }, h("a", { class: "btn btn-link", href: "#/connection/baseline" }, "Retake")))); }
      el.append(h("div", { class: "stat-row" }, stat(perf.length, "performed"), stat(reads.length, "read"), stat(reps.length, "replaced")));
      const ul = h("ul", { class: "deck" });
      [["perform", "Perform", "Sixty seconds, a target move, graded on four things.", "#/connection/perform"], ["read", "Read", "Someone else is speaking. Name the move.", "#/connection/read"], ["replace", "Replace", "You caught a harmful one. What replaces it?", "#/connection/replace"]].forEach(([k, n, l, href]) => ul.append(h("li", {}, h("a", { class: "card", href, style: { textDecoration: "none" } }, h("span", { class: "cat" }, h("strong", { style: { color: "var(--t-strong)" } }, n)), h("span", {}, l)))));
      el.append(h("h2", {}, "Today's exercise"), ul);
      el.append(h("div", { class: "actions" }, h("a", { class: "btn", href: "#/connection/grid" }, "The 27, by cluster")));
      el.append(h("div", { class: "callout" }, h("h3", {}, CN.grief.title), CN.grief.body, h("div", { class: "actions row" }, h("a", { class: "btn btn-link", href: "#/recovery/trigger/loss" }, "Releasing ritual"))));
      return el;
    });

    route(/^connection\/grid$/, () => {
      const el = screen("", topline(0, "The 27", () => nav("/connection"))); el.append(h("h1", {}, em("Twenty-seven *moves*")), h("p", { class: "help" }, "Three rows: where you stand. Three columns: where they start. Three arrows: which way you move them. Tap one."));
      CN.clusters.forEach(c => { el.append(h("h2", {}, c.name), h("p", { class: "fine", style: { marginTop: "-6px" } }, c.line)); const ul = h("ul", { class: "domains" }); c.members.forEach(n => { const e = E(n); ul.append(h("li", {}, h("a", { class: "domain-card", href: `#/connection/e/${n}` }, h("div", { class: "mark", style: { background: "var(--ok-bg)", color: "var(--t-strong)", fontFamily: "var(--font-display)", fontSize: "1.1rem" } }, String(n)), h("div", {}, h("div", { class: "name" }, e.name), h("div", { class: "sub" }, stanceLine(e))), h("span", { class: "tag" + (e.valence === "Healing" ? " live" : "") }, e.valence)))); }); el.append(ul); });
      el.append(h("div", { class: "callout" }, h("h3", {}, "Neutralizers"), CN.neutralizers.line, h("div", { class: "fine", style: { marginTop: "6px" } }, "Up to level: " + CN.neutralizers.up.map(n => E(n).name).join(", ") + ". Down to level: " + CN.neutralizers.down.map(n => E(n).name).join(", ") + ".")));
      return el;
    });
    route(/^connection\/e\/(\d+)$/, n => { const e = E(Number(n)); if (!e) { nav("/connection/grid"); return screen(""); } const el = screen("", topline(0, e.name, () => nav("/connection/grid"))); el.append(h("p", { class: "eyebrow" }, `Connection · #${e.n}`), h("h1", {}, e.name), eCard(e, true), h("div", { class: "callout" }, h("h3", {}, "Valence"), CN.valences[e.valence]), h("div", { class: "actions" }, CN.perform.items.find(i => i.target === e.n) ? h("a", { class: "btn btn-primary", href: "#/connection/perform/" + CN.perform.items.find(i => i.target === e.n).id }, "Perform it") : null, h("a", { class: "btn", href: "#/connection/grid" }, "Back to the 27"))); return el; });

    route(/^connection\/baseline$/, () => {
      const st = cn(); let pos = 0; const picks = []; const el = screen("", topline(0, "Baseline", () => nav("/connection"))); const box = h("div", {}); el.append(box);
      function draw() {
        box.innerHTML = "";
        if (pos >= CN.baseline.items.length) { const counts = {}; let harm = 0, heal = 0; picks.forEach(tag => { const [cl, val] = CN.baseline.tags[tag]; counts[cl] = (counts[cl] || 0) + 1; if (val === "Harmful") harm++; if (val === "Healing") heal++; }); st.baseline = { counts, harm, heal, at: Date.now() }; logIt("connection", "baseline"); nav("/connection/baseline/result"); return; }
        const it = CN.baseline.items[pos];
        box.append(h("p", { class: "eyebrow" }, `${pos + 1} of ${CN.baseline.items.length}`), pos === 0 ? h("p", { class: "help" }, CN.baseline.intro) : null, h("p", { class: "statement" }, it.t));
        const opts = h("div", { class: "options", role: "radiogroup" }); it.opts.forEach(([t, tag]) => opts.append(h("button", { class: "opt", role: "radio", "aria-checked": "false", onclick: () => { picks.push(tag); pos++; draw(); } }, h("span", { class: "dot" }), t))); box.append(opts);
      }
      draw(); return el;
    });
    route(/^connection\/baseline\/result$/, () => {
      const st = cn(); if (!st.baseline) { nav("/connection/baseline"); return screen(""); } const b = st.baseline;
      const el = screen("", topline(100, "Baseline", () => nav("/connection"))); el.append(h("p", { class: "eyebrow" }, "Connection · baseline"), h("h1", {}, em("What you *reach for*")), h("p", { class: "help" }, `${b.heal} of nine Healing, ${b.harm} Harmful. The clusters below are where your answers landed; the empty ones are moves you never make, which is where the training is.`));
      const bars = h("div", { class: "bars" }); CN.clusters.forEach(c => { const n = b.counts[c.id] || 0; bars.append(h("div", { class: "brow", style: { gridTemplateColumns: "1fr auto" } }, h("div", {}, h("div", { class: "lbl2" }, h("span", {}, c.name), h("span", {}, n)), h("div", { class: "track" }, h("div", { style: { width: Math.min(100, n / 9 * 100 * 2) + "%", background: byId.connection.color } }))), h("div", { class: "band" }, n ? "" : "never"))); }); el.append(bars);
      el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("a", { class: "btn btn-primary", href: "#/connection/perform" }, "Perform one"), h("a", { class: "btn", href: "#/connection" }, "Back")));
      return el;
    });

    route(/^connection\/perform(?:\/([\w-]+))?$/, id => {
      const item = id ? performItem(id) : nextUnseen(CN.perform.items, "perform"); if (!item) { nav("/connection"); return screen(""); } if (!id) { nav("/connection/perform/" + item.id); return screen(""); }
      const e = E(item.target); const st = cn(); const el = screen("", topline(0, "Perform", () => { stopAll(); nav("/connection"); }));
      let phase = "ready", transcript = "", interim = "", t0 = 0, rec = null, tick = null, secs = 0; const SR = window.SpeechRecognition || window.webkitSpeechRecognition; const canSpeak = !!SR;
      const ring = h("div", { class: "ring" }, h("div", { class: "t" }, String(CN.perform.prep_seconds))); const live = h("div", { class: "live-text" }); const micNote = h("p", { class: "mic-note" });
      const tx = h("textarea", { placeholder: "Type what you would say to them, as you would say it. Sixty seconds is about 150 words.", maxlength: 2000 }); tx.hidden = true; const acts = h("div", { class: "actions" });
      el.append(h("p", { class: "eyebrow" }, item.harmful ? "Harmful, on purpose" : item.isReplacement ? "The replacement" : `Target · ${e.valence}`), h("p", { class: "topic" }, item.t), eCard(e, false), h("div", { class: "timer" }, ring, micNote), live, tx, h("div", { class: "spacer" }), acts);
      const setRing = (n, total, isLive) => { ring.style.setProperty("--pct", Math.round((1 - n / total) * 100) + "%"); ring.querySelector(".t").textContent = String(n); ring.classList.toggle("live", !!isLive); };
      function stopAll() { if (tick) clearInterval(tick); tick = null; if (rec) { try { rec.onend = null; rec.stop(); } catch {} rec = null; } }
      function startRec() { if (!canSpeak) return; rec = new SR(); rec.continuous = true; rec.interimResults = true; rec.lang = "en-US"; rec.onresult = ev => { interim = ""; for (let i = ev.resultIndex; i < ev.results.length; i++) { const r = ev.results[i]; if (r.isFinal) transcript += (transcript ? " " : "") + r[0].transcript.trim(); else interim += r[0].transcript; } live.textContent = transcript + (interim ? " " + interim : ""); }; rec.onerror = ev => { micNote.textContent = ev.error === "not-allowed" ? "Microphone blocked. Type instead." : "Transcription hiccup. Keep going, or type."; tx.hidden = false; }; rec.onend = () => { if (phase === "speaking") { try { rec.start(); } catch {} } }; try { rec.start(); } catch {} }
      function draw() {
        acts.innerHTML = "";
        if (phase === "ready") { micNote.textContent = `Ten seconds to think, then sixty to ${canSpeak ? "speak" : "type"}.`; acts.append(h("button", { class: "btn btn-primary", onclick: () => { phase = "prep"; secs = CN.perform.prep_seconds; setRing(secs, CN.perform.prep_seconds); tick = setInterval(() => { secs--; setRing(secs, CN.perform.prep_seconds); if (secs <= 0) { clearInterval(tick); begin(); } }, 1000); draw(); } }, "Ready"), id && !item.isReplacement ? h("button", { class: "btn btn-link", onclick: () => nav("/connection/perform/" + nextUnseen(CN.perform.items.filter(i => i.id !== item.id), "perform").id) }, "Different situation") : null); }
        else if (phase === "prep") micNote.textContent = "Think. Where do you stand, and which way are you moving them?";
        else if (phase === "speaking") { micNote.textContent = "Say it to them."; acts.append(h("button", { class: "btn", onclick: finish }, "I'm done"), canSpeak && tx.hidden ? h("button", { class: "btn btn-link", onclick: () => { tx.hidden = false; tx.focus(); draw(); } }, "Type instead") : null); }
        else micNote.textContent = "Grading…";
      }
      function begin() { phase = "speaking"; t0 = Date.now(); secs = CN.perform.speak_seconds; setRing(secs, CN.perform.speak_seconds, true); if (canSpeak) startRec(); else { tx.hidden = false; tx.focus(); } tick = setInterval(() => { secs--; setRing(secs, CN.perform.speak_seconds, true); if (secs <= 0) finish(); }, 1000); draw(); }
      async function finish() {
        if (phase !== "speaking") return; phase = "grading"; const spoken = Math.min(CN.perform.speak_seconds, Math.round((Date.now() - t0) / 1000)); stopAll(); draw();
        const spokenText = (transcript + (interim ? " " + interim : "")).trim(); const text = tx.hidden ? spokenText : (tx.value.trim() || spokenText);
        if (!text || text.split(/\s+/).length < 8) { phase = "ready"; micNote.textContent = "Not enough came through. Try again, or type it."; tx.hidden = false; setRing(CN.perform.prep_seconds, CN.perform.prep_seconds); draw(); return; }
        let result;
        try { const r = await fetch("/api/grade", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "connection", scenario: item.t, transcript: text, seconds: spoken, target: { n: e.n, name: e.name, stance: stanceLine(e), valence: e.valence, levers: e.levers.map(l => lever(l).name), note: e.note }, harmful: !!item.harmful }) }); if (!r.ok) throw new Error(String(r.status)); result = await r.json(); }
        catch { result = window.ASCENT_LOCAL_GRADE_CONNECTION(item, e, text); }
        const entry = { kind: "perform", id: item.id, target: e.n, harmful: !!item.harmful, transcript: text, seconds: spoken, total: result.total, scores: result.scores, notes: result.notes, source: result.source, at: Date.now() };
        st.log.unshift(entry); save(); nav("/connection/result/0");
      }
      draw(); return el;
    });
    route(/^connection\/result\/(\d+)$/, i => {
      const st = cn(); const r = st.log.filter(l => l.kind === "perform")[Number(i)]; if (!r) { nav("/connection"); return screen(""); } const e = E(r.target); const item = performItem(r.id) || {};
      const el = screen("", topline(100, "Result", () => nav("/connection"))); const pass = r.total >= 9;
      el.append(h("p", { class: "eyebrow" }, `${fmtDate(r.at)} · ${r.seconds} s · #${e.n} ${e.name}`), h("div", { class: "score" }, h("span", { class: "big" }, r.total), h("span", { class: "of" }, "of 12"), h("span", { class: "verdict" + (pass ? " pass" : "") }, r.harmful ? (pass ? "Unmistakable" : "Too polite to learn from") : pass ? "Enacted" : "Not yet")));
      const ul = h("ul", { class: "dims" }); CN.perform.dims.forEach((dn, k) => ul.append(h("li", {}, h("span", { class: "dn" }, dn), h("span", { class: "pts" }, r.scores[k]), h("span", { class: "note" }, r.notes[k])))); el.append(ul);
      el.append(h("p", { class: "source" }, r.source === "model" ? "Graded against the enactment by the model grader." : "Offline estimate: the model grader was not reachable, so this is a heuristic reading. Treat it as rough."));
      el.append(h("details", { style: { marginTop: "14px", fontSize: "0.88rem", color: "var(--t-body)" } }, h("summary", {}, "What you said"), h("p", { style: { lineHeight: 1.5 } }, r.transcript)));
      if (r.harmful && item.replace) el.append(h("div", { class: "callout accent" }, h("h3", {}, "Now the replacement"), `#${item.replace} ${E(item.replace).name}. Same situation, the move that keeps trust.`, h("div", { class: "actions row" }, h("a", { class: "btn btn-primary", href: `#/connection/perform/${r.id}r` }, "Perform the replacement"))));
      el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, !pass && !r.harmful ? h("a", { class: "btn btn-primary", href: "#/connection/perform/" + r.id }, "Same situation, again") : null, h("a", { class: pass || r.harmful ? "btn btn-primary" : "btn", href: "#/connection/perform" }, "Next situation"), h("a", { class: "btn btn-link", href: "#/connection" }, "Done for now")));
      return el;
    });

    route(/^connection\/read(?:\/(\w+))?$/, id => {
      const item = id ? CN.read.items.find(i => i.id === id) : nextUnseen(CN.read.items, "read"); if (!item) { nav("/connection"); return screen(""); } if (!id) { nav("/connection/read/" + item.id); return screen(""); }
      const ans = E(item.answer); let pick = null, val = null, lev = null; const el = screen("", topline(0, "Read", () => nav("/connection"))); const box = h("div", {}); el.append(box);
      function draw() {
        box.innerHTML = ""; box.append(h("p", { class: "eyebrow" }, item.speaker), h("p", { class: "topic" }, item.t));
        box.append(chips(item.options.map(n => [n, `#${n} ${E(n).name}`]), pick, v => pick = v, "Which move is this?"));
        box.append(chips(Object.keys(CN.valences).map(v => [v, v]), val, v => val = v, "Valence"));
        box.append(chips(CN.levers.map(l => [l.id, l.name]), lev, v => lev = v, "Lever"));
        box.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { if (pick == null || !val || !lev) { alert("All three: move, valence, lever."); return; } const score = (pick === ans.n ? 1 : 0) + (val === ans.valence ? 1 : 0) + (ans.levers.includes(lev) ? 1 : 0); cn().log.unshift({ kind: "read", id: item.id, score, pick, val, lev, at: Date.now() }); save(); show(score); } }, "Check")));
      }
      function show(score) {
        box.innerHTML = ""; box.append(h("p", { class: "eyebrow" }, item.speaker), h("p", { class: "topic", style: { fontSize: "1.1rem" } }, item.t), h("div", { class: "score" }, h("span", { class: "big" }, score), h("span", { class: "of" }, "of 3"), h("span", { class: "verdict" + (score === 3 ? " pass" : "") }, score === 3 ? "Clean read" : score === 2 ? "Close" : "Look again")));
        box.append(h("ul", { class: "dims" }, h("li", {}, h("span", { class: "dn" }, "Move"), h("span", { class: "pts" }, pick === ans.n ? 1 : 0), h("span", { class: "note" }, `#${ans.n} ${ans.name}. ${pick !== ans.n ? `You said #${pick} ${E(pick).name}.` : ""}`)), h("li", {}, h("span", { class: "dn" }, "Valence"), h("span", { class: "pts" }, val === ans.valence ? 1 : 0), h("span", { class: "note" }, `${ans.valence}. ${CN.valences[ans.valence]}`)), h("li", {}, h("span", { class: "dn" }, "Lever"), h("span", { class: "pts" }, ans.levers.includes(lev) ? 1 : 0), h("span", { class: "note" }, ans.levers.map(l => lever(l).name).join(" or ")))));
        box.append(eCard(ans, true), h("div", { class: "spacer" }), h("div", { class: "actions" }, h("a", { class: "btn btn-primary", href: "#/connection/read" }, "Next read"), h("a", { class: "btn btn-link", href: "#/connection" }, "Done for now")));
      }
      draw(); return el;
    });

    route(/^connection\/replace(?:\/(\w+))?$/, id => {
      const item = id ? CN.replace.items.find(i => i.id === id) : nextUnseen(CN.replace.items, "replace"); if (!item) { nav("/connection"); return screen(""); } if (!id) { nav("/connection/replace/" + item.id); return screen(""); }
      const caught = E(item.caught), ans = E(item.answer); let pick = null, lev = null; const el = screen("", topline(0, "Replace", () => nav("/connection"))); const box = h("div", {}); el.append(box);
      function draw() {
        box.innerHTML = ""; box.append(h("p", { class: "eyebrow" }, `Caught · #${caught.n} ${caught.name}`), h("p", { class: "topic" }, item.t), h("p", { class: "help" }, CN.replace.intro));
        box.append(chips(item.options.map(n => [n, `#${n} ${E(n).name}`]), pick, v => pick = v, "Replace it with"), chips(CN.levers.filter(l => l.id !== "none").map(l => [l.id, l.name]), lev, v => lev = v, "Using which lever"));
        box.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { if (pick == null || !lev) { alert("The move and the lever."); return; } const score = (pick === ans.n ? 1 : 0) + (lev === item.lever ? 1 : ans.levers.includes(lev) ? 1 : 0); cn().log.unshift({ kind: "replace", id: item.id, score, at: Date.now() }); save(); show(score); } }, "Check")));
      }
      function show(score) {
        box.innerHTML = ""; box.append(h("p", { class: "eyebrow" }, `Caught · #${caught.n} ${caught.name}`), h("div", { class: "score" }, h("span", { class: "big" }, score), h("span", { class: "of" }, "of 2"), h("span", { class: "verdict" + (score === 2 ? " pass" : "") }, score === 2 ? "Replaced" : score === 1 ? "Half" : "Not that")));
        box.append(h("p", { class: "help" }, `#${ans.n} ${ans.name}, with ${lever(item.lever).name.toLowerCase()}. ${pick !== ans.n ? `You chose #${pick} ${E(pick).name}. ` : ""}${lever(item.lever).line}`));
        box.append(h("h2", {}, "What you caught"), eCard(caught, true), h("h2", {}, "What replaces it"), eCard(ans, true), h("div", { class: "spacer" }), h("div", { class: "actions" }, h("a", { class: "btn btn-primary", href: "#/connection/replace" }, "Next"), h("a", { class: "btn btn-link", href: "#/connection" }, "Done for now")));
      }
      draw(); return el;
    });

    /* ================= VISION ================= */
    const vi = () => { const s = S(); s.vision = s.vision || { predictions: [], attacks: [], cards: {}, audits: [], log: [] }; return s.vision; };
    function calibration(st) { const res = st.predictions.filter(p => p.resolved !== null && p.resolved !== undefined); const by = {}; VI.predict.confidences.forEach(c => by[c] = { n: 0, hit: 0 }); let brier = 0; res.forEach(p => { by[p.conf].n++; if (p.resolved) by[p.conf].hit++; brier += Math.pow(p.conf / 100 - (p.resolved ? 1 : 0), 2); }); const n = res.length; const meanConf = n ? res.reduce((a, p) => a + p.conf, 0) / n / 100 : 0; const hitRate = n ? res.filter(p => p.resolved).length / n : 0; const gap = hitRate - meanConf; let band = VI.predict.bands[0]; VI.predict.bands.forEach(b => { if (gap >= b.min) band = b; }); return { n, by, brier: n ? brier / n : null, meanConf, hitRate, gap, band }; }

    route(/^vision$/, () => {
      const d = byId.vision, st = vi(); const el = screen("", topline(0, "Vision", () => nav("/")));
      el.append(hub(d), h("p", { class: "help" }, VI.intro));
      const cal = calibration(st); const open = st.predictions.filter(p => p.resolved == null); const due = open.filter(p => p.by && p.by <= dayKey());
      el.append(h("div", { class: "stat-row" }, stat(open.length, "open predictions"), stat(cal.n, "resolved"), stat(cal.n ? Math.round(cal.hitRate * 100) + "%" : "—", cal.n ? `right · said ${Math.round(cal.meanConf * 100)}%` : "hit rate")));
      if (due.length) { el.append(h("h2", {}, "Due")); const ul = h("ul", { class: "evidence" }); due.forEach(p => ul.append(h("li", { style: { borderLeftColor: "var(--accent)" } }, p.text, h("div", { class: "meta" }, h("span", {}, `by ${p.by}`), h("span", {}, `${p.conf}% sure`)), h("div", { class: "actions row" }, h("button", { class: "btn", onclick: () => resolve(p, true) }, "It happened"), h("button", { class: "btn", onclick: () => resolve(p, false) }, "It didn't"))))); el.append(ul); }
      const ul = h("ul", { class: "deck" });
      const unseenCards = VI.cards.items.filter(c => !st.cards[c.id]);
      [["Prediction", "A checkable claim, a date, how sure you are.", "#/vision/predict"], ["Attack the thesis", "The model builds the case against it. It argues; it does not advise.", "#/vision/attack"], [`Base-rate card${unseenCards.length ? ` (${unseenCards.length} left)` : ""}`, "Your guess, then the number and its source.", "#/vision/card"], ["Narrative audit", "Three load-bearing claims: evidence, inference, or wish.", "#/vision/audit"]].forEach(([n, l, href]) => ul.append(h("li", {}, h("a", { class: "card", href, style: { textDecoration: "none" } }, h("span", { class: "cat" }, h("strong", { style: { color: "var(--t-strong)" } }, n)), h("span", {}, l)))));
      el.append(h("h2", {}, "Today"), ul);
      if (cal.n >= 5) el.append(h("div", { class: "callout" }, h("h3", {}, `Calibration · ${cal.band.name}`), cal.band.note, h("div", { class: "actions row" }, h("a", { class: "btn btn-link", href: "#/vision/calibration" }, "The table"))));
      else if (cal.n) el.append(h("p", { class: "fine" }, `${cal.n} resolved. Calibration appears at five; it means something at twenty.`));
      if (open.length) { el.append(h("h2", {}, "Open")); const ul2 = h("ul", { class: "evidence" }); open.filter(p => !due.includes(p)).slice(0, 8).forEach(p => ul2.append(h("li", {}, p.text, h("div", { class: "meta" }, h("span", {}, p.by ? `by ${p.by}` : fmtDate(p.at)), h("span", {}, `${p.conf}%`)), h("div", { class: "actions row" }, h("button", { class: "btn btn-link", onclick: () => resolve(p, true) }, "Happened"), h("button", { class: "btn btn-link", onclick: () => resolve(p, false) }, "Didn't"))))); el.append(ul2); }
      return el;
      function resolve(p, v) { p.resolved = v; p.resolvedAt = Date.now(); logIt("vision", "resolve", { id: p.id }); nav("/vision"); }
    });
    route(/^vision\/predict$/, () => {
      const st = vi(); let conf = 75; const el = screen("", topline(0, "Prediction", () => nav("/vision")));
      el.append(h("p", { class: "eyebrow" }, "Vision · prediction journal"), h("h1", {}, em("Say it, *then check it*")), h("p", { class: "help" }, VI.predict.intro));
      const text = ta(VI.predict.placeholder, "", 80); const by = h("input", { type: "date" }); const def = new Date(); def.setDate(def.getDate() + 30); by.value = dayKey(def);
      el.append(text, chips(VI.predict.confidences.map(c => [c, `${c}%`]), conf, v => conf = v, "How sure?"), h("label", { class: "lbl" }, "Check on"), by);
      el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { const t = text.value.trim(); if (t.length < 8) { alert("A claim someone could check."); return; } st.predictions.unshift({ id: uid(), text: t, conf, by: by.value || null, at: Date.now(), resolved: null }); logIt("vision", "predict"); nav("/vision"); } }, "Log it")));
      return el;
    });
    route(/^vision\/calibration$/, () => {
      const st = vi(); const cal = calibration(st); const el = screen("", topline(0, "Calibration", () => nav("/vision")));
      el.append(h("h1", {}, em("When you say *80*")), h("p", { class: "help" }, `${cal.n} resolved. Mean stated confidence ${Math.round(cal.meanConf * 100)}%, actual hit rate ${Math.round(cal.hitRate * 100)}%. Brier ${cal.brier == null ? "—" : cal.brier.toFixed(3)} (0 is perfect, 0.25 is a coin).`));
      const bars = h("div", { class: "bars" }); VI.predict.confidences.forEach(c => { const r = cal.by[c]; const hr = r.n ? r.hit / r.n : null; bars.append(h("div", { class: "brow", style: { gridTemplateColumns: "1fr auto" } }, h("div", {}, h("div", { class: "lbl2" }, h("span", {}, `Said ${c}%`), h("span", {}, r.n ? `${Math.round(hr * 100)}% right · n=${r.n}` : "no data")), h("div", { class: "track" }, h("div", { style: { width: (hr == null ? 0 : hr * 100) + "%", background: hr == null ? "transparent" : hr + 0.08 < c / 100 ? "var(--accent)" : byId.vision.color } }))), h("div", { class: "band" }, r.n ? (hr + 0.08 < c / 100 ? "over" : hr - 0.08 > c / 100 ? "under" : "ok") : ""))); }); el.append(bars);
      el.append(h("div", { class: "callout" }, h("h3", {}, cal.band.name), cal.band.note));
      const res = st.predictions.filter(p => p.resolved != null); if (res.length) { const ul = h("ul", { class: "evidence" }); res.slice(0, 20).forEach(p => ul.append(h("li", { style: { borderLeftColor: p.resolved ? "#2F6E4F" : "var(--accent)" } }, p.text, h("div", { class: "meta" }, h("span", {}, fmtDate(p.at)), h("span", {}, `${p.conf}%`), h("span", { class: "delta" }, p.resolved ? "happened" : "didn't"))))); el.append(h("h2", {}, "Resolved"), ul); }
      return el;
    });
    route(/^vision\/attack$/, () => {
      const st = vi(); const el = screen("", topline(0, "Attack the thesis", () => nav("/vision"))); const box = h("div", {});
      el.append(h("p", { class: "eyebrow" }, "Vision · the thesis"), h("h1", {}, em("Attack it *before the market does*")), h("p", { class: "help" }, VI.attack.intro), box);
      const last = st.attacks[0]; const text = ta(VI.attack.placeholder, last ? last.thesis : "", 90); const btn = h("button", { class: "btn btn-primary" }, "Build the case against it");
      box.append(text, h("div", { class: "spacer" }), h("div", { class: "actions" }, btn));
      btn.onclick = async () => { const thesis = text.value.trim(); if (thesis.length < 20) { alert("One or two sentences. The thesis, not the tagline."); return; } btn.disabled = true; btn.textContent = "Arguing…"; let result, source = "model"; try { const r = await fetch("/api/grade", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "counter", thesis }) }); if (!r.ok) throw new Error(String(r.status)); result = await r.json(); } catch { result = VI.attack.offline; source = "offline"; } st.attacks.unshift({ id: uid(), thesis, result, source, at: Date.now() }); logIt("vision", "attack"); nav("/vision/attack/0"); };
      if (st.attacks.length) { const ul = h("ul", { class: "evidence" }); st.attacks.slice(0, 6).forEach((a, i) => ul.append(h("li", { style: { cursor: "pointer" }, onclick: () => nav("/vision/attack/" + i) }, a.thesis, h("div", { class: "meta" }, h("span", {}, fmtDate(a.at)), h("span", {}, a.source))))); el.append(h("h2", {}, "Past theses"), ul); }
      return el;
    });
    route(/^vision\/attack\/(\d+)$/, i => {
      const a = vi().attacks[Number(i)]; if (!a) { nav("/vision/attack"); return screen(""); } const r = a.result; const el = screen("", topline(100, "The case against", () => nav("/vision")));
      el.append(h("p", { class: "eyebrow" }, fmtDate(a.at)), h("p", { class: "topic", style: { fontSize: "1.15rem" } }, a.thesis));
      el.append(h("h2", {}, "Three counters")); const ol = h("ol", { class: "steps" }); (r.counters || []).forEach(c => ol.append(h("li", {}, c))); el.append(ol);
      el.append(h("div", { class: "callout" }, h("h3", {}, "The base rate that applies"), r.base_rate || ""), h("div", { class: "callout" }, h("h3", {}, "The strongest version of your own thesis"), r.steelman || ""), h("div", { class: "callout accent" }, h("h3", {}, "The question that would settle it"), r.test || ""));
      el.append(h("p", { class: "source" }, a.source === "model" ? "Built by the model from your thesis. It is an argument, not advice; weigh it." : "Offline: the model was not reachable, so these are the standing questions every thesis has to answer. Run it again when online for the specific case."));
      el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("a", { class: "btn btn-primary", href: "#/vision/predict" }, "Turn the test into a prediction"), h("a", { class: "btn", href: "#/vision" }, "Back")));
      return el;
    });
    route(/^vision\/card(?:\/(\w+))?$/, id => {
      const st = vi(); const item = id ? VI.cards.items.find(c => c.id === id) : (VI.cards.items.filter(c => !st.cards[c.id])[0] || VI.cards.items[Math.floor(Math.random() * VI.cards.items.length)]); if (!item) { nav("/vision"); return screen(""); } if (!id) { nav("/vision/card/" + item.id); return screen(""); }
      const el = screen("", topline(0, "Base rate", () => nav("/vision"))); const box = h("div", {}); el.append(h("p", { class: "eyebrow" }, `Vision · base-rate card ${VI.cards.items.indexOf(item) + 1} of ${VI.cards.items.length}`), box);
      const prev = st.cards[item.id];
      function ask() { box.innerHTML = ""; const g = h("input", { type: "text", inputmode: "decimal", placeholder: `Your guess, in ${item.unit === "%" ? "percent" : item.unit}` }); box.append(h("p", { class: "statement" }, item.q), h("p", { class: "help" }, VI.cards.guessLine), g, h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { const v = parseFloat(g.value); if (isNaN(v)) { alert("A number. A guess is fine; that is the point."); return; } st.cards[item.id] = { guess: v, at: Date.now() }; logIt("vision", "card", { id: item.id }); reveal(v); } }, "Reveal"))); }
      function reveal(guess) { box.innerHTML = ""; const gap = guess - item.rate; const rel = Math.abs(gap) / item.rate; box.append(h("p", { class: "statement" }, item.q), h("div", { class: "score" }, h("span", { class: "big" }, item.rate + (item.unit === "%" ? "%" : item.unit === "x" ? "x" : "")), h("span", { class: "of" }, item.unit === "years" ? "years" : ""), h("span", { class: "verdict" + (rel < 0.2 ? " pass" : "") }, rel < 0.2 ? "Close" : gap > 0 ? "You guessed high" : "You guessed low")), h("p", { class: "help" }, `You said ${guess}${item.unit === "%" ? "%" : ""}. ${item.note}`), h("p", { class: "source" }, "Source: " + item.src), h("div", { class: "spacer" }), h("div", { class: "actions" }, h("a", { class: "btn btn-primary", href: "#/vision/card" }, "Next card"), h("a", { class: "btn btn-link", href: "#/vision" }, "Done for now"))); }
      prev ? reveal(prev.guess) : ask(); return el;
    });
    route(/^vision\/audit$/, () => {
      const st = vi(); const el = screen("", topline(0, "Narrative audit", () => nav("/vision")));
      el.append(h("p", { class: "eyebrow" }, "Vision · the story"), h("h1", {}, em("Evidence, inference, *or wish*")), h("p", { class: "help" }, VI.audit.intro));
      const story = ta(VI.audit.storyPlaceholder, "", 110); el.append(h("label", { class: "lbl" }, "The story"), story);
      const claims = [0, 1, 2].map(i => { const t = h("input", { type: "text", placeholder: VI.audit.claimPlaceholder, maxlength: 200 }); const o = { t, kind: null }; el.append(h("h2", {}, `Claim ${i + 1}`), t, chips(VI.audit.kinds.map(k => [k[0], k[1]]), null, v => o.kind = v)); return o; });
      el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { if (story.value.trim().length < 20 || claims.some(c => !c.t.value.trim() || !c.kind)) { alert("The story, three claims, and a kind for each."); return; } const a = { id: uid(), story: story.value.trim(), claims: claims.map(c => ({ t: c.t.value.trim(), kind: c.kind })), at: Date.now() }; st.audits.unshift(a); logIt("vision", "audit"); nav("/vision/audit/0"); } }, "Audit it")));
      if (st.audits.length) { const ul = h("ul", { class: "evidence" }); st.audits.slice(0, 5).forEach((a, i) => ul.append(h("li", { style: { cursor: "pointer" }, onclick: () => nav("/vision/audit/" + i) }, a.story.slice(0, 90) + (a.story.length > 90 ? "…" : ""), h("div", { class: "meta" }, h("span", {}, fmtDate(a.at)), h("span", {}, `${a.claims.filter(c => c.kind === "evidence").length} grounded`))))); el.append(h("h2", {}, "Past audits"), ul); }
      return el;
    });
    route(/^vision\/audit\/(\d+)$/, i => {
      const a = vi().audits[Number(i)]; if (!a) { nav("/vision/audit"); return screen(""); } const grounded = a.claims.filter(c => c.kind === "evidence").length; const wishes = a.claims.filter(c => c.kind === "wish").length;
      const el = screen("", topline(100, "Audit", () => nav("/vision"))); el.append(h("p", { class: "eyebrow" }, fmtDate(a.at)), h("p", { class: "help", style: { fontStyle: "italic" } }, a.story));
      const ul = h("ul", { class: "dims" }); a.claims.forEach(c => ul.append(h("li", {}, h("span", { class: "dn" }, VI.audit.kinds.find(k => k[0] === c.kind)[1]), h("span", { class: "pts" }, c.kind === "evidence" ? "✓" : c.kind === "wish" ? "!" : "~"), h("span", { class: "note" }, c.t)))); el.append(ul);
      el.append(h("div", { class: "callout" + (wishes ? " accent" : "") }, h("h3", {}, `${grounded} of 3 grounded`), VI.audit.verdict[grounded]));
      el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, wishes ? h("a", { class: "btn btn-primary", href: "#/vision/predict" }, "Turn a wish into a prediction") : null, h("a", { class: "btn", href: "#/vision" }, "Back")));
      return el;
    });

    /* ================= DETACHMENT ================= */
    const de = () => { const s = S(); s.detachment = s.detachment || { inventories: [], delegations: [], failure: null, absences: [], letter: null, log: [] }; return s.detachment; };
    function concentration(alloc) { const total = DE.inventory.points; const shares = DE.inventory.slots.map(s => (alloc[s.id] || 0) / total); const top = Math.max(...shares); const hhi = shares.reduce((a, x) => a + x * x, 0); let band = DE.inventory.bands[0]; DE.inventory.bands.forEach(b => { if (top >= b.min) band = b; }); const topSlot = DE.inventory.slots[shares.indexOf(top)]; return { top, hhi, band, topSlot }; }

    route(/^detachment$/, () => {
      const d = byId.detachment, st = de(); const el = screen("", topline(0, "Detachment", () => nav("/")));
      el.append(hub(d), h("p", { class: "help" }, DE.intro));
      const inv = st.inventories[0]; const active = st.delegations.find(x => !x.outcome); const absActive = st.absences.find(a => !a.doneAt); const reads = st.failure ? st.failure.reads.length : 0;
      el.append(h("div", { class: "stat-row" }, stat(inv ? Math.round(concentration(inv.alloc).top * 100) + "%" : "—", "in one basket"), stat(st.delegations.filter(x => x.outcome && x.outcome !== "took").length, "handed off and held"), stat(st.absences.filter(a => a.doneAt).reduce((a, x) => a + x.hours, 0) + " h", "unreachable, survived")));
      const ul = h("ul", { class: "deck" });
      [["Identity inventory", inv ? `${concentration(inv.alloc).band.name}: ${concentration(inv.alloc).topSlot.name.toLowerCase()} holds ${Math.round(concentration(inv.alloc).top * 100)}%. Redo monthly.` : "Twenty points across where you actually live.", "#/detachment/inventory"],
       ["Delegation", active ? `Holding: ${DE.delegate.items.find(i => i.id === active.id).t}` : "Release control where it is not needed. One a week.", "#/detachment/delegate"],
       ["The full failure", !st.failure ? "Write it once." : reads >= DE.failure.readDays ? "Read seven times. It is a fact now." : `Read ${reads} of ${DE.failure.readDays}.`, "#/detachment/failure"],
       ["Absence", absActive ? `Out now · ${absActive.hours} hours. Come back and log what broke.` : `Next: ${DE.absence.hours[Math.min(st.absences.filter(a => a.doneAt).length, DE.absence.hours.length - 1)]} hours unreachable.`, "#/detachment/absence"],
       ["Succession letter", st.letter ? `Written ${fmtDate(st.letter.at)}. Read it each quarter.` : "To whoever runs this if you cannot.", "#/detachment/letter"]
      ].forEach(([n, l, href]) => ul.append(h("li", {}, h("a", { class: "card", href, style: { textDecoration: "none" } }, h("span", { class: "cat" }, h("strong", { style: { color: "var(--t-strong)" } }, n)), h("span", {}, l)))));
      el.append(h("h2", {}, "Five practices"), ul);
      el.append(h("div", { class: "callout" }, h("h3", {}, "The cooldown"), "Shut the shop, in Recovery, is this block's ritual. The drawer closes; the shop opens at eight.", h("div", { class: "actions row" }, h("a", { class: "btn btn-link", href: "#/recovery/do/shut-the-shop?t=day" }, "Shut the shop"))));
      return el;
    });
    route(/^detachment\/inventory$/, () => {
      const st = de(); const prev = st.inventories[0]; const alloc = Object.assign({}, prev ? prev.alloc : {}); const el = screen("", topline(0, "Identity inventory", () => nav("/detachment")));
      el.append(h("p", { class: "eyebrow" }, "Detachment · inventory"), h("h1", {}, em("Where do *you* live?")), h("p", { class: "help" }, DE.inventory.intro));
      const left = h("p", { class: "help", style: { fontWeight: 600 } }); const rows = h("div", {});
      const used = () => Object.values(alloc).reduce((a, b) => a + b, 0);
      function draw() { rows.innerHTML = ""; left.textContent = `${DE.inventory.points - used()} points left`; DE.inventory.slots.forEach(s => { const v = alloc[s.id] || 0; rows.append(h("div", { class: "brow", style: { gridTemplateColumns: "1fr auto", alignItems: "center" } }, h("div", {}, h("div", { class: "lbl2" }, h("span", {}, h("strong", {}, s.name), h("span", { style: { color: "var(--t-faint)" } }, ` · ${s.hint}`)), h("span", {}, v)), h("div", { class: "track" }, h("div", { style: { width: (v / DE.inventory.points * 100) + "%", background: byId.detachment.color } }))), h("div", { class: "chips", style: { marginTop: 0 } }, h("button", { class: "chip", onclick: () => { if (v > 0) { alloc[s.id] = v - 1; draw(); } } }, "−"), h("button", { class: "chip", onclick: () => { if (used() < DE.inventory.points) { alloc[s.id] = v + 1; draw(); } } }, "+")))); }); }
      draw(); el.append(left, h("div", { class: "bars" }, rows));
      el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { if (used() !== DE.inventory.points) { alert(`All ${DE.inventory.points} points. Where they go is the data.`); return; } st.inventories.unshift({ alloc, at: Date.now() }); logIt("detachment", "inventory"); nav("/detachment/inventory/result"); } }, "Read it")));
      return el;
    });
    route(/^detachment\/inventory\/result$/, () => {
      const st = de(); const inv = st.inventories[0]; if (!inv) { nav("/detachment/inventory"); return screen(""); } const c = concentration(inv.alloc);
      const el = screen("interlude", topline(100, "Inventory", () => nav("/detachment"))); el.append(h("p", { class: "eyebrow" }, c.band.name), h("h1", {}, em(`*${Math.round(c.top * 100)}%* in ${c.topSlot.name.toLowerCase()}`)), h("p", { class: "body" }, c.band.note), h("p", { class: "body" }, `Concentration index ${c.hhi.toFixed(2)} (0.11 is perfectly spread across nine; 1.0 is all in one).`));
      if (st.inventories.length > 1) { const p = concentration(st.inventories[1].alloc); el.append(h("p", { class: "body" }, `Last time: ${Math.round(p.top * 100)}% in ${p.topSlot.name.toLowerCase()}.`)); }
      el.append(h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => nav("/detachment") }, "Back")));
      return el;
    });
    route(/^detachment\/delegate$/, () => {
      const st = de(); const active = st.delegations.find(x => !x.outcome); const el = screen("", topline(0, "Delegation", () => nav("/detachment")));
      el.append(h("p", { class: "eyebrow" }, "Detachment · delegation"), h("h1", {}, em("Release what *does not need you*")), h("p", { class: "help" }, DE.delegate.intro));
      if (active) {
        const it = DE.delegate.items.find(i => i.id === active.id); let outcome = null; const note = ta("What happened while you held it.", "", 70);
        el.append(h("div", { class: "callout accent" }, h("h3", {}, `Holding since ${fmtDate(active.at)} · ${it.term}`), it.t), chips(DE.delegate.outcomes.map(o => [o[0], o[1]]), null, v => outcome = v, "How did it go?"), note);
        el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { if (!outcome) { alert("One of the three."); return; } active.outcome = outcome; active.note = note.value.trim(); active.doneAt = Date.now(); logIt("detachment", "delegate", { id: active.id, outcome }); nav("/detachment/delegate"); } }, "Log it")));
        el.append(h("p", { class: "fine" }, DE.delegate.outcomes.map(o => `${o[1]}: ${o[2]}`).join(" ")));
      } else {
        const done = new Set(st.delegations.map(x => x.id)); const ul = h("ul", { class: "deck" });
        DE.delegate.items.forEach(it => ul.append(h("li", {}, h("button", { class: "card" + (done.has(it.id) ? " done" : ""), onclick: () => { st.delegations.unshift({ id: it.id, at: Date.now(), outcome: null }); logIt("detachment", "delegate-start", { id: it.id }); nav("/detachment"); } }, h("span", { class: "cat" }, it.term), h("span", {}, it.t, done.has(it.id) ? " ✓" : "")))));
        el.append(h("h2", {}, "Pick one"), ul);
      }
      const past = st.delegations.filter(x => x.outcome); if (past.length) { const ul = h("ul", { class: "evidence" }); past.slice(0, 7).forEach(x => ul.append(h("li", { style: { borderLeftColor: x.outcome === "took" ? "var(--accent)" : "#2F6E4F" } }, DE.delegate.items.find(i => i.id === x.id).t, h("div", { class: "meta" }, h("span", {}, fmtDate(x.doneAt)), h("span", { class: "delta" }, DE.delegate.outcomes.find(o => o[0] === x.outcome)[1]), x.note ? h("span", {}, x.note) : null)))); el.append(h("h2", {}, "Held"), ul); }
      return el;
    });
    route(/^detachment\/failure$/, () => {
      const st = de(); const el = screen("", topline(0, "The full failure", () => nav("/detachment")));
      el.append(h("p", { class: "eyebrow" }, "Detachment · the full failure"), h("h1", {}, em("Write it *once*")), h("p", { class: "help" }, DE.failure.intro));
      if (!st.failure) {
        const fields = DE.failure.prompts.map(p => { const t = ta(p, "", 90); el.append(h("label", { class: "lbl" }, p), t); return t; });
        el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { if (fields.some(f => f.value.trim().length < 10)) { alert("All four. Plainly."); return; } st.failure = { text: fields.map(f => f.value.trim()), at: Date.now(), reads: [] }; logIt("detachment", "failure-write"); nav("/detachment/failure"); } }, "Save it. Then read it tomorrow.")));
        return el;
      }
      const today = dayKey(); const readToday = st.failure.reads.includes(today); const n = st.failure.reads.length;
      el.append(h("p", { class: "fine" }, `Written ${fmtDate(st.failure.at)} · read ${n} of ${DE.failure.readDays}`));
      if (n >= DE.failure.readDays) el.append(h("div", { class: "callout" }, h("h3", {}, "A fact now"), DE.failure.done));
      DE.failure.prompts.forEach((p, i) => el.append(h("h2", {}, p), h("p", { class: "help", style: { whiteSpace: "pre-wrap" } }, st.failure.text[i])));
      el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", disabled: readToday, onclick: () => { st.failure.reads.push(today); logIt("detachment", "failure-read"); nav("/detachment"); } }, readToday ? "Read today" : "I read it. Close it."), h("button", { class: "btn btn-link", onclick: () => { if (confirm("Rewrite the failure? The readings reset.")) { st.failure = null; save(); nav("/detachment/failure"); } } }, "Rewrite")));
      el.append(h("p", { class: "fine" }, DE.failure.readLine));
      return el;
    });
    route(/^detachment\/absence$/, () => {
      const st = de(); const active = st.absences.find(a => !a.doneAt); const doneN = st.absences.filter(a => a.doneAt).length; const next = DE.absence.hours[Math.min(doneN, DE.absence.hours.length - 1)];
      const el = screen("", topline(0, "Absence", () => nav("/detachment"))); el.append(h("p", { class: "eyebrow" }, "Detachment · absence"), h("h1", {}, em("Unreachable, *by design*")), h("p", { class: "help" }, DE.absence.intro));
      if (active) {
        const elapsed = Math.round((Date.now() - active.at) / 36e5 * 10) / 10; const broke = ta(DE.absence.brokePlaceholder, "", 80);
        el.append(h("div", { class: "callout accent" }, h("h3", {}, `Out · ${active.hours} hours planned`), `Started ${fmtDate(active.at)}, ${elapsed} h ago. Phone off is the rule; you are reading this on something, so finish and put it down.`), h("label", { class: "lbl" }, "Back. What broke?"), broke);
        el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { active.doneAt = Date.now(); active.broke = broke.value.trim() || "Nothing."; active.actual = Math.round((active.doneAt - active.at) / 36e5 * 10) / 10; logIt("detachment", "absence", { hours: active.hours }); nav("/detachment/absence"); } }, "Back · log it"), h("button", { class: "btn btn-link", onclick: () => { st.absences = st.absences.filter(a => a !== active); save(); nav("/detachment/absence"); } }, "Cancel this one")));
      } else {
        el.append(h("div", { class: "callout" }, h("h3", {}, `Next: ${next} hours`), DE.absence.line), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { st.absences.unshift({ hours: next, at: Date.now(), doneAt: null }); save(); nav("/detachment"); } }, `Start ${next} hours now`)));
        const hrs = h("input", { type: "text", inputmode: "decimal", placeholder: "hours" }); const broke = h("input", { type: "text", placeholder: DE.absence.brokePlaceholder });
        el.append(h("h2", {}, "Log one already done"), hrs, broke, h("div", { class: "actions row" }, h("button", { class: "btn", onclick: () => { const v = parseFloat(hrs.value); if (isNaN(v) || v <= 0) return; const now = Date.now(); st.absences.unshift({ hours: v, at: now - v * 36e5, doneAt: now, actual: v, broke: broke.value.trim() || "Nothing." }); logIt("detachment", "absence", { hours: v }); nav("/detachment/absence"); } }, "Log it")));
      }
      const past = st.absences.filter(a => a.doneAt); if (past.length) { const ul = h("ul", { class: "evidence" }); past.slice(0, 7).forEach(a => ul.append(h("li", {}, a.broke, h("div", { class: "meta" }, h("span", {}, fmtDate(a.doneAt)), h("span", { class: "delta" }, `${a.actual || a.hours} h`))))); el.append(h("h2", {}, "What broke"), ul); }
      return el;
    });
    route(/^detachment\/letter$/, () => {
      const st = de(); const el = screen("", topline(0, "Succession letter", () => nav("/detachment")));
      el.append(h("p", { class: "eyebrow" }, "Detachment · the letter"), h("h1", {}, em("To whoever *runs this next*")), h("p", { class: "help" }, DE.letter.intro));
      if (!st.letter) {
        const fields = DE.letter.prompts.map(p => { const t = ta(p, "", 90); el.append(h("label", { class: "lbl" }, p), t); return t; });
        el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { if (fields.some(f => f.value.trim().length < 10)) { alert("All four parts."); return; } st.letter = { text: fields.map(f => f.value.trim()), at: Date.now(), reads: [] }; logIt("detachment", "letter-write"); nav("/detachment/letter"); } }, "Save the letter")));
        return el;
      }
      el.append(h("p", { class: "fine" }, `Written ${fmtDate(st.letter.at)}${st.letter.reads.length ? ` · last read ${fmtDate(st.letter.reads[st.letter.reads.length - 1])}` : ""}`));
      DE.letter.prompts.forEach((p, i) => el.append(h("h2", {}, p), h("p", { class: "help", style: { whiteSpace: "pre-wrap" } }, st.letter.text[i])));
      el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { st.letter.reads.push(Date.now()); logIt("detachment", "letter-read"); nav("/detachment"); } }, "Read it again · done"), h("button", { class: "btn btn-link", onclick: () => { if (confirm("Rewrite the letter?")) { st.letter = null; save(); nav("/detachment/letter"); } } }, "Rewrite")));
      el.append(h("p", { class: "fine" }, DE.letter.done));
      return el;
    });
  });
})();
