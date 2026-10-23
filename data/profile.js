/* Ascent Profile — baseline assessment. In-house draft items for Dr. Patel to correct.
   Scale: past month, 0 Never · 1 Rarely · 2 Sometimes · 3 Often · 4 Almost always.
   rev: true = item describes the trained capacity (higher = stronger); default items describe the block (higher = weaker).
   Scoring: each domain 0–100 where 100 = fully trained. Never shown as a diagnosis; bands are capacity words. */
window.ASCENT_PROFILE = {
  scale: ["Never", "Rarely", "Sometimes", "Often", "Almost always"],
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
    { d: "capability", t: "When a real threat to the company appeared, my body reacted as if it were an emergency for hours afterward." },
    { d: "capability", t: "I avoided a conversation, call, or task because of how it would feel, not because it was the wrong move." },
    { d: "capability", t: "I could read how much runway or risk we actually had, separate from how it felt.", rev: true },
    { d: "capability", t: "Fear about survival (mine or the company's) shaped a decision more than the facts did." },
    { d: "capability", t: "I did something that scared me because it was the right move, and it went fine.", rev: true },
    { d: "capability", t: "My sleep, eating, or exercise fell apart when pressure went up." },

    // Enjoyment (Guilt)
    { d: "enjoyment", t: "I enjoyed something with no purpose and did not feel I had to earn it or make up for it.", rev: true },
    { d: "enjoyment", t: "When I rested, part of me was keeping a ledger of what I should have been doing." },
    { d: "enjoyment", t: "I cut short or cancelled something I was looking forward to because work was not finished." },
    { d: "enjoyment", t: "I could be fully absorbed in something (a meal, a game, a conversation) without checking anything.", rev: true },
    { d: "enjoyment", t: "I felt guilty about being happy when the company was not doing well." },
    { d: "enjoyment", t: "I had at least a few hours a week that belonged to pleasure and nothing else.", rev: true },

    // Drive (Shame)
    { d: "drive", t: "I could say what I value in a sentence and name a thing I did this week because of it.", rev: true },
    { d: "drive", t: "A goal I was chasing was really about proving something to someone." },
    { d: "drive", t: "I kept working past the point of usefulness because stopping felt like being exposed." },
    { d: "drive", t: "My motivation survived a bad week because it did not depend on how I looked.", rev: true },
    { d: "drive", t: "I compared my progress with other founders and felt smaller for it." },
    { d: "drive", t: "My daily and weekly targets traced back to something I actually care about, not to what would impress.", rev: true },

    // Connection (Grief)
    { d: "connection", t: "I could raise someone else's standing in a room without feeling I had lost any of my own.", rev: true },
    { d: "connection", t: "I held onto a position or decision in a conversation mainly to avoid looking lower than the other person." },
    { d: "connection", t: "I repaired a rupture with a co-founder, hire, investor, or partner within a few days.", rev: true },
    { d: "connection", t: "There is a relationship the company has cost me that I have not let myself feel." },
    { d: "connection", t: "I noticed what someone was doing to my status in a conversation while it was happening, not afterward.", rev: true },
    { d: "connection", t: "I felt alone in a way that no one around me could see." },

    // Communication (Lies)
    { d: "communication", t: "I gave a board, investor, or team a number or state that was more presentable than true." },
    { d: "communication", t: "When I had something hard to say, I said it within a day of knowing it.", rev: true },
    { d: "communication", t: "I knew the real reason for a decision and gave a different one." },
    { d: "communication", t: "I told a co-founder or senior hire what I actually thought of their work, plainly.", rev: true },
    { d: "communication", t: "I softened, hedged, or buried the hard part of a message so that it did not land." },
    { d: "communication", t: "I said the thing that made me look worst, without qualifying it, because it was true.", rev: true },

    // Vision (Illusion)
    { d: "vision", t: "I could separate what I hoped would happen from what I expected would happen.", rev: true },
    { d: "vision", t: "I defended the company's story in a conversation instead of attacking it to see if it held." },
    { d: "vision", t: "A forecast I made was wrong in the direction I wanted it to be right." },
    { d: "vision", t: "Before I believed an explanation for why something worked, I asked what the base rate was.", rev: true },
    { d: "vision", t: "I treated a thesis about the market or product as a hypothesis I could be wrong about.", rev: true },
    { d: "vision", t: "I talked myself into a reading of the facts that, later, I could see was the one I wanted." },

    // Detachment (Attachment)
    { d: "detachment", t: "If the company failed tomorrow, I would still know who I am.", rev: true },
    { d: "detachment", t: "I held onto a decision or task that someone else could have owned because I needed to be essential." },
    { d: "detachment", t: "A piece of news about the company changed how I felt about myself as a person." },
    { d: "detachment", t: "I was unreachable for a planned stretch and the company was fine.", rev: true },
    { d: "detachment", t: "I could imagine handing this company to someone else without it feeling like a death.", rev: true },
    { d: "detachment", t: "I checked metrics, email, or messages when there was no decision to make." }
  ],
  /* Safety layer. Never scored, never shown as a score. A yes routes to the crisis card and marks the profile for referral. */
  safety: {
    prefix: "One more question, asked of everyone. It is not part of your Profile.",
    text: "In the past two weeks, have you had thoughts that you would be better off dead, or of hurting yourself?",
    options: ["No", "Yes"],
    yes_index: 1
  },
  crisis: {
    title: "Thank you for answering that.",
    body: "Ascent is training, not care, and that answer deserves care. If you are in danger right now, call or text 988 (US) or go to the nearest emergency room. If you are not in danger, please tell someone you trust today and talk to a clinician this week. Your Profile will still be ready, and it will recommend a clinician alongside any training."
  }
};
