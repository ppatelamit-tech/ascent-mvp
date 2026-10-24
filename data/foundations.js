/* Foundations — the diet-and-nutrition pillar. What the seven stand on.
   Two sides: Add (sleep, movement, daylight, water, food) and Limit (the phone and the other things that quietly drain).
   The app cannot enforce a limit; the phone can. Foundations prescribes one, walks you to the OS setting, and keeps the score honest. */
window.ASCENT_FOUNDATIONS = {
  intro: "Nutrition for the mind. Thirty seconds a day: what went in, what you kept out. One thing to add this week, one thing to limit. The phone's own tools do the enforcing; this is where you decide and where you keep score.",
  // ---------- daily check-in (about 30 seconds) ----------
  checkin: [
    { id: "sleep", q: "Sleep last night", opts: [["lt6", "Under 6 h"], ["6-7", "6–7 h"], ["7-8", "7–8 h"], ["8+", "8 h or more"]], good: ["7-8", "8+"] },
    { id: "wake", q: "Wake time", opts: [["usual", "Within an hour of usual"], ["off", "More than an hour off"]], good: ["usual"] },
    { id: "move", q: "Movement so far today", opts: [["none", "None"], ["light", "A walk, some stairs"], ["30", "30 minutes or more"]], good: ["light", "30"] },
    { id: "light", q: "Daylight before noon", opts: [["yes", "Ten minutes or more"], ["no", "Not really"]], good: ["yes"] },
    { id: "sub", q: "Yesterday, after 2 p.m.", opts: [["none", "Neither"], ["caf", "Caffeine"], ["alc", "Alcohol"], ["both", "Both"]], good: ["none"] },
    { id: "first", q: "First time you looked at the phone today", opts: [["bed", "In bed, before getting up"], ["30", "Within half an hour"], ["later", "After daylight and a drink of water"]], good: ["later"] },
    { id: "last", q: "Last night, phone down before sleep", opts: [["inbed", "In bed, until I slept"], ["30", "About half an hour before"], ["60", "An hour or more before"]], good: ["30", "60"] }
  ],
  // ---------- Add menu: one per week ----------
  adds: [
    { id: "wake-same", name: "Same wake time, every day", why: "Regularity moves mood more than total hours do. Pick a time you can keep on Saturday.", micro: "Set one alarm for the week and leave it alone." },
    { id: "daylight", name: "Ten minutes of daylight before noon", why: "Morning light sets the clock that runs sleep, appetite and energy. Outdoors, no sunglasses, a window does not count.", micro: "Coffee outside, or the first call on a walk." },
    { id: "move-20", name: "Twenty minutes of movement", why: "The best-replicated antidepressant that is not a drug. Intensity matters less than showing up.", micro: "Twenty minutes, any pace. Stairs count. Carrying things counts." },
    { id: "water-first", name: "Water before coffee", why: "Small, dull, and it works: a glass of water on waking blunts the afternoon slump.", micro: "A full glass before the first caffeine." },
    { id: "lunch-away", name: "One meal away from a screen", why: "Eating while working is eating without noticing, and the brain never registers that it was fed.", micro: "Lunch at a table, phone face down, twelve minutes." },
    { id: "in-bed-8", name: "Eight hours in bed", why: "Not eight hours asleep. Eight in bed gives you a real chance at seven.", micro: "Lights out eight hours before the alarm, three nights this week." }
  ],
  // ---------- Limit menu: one per week ----------
  limits: [
    { id: "phone-bed", name: "No phone in bed", keystone: true, why: "The single highest-leverage limit. The phone in bed costs sleep at both ends and starts the day in someone else's agenda.", when: "I get into bed", then: "the phone is already in the drawer, charging, and the book is on the nightstand.", setup: "dark" },
    { id: "doom", name: "No news or feeds before noon", why: "Scrolling first thing hands your attention to the loudest thing in the world before you have had a thought of your own.", when: "I reach for the phone in the morning", then: "I open the Foundations check-in instead, then put it down.", setup: "limits" },
    { id: "social", name: "Social media: one window a day", why: "Not zero. One deliberate window, with a start and an end, instead of forty accidental ones.", when: "I feel the pull to check", then: "I note it and wait for the window.", setup: "limits" },
    { id: "caf-2", name: "No caffeine after 2 p.m.", why: "Caffeine has a six-hour half-life. The 4 p.m. coffee is still a quarter-strength at 10 p.m.", when: "I want the afternoon coffee", then: "it is decaf, tea, or a walk." },
    { id: "alc-week", name: "No alcohol on work nights", why: "Alcohol is a sedative that wrecks the second half of the night. Founders use it to come down; it makes coming down harder tomorrow.", when: "When the day ends and I want a drink", then: "I run the Shut the shop ritual first, then decide." },
    { id: "email-8", name: "No work email after 8 p.m.", why: "Nothing after eight is actionable before morning. Reading it only moves the worry into the night.", when: "I think of checking", then: "I write the thought on paper for 8 a.m." },
    { id: "trading", name: "No trading, crypto or market apps outside one window", why: "Price-checking is a slot machine with a professional veneer. Founders are especially prone, and it eats the same attention the company needs.", when: "I want to check the number", then: "I wait for the window; nothing changes because I looked.", setup: "limits" },
    { id: "dash", name: "Dashboards and metrics: twice a day", why: "Watching a number does not move it. Checking is a way of feeling in control that produces nothing.", when: "I want to refresh the dashboard", then: "I ask what I would do differently if it changed. Usually nothing." },
    { id: "custom", name: "Something of your own", why: "You know what it is. Name it, and give it the same shape: when, then.", when: "", then: "" }
  ],
  // ---------- Dull after dark ----------
  dark: {
    name: "Dull after dark",
    why: "The better-replicated effect is not blue light. It is boredom: a grey or red screen is simply less interesting, and the pull drops. Ascent shifts to a red cast after dark too, so the app is on your side.",
    ios: ["Settings → Accessibility → Display & Text Size → Color Filters. Turn on, choose Grayscale, or Color Tint with the red slider up.", "Settings → Accessibility → Accessibility Shortcut → tick Color Filters. Now triple-clicking the side button toggles it.", "Shortcuts app → Automation → Time of Day → sunset → add the action Set Color Filters → On. Make a second one for sunrise → Off."],
    android: ["Settings → Digital Wellbeing → Bedtime mode → set the schedule → turn on Grayscale.", "Or Settings → Accessibility → Color correction → Grayscale, and add it to the Quick Settings tiles.", "Some phones hide it under Display → Eye comfort shield or Night Light; red tint is there."]
  },
  // ---------- brief screens (shown once, gently, in Foundations settings) ----------
  screens: {
    intro: "Three honest questions about drinking and two about betting. Nobody sees these but you. If the numbers say a clinician would be useful, the app says so once and leaves it there.",
    auditc: [
      { q: "How often do you have a drink containing alcohol?", opts: ["Never", "Monthly or less", "2–4 times a month", "2–3 times a week", "4 or more times a week"] },
      { q: "How many drinks do you have on a typical day when you are drinking?", opts: ["1 or 2", "3 or 4", "5 or 6", "7 to 9", "10 or more"] },
      { q: "How often do you have six or more drinks on one occasion?", opts: ["Never", "Less than monthly", "Monthly", "Weekly", "Daily or almost daily"] }
    ],
    auditFlag: 4,
    liebet: [
      "Have you ever had to lie to people important to you about how much you gambled or traded?",
      "Have you ever felt the need to bet or trade more and more money?"
    ],
    referNote: "Your answers put you in the range where talking to a clinician tends to be useful. This is not a diagnosis; it is a door. The Profile will carry the note."
  }
};
