/* Status 27 Profile — baseline assessment. In-house draft items for Dr. Patel to correct.
   Scale: past month, 0 Never · 1 Rarely · 2 Sometimes · 3 Often · 4 Almost always.
   rev: true = item describes the trained capacity (higher = stronger); default items describe the block (higher = weaker).
   Scoring: each domain 0–100 where 100 = fully trained. Never shown as a diagnosis; bands are capacity words. */
window.ASCENT_PROFILE = {
  placement: { eyebrow: "Placement", title: "Six questions to find your *starting level*", body: "The first time you train a capacity, six quick questions set where you start, the way a trainer finds your working weight. Honest beats flattering: a level set too high makes the exercises miss.", done: "Placed. The exercises start from here, and the level moves as you train." },
  scale: ["Never", "Rarely", "Sometimes", "Often", "Almost always"],
  // Items that describe a state rather than a frequency use the agreement set (same 0–4 scoring).
  scaleAgree: ["Strongly disagree", "Disagree", "Neither", "Agree", "Strongly agree"],
  prefixes: { freq: "In the past month…", agree: "Right now…" },
  bands: [
    { min: 0,  name: "Early",       note: "This capacity is carrying most of the weight of its block right now." },
    { min: 40, name: "Developing",  note: "Trained in some situations, not yet under load." },
    { min: 65, name: "Established", note: "Holds under ordinary pressure. Slips at the edges." },
    { min: 85, name: "Strong",      note: "Holds under load. Worth maintaining, not training." }
  ],
  intro: {
    title: "Your *Profile*",
    body: "Forty-two statements about the past month, one at a time. Answer for how it has actually been, not how it usually is or how you want it to be. About twelve minutes. There are no right answers and nothing here is a diagnosis; this is a reading of seven capacities, taken once, so you can see which to train first."
  },
  interludes: {
    capability:    "The first seven are about fear and what it does to your body and your decisions when the stakes are real.",
    enjoyment:     "Next, enjoyment. Not whether you have fun, but whether you are allowed to.",
    drive:         "Drive. Where your motivation comes from, and whose it is.",
    connection:    "Connection. How you handle status with the people you work with and love, and what the company has cost you.",
    communication: "Communication. Not whether you can speak well, but whether you say the true thing, and how fast.",
    vision:        "Vision. The gap between what you believe and what is so.",
    detachment:    "Last, detachment. How much of you is the company."
  },
  items: [
    // Capability (Fear)
    { d: "capability", t: "When a real threat to the company appeared, my body stayed in emergency mode for hours afterward." },
    { d: "capability", t: "I avoided a conversation, call, or task because of how it would feel, not because it was the wrong move." },
    { d: "capability", t: "I can tell how much runway and risk we actually have, apart from how it feels.", scale: "agree", rev: true },
    { d: "capability", t: "Fear about survival (mine or the company's) shaped a decision more than the facts did." },
    { d: "capability", t: "I did something that scared me because it was the right move.", rev: true },
    { d: "capability", t: "My sleep, eating, or exercise fell apart when pressure went up." },

    // Enjoyment (Guilt)
    { d: "enjoyment", t: "I enjoyed something purely for its own sake, without feeling I had to earn it or make up for it.", rev: true },
    { d: "enjoyment", t: "When I rested, part of me kept a tally of what I should have been doing." },
    { d: "enjoyment", t: "I cut short or cancelled something I was looking forward to because work was not finished." },
    { d: "enjoyment", t: "I was fully absorbed in something (a meal, a game, a conversation) without checking my phone.", rev: true },
    { d: "enjoyment", t: "I felt guilty about being happy when the company was not doing well." },
    { d: "enjoyment", t: "I set aside time purely for pleasure, and kept it.", rev: true },

    // Drive (Shame)
    { d: "drive", t: "I can state what I value in one sentence and name something I did this week because of it.", scale: "agree", rev: true },
    { d: "drive", t: "I chased a goal mainly to prove something to someone." },
    { d: "drive", t: "I kept working past the point of usefulness because stopping felt like being exposed." },
    { d: "drive", t: "My motivation survives a bad week because it does not depend on how I look.", scale: "agree", rev: true },
    { d: "drive", t: "I compared my progress with other founders and felt smaller for it." },
    { d: "drive", t: "My daily and weekly targets trace back to something I actually care about, not to what would impress other people.", scale: "agree", rev: true },

    // Connection (Grief)
    { d: "connection", t: "I raised someone else's standing in a room without feeling I had lost any of my own.", rev: true },
    { d: "connection", t: "I held onto a position or decision in a conversation mainly so that I would not look lower in status than the other person." },
    { d: "connection", t: "When there was a rift with a co-founder, employee, investor, or partner, I repaired it within a few days.", rev: true },
    { d: "connection", t: "The company has cost me a relationship, and I have not let myself feel that loss.", scale: "agree" },
    { d: "connection", t: "I noticed what someone was doing to my status in a conversation while it was happening, not afterward.", rev: true },
    { d: "connection", t: "I feel alone in a way that no one around me can see.", scale: "agree" },

    // Communication (Lies)
    { d: "communication", t: "I gave a board, investor, or team a number or a status update that was more flattering than accurate." },
    { d: "communication", t: "When I had something hard to say, I said it within a day of knowing it.", rev: true },
    { d: "communication", t: "I knew the real reason for a decision and gave a different one." },
    { d: "communication", t: "I told a co-founder or senior employee plainly what I thought of their work.", rev: true },
    { d: "communication", t: "I softened, hedged, or buried the hard part of a message until it no longer registered." },
    { d: "communication", t: "I said something true that made me look bad, without qualifying it.", rev: true },

    // Vision (Illusion)
    { d: "vision", t: "I can separate what I hope will happen from what I expect will happen.", scale: "agree", rev: true },
    { d: "vision", t: "I defended the company's story in a conversation instead of testing whether it held up." },
    { d: "vision", t: "A forecast I made turned out to be too optimistic." },
    { d: "vision", t: "Before accepting an explanation for why something worked, I asked how often that approach usually works (the base rate).", rev: true },
    { d: "vision", t: "I treated a thesis about the market or product as a hypothesis that could be wrong.", rev: true },
    { d: "vision", t: "I talked myself into a reading of the facts that I later saw was simply the one I wanted." },

    // Detachment (Attachment)
    { d: "detachment", t: "If the company failed tomorrow, I would still know who I am.", scale: "agree", rev: true },
    { d: "detachment", t: "I held onto a decision or task that someone else could have owned because I needed to be essential." },
    { d: "detachment", t: "A piece of news about the company changed how I felt about myself as a person." },
    { d: "detachment", t: "I was deliberately unreachable for a stretch, and the company was fine.", rev: true },
    { d: "detachment", t: "I can imagine handing this company to someone else without it feeling like a death.", scale: "agree", rev: true },
    { d: "detachment", t: "I checked metrics, email, or messages when there was no decision to make." }
  ],
  /* Safety layer — OFF (Nov 2026): a direct self-harm question in a training app creates a duty the app cannot meet.
     The 988 strip stays on every screen and the Guide routes crisis language to the crisis card. Set enabled: true to restore. */
  safety: {
    enabled: false,
    prefix: "One more question, asked of everyone. It is not part of your Profile.",
    text: "In the past two weeks, have you had thoughts that you would be better off dead, or of hurting yourself?",
    options: ["No", "Yes"],
    yes_index: 1
  },
  crisis: {
    title: "Thank you for answering that.",
    body: "This is training, not care, and that answer deserves care. If you are in danger right now, call or text 988 (US) or go to the nearest emergency room. If you are not in danger, please tell someone you trust today and talk to a clinician this week. Your Profile will still be ready, and it will recommend a clinician alongside any training."
  }
};
