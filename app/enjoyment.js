/* Enjoyment block — the Otter. Audio adventure player with a generative score.
   Layers: narration (ElevenLabs file, or device voice fallback) · ambient bed (file loop, or engine noise) · one-shot sounds (files) · music (Web Audio engine driven by scene moods).
   Registers its routes through window.ASCENT_PLUGINS; app.js calls each plugin with its api before the first render. */
(function () {
  "use strict";
  window.ASCENT_PLUGINS = window.ASCENT_PLUGINS || [];
  window.ASCENT_PLUGINS.push(function (api) {
    const { route, h, em, screen, topline, nav, mark, byId, slider, fmtDate } = api;
    const E = window.ASCENT_ENJOYMENT;
    const st = () => { const s = api.state(); s.enjoyment = s.enjoyment || { sessions: [] }; return s.enjoyment; };
    const base = id => `../assets/audio/${id}/`;

    // ---------- music engine ----------
    const SCALES = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10] };
    const PROG = { major: [0, 5, 3, 4], minor: [0, 5, 2, 6], dorian: [0, 3, 6, 4] }; // scale degrees
    function Engine() {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
      const music = ctx.createGain(); music.gain.value = 0; music.connect(master);
      const amb = ctx.createGain(); amb.gain.value = 0; amb.connect(master);
      const root = 110 * Math.pow(2, 5 / 12); // D2
      let mood = { intensity: 0.2, mode: "major", tempo: 60 }, running = false, step = 0, timer = null, bedSrc = null, bedNode = null;
      // drone: two detuned saws through a lowpass
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 400; lp.Q.value = 0.7; lp.connect(music);
      const drone = [0, 7].map((semi, i) => { const o = ctx.createOscillator(); o.type = i ? "triangle" : "sawtooth"; o.frequency.value = root * Math.pow(2, semi / 12); o.detune.value = i ? 4 : -4; const g = ctx.createGain(); g.gain.value = i ? 0.12 : 0.08; o.connect(g); g.connect(lp); o.start(); return { o, g, semi }; });
      // pulse: filtered noise burst + sine thump
      const noiseBuf = (() => { const b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = b.getChannelData(0); let last = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; d[i] = (last + 0.02 * w) / 1.02; last = d[i]; d[i] *= 3.5; } return b; })();
      function thump(t, vel) { const o = ctx.createOscillator(); o.frequency.setValueAtTime(root / 2 * 1.5, t); o.frequency.exponentialRampToValueAtTime(root / 4, t + 0.25); const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5 * vel, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35); o.connect(g); g.connect(music); o.start(t); o.stop(t + 0.4); }
      function tick(t, vel) { const s = ctx.createBufferSource(); s.buffer = noiseBuf; const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2200; f.Q.value = 2; const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18 * vel, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08); s.connect(f); f.connect(g); g.connect(music); s.start(t); s.stop(t + 0.1); }
      function pluck(t, freq, vel, dur) { const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = freq; const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = freq * 3; const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22 * vel, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(f); f.connect(g); g.connect(music); o.start(t); o.stop(t + dur + 0.05); }
      function pad(t, freqs, dur) { freqs.forEach((fq, i) => { const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = fq; o.detune.value = (i - 1) * 3; const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.07, t + dur * 0.4); g.gain.linearRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(music); o.start(t); o.stop(t + dur + 0.1); }); }
      function degFreq(scale, deg, oct) { const n = scale.length; const s = scale[((deg % n) + n) % n] + 12 * (Math.floor(deg / n) + oct); return root * Math.pow(2, s / 12); }
      let nextBeat = 0, bar = 0;
      function schedule() {
        const scale = SCALES[mood.mode], prog = PROG[mood.mode], beat = 60 / mood.tempo, I = mood.intensity;
        while (nextBeat < ctx.currentTime + 0.6) {
          const b = step % 8; const chordDeg = prog[Math.floor(step / 8) % prog.length];
          if (b === 0) { pad(nextBeat, [degFreq(scale, chordDeg, 1), degFreq(scale, chordDeg + 2, 1), degFreq(scale, chordDeg + 4, 1)], beat * 8); bar++; }
          if (I > 0.3 && (b === 0 || b === 4 || (I > 0.6 && b === 6))) thump(nextBeat, Math.min(1, (I - 0.2) * 1.3));
          if (I > 0.45 && b % 2 === 1) tick(nextBeat, (I - 0.3));
          if (I > 0.55) { const arp = [0, 2, 4, 2, 7, 4, 2, 0]; pluck(nextBeat, degFreq(scale, chordDeg + arp[b], I > 0.8 ? 3 : 2), (I - 0.4) * 1.2, beat * 0.9); }
          else if (I > 0.25 && (b === 2 || b === 6)) pluck(nextBeat, degFreq(scale, chordDeg + (b === 2 ? 4 : 2), 2), 0.6, beat * 2);
          nextBeat += beat; step++;
        }
      }
      function setMood(m, fade) { mood = Object.assign({}, mood, m); const t = ctx.currentTime, f = fade == null ? 4 : fade; lp.frequency.cancelScheduledValues(t); lp.frequency.linearRampToValueAtTime(300 + mood.intensity * 1800, t + f); drone[0].g.gain.linearRampToValueAtTime(0.06 + mood.intensity * 0.08, t + f); music.gain.cancelScheduledValues(t); music.gain.linearRampToValueAtTime(0.35 + mood.intensity * 0.35, t + f); const third = mood.mode === "major" ? 4 : 3; drone[1].o.frequency.linearRampToValueAtTime(root * Math.pow(2, (mood.intensity > 0.5 ? 7 : third) / 12), t + f); }
      function start() { if (running) return; running = true; ctx.resume(); nextBeat = ctx.currentTime + 0.1; step = 0; timer = setInterval(schedule, 200); }
      function stop(fade) { const t = ctx.currentTime; music.gain.cancelScheduledValues(t); music.gain.linearRampToValueAtTime(0.0001, t + (fade || 1.5)); amb.gain.cancelScheduledValues(t); amb.gain.linearRampToValueAtTime(0.0001, t + (fade || 1.5)); setTimeout(() => { running = false; clearInterval(timer); if (bedNode) { try { bedNode.stop(); } catch {} } try { ctx.close(); } catch {} }, (fade || 1.5) * 1000 + 100); }
      // ambient bed: engine noise fallback, shaped by grade
      function noiseBed(grade) { const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true; const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = grade === "calm" ? 500 : grade === "active" ? 900 : 700; const g = ctx.createGain(); g.gain.value = 0.35; const lfo = ctx.createOscillator(); lfo.frequency.value = grade === "calm" ? 0.08 : 0.2; const lg = ctx.createGain(); lg.gain.value = 0.15; lfo.connect(lg); lg.connect(g.gain); lfo.start(); s.connect(f); f.connect(g); g.connect(amb); s.start(); bedNode = s; amb.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 3); }
      function fileBed(el) { bedSrc = ctx.createMediaElementSource(el); bedSrc.connect(amb); el.loop = true; el.play().catch(() => {}); amb.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 3); }
      return { ctx, master, setMood, start, stop, noiseBed, fileBed, sfx: (el, gain) => { const s = ctx.createMediaElementSource(el); const g = ctx.createGain(); g.gain.value = gain || 0.8; s.connect(g); g.connect(master); return el.play().catch(() => {}); } };
    }

    // ---------- helpers ----------
    async function exists(url) { try { const r = await fetch(url, { method: "HEAD" }); return r.ok; } catch { return false; } }
    function hoursThisWeek() { const since = Date.now() - 7 * 864e5; return st().sessions.filter(s => s.at > since).reduce((a, s) => a + (s.minutes || 0), 0) / 60; }

    // ---------- hub ----------
    route(/^enjoyment$/, () => {
      const d = byId.enjoyment, e = st(); let grade = e.lastGrade || "calm";
      const el = screen("", topline(0, "Enjoyment", () => nav("/")));
      el.append(h("div", { class: "hub-head" }, mark(d, true), h("div", {}, h("p", { class: "eyebrow", style: { marginTop: 0 } }, "Enjoyment · over guilt"), h("h1", { style: { marginTop: "4px" } }, d.line))));
      el.append(h("p", { class: "help" }, E.intro.body));
      const hrs = hoursThisWeek(); const sess = e.sessions;
      const avg = sess.length ? (sess.slice(0, 10).reduce((a, s) => a + s.rating, 0) / Math.min(10, sess.length)).toFixed(1) : "–";
      el.append(h("div", { class: "stat-row" }, h("div", { class: "stat" }, h("div", { class: "n" }, hrs.toFixed(1)), h("div", { class: "l" }, `of ${E.weeklyTarget} unearned hours this week`)), h("div", { class: "stat" }, h("div", { class: "n" }, avg), h("div", { class: "l" }, "how much you let go, of 5")), h("div", { class: "stat" }, h("div", { class: "n" }, sess.length), h("div", { class: "l" }, "journeys"))));
      el.append(h("div", { class: "track", style: { height: "8px", background: "var(--hairline)", borderRadius: "4px", overflow: "hidden", marginTop: "10px" } }, h("div", { style: { width: Math.min(100, Math.round(hrs / E.weeklyTarget * 100)) + "%", height: "100%", background: d.color, borderRadius: "4px" } })));
      const tabs = h("div", { class: "tiers" }), note = h("p", { class: "help", style: { fontSize: "0.85rem" } }), list = h("ul", { class: "deck" });
      const draw = () => { [...tabs.children].forEach(c => c.setAttribute("aria-checked", String(c.dataset.g === grade))); note.textContent = E.grades.find(g => g.id === grade).note; list.innerHTML = "";
        E.adventures.filter(a => a.grade === grade).forEach(a => list.append(h("li", {}, h("button", { class: "card", onclick: () => { e.lastGrade = grade; api.save(); nav("/enjoyment/play/" + a.id); } }, h("span", { class: "cat" }, `${a.minutes} min`), h("span", {}, h("strong", {}, a.title), h("span", { style: { display: "block", fontSize: "0.88rem", color: "var(--t-body)", marginTop: "4px" } }, a.blurb))))));
        if (!list.children.length) list.append(h("li", { class: "help" }, "More journeys in this grade are being recorded.")); };
      E.grades.forEach(g => tabs.append(h("button", { class: "chip", "data-g": g.id, role: "radio", onclick: () => { grade = g.id; draw(); } }, g.name)));
      el.append(h("h2", {}, "Journeys"), tabs, note, list); draw();
      el.append(h("p", { class: "fine" }, "Headphones, phone face down. Some journeys put you in real trouble for a while; every one of them ends in relief. Nothing is graded, nothing is tracked except your own one-tap answer at the end."));
      return el;
    });

    // ---------- player ----------
    route(/^enjoyment\/play\/([\w-]+)$/, id => {
      const a = E.adventures.find(x => x.id === id); if (!a) { nav("/enjoyment"); return screen(""); }
      const d = byId.enjoyment; const el = screen("", topline(0, a.title, () => { teardown(); nav("/enjoyment"); }));
      let eng = null, narr = null, cues = null, sceneIdx = -1, raf = null, started = 0, finished = false, synthMode = false, synthTimer = null;
      el.append(h("p", { class: "eyebrow" }, `${E.grades.find(g => g.id === a.grade).name} · ${a.minutes} min`), h("h1", {}, a.title), h("p", { class: "help" }, a.blurb));
      const ring = h("div", { class: "ring", style: { width: "200px", height: "200px", borderRadius: "100px" } }, h("button", { class: "t", style: { background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 600, color: "var(--t-strong)", position: "relative" } }, "Begin"));
      ring.style.setProperty("--pct", "0%"); ring.style.background = `conic-gradient(${d.color} var(--pct, 0%), var(--hairline) 0)`;
      const sceneLine = h("p", { class: "mic-note" }, "Headphones on. Phone face down after you press begin."); const status = h("p", { class: "fine", style: { textAlign: "center" } });
      el.append(h("div", { class: "timer" }, ring, sceneLine), status, h("div", { class: "spacer" }));
      const btn = ring.querySelector("button");
      function teardown() { if (raf) cancelAnimationFrame(raf); if (synthTimer) clearTimeout(synthTimer); if (narr) { try { narr.pause(); } catch {} } if (window.speechSynthesis && synthMode) speechSynthesis.cancel(); if (eng) eng.stop(1.2); }
      function setScene(i) { if (i === sceneIdx || i < 0 || i >= a.scenes.length) return; sceneIdx = i; const s = a.scenes[i]; eng.setMood(s.mood, i === 0 ? 0.5 : 5); sceneLine.textContent = `${i + 1} of ${a.scenes.length}`; if (!synthMode) (s.sfx || []).forEach((x, k) => { const at = (cues.scenes[i].start + x.at - narr.currentTime) * 1000; setTimeout(() => { if (!finished) { const au = new Audio(base(a.id) + `sfx-${s.id}-${k}.mp3`); au.onerror = () => {}; eng.sfx(au, 0.7); } }, Math.max(0, at)); }); }
      function finish() { if (finished) return; finished = true; const mins = Math.round((Date.now() - started) / 60000) || a.minutes; eng.setMood({ intensity: 0.1 }, 3); setTimeout(() => { teardown(); nav(`/enjoyment/after/${a.id}/${mins}`); }, 3500); }
      async function begin() {
        btn.disabled = true; btn.textContent = "…"; eng = Engine(); eng.start(); started = Date.now();
        const bedUrl = base(a.id) + "bed.mp3"; if (await exists(bedUrl)) { const bed = new Audio(bedUrl); bed.crossOrigin = "anonymous"; eng.fileBed(bed); } else eng.noiseBed(a.grade);
        const narrUrl = base(a.id) + "narration.mp3", cuesUrl = base(a.id) + "cues.json";
        if (await exists(narrUrl) && await exists(cuesUrl)) {
          cues = await (await fetch(cuesUrl)).json(); narr = new Audio(narrUrl); narr.crossOrigin = "anonymous"; const src = eng.ctx.createMediaElementSource(narr); const g = eng.ctx.createGain(); g.gain.value = 1; src.connect(g); g.connect(eng.master);
          narr.onended = finish; await narr.play(); btn.textContent = "Pause";
          const loop = () => { if (finished) return; const t = narr.currentTime; const i = cues.scenes.findIndex((c, k) => t >= c.start && (k === cues.scenes.length - 1 || t < cues.scenes[k + 1].start)); if (i >= 0) setScene(i); ring.style.setProperty("--pct", Math.round(t / narr.duration * 100) + "%"); raf = requestAnimationFrame(loop); }; loop();
          btn.disabled = false; btn.onclick = () => { if (narr.paused) { narr.play(); eng.ctx.resume(); btn.textContent = "Pause"; } else { narr.pause(); btn.textContent = "Resume"; } };
        } else {
          synthMode = true; status.textContent = "Narration is not recorded for this journey yet; your device's voice is reading it. Recorded narration and sound replace this."; btn.textContent = "Playing";
          const total = a.scenes.reduce((s, sc) => s + sc.text.split(/\s+/).length / 2.4 + sc.pause, 0); let elapsed = 0;
          const speak = i => { if (finished) return; if (i >= a.scenes.length) return finish(); setScene(i); const s = a.scenes[i]; const u = new SpeechSynthesisUtterance(s.text.replace(/\[[^\]]+\]/g, "")); u.rate = a.grade === "adventure" ? 1.0 : 0.88; u.pitch = 0.9; u.onend = () => { synthTimer = setTimeout(() => speak(i + 1), s.pause * 1000); }; speechSynthesis.speak(u); };
          const tickp = () => { if (finished) return; elapsed += 0.5; ring.style.setProperty("--pct", Math.min(100, Math.round(elapsed / total * 100)) + "%"); synthTimer = setTimeout(tickp, 500); }; speak(0); tickp();
        }
      }
      btn.onclick = begin;
      el.append(h("div", { class: "actions" }, h("button", { class: "btn btn-link", onclick: () => { teardown(); nav("/enjoyment"); } }, "Stop")));
      return el;
    });

    // ---------- after ----------
    route(/^enjoyment\/after\/([\w-]+)\/(\d+)$/, (id, mins) => {
      const a = E.adventures.find(x => x.id === id) || { title: "Journey" }; const d = byId.enjoyment;
      const el = screen("", topline(100, "Done", () => nav("/enjoyment")));
      el.append(mark(d, true), h("p", { class: "eyebrow" }, a.title), h("h1", {}, em("That was *yours*")), h("p", { class: "help" }, "Nothing to take away. One question, one tap, and it goes in the week's tally of hours that belonged to pleasure and nothing else."));
      let v = 3; const opts = h("div", { class: "options" });
      [1, 2, 3, 4, 5].forEach(n => opts.append(h("button", { class: "opt", role: "radio", "aria-checked": String(n === v), onclick: () => { v = n; [...opts.children].forEach((c, i) => c.setAttribute("aria-checked", String(i + 1 === v))); } }, h("span", { class: "dot" }), n === 1 ? E.after.low : n === 5 ? E.after.high : String(n))));
      el.append(h("p", { class: "statement", style: { fontSize: "1.3rem" } }, E.after.q), opts, h("div", { class: "spacer" }), h("div", { class: "actions" }, h("button", { class: "btn btn-primary", onclick: () => { st().sessions.unshift({ id, minutes: Number(mins), rating: v, at: Date.now() }); api.save(); nav("/enjoyment"); } }, "Log it"), h("button", { class: "btn btn-link", onclick: () => nav("/enjoyment") }, "Skip")));
      return el;
    });
  });
})();
