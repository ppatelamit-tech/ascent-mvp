/* Vision block — see clearly. The Hawk.
   Illusion is the wish mistaken for the forecast. Vision separates them with four mechanics:
   a prediction journal with calibration, attacking the thesis (the model builds the counter-case; it never advises),
   base-rate cards (guess first, then the number), and a narrative audit (which claims in your story are evidence, inference, or wish).
   Base rates are named to their source and rounded; some are decades old. Draft content for Dr. Patel to correct. */
window.ASCENT_VISION = {
  intro: "Founders are paid to believe. The cost is that belief feels like knowledge. Vision keeps a ledger of what you predicted against what happened, attacks your own thesis before the market does, and checks your numbers against the base rates.",
  predict: {
    intro: "Write a prediction you can check. A date, a number, a yes or no. Say how sure you are. When the date comes, mark it. After twenty, your calibration appears: when you say 80%, how often are you right?",
    confidences: [55, 65, 75, 85, 95],
    placeholder: "e.g. We close the Acme contract by 15 Nov. · MRR is above 40k on 1 Jan. · The hire accepts.",
    resolveLine: "Did it happen? Honest counts. The ledger is for you.",
    bands: [{ min: 0, name: "Overconfident", note: "When you say 85, you are right well under 85% of the time. Your numbers are wishes with decimals. Lower them, or widen the question." }, { min: -0.08, name: "Roughly calibrated", note: "Your confidence tracks your hit rate. Rare. Keep the ledger going." }, { min: 0.08, name: "Underconfident", note: "You are right more often than you say. You know more than you let yourself claim." }]
  },
  attack: {
    intro: "Write the thesis you are betting the company on, in one or two sentences. The model will build the strongest case against it: three counters, the base rate that applies, the best version of your own argument, and the one question that would settle it. It does not advise. It argues.",
    placeholder: "e.g. Mid-market logistics firms will pay for AI dispatching because their margin problem is driver idle time, and nobody serves them.",
    offline: {
      counters: ["Who else has tried to sell this buyer this thing, and why did it not take?", "If the problem is as painful as you say, what is the buyer doing about it today, and why is that not enough?", "What has to be true about the buyer's budget, timing and authority for this to close in under six months?"],
      base_rate: "Most startups that fail cite no market need as the reason. Assume your buyer does not want this until twelve of them have told you otherwise in their own words.",
      steelman: "The strongest version of your thesis is the one with a named buyer, a named budget line, and a reason now.",
      test: "Name the single cheapest thing you could learn this month that would make you abandon the thesis if it came back wrong."
    }
  },
  cards: {
    intro: "A question, your guess, then the number and where it comes from. The gap between your guess and the base rate is your illusion, measured. Numbers are rounded and some are old; the sources are named so you can check.",
    guessLine: "Your guess first. Then the number.",
    items: [
      { id: "c1", q: "Of new US businesses, what share are still operating five years on?", unit: "%", rate: 50, src: "US Bureau of Labor Statistics, Business Employment Dynamics (long-run average)", note: "About half. The other half close, quietly, mostly without a post-mortem." },
      { id: "c2", q: "Of venture-backed startups, what share fail to return investors' capital?", unit: "%", rate: 75, src: "Shikhar Ghosh, Harvard Business School, analysis of ~2,000 VC-backed companies (reported 2012)", note: "Roughly three in four. The famous returns come from the other quarter." },
      { id: "c3", q: "Entrepreneurs asked their own odds of success: what share put them at 70% or better?", unit: "%", rate: 81, src: "Cooper, Woo & Dunkelberg, Journal of Business Venturing, 1988", note: "81%, and a third said 100%. Against a five-year survival rate near half." },
      { id: "c4", q: "Students estimating when they would finish their thesis: what share finished by their own 'realistic' date?", unit: "%", rate: 30, src: "Buehler, Griffin & Ross, 1994 (the planning fallacy)", note: "Under a third. Their 'worst case' estimates were closer to the truth than their realistic ones." },
      { id: "c5", q: "Of large infrastructure projects, what share run over budget?", unit: "%", rate: 90, src: "Bent Flyvbjerg, Oxford Saïd, megaproject database", note: "About nine in ten. Your roadmap is a small megaproject." },
      { id: "c6", q: "In startup post-mortems, what share name 'no market need' as a cause of failure?", unit: "%", rate: 35, src: "CB Insights, startup post-mortem analyses (2014–2021), range roughly 35–42%", note: "The most common cause, year after year. Not funding, not team. Nobody wanted it." },
      { id: "c7", q: "Of startups in one large analysis, what share were found to have scaled prematurely (spend ahead of product-market fit)?", unit: "%", rate: 70, src: "Startup Genome, 2011 report", note: "About seven in ten. Premature scaling was the most common failure pattern they found." },
      { id: "c8", q: "Of seed-funded startups, what share go on to raise a second round?", unit: "%", rate: 48, src: "CB Insights venture funnel analysis (2008–2010 cohort)", note: "A bit under half. Roughly one in seven reached a fourth round." },
      { id: "c9", q: "Companies that go public: how old are they, at the median, when they do?", unit: "years", rate: 11, src: "Jay Ritter, University of Florida, IPO statistics (recent decades)", note: "Over a decade. 'Exit in five years' is a wish with a date." },
      { id: "c10", q: "When people give a 98% confidence interval, how often does the truth fall outside it?", unit: "%", rate: 40, src: "Alpert & Raiffa, 1982, in Judgment Under Uncertainty", note: "Around 40%, against the 2% it should be. Overconfidence is the default setting, not a personal flaw." },
      { id: "c11", q: "Founders whose previous company succeeded: what share succeed again? (First-timers run about 20%.)", unit: "%", rate: 30, src: "Gompers, Kovner, Lerner & Scharfstein, Journal of Financial Economics, 2010", note: "About 30%, against roughly 20% for first-timers and those who failed before. Experience helps, less than the story says." },
      { id: "c12", q: "Of startups in one analysis, those that pivoted once or twice raised how many times more money than those that pivoted never or three-plus times?", unit: "x", rate: 2.5, src: "Startup Genome, 2011 report", note: "About 2.5x, with 3.6x better user growth. Change course, but not constantly." }
    ]
  },
  audit: {
    intro: "Write the story you tell about the company, the one you give investors or your partner. Then pull out its three load-bearing claims and mark each: evidence (something happened), inference (follows from evidence), or wish (you want it to be true). A story standing on wishes is an illusion, however well told.",
    storyPlaceholder: "The story, as you tell it. Three or four sentences.",
    claimPlaceholder: "A claim the story cannot stand without",
    kinds: [["evidence", "Evidence", "It happened. You can point at it."], ["inference", "Inference", "It follows from something that happened."], ["wish", "Wish", "You want it. Nothing yet says so."]],
    verdict: { 0: "Three wishes. The story is a pitch, not a forecast. Keep telling it to investors; stop telling it to yourself.", 1: "One claim with evidence. Find the test that turns a wish into an inference this month.", 2: "Two claims grounded. The third is where the company is actually exposed.", 3: "All three grounded. Rare. Check again in a quarter; stories drift." }
  }
};
