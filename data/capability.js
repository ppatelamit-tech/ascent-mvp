/* Capability block — confidence by evidence.
   A deck of real-world challenges in three tiers. The user picks, rates arousal before (0–10), does it, rates after, writes one line.
   Each completion is a line in the evidence file. Confidence is a record of things done under fear, not a feeling to be summoned.
   Draft content for Dr. Patel to correct. */
window.ASCENT_CAPABILITY = {
  block: {
    weeks: 6,
    perWeek: 3,
    title: "Capability",
    lesson_titles: [
      "Fear is a forecast your body makes without you",
      "Felt risk and actual exposure are two different numbers",
      "Arousal under load: what to do with a racing heart in a real meeting",
      "The evidence file: why confidence is a record, not a mood",
      "Sleep, body, recovery: the basics fear takes first",
      "Holding steady when the threat is real"
    ]
  },
  tiers: [
    { id: "warm", name: "Warm", note: "Mild discomfort. Doable today." },
    { id: "load", name: "Load", note: "Real discomfort. Plan it, then do it." },
    { id: "edge", name: "Edge", note: "The thing you have been avoiding." }
  ],
  categories: ["Social", "Professional", "Physical", "Exposure"],
  deck: [
    // Warm
    { id: "w1", tier: "warm", cat: "Social", t: "Start a conversation with a stranger and keep it going for two minutes." },
    { id: "w2", tier: "warm", cat: "Social", t: "Ask someone a question you would normally look up instead." },
    { id: "w3", tier: "warm", cat: "Professional", t: "Send the follow-up email you have been putting off, today, without rereading it more than once." },
    { id: "w4", tier: "warm", cat: "Professional", t: "Say \"I don't know\" out loud in a meeting where you would usually bluff." },
    { id: "w5", tier: "warm", cat: "Physical", t: "Cold shower, two minutes, no bracing. Breathe out slowly the whole way." },
    { id: "w6", tier: "warm", cat: "Physical", t: "A hard effort for ten minutes: run, row, hill, stairs. Stay in it after it gets unpleasant." },
    { id: "w7", tier: "warm", cat: "Exposure", t: "Eat a meal alone in a restaurant without a phone or a book." },
    { id: "w8", tier: "warm", cat: "Exposure", t: "Leave a message on someone's voicemail instead of texting." },
    { id: "w9", tier: "warm", cat: "Social", t: "Give a specific compliment to someone you do not know well." },
    { id: "w10", tier: "warm", cat: "Professional", t: "Decline a meeting with one sentence and no apology." },
    // Load
    { id: "l1", tier: "load", cat: "Professional", t: "Make the cold call you have been avoiding. The goal is the call, not the outcome." },
    { id: "l2", tier: "load", cat: "Professional", t: "Ask a customer or investor directly why they said no." },
    { id: "l3", tier: "load", cat: "Professional", t: "Give someone on your team feedback you have been holding for more than a week." },
    { id: "l4", tier: "load", cat: "Social", t: "Go to an event alone and introduce yourself to five people." },
    { id: "l5", tier: "load", cat: "Social", t: "Ask for something you expect to be refused." },
    { id: "l6", tier: "load", cat: "Physical", t: "A fitness test you have not attempted: a timed mile, a max set, a long swim. Record the number." },
    { id: "l7", tier: "load", cat: "Physical", t: "Train at the hour you are most tired, once, to prove you can." },
    { id: "l8", tier: "load", cat: "Exposure", t: "Speak first in a room where you are the least senior person." },
    { id: "l9", tier: "load", cat: "Exposure", t: "Post something publicly, under your name, that you believe and expect pushback on." },
    { id: "l10", tier: "load", cat: "Professional", t: "Tell your co-founder or a board member one thing you are afraid of about the company." },
    // Edge
    { id: "e1", tier: "edge", cat: "Professional", t: "Have the conversation you have been avoiding for a month. Schedule it today, hold it this week." },
    { id: "e2", tier: "edge", cat: "Professional", t: "Pitch to the person you are most intimidated by." },
    { id: "e3", tier: "edge", cat: "Professional", t: "Share the real runway number with the person who most needs to hear it." },
    { id: "e4", tier: "edge", cat: "Social", t: "Apologize, in person, for something specific, without explaining." },
    { id: "e5", tier: "edge", cat: "Physical", t: "An endurance event you are not sure you can finish. Enter it. Finish it." },
    { id: "e6", tier: "edge", cat: "Exposure", t: "Perform something in front of strangers: open mic, a talk, a reading." },
    { id: "e7", tier: "edge", cat: "Exposure", t: "Spend a full day with no access to the company. No metrics, no messages. Tell the team in advance." },
    { id: "e8", tier: "edge", cat: "Social", t: "Reach out to someone you fell out with and ask to talk." }
  ],
  arousal: { before: "How much is your body reacting right now, thinking about doing this?", after: "And now that it is done?", low: "0 · calm", high: "10 · full alarm" },
  notePrompt: "One line for the evidence file. What did you do, and what happened?",
  readiness: { title: "Two taps", q1: "How ready are you today?", q2: "How heavy is the load?" }
};
