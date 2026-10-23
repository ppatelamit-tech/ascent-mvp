/* Capability block — confidence by evidence.
   A deck of real-world challenges in three tiers. The user picks, rates arousal before (0–10), does it, rates after, writes one line.
   Each completion is a line in the evidence file. Confidence is a record of things done under fear, not a feeling to be summoned.
   Draft content for Dr. Patel to correct. */
window.ASCENT_CAPABILITY = {
  /* Three a day: one Warm, one Load, one Edge, drawn from the areas the user marked as priorities. Points per tier; levels from cumulative points. */
  daily: { count: 3, minPriorities: 2 },
  points: { warm: 10, load: 25, edge: 60 },
  levels: [0, 50, 150, 300, 500, 750, 1050, 1400, 1800, 2250, 2750, 3300, 3900, 4550, 5250], // cumulative points to reach each level (level 1 at 0)
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
  categoryNotes: { Social: "Strangers, asks, apologies, people you avoid.", Professional: "The calls, conversations, and numbers you put off.", Physical: "Cold, endurance, effort past the point of comfort.", Exposure: "Being seen: speaking, posting, performing, being unreachable." },
  prioritiesIntro: { title: "Where does *fear* get you?", body: "Pick at least two areas. Each day you get three challenges drawn from them: one Warm, one Load, one Edge. You can change these any time." },
  deck: [
    // Warm · Social
    { id: "w1", tier: "warm", cat: "Social", t: "Start a conversation with a stranger and keep it going for two minutes." },
    { id: "w2", tier: "warm", cat: "Social", t: "Ask someone a question you would normally look up instead." },
    { id: "w9", tier: "warm", cat: "Social", t: "Give a specific compliment to someone you do not know well." },
    { id: "w11", tier: "warm", cat: "Social", t: "Call a friend you have not spoken to in three months. No text first." },
    { id: "w12", tier: "warm", cat: "Social", t: "Ask a barista, driver, or cashier one real question about their day and listen to the answer." },
    // Warm · Professional
    { id: "w3", tier: "warm", cat: "Professional", t: "Send the follow-up email you have been putting off, today, without rereading it more than once." },
    { id: "w4", tier: "warm", cat: "Professional", t: "Say \"I don't know\" out loud in a meeting where you would usually bluff." },
    { id: "w10", tier: "warm", cat: "Professional", t: "Decline a meeting with one sentence and no apology." },
    { id: "w13", tier: "warm", cat: "Professional", t: "Ask one person on your team what you could do better this week, and only say thank you." },
    { id: "w14", tier: "warm", cat: "Professional", t: "Write the number you are avoiding on a sticky note and put it where you will see it all day." },
    // Warm · Physical
    { id: "w5", tier: "warm", cat: "Physical", t: "Cold shower, two minutes, no bracing. Breathe out slowly the whole way." },
    { id: "w6", tier: "warm", cat: "Physical", t: "A hard effort for ten minutes: run, row, hill, stairs. Stay in it after it gets unpleasant." },
    { id: "w15", tier: "warm", cat: "Physical", t: "Hold a plank or a wall sit for one minute past the point you want to stop." },
    { id: "w16", tier: "warm", cat: "Physical", t: "Walk or run outside before you look at a screen today." },
    { id: "w17", tier: "warm", cat: "Physical", t: "Do the workout you have been skipping, at half the length. The point is showing up." },
    // Warm · Exposure
    { id: "w7", tier: "warm", cat: "Exposure", t: "Eat a meal alone in a restaurant without a phone or a book." },
    { id: "w8", tier: "warm", cat: "Exposure", t: "Leave a message on someone's voicemail instead of texting." },
    { id: "w18", tier: "warm", cat: "Exposure", t: "Post one honest sentence about how the company is actually going, somewhere people you know will see it." },
    { id: "w19", tier: "warm", cat: "Exposure", t: "Sing or hum out loud where someone can hear you." },
    { id: "w20", tier: "warm", cat: "Exposure", t: "Put your phone in another room for two hours during the workday. Tell no one." },
    // Load · Social
    { id: "l4", tier: "load", cat: "Social", t: "Go to an event alone and introduce yourself to five people." },
    { id: "l5", tier: "load", cat: "Social", t: "Ask for something you expect to be refused." },
    { id: "l11", tier: "load", cat: "Social", t: "Tell someone close to you one thing you have been pretending is fine." },
    { id: "l12", tier: "load", cat: "Social", t: "Invite someone you admire to coffee, with a reason, and no hedge in the message." },
    { id: "l13", tier: "load", cat: "Social", t: "Disagree out loud with the most senior person in a social setting, politely, and hold it." },
    // Load · Professional
    { id: "l1", tier: "load", cat: "Professional", t: "Make the cold call you have been avoiding. The goal is the call, not the outcome." },
    { id: "l2", tier: "load", cat: "Professional", t: "Ask a customer or investor directly why they said no." },
    { id: "l3", tier: "load", cat: "Professional", t: "Give someone on your team feedback you have been holding for more than a week." },
    { id: "l10", tier: "load", cat: "Professional", t: "Tell your co-founder or a board member one thing you are afraid of about the company." },
    { id: "l14", tier: "load", cat: "Professional", t: "Renegotiate a price, a deadline, or a term you accepted because pushing felt risky." },
    // Load · Physical
    { id: "l6", tier: "load", cat: "Physical", t: "A fitness test you have not attempted: a timed mile, a max set, a long swim. Record the number." },
    { id: "l7", tier: "load", cat: "Physical", t: "Train at the hour you are most tired, once, to prove you can." },
    { id: "l15", tier: "load", cat: "Physical", t: "Cold water immersion: a lake, the sea, or a cold bath, three minutes." },
    { id: "l16", tier: "load", cat: "Physical", t: "Go to a class or gym where you are clearly the least experienced person, and finish it." },
    { id: "l17", tier: "load", cat: "Physical", t: "Fast from waking until mid-afternoon, water only, and work normally." },
    // Load · Exposure
    { id: "l8", tier: "load", cat: "Exposure", t: "Speak first in a room where you are the least senior person." },
    { id: "l9", tier: "load", cat: "Exposure", t: "Post something publicly, under your name, that you believe and expect pushback on." },
    { id: "l18", tier: "load", cat: "Exposure", t: "Record a two-minute video of yourself explaining what your company does, and send it to five people." },
    { id: "l19", tier: "load", cat: "Exposure", t: "Ask a question at a public event, with a microphone, in front of the room." },
    { id: "l20", tier: "load", cat: "Exposure", t: "Spend a workday without checking metrics or dashboards. Tell the team in advance." },
    // Edge · Social
    { id: "e4", tier: "edge", cat: "Social", t: "Apologize, in person, for something specific, without explaining." },
    { id: "e8", tier: "edge", cat: "Social", t: "Reach out to someone you fell out with and ask to talk." },
    { id: "e9", tier: "edge", cat: "Social", t: "Tell a parent, partner, or oldest friend the thing about your life you have been keeping from them." },
    { id: "e10", tier: "edge", cat: "Social", t: "Ask the person whose opinion you most fear what they honestly think of you." },
    // Edge · Professional
    { id: "e1", tier: "edge", cat: "Professional", t: "Have the conversation you have been avoiding for a month. Schedule it today, hold it this week." },
    { id: "e2", tier: "edge", cat: "Professional", t: "Pitch to the person you are most intimidated by." },
    { id: "e3", tier: "edge", cat: "Professional", t: "Share the real runway number with the person who most needs to hear it." },
    { id: "e11", tier: "edge", cat: "Professional", t: "Fire, replace, or step away from the person or deal you have known for months is wrong." },
    // Edge · Physical
    { id: "e5", tier: "edge", cat: "Physical", t: "An endurance event you are not sure you can finish. Enter it. Finish it." },
    { id: "e12", tier: "edge", cat: "Physical", t: "A full day of hard physical work outdoors, dawn to dark, no screens." },
    { id: "e13", tier: "edge", cat: "Physical", t: "Compete in something physical, in public, where you might lose badly." },
    { id: "e14", tier: "edge", cat: "Physical", t: "Spend a night outside alone: a tent, a bivvy, a beach. Nothing to do but be there." },
    // Edge · Exposure
    { id: "e6", tier: "edge", cat: "Exposure", t: "Perform something in front of strangers: open mic, a talk, a reading." },
    { id: "e7", tier: "edge", cat: "Exposure", t: "Spend a full day with no access to the company. No metrics, no messages. Tell the team in advance." },
    { id: "e15", tier: "edge", cat: "Exposure", t: "Publish the real story of your biggest failure as a founder, under your name, with the numbers." },
    { id: "e16", tier: "edge", cat: "Exposure", t: "Go on a podcast or panel and answer every question without a prepared line." }
  ],
  arousal: { before: "How much is your body reacting right now, thinking about doing this?", after: "And now that it is done?", low: "0 · calm", high: "10 · full alarm" },
  notePrompt: "One line for the evidence file. What did you do, and what happened?",
  readiness: { title: "Two taps", q1: "How ready are you today?", q2: "How heavy is the load?" }
};
