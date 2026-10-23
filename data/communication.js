/* Communication block — say it in 30 seconds.
   The user is given a topic and 30 seconds to speak. Speech is transcribed and graded against the six-dimension rubric.
   The rubric lives in netlify/functions/grade.js (server) and is mirrored in app/grader-local.js (offline estimate).
   Draft content for Dr. Patel to correct. */
window.ASCENT_COMMUNICATION = {
  block: {
    weeks: 6,
    perWeek: 4,
    title: "Communication",
    lesson_titles: [
      "The delay between knowing and saying",
      "Hedges: the eleven words that bury the point",
      "Say the number first",
      "Ownership: 'I' for the decision, 'we' for the work",
      "The real reason, not the presentable one",
      "Finishing: end with the ask, not the apology"
    ]
  },
  prep_seconds: 5,
  speak_seconds: 30,
  categories: ["Board", "Team", "Co-founder", "Investor", "Customer", "Self"],
  topics: [
    { id: "b1", cat: "Board", t: "Tell the board the real number for the quarter and why you missed it." },
    { id: "b2", cat: "Board", t: "Tell the board you are changing the strategy you sold them six months ago." },
    { id: "b3", cat: "Board", t: "Tell the board you need to replace a senior hire they liked." },
    { id: "b4", cat: "Board", t: "Tell the board how many months of runway you actually have." },
    { id: "t1", cat: "Team", t: "Tell the team there will be layoffs, how many, and when." },
    { id: "t2", cat: "Team", t: "Tell the team the product launch failed and what you got wrong." },
    { id: "t3", cat: "Team", t: "Tell a senior engineer their work has not been good enough for two months." },
    { id: "t4", cat: "Team", t: "Tell the team you were wrong about a decision you pushed hard for." },
    { id: "c1", cat: "Co-founder", t: "Tell your co-founder what you actually think about how they are showing up." },
    { id: "c2", cat: "Co-founder", t: "Tell your co-founder you think the equity split is no longer fair." },
    { id: "c3", cat: "Co-founder", t: "Tell your co-founder you want them to step out of their role." },
    { id: "c4", cat: "Co-founder", t: "Tell your co-founder something you have been hiding from them about the business." },
    { id: "i1", cat: "Investor", t: "Tell an investor the round is not coming together and what you are going to do." },
    { id: "i2", cat: "Investor", t: "Tell an investor you do not want them on the cap table, and why." },
    { id: "i3", cat: "Investor", t: "Tell an investor the metric in the deck was presented more favorably than it should have been." },
    { id: "u1", cat: "Customer", t: "Tell your biggest customer you are deprecating the feature they rely on." },
    { id: "u2", cat: "Customer", t: "Tell a customer you lost their data." },
    { id: "u3", cat: "Customer", t: "Tell a customer the price is going up 40 percent." },
    { id: "s1", cat: "Self", t: "Say the real reason you started this company, not the one in the deck." },
    { id: "s2", cat: "Self", t: "Say what you are most afraid will happen in the next six months." },
    { id: "s3", cat: "Self", t: "Say the thing about your own performance you would least want the board to know." },
    { id: "s4", cat: "Self", t: "Say what you would do if the company did not exist." }
  ],
  dimensions: ["Hard thing first", "Specificity", "Directness", "Ownership", "Finished the thought", "Cost to the speaker"],
  thresholds: { pass: 15, repeat: 10 },
  hedges: ["i think", "kind of", "sort of", "maybe", "a bit", "probably", "to be honest", "i guess", "we'll see", "hopefully", "it's possible that", "it is possible that", "a little", "you know"]
};
