/* Character — the intake questionnaire, the backend profile, and the sheet the founder plays.
   Routes: #/intake (one item per screen, resumable), #/sheet, #/roads (goal-setting: mastery, cross-training, re-classing).
   Backend values live in st.character.raw and are never rendered. Content in data/intake.js. */
(function () {
  "use strict";
  window.ASCENT_PLUGINS = window.ASCENT_PLUGINS || [];
  window.ASCENT_PLUGINS.push(function (api) {
    const { route, h, em, screen, topline, nav, mark, byId, fmtDate } = api;
    const I = window.ASCENT_INTAKE, D = window.ASCENT_DOMAINS;
    const S = () => api.state(); const save = api.save;
    const item = id => I.items.find(x => x.id === id);
    const RETAKE_DAYS = 28, ROADS_AFTER = 7;

    // ---------- scoring ----------
    function score(answers) {
      const sc = {}; const likert = {}; I.items.forEach(it => { if (!it.scale || it.opts || it.pair) return; const v = answers[it.id]; if (typeof v !== "number") return; const x = it.rev ? 5 - v : v; (likert[it.scale] = likert[it.scale] || []).push(x); });
      Object.keys(likert).forEach(k => { const a = likert[k]; sc[k] = Math.round((a.reduce((p, q) => p + q, 0) / a.length - 1) / 3 * 100); });
      const needs = {}; Object.keys(I.needs).forEach(n => needs[n] = 0); const pairWins = {};
      I.items.filter(it => it.pair).forEach(it => { const v = answers[it.id]; if (typeof v === "string") { needs[v]++; pairWins[it.id] = v; } });
      I.items.filter(it => it.block === "V").forEach(it => { const v = answers[it.id]; if (typeof v === "string") needs[v] += 1; });
      sc.needs = needs;
      sc.risk = ((answers.R1 || 0) + (answers.R2 || 0)); sc.loss = ((answers.R3 || 0) + (answers.R4 || 0));
      sc.meq = ["G1", "G2", "G3", "G4", "G5"].reduce((a, id) => a + (answers[id] || 0), 0);
      sc.ctx = { founding: answers.H1, stage: answers.H2, team: answers.H3, hours: answers.H4 };
      sc.pairWins = pairWins; return sc;
    }
    function derive(sc, profileScores) {
      const n = sc.needs; const ranked = Object.keys(n).sort((a, b) => n[b] - n[a] || headToHead(sc, a, b));
      const need = ranked[0], latentNeed = ranked[1];
      const g = k => sc[k] == null ? 50 : sc[k]; const needPct = k => Math.round(n[k] / 12 * 100);
      const styles = {
        explorer: 0.35 * g("O") + 0.35 * g("basF") + 0.15 * g("E") + 0.15 * needPct("uncertainty"),
        builder: 0.4 * g("C") + 0.25 * g("prev") + 0.2 * needPct("certainty") + 0.15 * (100 - g("basF")),
        director: 0.3 * g("basD") + 0.25 * (100 - g("A")) + 0.25 * g("future") + 0.2 * g("prom"),
        negotiator: 0.35 * g("A") + 0.25 * needPct("love") + 0.2 * needPct("contribution") + 0.2 * g("O")
      };
      const sRank = Object.keys(styles).sort((a, b) => styles[b] - styles[a]); const style = sRank[0], latentStyle = sRank[1];
      const hunger = Math.round((g("basR") + g("basD") + g("basF")) / 3); const fear = g("bis");
      const rf = g("prom") - g("prev"); const stance = rf > 10 ? "vanguard" : rf < -10 ? "warden" : "steady";
      const horizon = ["past", "present", "future"].sort((a, b) => g(b) - g(a))[0];
      const senses = g("sense") < 45 ? "dim" : g("sense") < 65 ? "fair" : "keen";
      const hour = sc.meq >= 18 ? "morning" : sc.meq <= 11 ? "evening" : "day";
      const stats = { O: g("O"), C: g("C"), E: g("E"), A: g("A"), S: 100 - g("N") };
      const flaw = profileScores ? D.slice().sort((a, b) => profileScores[a.id] - profileScores[b.id])[0].id : null;
      return { need, latentNeed, style, latentStyle, title: I.epithets[need][style], fear, hunger, stats, stance, horizon, senses, hour, flaw, raw: { scores: sc, styles }, at: Date.now() };
    }
    function headToHead(sc, a, b) { const it = I.items.find(x => x.pair && x.pair.some(p => p[0] === a) && x.pair.some(p => p[0] === b)); if (!it) return 0; const w = sc.pairWins[it.id]; return w === a ? -1 : w === b ? 1 : 0; }
    const band = v => v < 40 ? "Low" : v > 65 ? "High" : "Mid";
    function current(ch) { const s = ch.raw.scores; return { bis: s.bis, basF: s.basF, basD: s.basD, O: s.O, C: s.C, E: s.E, A: s.A, prev: s.prev, prom: s.prom, future: s.future, sense: s.sense }; }
    const MASTERY = { certainty: { bis: 45, basF: 55 }, uncertainty: { bis: 45, C: 60 }, significance: { A: 55, basD: 60 }, love: { A: 60, E: 55 }, growth: { future: 55, A: 55 }, contribution: { C: 60, basD: 60 } };
    function gaps(ch, target) { const cur = current(ch); return Object.keys(target).map(k => ({ dim: k, delta: target[k] - (cur[k] == null ? 50 : cur[k]) })).filter(x => Math.abs(x.delta) >= 8).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 3).map(x => { const mv = I.gapMoves[x.dim] || {}; const dir = x.delta > 0 ? "up" : "down"; return { dim: x.dim, dir, text: mv[dir] || mv.up || mv.down || "", ids: mv.ids || [] }; }); }
    window.ASCENT_CHARACTER = { score, derive, gaps, band };

    // ---------- intake ----------
    route(/^intake$/, () => {
      const s = S(); s.intake = s.intake || { answers: {}, pos: 0, startedAt: null, doneAt: null };
      const st = s.intake; const total = I.order.length;
      if (st.doneAt && s.character && !s.intake.retaking) { nav("/sheet"); return screen(""); }
      const el = screen(""); const box = h("div", {}); el.append(box);
      function draw() {
        box.innerHTML = "";
        if (st.pos === 0 && !st.startedAt) { box.append(topline(0, "Your build", () => nav("/")), h("p", { class: "eyebrow" }, `${I.minutes} minutes · once · stop and resume any time`), h("h1", {}, em("Lives to *choose between*")), h("p", { class: "help" }, I.intro), h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { st.startedAt = Date.now(); save(); draw(); } }, "Begin"))); return; }
        if (st.pos >= total) { finish(); return; }
        const it = item(I.order[st.pos]); const pct = Math.round(st.pos / total * 100);
        box.append(topline(pct, `${st.pos + 1} of ${total}`, () => { save(); nav("/"); }));
        const pick = v => { st.answers[it.id] = v; st.pos++; save(); draw(); };
        const quit = h("div", { class: "actions row", style: { marginTop: "6px", justifyContent: "flex-end" } }, h("button", { class: "btn btn-link", onclick: () => { save(); nav("/"); } }, "Save and finish later"));
        setTimeout(() => box.append(quit), 0);
        if (it.pair) { box.append(h("p", { class: "eyebrow" }, "Which is more like you, most of the time?")); const opts = h("div", { class: "options", role: "radiogroup" }); const pr = Math.random() < 0.5 ? it.pair : it.pair.slice().reverse(); pr.forEach(([tag, t]) => opts.append(h("button", { class: "opt", role: "radio", "aria-checked": "false", onclick: ev => window.ASCENT_SETTLE(ev, () => pick(tag)) }, h("span", { class: "dot" }), t))); box.append(opts); return; }
        if (it.opts) { box.append(h("p", { class: "eyebrow" }, it.block === "V" ? "Choose a life" : it.block === "R" ? "Your call" : it.block === "H" ? "About the company" : "About your day"), h("p", { class: "statement" }, it.t)); const opts = h("div", { class: "options", role: "radiogroup" }); it.opts.forEach(([v, t]) => opts.append(h("button", { class: "opt", role: "radio", "aria-checked": "false", onclick: ev => window.ASCENT_SETTLE(ev, () => pick(v)) }, h("span", { class: "dot" }), t))); box.append(opts); return; }
        box.append(h("p", { class: "eyebrow" }, "How true is this of you?"), h("p", { class: "statement" }, it.t)); const opts = h("div", { class: "options", role: "radiogroup" }); I.likert.forEach(([v, t]) => opts.append(h("button", { class: "opt", role: "radio", "aria-checked": "false", onclick: ev => window.ASCENT_SETTLE(ev, () => pick(Number(v))) }, h("span", { class: "dot" }), t))); box.append(opts);
      }
      function finish() { const sc = score(st.answers); const ch = derive(sc, s.profile.scores); s.characterHistory = s.characterHistory || []; if (s.character) s.characterHistory.push(s.character); if (s.character && s.character.path) ch.path = s.character.path; s.character = ch; st.doneAt = Date.now(); st.retaking = false; save(); nav("/sheet"); }
      draw(); return el;
    });

    // ---------- sheet ----------
    route(/^sheet$/, () => {
      const s = S(); const ch = s.character; if (!ch) { nav("/intake"); return screen(""); }
      const t = window.ASCENT_TODAY; const p = t.program(); const el = screen("", topline(0, "Your build", () => nav("/")));
      const cls = I.classes[ch.need], wpn = I.styles[ch.style]; const flawD = ch.flaw ? byId[ch.flaw] : (s.profile.scores ? byId[D.slice().sort((a, b) => s.profile.scores[a.id] - s.profile.scores[b.id])[0].id] : null);
      el.append(h("div", { class: "sheet-head" }, flawD ? h("div", { class: "sheet-mark" }, mark(flawD, true)) : null, h("div", {}, h("p", { class: "eyebrow" }, `${cls.name} · ${wpn.name.toLowerCase()} · level ${p.closed}`), h("h1", { style: { marginTop: "2px" } }, ch.title), h("p", { class: "help", style: { marginTop: "6px" } }, `${wpn.move} ${cls.cost}`))));
      const bar = (label, v, color, word) => h("div", { class: "brow", style: { gridTemplateColumns: "1fr auto" } }, h("div", {}, h("div", { class: "lbl2" }, h("span", {}, label), h("span", {}, word || "")), h("div", { class: "track" }, h("div", { style: { width: v + "%", background: color || "var(--em)" } }))), h("div", { class: "band" }, ""));
      const X = I.explain; const note = t => h("p", { class: "fine", style: { marginTop: "6px" } }, t);
      el.append(h("h2", {}, "Fear and hunger"), h("div", { class: "bars" }, bar("Fear", ch.fear, "var(--crisis)", band(ch.fear)), bar("Hunger", ch.hunger, "#BF7440", band(ch.hunger))), window.ASCENT_MORE("What this means", note(`Fear ${band(ch.fear).toLowerCase()}: ${X.fear[band(ch.fear)]}`), note(`Hunger ${band(ch.hunger).toLowerCase()}: ${X.hunger[band(ch.hunger)]}`)));
      el.append(h("h2", {}, "Stats"), h("div", { class: "bars" }, ...I.stats.map(([k, name]) => bar(name, ch.stats[k], "var(--accent)", band(ch.stats[k])))), window.ASCENT_MORE("What the stats mean", ...I.stats.map(([k]) => note(X.stats[k]))));
      el.append(h("h2", {}, "How you move"));
      [["Stance", I.words.stance[ch.stance], X.stance[ch.stance]], ["Horizon", I.words.horizon[ch.horizon], X.horizon[ch.horizon]], ["Senses", I.words.senses[ch.senses], X.senses[ch.senses]], ["Hour", I.words.hour[ch.hour], X.hour[ch.hour]]].forEach(([l, w, t]) => el.append(h("div", { class: "callout", style: { marginTop: "10px" } }, h("h3", {}, `${l} · ${w}`), window.ASCENT_MORE("What this means", h("p", { class: "help", style: { marginTop: "4px" } }, t)))));
      if (s.profile.scores) { el.append(h("h2", {}, "Skills")); const bars = h("div", { class: "bars" }); D.forEach(d => bars.append(h("div", { class: "brow" }, mark(d), h("div", {}, h("div", { class: "lbl2" }, h("span", {}, d.name), h("span", {}, s.profile.scores[d.id])), h("div", { class: "track" }, h("div", { style: { width: s.profile.scores[d.id] + "%", background: d.color } }))), h("div", { class: "band" }, d.id === (flawD || {}).id ? "trains first" : "")))); el.append(bars); }
      else el.append(h("div", { class: "callout accent" }, h("h3", {}, "Skills"), "The seven skills come from the Profile.", h("div", { class: "actions row" }, h("a", { class: "btn btn-primary", href: "#/profile" }, "Take the Profile"))));
      el.append(h("div", { class: "callout" }, h("h3", {}, "Off-hand and subclass"), h("span", { class: "greyed" }, `${I.styles[ch.latentStyle].name} · ${I.classes[ch.latentNeed].name}`), " " + I.explain.latent));
      if (ch.path) el.append(h("div", { class: "callout accent" }, h("h3", {}, `Road · ${ch.path.kind === "master" ? "Mastery" : ch.path.kind === "weapon" ? "Change the weapon" : "Change the class"}${ch.path.destName ? " · " + ch.path.destName : ""}`), ch.path.gaps.map(g => g.text).join(" "), h("div", { class: "fine", style: { marginTop: "6px" } }, `Since ${fmtDate(ch.path.at)}. Retest moves the sheet; nothing else does.`)));
      const days = Math.floor((Date.now() - ch.at) / 864e5); const canRetake = days >= RETAKE_DAYS || s.testMode; const canRoads = p.closed >= ROADS_AFTER || s.testMode;
      const fresh = !s.guide || !Object.keys(s.guide.days || {}).length;
      el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, fresh ? h("a", { class: "btn btn-primary", href: "#/" }, "Begin your days") : null, canRoads && !ch.path ? h("a", { class: "btn btn-primary", href: "#/roads" }, "Three roads") : null, h("button", { class: "btn" + (canRetake ? "" : " btn-link"), disabled: !canRetake, onclick: () => { s.intake = { answers: {}, pos: 0, startedAt: null, doneAt: null, retaking: true }; save(); nav("/intake"); } }, canRetake ? "Retake" : `Retake in ${RETAKE_DAYS - days} days`), ch.path ? h("a", { class: "btn btn-link", href: "#/roads" }, "Change road") : null));
      el.append(h("p", { class: "fine" }, canRoads || ch.path ? "A build, not a verdict." : `A build, not a verdict. Roads open after ${ROADS_AFTER} closed days.`));
      return el;
    });

    // ---------- roads ----------
    route(/^roads$/, () => {
      const s = S(); const ch = s.character; if (!ch) { nav("/intake"); return screen(""); }
      let kind = null, dest = null, proving = null; const el = screen("", topline(0, "Three roads", () => nav("/sheet"))); const box = h("div", {}); el.append(box);
      function say(text) { return h("div", { class: "bubble guide", style: { maxWidth: "100%" } }, text); }
      function s1() { box.innerHTML = ""; box.append(say(I.roads.intro)); const ul = h("ul", { class: "deck" }); [["master", "Master this build", `${ch.title}, higher level.`], ["weapon", "Change the weapon", `${I.styles[ch.style].name} to another. Behaviour; a quarter.`], ["class", "Change the class", `${I.classes[ch.need].name} to another. A different need; months, if at all.`]].forEach(([k, n, l]) => ul.append(h("li", {}, h("button", { class: "card", onclick: () => { kind = k; k === "master" ? s4() : s2(); } }, h("span", { class: "cat" }, n), h("span", {}, l))))); box.append(ul); }
      function s2() { box.innerHTML = ""; const opts = kind === "weapon" ? Object.keys(I.styles).filter(k => k !== ch.style).map(k => [k, I.styles[k].name, I.styles[k].move]) : Object.keys(I.classes).filter(k => k !== ch.need).map(k => [k, I.classes[k].name, I.classes[k].cost]); box.append(say(kind === "weapon" ? "Which weapon?" : "Which class?")); const ul = h("ul", { class: "deck" }); opts.forEach(([k, n, l]) => ul.append(h("li", {}, h("button", { class: "card", onclick: () => { dest = k; s3(); } }, h("span", { class: "cat" }, n), h("span", {}, l))))); box.append(ul); }
      function s3() { box.innerHTML = ""; box.append(say(I.roads.proving)); const opts = h("div", { class: "options" }); I.roads.provingOpts.forEach(([v, t]) => opts.append(h("button", { class: "opt", onclick: () => { proving = v; s4(); } }, h("span", { class: "dot" }), t))); box.append(opts); }
      function s4() {
        box.innerHTML = ""; const routed = kind !== "master" && proving !== "nobody"; const finalKind = routed ? "master" : kind;
        const target = finalKind === "master" ? MASTERY[ch.need] : finalKind === "weapon" ? I.signatures.styles[dest] : I.signatures.classes[dest];
        const g = gaps(ch, target); const destName = finalKind === "weapon" ? I.styles[dest].name : finalKind === "class" ? I.classes[dest].name : null;
        box.append(say(routed ? I.roads.routed : finalKind === "master" ? I.roads.master : I.roads.open));
        if (g.length) { const ol = h("ol", { class: "steps" }); g.forEach(x => ol.append(h("li", {}, x.text))); box.append(h("h2", {}, "The gaps"), ol); } else box.append(h("p", { class: "help" }, "The numbers already sit where this road leads. The work is holding them there; the retest will tell."));
        box.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { ch.path = { kind: finalKind, dest: finalKind === "master" ? null : dest, destName, gaps: g, provingTo: proving, at: Date.now() }; if (routed && proving) { s.drive = s.drive || { values: [], goals: [], feeds: [], log: [] }; s.drive.goals.unshift({ id: Date.now().toString(36), text: `Become ${destName}`, serves: null, proving: { person: "a person", group: "a group", younger: "a younger me" }[proving], verdict: null, rewrite: "", at: Date.now() }); } save(); nav("/sheet"); } }, "Begin")));
      }
      s1(); return el;
    });
  });
})();
