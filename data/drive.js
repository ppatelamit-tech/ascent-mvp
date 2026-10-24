/* Drive block — define the self, then feed it. The Hound.
   Shame says: I am what I prove. Drive says: I am what I value, and I feed it on schedule.
   Three mechanics: a forced-choice values sort down to five (defined in your own words, one behaviour each),
   a goal audit (which value does this serve, and who am I proving it to), and a weekly cadence (feed one value a day, with a motivation check).
   Scoreboard: the gap between what you say you value and what you fed. Draft content for Dr. Patel to correct. */
window.ASCENT_DRIVE = {
  intro: "Most founder goals are proofs: to a parent, an ex-boss, a cohort, a younger self. Proofs run on shame and they never finish. Drive rebuilds motivation on values you chose, then feeds them daily, and keeps the score honest.",
  values: [
    { id: "craft", name: "Craft", hint: "Doing the thing well for its own sake." },
    { id: "freedom", name: "Freedom", hint: "Choosing your hours, your work, your place." },
    { id: "family", name: "Family", hint: "The people who were there before the company." },
    { id: "health", name: "Health", hint: "A body that works for decades." },
    { id: "learning", name: "Learning", hint: "Knowing more this year than last." },
    { id: "wealth", name: "Wealth", hint: "Money as security, options, or score." },
    { id: "recognition", name: "Recognition", hint: "Being seen and credited." },
    { id: "service", name: "Service", hint: "Making someone's life better, measurably." },
    { id: "honesty", name: "Honesty", hint: "Saying what is true at some cost." },
    { id: "loyalty", name: "Loyalty", hint: "Staying when leaving is easier." },
    { id: "adventure", name: "Adventure", hint: "Not knowing how it ends." },
    { id: "order", name: "Order", hint: "Systems that run without you watching." },
    { id: "creativity", name: "Creativity", hint: "Making a thing that did not exist." },
    { id: "influence", name: "Influence", hint: "Changing what others decide." },
    { id: "fairness", name: "Fairness", hint: "Everyone gets what they are owed." },
    { id: "beauty", name: "Beauty", hint: "Things that are good to look at and use." },
    { id: "community", name: "Community", hint: "A room full of people who know your name." },
    { id: "meaning", name: "Meaning", hint: "Being part of something larger than the quarter." },
    { id: "security", name: "Security", hint: "Knowing the floor will hold." },
    { id: "play", name: "Play", hint: "Doing things for no reason." },
    { id: "excellence", name: "Excellence", hint: "Being among the best at it." },
    { id: "independence", name: "Independence", hint: "Owing nobody an explanation." },
    { id: "legacy", name: "Legacy", hint: "Something that outlasts you." },
    { id: "courage", name: "Courage", hint: "Acting while afraid." }
  ],
  sort: {
    rounds: [12, 7, 5],
    intro: "Twenty-four values. Keep twelve. Then seven. Then five. Forced choice: letting one go is the point, and it will hurt a little. The five that survive are the ones you will feed.",
    roundLines: ["Keep twelve. Let the rest go.", "Keep seven. This round costs something.", "Keep five. These are the ones."],
    definePrompt: "In your own words, one sentence: what does this mean to you? Not the dictionary. Yours.",
    behaviorPrompt: "One behaviour that feeds it. Something you could do this week, small enough to actually do.",
    behaviorPlaceholder: "e.g. an hour of the real work before email, a call to my brother, a run"
  },
  audit: {
    intro: "List the goals you are actually running on. Then, for each: which of your five does it serve, and who are you proving it to? A goal with a 'proving' answer and no value behind it is shame wearing a plan.",
    servesPrompt: "Which of your five does this serve?",
    provingPrompt: "Who am I proving this to?",
    provingPlaceholder: "a person, a group, a younger self, or nobody",
    verdicts: [["keep", "Keep", "Serves a value. Proving is a side effect, not the engine."], ["rewrite", "Rewrite", "The value is real; the goal is shaped by someone else's eyes. Write it again, smaller or truer."], ["drop", "Drop", "No value behind it. Only a proof. Let it go."]],
    rewritePlaceholder: "The same goal, written so it serves the value and not the audience."
  },
  feed: {
    intro: "One value a day. Do its behaviour. Then the only question that matters: were you moving toward it, or proving something?",
    motivation: [["toward", "Toward it", "The thing itself was the point."], ["prove", "To prove", "Someone was watching, in the room or in your head."], ["both", "Both", "Started as a proof, became the thing. That is allowed."]],
    notePlaceholder: "What you did, in a line."
  },
  score: { window: 14, intro: "Fourteen days. Each of your five, and how many days you fed it. The gap is the values with zero. Shame hides in the gap: these are the values you claim and starve." }
};
