/* Status 27 — runtime configuration. Public values only (the Supabase anon key is meant to be public; row-level security does the protecting).
   Leave both empty and the app stays local-only: everything lives in this browser. */
window.ASCENT_CONFIG = {
  // The house is Status 27. The app title is set here so it can change without touching the code.
  brand: { house: "Status 27", app: "Status 27", tag: "designed by a psychiatrist", mission: "Durable frameworks for emotional and social IQ training." },
  supabaseUrl: "https://ghdmzjsokixorqcwnfrm.supabase.co",
  supabaseAnonKey: "sb_publishable_5udQo5toCZrHSy7Ugen76g_AVKKWYC5"
};
