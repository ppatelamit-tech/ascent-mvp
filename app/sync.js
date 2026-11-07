/* Sync — accounts and profile storage. Supabase auth (magic link) + one row per user holding the whole state as JSON.
   Rules: the app works fully without an account (local only). Signing in pulls the newer of local/remote by `updated`, then every save pushes (debounced).
   Delete removes the row and signs out; local state is kept unless the founder also clears it. Nothing is sent anywhere until the founder signs in.
   Setup: app/config.js + the SQL in README (table ascent_state, RLS: owner only). */
(function () {
  "use strict";
  window.ASCENT_PLUGINS = window.ASCENT_PLUGINS || [];
  window.ASCENT_PLUGINS.push(function (api) {
    const { route, h, em, screen, topline, nav, fmtDate } = api;
    const S = () => api.state(); const save = api.save;
    const cfg = window.ASCENT_CONFIG || {}; const ready = !!(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);
    const sb = ready ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null;
    let user = null, pushTimer = null, status = ready ? "idle" : "off", lastSync = null;
    const SYNC = window.ASCENT_SYNC = { ready, get user() { return user; }, get status() { return status; }, get lastSync() { return lastSync; }, signIn, signOut, pull, push, deleteAccount };
    const TABLE = "ascent_state";

    async function signIn(email) { const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + location.pathname + "#/account" } }); if (error) throw error; }
    async function signOut() { await sb.auth.signOut(); user = null; status = "idle"; }
    function stripLocal(st) { const copy = JSON.parse(JSON.stringify(st)); delete copy.testMode; return copy; }
    async function push() {
      if (!sb || !user) return; status = "saving";
      const st = S(); const { error } = await sb.from(TABLE).upsert({ user_id: user.id, state: stripLocal(st), updated_at: new Date(st.updated || Date.now()).toISOString() }, { onConflict: "user_id" });
      status = error ? "error" : "synced"; if (!error) lastSync = Date.now(); if (error) console.warn("sync push", error.message);
    }
    async function pull() {
      if (!sb || !user) return "none"; status = "loading";
      const { data, error } = await sb.from(TABLE).select("state, updated_at").eq("user_id", user.id).maybeSingle();
      if (error) { status = "error"; console.warn("sync pull", error.message); return "error"; }
      const local = S(); const remoteAt = data ? new Date(data.updated_at).getTime() : 0; const localAt = local.updated || local.started || 0;
      if (data && remoteAt > localAt) { const next = data.state; next.testMode = local.testMode; api.replaceState(next); status = "synced"; lastSync = Date.now(); return "remote"; }
      await push(); return data ? "local" : "first";
    }
    async function deleteAccount() { if (!sb || !user) return; const { error } = await sb.from(TABLE).delete().eq("user_id", user.id); if (error) throw error; await signOut(); }

    if (sb) {
      sb.auth.onAuthStateChange((event, session) => { const was = user; user = session ? session.user : null; if (user && (!was || was.id !== user.id)) pull().then(() => { if (location.hash.startsWith("#/account")) nav("/account"); }); if (!user) status = "idle"; });
      window.addEventListener("ascent:save", () => { if (!user) return; clearTimeout(pushTimer); pushTimer = setTimeout(push, 1500); });
      window.addEventListener("pagehide", () => { if (user && pushTimer) { clearTimeout(pushTimer); push(); } });
    }

    route(/^account$/, () => {
      const el = screen("", topline(0, "Account", () => nav("/")));
      el.append(h("p", { class: "eyebrow" }, "Your data"), h("h1", {}, em("Keep it *across devices*")));
      if (!ready) { el.append(h("p", { class: "help" }, "Accounts are not switched on in this build. Everything you have done lives in this browser only: clear the browser and it is gone, change phones and it does not follow. Nothing has been sent anywhere."), h("p", { class: "fine" }, "To switch them on: fill app/config.js with the Supabase project URL and anon key, and run the SQL in the README.")); return el; }
      if (!user) {
        const inp = h("input", { type: "email", placeholder: "you@company.com", autocomplete: "email" }); const note = h("p", { class: "fine" }); const btn = h("button", { class: "btn btn-primary", onclick: async () => { const e = inp.value.trim(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) { note.textContent = "An email address, so the link has somewhere to go."; return; } btn.disabled = true; btn.textContent = "Sending…"; try { await signIn(e); note.textContent = `Sent. Open the link in the email on this device and you are in. It expires in an hour.`; btn.textContent = "Sent"; } catch (err) { btn.disabled = false; btn.textContent = "Send me a link"; note.textContent = "That did not send: " + (err.message || "unknown error") + ". Try again in a minute."; } } }, "Send me a link");
        el.append(h("p", { class: "help" }, "No password. Enter your email and we send a link; open it and this device is signed in. Your Profile, your build and every day's work are then saved to your account and follow you to any device you sign in on."), inp, h("div", { class: "actions" }, btn), note);
        el.append(h("div", { class: "callout" }, h("h3", {}, "What is stored, and the rules"), "Everything the app knows: your Profile answers and scores, your build and the numbers behind it, your check-ins, rituals, exercises, what you said to the Guide, and what you spoke in the Perform drills. It is stored under your account, encrypted at rest, readable by you and by nobody else in the product. It is never sold, never used to train anything, and the Delete button below removes all of it at once. Until you sign in, nothing leaves this device."));
        return el;
      }
      const st = S(); const line = status === "synced" ? `Saved${lastSync ? " · " + new Date(lastSync).toLocaleTimeString() : ""}` : status === "saving" ? "Saving…" : status === "error" ? "Could not reach the server; your work is safe on this device and will sync when it can." : "Signed in";
      el.append(h("div", { class: "callout accent" }, h("h3", {}, user.email), line));
      el.append(h("div", { class: "actions" }, h("button", { class: "btn", onclick: async () => { await push(); nav("/account"); } }, "Save now"), h("button", { class: "btn", onclick: async () => { await signOut(); nav("/account"); } }, "Sign out on this device")));
      el.append(h("h2", {}, "Delete"), h("p", { class: "help" }, "Removes everything stored under your account: Profile, build, days, transcripts. This device keeps its local copy until you clear it below. There is no undo."));
      el.append(h("div", { class: "actions row" }, h("button", { class: "btn btn-link", style: { color: "var(--crisis)" }, onclick: async () => { if (!confirm("Delete everything stored under your account? There is no undo.")) return; try { await deleteAccount(); alert("Deleted. You are signed out on this device."); nav("/account"); } catch (e) { alert("Could not delete: " + e.message); } } }, "Delete my account data"), h("button", { class: "btn btn-link", onclick: () => { if (!confirm("Clear this device too? The app starts over here.")) return; localStorage.removeItem("ascent-mvp-v1"); location.reload(); } }, "Clear this device")));
      el.append(h("p", { class: "fine" }, `Local copy last changed ${fmtDate(st.updated || st.started)}.`));
      return el;
    });
  });
})();
