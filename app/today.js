/* Today — the three pillars. Development (the seven, parallel to working out) · Foundations (parallel to diet and nutrition) · Recovery (liminal rituals, parallel to recovery).
   One activity from each, every day. All three done closes the day. Seven closed days in the first ten: founding member.
   Registers through window.ASCENT_PLUGINS. Owns state.today. */
(function () {
  "use strict";
  window.ASCENT_PLUGINS = window.ASCENT_PLUGINS || [];
  window.ASCENT_PLUGINS.push(function (api) {
    const { route, h, em, screen, topline, nav, mark, byId, fmtDate } = api;
    const F = window.ASCENT_FOUNDATIONS, R = window.ASCENT_RECOVERY, D = window.ASCENT_DOMAINS, E = window.ASCENT_ENJOYMENT;
    const WINDOW = 10, GOAL = 7;
    const S = () => api.state();
    const T = () => { const s = S(); s.today = s.today || { start: null, checkins: {}, ritualLog: [], rituals: [], add: null, limit: null, custom: null, weekSet: null, dark: { mode: "red", from: 20, to: 6 }, screenTime: {}, screens: {}, founding: null }; return s.today; };
    const save = api.save;

    // ---------- days ----------
    function dayKey(ts) { const d = new Date(ts || Date.now()); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
    function keyToDate(k) { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); }
    function addDays(k, n) { const d = keyToDate(k); d.setDate(d.getDate() + n); return dayKey(d); }
    function weekKey(ts) { const d = new Date(ts || Date.now()); const day = (d.getDay() + 6) % 7; d.setDate(d.getDate() - day); return dayKey(d); }
    function devDone(day) {
      const s = S();
      if (s.profile.doneAt && dayKey(s.profile.doneAt) === day) return "Profile";
      if ((s.capability.completions || []).some(k => dayKey(k.at) === day)) return "Capability";
      if ((s.communication.sets || []).some(k => dayKey(k.at) === day)) return "Communication";
      if (((s.enjoyment || {}).sessions || []).some(k => dayKey(k.at) === day)) return "Enjoyment";
      return null;
    }
    const foundDone = day => !!T().checkins[day];
    const recDone = day => T().ritualLog.find(r => dayKey(r.at) === day);
    const dayClosed = day => !!(devDone(day) && foundDone(day) && recDone(day));
    function program() {
      const t = T(); if (!t.start) { t.start = dayKey(); save(); }
      const idx = Math.round((keyToDate(dayKey()) - keyToDate(t.start)) / 864e5) + 1; // 1-based day in the window
      let closed = 0; for (let i = 0; i < WINDOW; i++) if (dayClosed(addDays(t.start, i))) closed++;
      return { idx, closed, over: idx > WINDOW, won: closed >= GOAL };
    }

    // ---------- today's Development pick ----------
    function seeded(str) { let x = 2166136261; for (let i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 16777619); } return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 100000) / 100000; }; }
    function pickDevelopment() {
      const s = S(); const live = D.filter(d => d.status === "live");
      if (!s.profile.done) return { d: null, title: "Take the Profile", line: "Twelve minutes, once. It tells the app where to start you, and it counts as today's Development.", href: "#/profile" };
      const sc = s.profile.scores || {}; const sorted = live.slice().sort((a, b) => (sc[a.id] || 0) - (sc[b.id] || 0));
      const weakest = sorted[0]; const others = sorted.slice(1);
      const idx = program().idx; const rnd = seeded("dev" + dayKey());
      const d = idx % 3 === 1 ? weakest : others[Math.floor(rnd() * others.length)] || weakest;
      const hour = new Date().getHours(), weekend = [0, 6].includes(new Date().getDay());
      if (d.id === "capability") return { d, title: "Today's three", line: "One Warm, one Load, one Edge from your priority areas. The Warm alone closes the day; the Edge is where the confidence comes from.", href: "#/capability" };
      if (d.id === "communication") return { d, title: "One thirty-second set", line: "A topic, ten seconds to think, thirty to speak. Graded on six dimensions. One set closes the day.", href: "#/communication/set" };
      const grade = weekend ? "adventure" : hour >= 18 ? "calm" : "active";
      const pool = E.adventures.filter(a => a.grade === grade); const adv = pool[Math.floor(rnd() * pool.length)];
      return { d, title: adv.title, line: `${adv.minutes} minutes, ${grade}. ${adv.blurb}`, href: `#/enjoyment/play/${adv.id}`, alt: { label: "Choose another", href: "#/enjoyment" } };
    }

    // ---------- today's Foundations micro-action ----------
    function weeklyPlan() { const t = T(); const wk = weekKey(); if (t.weekSet !== wk) { t.weekSet = wk; if (!t.add) t.add = "daylight"; if (!t.limit) t.limit = "phone-bed"; save(); } return { add: F.adds.find(a => a.id === t.add) || F.adds[1], limit: limitObj() }; }
    function limitObj() { const t = T(); const l = F.limits.find(x => x.id === t.limit) || F.limits[0]; if (l.id === "custom" && t.custom) return Object.assign({}, l, t.custom); return l; }
    function microAction() { const { add, limit } = weeklyPlan(); const odd = program().idx % 2 === 1; return odd ? { kind: "Add", text: add.micro, name: add.name } : { kind: "Limit", text: `When ${lc(limit.when)}, then ${limit.then}`, name: limit.name }; }
    const lc = s => s ? s[0].toLowerCase() + s.slice(1) : "";

    // ---------- dull after dark ----------
    function applyDark() { const t = T(); const dk = t.dark || { mode: "off" }; const hr = new Date().getHours(); const on = dk.mode !== "off" && (hr >= dk.from || hr < dk.to); document.documentElement.classList.toggle("night-red", on && dk.mode === "red"); document.documentElement.classList.toggle("night-grey", on && dk.mode === "grey"); }
    applyDark(); setInterval(applyDark, 60000);

    // ---------- shared bits ----------
    function tile(label, sub, done, href, body) {
      return h("a", { class: "pillar" + (done ? " done" : ""), href }, h("div", { class: "p-head" }, h("span", { class: "p-label" }, label), h("span", { class: "p-sub" }, sub), h("span", { class: "p-check" }, done ? "✓" : "")), body);
    }
    function ring(p) { const dots = []; for (let i = 0; i < GOAL; i++) dots.push(h("span", { class: i < p.closed ? "on" : "" })); return h("div", { class: "seven-ring" }, h("div", { class: "dots" }, ...dots), h("div", { class: "r-label" }, p.won ? "Seven days. The app is yours." : p.over ? `${p.closed} of ${GOAL} in your ten days` : `Day ${p.idx} of ${WINDOW} · ${p.closed} of ${GOAL} closed`)); }

    // ---------- Today ----------
    route(/^$/, () => {
      const s = S(); const t = T(); const p = program(); const day = dayKey();
      if (p.won && !t.founding) { t.founding = Date.now(); save(); nav("/founding"); return screen(""); }
      const el = screen("home today");
      el.append(h("div", { class: "wordmark" }, "Ascent", h("small", {}, "designed by a psychiatrist")));
      const dev = devDone(day), fnd = foundDone(day), rec = recDone(day); const closed = dev && fnd && rec;
      el.append(h("h1", {}, closed ? em("Today is *closed*") : em(`Three things, *then done*`)), h("p", { class: "help" }, closed ? "Development, Foundations, Recovery. Nothing else is asked of you today." : "One from each. Train, fuel, recover. The order is yours."));
      el.append(ring(p));
      const pick = pickDevelopment(); const micro = microAction(); const hour = new Date().getHours();
      el.append(tile("Development", "the seven · like working out", dev, dev ? "#/seven" : pick.href,
        h("div", { class: "p-body" }, pick.d ? mark(pick.d) : null, h("div", {}, h("div", { class: "p-title" }, dev ? `Done · ${dev}` : pick.title), h("div", { class: "p-line" }, dev ? "Browse the seven if you want more; nothing more is required." : pick.line)))));
      el.append(tile("Foundations", "add and limit · like nutrition", fnd, fnd ? "#/foundations" : "#/foundations/checkin",
        h("div", { class: "p-body" }, h("div", {}, h("div", { class: "p-title" }, fnd ? `Checked in · ${micro.kind}: ${micro.name}` : "Thirty-second check-in"), h("div", { class: "p-line" }, fnd ? micro.text : `Sleep, movement, daylight, what you kept out. Then today's ${micro.kind.toLowerCase()}: ${micro.text}`)))));
      const quiet = hour >= 17 ? "Nothing happened? Shut the shop · 2 minutes" : "Something happened? Cross back. Quiet day: shut the shop tonight.";
      el.append(tile("Recovery", "liminal rituals · like recovery", !!rec, "#/recovery",
        h("div", { class: "p-body" }, h("div", {}, h("div", { class: "p-title" }, rec ? `Crossed · ${ritualName(rec.id)}` : "A ritual for what happened"), h("div", { class: "p-line" }, rec ? "Bounded, finished, back in the room." : quiet)))));
      if (!p.won) el.append(h("p", { class: "fine" }, `Close ${GOAL} of your first ${WINDOW} days and Ascent is free for your first year, with the founder's rate locked after. Closing a day means all three, honestly. Nobody checks but you.`));
      el.append(h("div", { class: "actions row", style: { marginTop: "14px" } }, h("a", { class: "btn btn-link", href: "#/seven" }, "The seven"), h("a", { class: "btn btn-link", href: "#/profile/report" }, "Profile")));
      return el;
    });
    function ritualName(id) { const r = R.rituals.find(x => x.id === id) || T().rituals.find(x => x.id === id); return r ? r.name : "ritual"; }

    route(/^founding$/, () => {
      const el = screen("interlude", topline(100, "Founding member", () => nav("/")));
      el.append(h("p", { class: "eyebrow" }, "Seven of ten"), h("h1", {}, em("You showed up. *The app is yours.*")), h("p", { class: "body" }, "Seven closed days in your first ten. Ascent is free for your first year, and when subscriptions arrive your founder's rate is locked in. Nothing to claim; it is already recorded here."), h("p", { class: "body" }, "What happens now is the same thing that happened this week, for longer. The seven get deeper. Foundations gets quieter as it becomes habit. Recovery is there on the days that need it."), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => nav("/") }, "Back to today")));
      return el;
    });

    // ---------- Foundations ----------
    route(/^foundations$/, () => {
      const t = T(); const day = dayKey(); const { add, limit } = weeklyPlan(); const wk = weekKey();
      const el = screen("", topline(0, "Foundations", () => nav("/")));
      el.append(h("p", { class: "eyebrow" }, "Foundations · what the seven stand on"), h("h1", {}, em("Add one thing. *Limit one thing.*")), h("p", { class: "help" }, F.intro));
      el.append(h("div", { class: "actions" }, h("a", { class: "btn btn-primary", href: "#/foundations/checkin" }, foundDone(day) ? "Redo today's check-in" : "Today's check-in · 30 seconds")));
      el.append(h("div", { class: "callout" }, h("h3", {}, "This week"), h("div", {}, h("strong", {}, "Add: "), add.name), h("div", { style: { marginTop: "6px" } }, h("strong", {}, "Limit: "), limit.name), h("div", { class: "fine", style: { marginTop: "8px" } }, `When ${lc(limit.when)}, then ${limit.then}`), h("div", { class: "actions row" }, h("a", { class: "btn", href: "#/foundations/plan" }, "Change"), limit.setup === "dark" || limit.setup === "limits" ? h("a", { class: "btn", href: "#/foundations/dark" }, "Set up on the phone") : null)));
      // seven-day tally
      const keys = []; for (let i = 6; i >= 0; i--) keys.push(addDays(day, -i));
      const rows = F.checkin.map(q => { const hits = keys.filter(k => t.checkins[k] && q.good.includes(t.checkins[k][q.id])).length; const seen = keys.filter(k => t.checkins[k]).length; return h("div", { class: "brow", style: { gridTemplateColumns: "1fr auto" } }, h("div", {}, h("div", { class: "lbl2" }, h("span", {}, q.q), h("span", { class: "band" }, seen ? `${hits} of ${seen} days` : "—")), h("div", { class: "track" }, h("div", { style: { width: (seen ? (hits / seen) * 100 : 0) + "%", background: "var(--accent)" } })))); });
      el.append(h("h2", {}, "Last seven days"), h("div", { class: "bars" }, ...rows));
      // screen time
      const stIn = h("input", { type: "text", inputmode: "decimal", placeholder: "hours per day, from your phone's Screen Time", value: t.screenTime[wk] || "" });
      el.append(h("h2", {}, "Screen time"), h("p", { class: "help" }, "Once a week, type the daily average your phone reports. The trend is the point, not the number."), stIn, h("div", { class: "actions row" }, h("button", { class: "btn", onclick: () => { const v = parseFloat(stIn.value); if (!isNaN(v)) { t.screenTime[wk] = v; save(); nav("/foundations"); } } }, "Save this week")));
      const weeks = Object.keys(t.screenTime).sort().slice(-8); if (weeks.length) el.append(h("div", { class: "trend" }, ...weeks.map(w => h("span", { style: { height: Math.min(100, t.screenTime[w] / 10 * 100) + "%" }, title: `${w}: ${t.screenTime[w]} h` }))));
      el.append(h("div", { class: "actions" }, h("a", { class: "btn", href: "#/foundations/dark" }, `${F.dark.name} · ${t.dark.mode === "off" ? "off" : t.dark.mode + " from " + t.dark.from + ":00"}`), h("a", { class: "btn btn-link", href: "#/foundations/screens" }, t.screens.done ? "A few honest questions · answered" : "A few honest questions")));
      return el;
    });

    route(/^foundations\/checkin$/, () => {
      const t = T(); const day = dayKey(); const ans = Object.assign({}, t.checkins[day] || {});
      const el = screen("", topline(0, "Check-in", () => nav("/")));
      el.append(h("p", { class: "eyebrow" }, "Foundations · today"), h("h1", {}, em("Thirty seconds. *Honest counts.*")));
      F.checkin.forEach(q => {
        const chips = h("div", { class: "chips" });
        q.opts.forEach(([v, label]) => chips.append(h("button", { class: "chip", role: "radio", "aria-checked": String(ans[q.id] === v), onclick: () => { ans[q.id] = v; [...chips.children].forEach((c, i) => c.setAttribute("aria-checked", String(q.opts[i][0] === v))); } }, label)));
        el.append(h("label", { class: "lbl" }, q.q), chips);
      });
      const micro = microAction();
      el.append(h("div", { class: "callout accent", style: { marginTop: "26px" } }, h("h3", {}, `Today's ${micro.kind.toLowerCase()} · ${micro.name}`), micro.text));
      el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { if (Object.keys(ans).length < F.checkin.length) { alert("One answer per line; it takes thirty seconds."); return; } t.checkins[day] = Object.assign(ans, { at: Date.now() }); save(); nav("/"); } }, "Save and close")));
      return el;
    });

    route(/^foundations\/plan$/, () => {
      const t = T(); const el = screen("", topline(0, "This week", () => nav("/foundations")));
      el.append(h("p", { class: "eyebrow" }, "Foundations · the week's two"), h("h1", {}, em("One to *add*. One to *limit*.")), h("p", { class: "help" }, "Not seven. One of each, for a week. Change them on Monday if you like; keep them if they are working."));
      el.append(h("h2", {}, "Add"));
      const addList = h("div", { class: "options" });
      F.adds.forEach(a => addList.append(h("button", { class: "opt", role: "radio", "aria-checked": String(t.add === a.id), onclick: () => { t.add = a.id; save(); nav("/foundations/plan"); } }, h("span", { class: "dot" }), h("div", {}, h("div", {}, a.name), h("div", { class: "fine", style: { marginTop: "4px" } }, a.why)))));
      el.append(addList, h("h2", {}, "Limit"));
      const limList = h("div", { class: "options" });
      F.limits.forEach(l => limList.append(h("button", { class: "opt", role: "radio", "aria-checked": String(t.limit === l.id), onclick: () => { t.limit = l.id; save(); nav("/foundations/plan"); } }, h("span", { class: "dot" }), h("div", {}, h("div", {}, l.name, l.keystone ? h("span", { class: "tag live", style: { marginLeft: "8px", fontSize: "0.62rem", padding: "2px 7px", border: "1px solid var(--accent)", borderRadius: "999px" } }, "keystone") : null), h("div", { class: "fine", style: { marginTop: "4px" } }, l.why)))));
      el.append(limList);
      if (t.limit === "custom") {
        const c = t.custom || { name: "", when: "", then: "" };
        const n = h("input", { type: "text", placeholder: "Name it", value: c.name }), w = h("input", { type: "text", placeholder: "When I…", value: c.when }), th = h("input", { type: "text", placeholder: "then I…", value: c.then });
        el.append(h("h2", {}, "Your own"), n, w, th, h("div", { class: "actions" }, h("button", { class: "btn", onclick: () => { t.custom = { name: n.value.trim() || "My limit", when: w.value.trim(), then: th.value.trim() }; save(); nav("/foundations"); } }, "Save")));
      }
      el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("a", { class: "btn btn-primary", href: "#/foundations" }, "Done")));
      return el;
    });

    route(/^foundations\/dark$/, () => {
      const t = T(); const el = screen("", topline(0, F.dark.name, () => nav("/foundations")));
      el.append(h("p", { class: "eyebrow" }, "Foundations · the phone"), h("h1", {}, em("Make the phone *boring* after dark")), h("p", { class: "help" }, F.dark.why));
      el.append(h("h2", {}, "In Ascent"));
      const modes = h("div", { class: "chips" });
      [["red", "Red cast"], ["grey", "Grey"], ["off", "Off"]].forEach(([v, l]) => modes.append(h("button", { class: "chip", role: "radio", "aria-checked": String(t.dark.mode === v), onclick: () => { t.dark.mode = v; save(); applyDark(); nav("/foundations/dark"); } }, l)));
      const from = h("select", {}, ...[18, 19, 20, 21, 22].map(x => { const o = h("option", { value: x }, `from ${x}:00`); if (x === t.dark.from) o.selected = true; return o; }));
      from.onchange = () => { t.dark.from = Number(from.value); save(); applyDark(); };
      el.append(modes, from);
      el.append(h("h2", {}, "On the phone itself"), h("p", { class: "help" }, "Ninety seconds, once. The phone does the rest every evening."));
      const tabs = h("div", { class: "chips" }); const steps = h("ol", { class: "steps" }); let os = /iPhone|iPad/.test(navigator.userAgent) ? "ios" : "android";
      const drawSteps = () => { steps.innerHTML = ""; (os === "ios" ? F.dark.ios : F.dark.android).forEach(s => steps.append(h("li", {}, s))); [...tabs.children].forEach(c => c.setAttribute("aria-checked", String(c.dataset.os === os))); };
      [["ios", "iPhone"], ["android", "Android"]].forEach(([v, l]) => tabs.append(h("button", { class: "chip", role: "radio", "data-os": v, onclick: () => { os = v; drawSteps(); } }, l)));
      drawSteps(); el.append(tabs, steps);
      el.append(h("div", { class: "callout" }, h("h3", {}, "Also useful"), "iOS Screen Time → App Limits, and Android Digital Wellbeing → App timers, put a daily cap on the apps your Limit names. Set the cap, then do not negotiate with it."));
      el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("a", { class: "btn btn-primary", href: "#/foundations" }, "Done")));
      return el;
    });

    route(/^foundations\/screens$/, () => {
      const t = T(); const el = screen("", topline(0, "Honest questions", () => nav("/foundations")));
      el.append(h("p", { class: "eyebrow" }, "Foundations · optional"), h("h1", {}, em("Five questions, *once*")), h("p", { class: "help" }, F.screens.intro));
      const a = { audit: [], lb: [] };
      F.screens.auditc.forEach((q, i) => { const chips = h("div", { class: "chips" }); q.opts.forEach((o, k) => chips.append(h("button", { class: "chip", role: "radio", "aria-checked": "false", onclick: () => { a.audit[i] = k; [...chips.children].forEach((c, j) => c.setAttribute("aria-checked", String(j === k))); } }, o))); el.append(h("label", { class: "lbl" }, q.q), chips); });
      F.screens.liebet.forEach((q, i) => { const chips = h("div", { class: "chips" }); ["No", "Yes"].forEach((o, k) => chips.append(h("button", { class: "chip", role: "radio", "aria-checked": "false", onclick: () => { a.lb[i] = k; [...chips.children].forEach((c, j) => c.setAttribute("aria-checked", String(j === k))); } }, o))); el.append(h("label", { class: "lbl" }, q), chips); });
      el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => {
        if (a.audit.length < 3 || a.lb.length < 2 || a.audit.includes(undefined) || a.lb.includes(undefined)) { alert("All five, please."); return; }
        const auditScore = a.audit.reduce((x, y) => x + y, 0); const flag = auditScore >= F.screens.auditFlag || a.lb.some(x => x === 1);
        t.screens = { done: true, audit: auditScore, liebet: a.lb.slice(), flag, at: Date.now() }; if (flag) S().profile.refer = true; save(); nav("/foundations/screens/result");
      } }, "Done")));
      return el;
    });
    route(/^foundations\/screens\/result$/, () => {
      const t = T(); const el = screen("interlude", topline(100, "Honest questions", () => nav("/foundations")));
      if (t.screens.flag) el.append(h("h1", {}, em("Worth a *conversation*")), h("p", { class: "body" }, F.screens.referNote), h("p", { class: "body" }, "In the meantime the Limit menu has alcohol and trading on it, and the rituals are there for the evenings."));
      else el.append(h("h1", {}, em("Nothing *flagged*")), h("p", { class: "body" }, "Your answers are in the ordinary range. The questions stay answered; nothing follows you around."));
      el.append(h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => nav("/foundations") }, "Back")));
      return el;
    });

    // ---------- Recovery ----------
    const allRituals = () => R.rituals.concat(T().rituals || []);
    route(/^recovery$/, () => {
      const t = T(); const day = dayKey(); const todayCount = t.ritualLog.filter(r => dayKey(r.at) === day).length;
      const el = screen("", topline(0, "Recovery", () => nav("/")));
      el.append(h("p", { class: "eyebrow" }, "Recovery · liminal rituals"), h("h1", {}, em("Something ended. *Cross back.*")), h("p", { class: "help" }, R.intro));
      if (todayCount >= R.brake.perDay) el.append(h("div", { class: "callout refer" }, h("h3", {}, "Enough for today"), R.brake.text));
      const ul = h("ul", { class: "domains" });
      R.triggers.forEach(tr => { const n = allRituals().filter(r => r.trigger.includes(tr.id)).length; ul.append(h("li", {}, h("a", { class: "domain-card", href: `#/recovery/trigger/${tr.id}` }, h("div", { class: "mark", style: { background: "var(--ok-bg)", color: "var(--em)", fontFamily: "var(--font-display)", fontSize: "1.3rem" } }, tr.name[0]), h("div", {}, h("div", { class: "name" }, tr.name), h("div", { class: "sub" }, tr.line)), h("span", { class: "tag" }, `${n}`)))); });
      el.append(ul);
      el.append(h("div", { class: "actions" }, h("a", { class: "btn", href: "#/recovery/build" }, "Build your own")));
      if (t.ritualLog.length) { const ulx = h("ul", { class: "evidence" }); t.ritualLog.slice(0, 7).forEach(r => ulx.append(h("li", {}, ritualName(r.id), h("div", { class: "meta" }, h("span", {}, fmtDate(r.at)), h("span", {}, R.triggers.find(x => x.id === r.trigger)?.name || ""))))); el.append(h("h2", {}, "Crossings"), ulx); }
      return el;
    });
    route(/^recovery\/trigger\/(\w+)$/, id => {
      const tr = R.triggers.find(x => x.id === id); if (!tr) return screen("", h("h1", {}, "Not found"));
      const el = screen("", topline(0, tr.name, () => nav("/recovery")));
      el.append(h("p", { class: "eyebrow" }, "Recovery · " + tr.name), h("h1", {}, tr.line));
      const ul = h("ul", { class: "deck" });
      allRituals().filter(r => r.trigger.includes(id)).forEach(r => { const d = byId[(r.author || "").split("+")[0]]; ul.append(h("li", {}, h("a", { class: "card", href: `#/recovery/do/${r.id}?t=${id}`, style: { textDecoration: "none" } }, d ? mark(d) : null, h("div", {}, h("div", { style: { fontWeight: 600 } }, r.name, h("span", { style: { color: "var(--t-faint)", fontWeight: 400 } }, ` · ${r.minutes} min`)), h("div", { class: "fine", style: { marginTop: "4px" } }, r.needs), r.source ? h("div", { class: "source" }, r.source) : null)))); });
      el.append(ul);
      return el;
    });
    route(/^recovery\/do\/([\w-]+)(?:\?t=(\w+))?$/, (id, trig) => {
      const r = allRituals().find(x => x.id === id); if (!r) return screen("", h("h1", {}, "Not found"));
      const t = T(); const el = screen("", topline(0, r.name, () => nav("/recovery")));
      let beat = -1, left = 0, timer = null; const box = h("div", {});
      el.append(h("p", { class: "eyebrow" }, "Recovery · " + r.name), box);
      function stop() { if (timer) clearInterval(timer); timer = null; }
      function draw() {
        box.innerHTML = "";
        if (beat < 0) { box.append(h("h1", {}, em(`*${r.name}*`)), h("p", { class: "help" }, `Three beats, about ${r.minutes} minutes. ${r.needs}`), h("p", { class: "help" }, "Separation: name what ended. Crossing: the thing you do. Return: step back into the room. Each beat has a floor; you cannot rush it, and you can take longer."), r.source ? h("p", { class: "source" }, r.source) : null, h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { beat = 0; startBeat(); } }, "Begin"))); return; }
        if (beat >= r.beats.length) { box.append(h("p", { class: "eyebrow" }, "Return complete"), h("h1", {}, em("You are *back in the room*")), h("p", { class: "help" }, "That is the ritual. Nothing more to do with it tonight."), h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { t.ritualLog.unshift({ id: r.id, trigger: trig || r.trigger[0], at: Date.now() }); save(); nav("/"); } }, "Crossed · back to today"))); return; }
        const b = r.beats[beat]; const pct = Math.round(100 * (1 - left / b.seconds));
        box.append(h("p", { class: "eyebrow" }, `${beat + 1} of 3 · ${b.name}`), h("p", { class: "statement" }, b.text), h("div", { class: "timer" }, h("div", { class: "ring", style: { "--pct": pct + "%" } }, h("div", { class: "t" }, left > 0 ? String(left) : "·"))), h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", disabled: left > 0, onclick: () => { beat++; startBeat(); } }, left > 0 ? "Stay with it" : beat === r.beats.length - 1 ? "Step back in" : "Next beat")));
      }
      function startBeat() { stop(); if (beat >= r.beats.length) { draw(); return; } left = r.beats[beat].seconds; draw(); timer = setInterval(() => { left--; if (left <= 0) { left = 0; stop(); } draw(); }, 1000); }
      window.addEventListener("hashchange", stop, { once: true });
      draw(); return el;
    });
    route(/^recovery\/build$/, () => {
      const t = T(); const el = screen("", topline(0, "Build your own", () => nav("/recovery")));
      el.append(h("p", { class: "eyebrow" }, "Recovery · yours"), h("h1", {}, em("One trigger, *three beats*")), h("p", { class: "help" }, R.build.intro));
      const name = h("input", { type: "text", placeholder: "Name it" }); const trig = h("select", {}, ...R.triggers.map(x => h("option", { value: x.id }, x.name)));
      const beats = R.build.placeholders.map(p => h("textarea", { placeholder: p, style: { minHeight: "80px" } }));
      el.append(h("label", { class: "lbl" }, "Name"), name, h("label", { class: "lbl" }, "When"), trig);
      ["Separation", "Crossing", "Return"].forEach((n, i) => el.append(h("label", { class: "lbl" }, n), beats[i]));
      el.append(h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { if (!name.value.trim() || beats.some(b => !b.value.trim())) { alert("A name and all three beats."); return; } const id = "own-" + Date.now().toString(36); t.rituals.push({ id, name: name.value.trim(), trigger: [trig.value], author: "", minutes: 3, needs: "Yours.", beats: ["Separation", "Crossing", "Return"].map((n, i) => ({ name: n, seconds: [45, 60, 40][i], text: beats[i].value.trim() })) }); save(); nav("/recovery/trigger/" + trig.value); } }, "Save the ritual")));
      return el;
    });
  });
})();
