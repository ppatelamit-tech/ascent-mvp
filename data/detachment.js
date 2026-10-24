/* Detachment block — hold it loosely. The Cat.
   Attachment is the self fused to the outcome. Detachment trains the seam between them with five mechanics:
   an identity inventory (how concentrated is your sense of self in the company), delegation challenges (release control where it is not needed),
   the full failure (write it once, read it daily for a week, until it is a fact and not a terror), absence days (four hours growing), and a succession letter.
   Draft content for Dr. Patel to correct. */
window.ASCENT_DETACHMENT = {
  intro: "If the company is you, every bad week is an injury to the self, and you will hold on past the point of sense. Detachment is not caring less. It is having somewhere to stand that the company cannot take away.",
  inventory: {
    intro: "Twenty points. Spread them across where your sense of who you are actually lives, right now, not where you wish it did. The concentration score is how much of you one failure could take.",
    points: 20,
    slots: [
      { id: "company", name: "The company", hint: "Its success is my success." },
      { id: "craft", name: "The craft", hint: "What I am good at, wherever I do it." },
      { id: "partner", name: "Partner", hint: "The person I share a life with." },
      { id: "family", name: "Children, parents, family", hint: "Who I am to them." },
      { id: "friends", name: "Friends", hint: "People who knew me before and will after." },
      { id: "body", name: "Body, sport", hint: "What I can do physically." },
      { id: "making", name: "Something I make for no money", hint: "Music, wood, bread, words." },
      { id: "community", name: "Community, faith, place", hint: "A room I belong to that is not work." },
      { id: "alone", name: "Just me, alone, not doing", hint: "Who I am when nothing is happening." }
    ],
    bands: [{ min: 0, name: "Spread", note: "No single slot holds more than a third. A bad quarter hurts and does not unmake you." }, { min: 0.34, name: "Leaning", note: "One slot holds over a third of you. Feed two others this month on purpose." }, { min: 0.5, name: "All in one basket", note: "Half or more of who you are sits in one place. That is where the holding-on comes from. The other slots are not hobbies; they are structural." }]
  },
  delegate: {
    intro: "Control released where it is not needed. One challenge a week. Hold it for the full term; the point is what happens when you do not step in, which is usually nothing.",
    items: [
      { id: "d1", t: "Hand one recurring decision to someone, for a month, and do not review it.", term: "a month" },
      { id: "d2", t: "Let a meeting you always run happen without you. Read the notes after, not during.", term: "one meeting" },
      { id: "d3", t: "Someone else writes and sends the investor update. You read it when they do.", term: "one update" },
      { id: "d4", t: "Do not read the team channel for 48 hours. Tell them, then don't.", term: "48 hours" },
      { id: "d5", t: "A thing is broken and you could fix it in an hour. Leave it for the person whose job it is, for a day.", term: "a day" },
      { id: "d6", t: "Someone else presents at the all-hands. You sit in the audience.", term: "one all-hands" },
      { id: "d7", t: "Hand one hiring decision, start to finish, to the hiring manager. Meet the person after they are hired.", term: "one hire" },
      { id: "d8", t: "Set a spending limit under which nobody asks you. Then do not ask about it.", term: "a month" },
      { id: "d9", t: "A customer escalation lands. The team handles it for 24 hours before you hear the details.", term: "24 hours" },
      { id: "d10", t: "Give your calendar to someone for a week. They accept, decline, and move things. You turn up.", term: "a week" }
    ],
    outcomes: [["held", "I held it", "Nothing I could not live with happened."], ["held-cost", "I held it, something broke", "Note what broke. Usually it was smaller than the fear."], ["took", "I took it back", "Note the moment. That is the attachment, exactly there."]]
  },
  failure: {
    intro: "Write the full failure once. The company closes. Give it a date. Who you tell first, in what words. The morning after. What is still true about you that evening. Then read it every day for a week, until it is a fact you know rather than a thing you flinch from.",
    prompts: ["The date, and how it ends. Plainly.", "Who you tell first, and the words you use.", "The morning after: what you do with the first four hours.", "What is still true about you that evening. Name three things."],
    readDays: 7,
    readLine: "Read it slowly. Then close it. Once a day, seven days.",
    done: "Seven readings. It is a fact now, one of many. The company can still fail and you will still be here on the morning after. That is the whole of detachment."
  },
  absence: {
    intro: "Four hours unreachable, by design. Then six, eight, twelve, a day. Phone off, not silenced. Afterwards, one question: what broke? The answer is the data.",
    hours: [4, 6, 8, 12, 24],
    brokePlaceholder: "What broke while you were gone? 'Nothing' is a valid and common answer.",
    line: "Schedule it, do it, come back and log it. The company's survival of your absence is the evidence file for this block."
  },
  letter: {
    intro: "A letter to whoever runs this if you cannot. Not legal; human. What matters, what to protect, what to let go, what you got wrong. Writing it is the exercise. You can read it again each quarter.",
    prompts: ["To whoever is reading this: what the company is actually for.", "The three things to protect, and the one thing to let go of first.", "What I got wrong that you should not repeat.", "The people. Who to keep close, who to call."],
    done: "Saved. Read it again in a quarter; it will tell you how your grip has changed."
  }
};
