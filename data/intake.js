/* Intake — the backend profile and the character derived from it. Nothing here names a construct to the founder.
   Blocks: A threat/reward (BIS/BAS, Carver & White 1994, public domain), B Big Five (IPIP-style, three per trait),
   C needs as forced-choice pairs, V vignettes (second asking of the needs), R risk, D regulatory focus, E time orientation,
   F interoception (after MAIA-2), G chronotype (after rMEQ), H context. Styles (Explorer/Builder/Director/Negotiator) are derived, never asked.
   Design doc: "Ascent Profile v2 — character system design" (Status 27). Draft items for Dr. Patel to edit. */
window.ASCENT_INTAKE = {
  minutes: 12, coreMinutes: 6, // 92 items: a required core of 47 (class, fear, hunger), then 45 that forge the weapon and stats, resumable
  intro: "Six minutes now, six more whenever you like. Lives to choose between and a few plain questions, no right answers. The first half gives you a class; the second forges your weapon and stats. Not who you are: the build you are running.",
  likert: [["1", "Very false for me"], ["2", "Somewhat false for me"], ["3", "Somewhat true for me"], ["4", "Very true for me"]],
  items: [
    // ---- A. BIS/BAS ----
    { id: "A1", block: "A", scale: "bis", t: "If I think something unpleasant is going to happen, I usually get pretty worked up." },
    { id: "A2", block: "A", scale: "bis", t: "I worry about making mistakes." },
    { id: "A3", block: "A", scale: "bis", t: "Criticism hurts me quite a bit." },
    { id: "A4", block: "A", scale: "bis", t: "I get worried or upset when I think someone is angry with me." },
    { id: "A5", block: "A", scale: "bis", rev: true, t: "Even when something bad is about to happen, I rarely feel afraid or nervous." },
    { id: "A6", block: "A", scale: "bis", t: "I feel worried when I think I have done poorly at something important." },
    { id: "A7", block: "A", scale: "bis", rev: true, t: "I have fewer fears than most people I know." },
    { id: "A8", block: "A", scale: "basR", t: "When I get something I want, I feel excited and energized." },
    { id: "A9", block: "A", scale: "basR", t: "When I'm doing well at something, I love to keep at it." },
    { id: "A10", block: "A", scale: "basR", t: "When good things happen to me, I feel it strongly." },
    { id: "A11", block: "A", scale: "basR", t: "Winning a competition would excite me." },
    { id: "A12", block: "A", scale: "basR", t: "When I see an opportunity for something I like, I get excited right away." },
    { id: "A13", block: "A", scale: "basD", t: "When I want something, I usually go all out to get it." },
    { id: "A14", block: "A", scale: "basD", t: "I go out of my way to get things I want." },
    { id: "A15", block: "A", scale: "basD", t: "If I see a chance to get something I want, I move on it right away." },
    { id: "A16", block: "A", scale: "basD", t: "When I go after something, I hold nothing back." },
    { id: "A17", block: "A", scale: "basF", t: "I often do things just because they might be fun." },
    { id: "A18", block: "A", scale: "basF", t: "I crave excitement and new sensations." },
    { id: "A19", block: "A", scale: "basF", t: "I will try almost anything new if I think it will be fun." },
    { id: "A20", block: "A", scale: "basF", t: "I often act on the spur of the moment." },
    // ---- B. Big Five ----
    { id: "B1", block: "B", scale: "O", t: "I come up with ideas other people don't." },
    { id: "B2", block: "B", scale: "O", rev: true, t: "Abstract ideas bore me." },
    { id: "B3", block: "B", scale: "O", t: "I enjoy hearing a view that overturns mine." },
    { id: "B4", block: "B", scale: "C", t: "I get things done on the day I said I would." },
    { id: "B5", block: "B", scale: "C", rev: true, t: "I leave my things in a mess." },
    { id: "B6", block: "B", scale: "C", t: "I follow a plan through even when it stops being interesting." },
    { id: "B7", block: "B", scale: "E", t: "I am the one who starts the conversation in a room of strangers." },
    { id: "B8", block: "B", scale: "E", rev: true, t: "I tend to stay in the background." },
    { id: "B9", block: "B", scale: "E", t: "A full day of people leaves me with more energy, not less." },
    { id: "B10", block: "B", scale: "A", t: "I make time for other people." },
    { id: "B11", block: "B", scale: "A", rev: true, t: "I lose interest when people talk about their problems." },
    { id: "B12", block: "B", scale: "A", t: "I assume good intent until shown otherwise." },
    { id: "B13", block: "B", scale: "N", t: "I get stressed out easily." },
    { id: "B14", block: "B", scale: "N", rev: true, t: "I am relaxed most of the time." },
    { id: "B15", block: "B", scale: "N", t: "A bad hour can color my whole day." },
    // ---- C. needs, forced-choice pairs ----
    { id: "C1", block: "C", pair: [["certainty", "Knowing what next month looks like."], ["uncertainty", "A next month that surprises me."]] },
    { id: "C2", block: "C", pair: [["certainty", "Being safe."], ["significance", "Being someone who matters."]] },
    { id: "C3", block: "C", pair: [["certainty", "A steady life."], ["love", "A life full of people I love."]] },
    { id: "C4", block: "C", pair: [["certainty", "Knowing the floor will hold."], ["growth", "Being better this year than last."]] },
    { id: "C5", block: "C", pair: [["certainty", "Protecting what I have."], ["contribution", "Giving to something beyond me."]] },
    { id: "C6", block: "C", pair: [["uncertainty", "A story whose ending I cannot predict."], ["significance", "Recognition for what I have done."]] },
    { id: "C7", block: "C", pair: [["uncertainty", "The thrill of the new."], ["love", "The warmth of people who know me."]] },
    { id: "C8", block: "C", pair: [["uncertainty", "Variety."], ["growth", "Progress."]] },
    { id: "C9", block: "C", pair: [["uncertainty", "An adventure of my own."], ["contribution", "A cause bigger than me."]] },
    { id: "C10", block: "C", pair: [["significance", "Being seen as exceptional."], ["love", "Being deeply known by a few."]] },
    { id: "C11", block: "C", pair: [["significance", "Standing out."], ["growth", "Leveling up."]] },
    { id: "C12", block: "C", pair: [["significance", "My name on the work."], ["contribution", "Other people's lives better because of the work."]] },
    { id: "C13", block: "C", pair: [["love", "Belonging somewhere."], ["growth", "Becoming more than I am."]] },
    { id: "C14", block: "C", pair: [["love", "Being loved."], ["contribution", "Being useful."]] },
    { id: "C15", block: "C", pair: [["growth", "My own growth."], ["contribution", "Other people's growth."]] },
    // ---- V. vignettes ----
    { id: "V1", block: "V", t: "A well-known founder offers you one of these roles. Each pays exactly double what you earn now. Which do you take?", opts: [["certainty", "Run her operations team: a clear brief, no surprises."], ["uncertainty", "Take over a small, shaky company of hers, yours outright."], ["growth", "Be trained by her personally for two years, with a title at the end."], ["contribution", "Lead her foundation's first program."]] },
    { id: "V2", block: "V", t: "Your company is acquired. The money is the same either way. Which ending do you choose?", opts: [["certainty", "A clean exit: paid in full, nothing left to go wrong."], ["significance", "A keynote at the acquirer's conference about how you did it."], ["love", "The team stays together, under you."], ["growth", "A new, harder problem inside the acquirer."]] },
    { id: "V3", block: "V", t: "An investor gives you a year of runway, no strings attached. What do you spend the year on?", opts: [["certainty", "Fixing everything that is fragile."], ["uncertainty", "The three things you were afraid to try."], ["love", "Hiring the people you have wanted beside you."], ["contribution", "Opening the product to customers who cannot pay."]] },
    { id: "V4", block: "V", t: "A journalist writes a profile of you. Which line do you most want in it?", opts: [["certainty", "\"Built something that will still be here in thirty years.\""], ["uncertainty", "\"Nobody saw it coming, including the founder.\""], ["significance", "\"The best in the category.\""], ["love", "\"Everyone who worked there would do it again.\""]] },
    { id: "V5", block: "V", t: "You have the same job offer in several cities. Which city do you choose?", opts: [["love", "The one where your oldest friends live."], ["uncertainty", "The one where you know nobody."], ["growth", "The one with the strongest people in your field."], ["contribution", "The one where you grew up and could give something back."]] },
    { id: "V6", block: "V", t: "For a year, you get one afternoon a week with no obligations. How do you spend it?", opts: [["certainty", "The same walk and the same café, every week."], ["uncertainty", "Somewhere different each week, unplanned."], ["growth", "Lessons in a skill you are bad at."], ["contribution", "Mentoring someone two steps behind you."]] },
    { id: "V7", block: "V", t: "A rival founder fails publicly. What is your first honest reaction?", opts: [["certainty", "Relief that it was not you."], ["growth", "Curiosity about what went wrong."], ["significance", "Quiet satisfaction that you are now ahead."], ["love", "Wanting to call and check on them."]] },
    { id: "V8", block: "V", t: "You are offered a seat on one board. Which do you take?", opts: [["certainty", "The one most likely to still exist in a decade."], ["uncertainty", "The one whose future nobody can predict."], ["significance", "The one whose name opens doors."], ["contribution", "The one doing the most good per dollar."]] },
    { id: "V9", block: "V", t: "Your co-founder leaves. What hurts most?", opts: [["certainty", "Not knowing what happens to the plan."], ["love", "Losing the person."], ["significance", "What people will say."], ["growth", "Losing the one who pushed you."]] },
    { id: "V10", block: "V", t: "Ten years on, the company worked. What would make you say it was worth it?", opts: [["certainty", "It was never close to dying."], ["uncertainty", "It surprised you every year."], ["significance", "Your name is on it."], ["love", "The people are still in your life."], ["growth", "You are not the person you were when you started."], ["contribution", "Something outside the company is better because of it."]] },
    // ---- R. risk ----
    { id: "R1", block: "R", scale: "risk", t: "You can take $100,000 now, or flip a coin: heads you get $1,000,000, tails you get nothing. Which do you choose?", opts: [[0, "The $100,000"], [1, "The coin flip"]] },
    { id: "R4", block: "R", scale: "loss", t: "You are offered a deal with a 90% chance of doubling the value of your company and a 10% chance of ending it. Do you take it?", opts: [[0, "Pass"], [1, "Take it"]] },
    // ---- D. regulatory focus ----
    { id: "D1", block: "D", scale: "prom", t: "I think more about what I could gain than what I could lose." },
    { id: "D2", block: "D", scale: "prom", t: "When I start something, I picture the version that goes brilliantly." },
    { id: "D3", block: "D", scale: "prom", t: "A missed opportunity bothers me more than a mistake." },
    { id: "D4", block: "D", scale: "prom", t: "I set goals that would be a stretch even on a good day." },
    { id: "D5", block: "D", scale: "prev", t: "I think more about what could go wrong than what could go right." },
    { id: "D6", block: "D", scale: "prev", t: "Not failing matters more to me than winning big." },
    { id: "D7", block: "D", scale: "prev", t: "I feel most at ease when every obligation is covered." },
    { id: "D8", block: "D", scale: "prev", t: "A mistake stays with me longer than a missed chance." },
    // ---- E. time orientation ----
    { id: "E1", block: "E", scale: "past", t: "I often replay things that happened years ago." },
    { id: "E2", block: "E", scale: "past", t: "Where I come from explains most of who I am." },
    { id: "E3", block: "E", scale: "present", t: "I take each day as it comes." },
    { id: "E4", block: "E", scale: "present", t: "Tomorrow will take care of itself." },
    { id: "E5", block: "E", scale: "future", t: "I make lists of what I need to do and work through them." },
    { id: "E6", block: "E", scale: "future", t: "I give up today's pleasure for where I want to be in five years." },
    // ---- F. interoception ----
    { id: "F1", block: "F", scale: "sense", t: "I notice discomfort in my body before I know what is causing it." },
    { id: "F2", block: "F", scale: "sense", t: "I can tell where in my body tension sits." },
    { id: "F3", block: "F", scale: "sense", t: "I notice changes in my breathing when I am stressed." },
    { id: "F4", block: "F", scale: "sense", t: "I notice when my body is telling me to slow down." },
    { id: "F5", block: "F", scale: "sense", t: "I listen to my body for clues about what to do." },
    { id: "F6", block: "F", scale: "sense", t: "When something is wrong, I feel it physically first." },
    { id: "F7", block: "F", scale: "sense", t: "I can tell the difference between being tired and being sad." },
    // ---- G. chronotype (rMEQ-style; values are the rMEQ points) ----
    { id: "G1", block: "G", scale: "meq", t: "If you had nothing at all to do tomorrow, when would you get up?", opts: [[5, "Before 6:30"], [4, "6:30 to 7:45"], [3, "7:45 to 9:45"], [2, "9:45 to 11:00"], [1, "After 11:00"]] },
    { id: "G2", block: "G", scale: "meq", t: "How alert are you in the first half hour after waking?", opts: [[1, "Not at all alert"], [2, "Slightly alert"], [3, "Fairly alert"], [4, "Very alert"]] },
    { id: "G3", block: "G", scale: "meq", t: "When do you start to feel tired and ready for sleep?", opts: [[5, "Before 9 pm"], [4, "9 to 10:15 pm"], [3, "10:15 pm to 12:45 am"], [2, "12:45 to 2 am"], [1, "After 2 am"]] },
    { id: "G4", block: "G", scale: "meq", t: "At what time of day do you feel your best?", opts: [[5, "5 to 8 am"], [4, "8 to 10 am"], [3, "10 am to 5 pm"], [2, "5 to 10 pm"], [1, "10 pm to 5 am"]] },
    { id: "G5", block: "G", scale: "meq", t: "Are you a morning person or an evening person?", opts: [[6, "Definitely morning"], [4, "More morning than evening"], [2, "More evening than morning"], [0, "Definitely evening"]] },
    // ---- H. context ----
    { id: "H1", block: "H", scale: "ctx", t: "Did you found the company alone or with others?", opts: [["solo", "Alone"], ["co", "With co-founders"]] },
    { id: "H2", block: "H", scale: "ctx", t: "What stage is the company at?", opts: [["pre", "Pre-seed or idea"], ["seed", "Seed"], ["a", "Series A"], ["later", "Later"]] },
    { id: "H3", block: "H", scale: "ctx", t: "How many people are on the team, including you?", opts: [["1", "Just me"], ["2-5", "2 to 5"], ["6-20", "6 to 20"], ["21+", "More than 20"]] },
    { id: "H4", block: "H", scale: "ctx", t: "How many hours do you work in a typical week?", opts: [["<40", "Under 40"], ["40-55", "40 to 55"], ["55-70", "55 to 70"], ["70+", "Over 70"]] }
  ],
  // presentation order is computed at the foot of this file: the core (vignettes, fear/hunger, need pairs, risk) first, then the rest.
  needs: { certainty: "Certainty", uncertainty: "Uncertainty", significance: "Significance", love: "Love", growth: "Growth", contribution: "Contribution" },
  classes: {
    certainty: { name: "Knight", cost: "Holds the line past the point of sense, and calls it duty.", home: ["detachment", "capability"] },
    uncertainty: { name: "Rogue", cost: "Finishes fewer things than it starts, and knows it.", home: ["enjoyment", "capability"] },
    significance: { name: "Paladin", cost: "Proves things to people who stopped watching years ago.", home: ["drive", "communication"] },
    love: { name: "Bard", cost: "Cannot deliver bad news to anyone it likes, which is everyone.", home: ["connection", "enjoyment"] },
    growth: { name: "Wizard", cost: "Never arrives, and treats people as curriculum.", home: ["vision", "capability"] },
    contribution: { name: "Druid", cost: "Disappears into the cause until there is nobody left to tend it.", home: ["connection", "detachment"] }
  },
  styles: {
    explorer: { name: "Daggers", move: "Fast, close, and never bored; many small cuts." },
    builder: { name: "Hammer", move: "Slow, heavy, and cumulative; builds by accumulation." },
    director: { name: "Spear", move: "One long thrust; reach and commitment over range." },
    negotiator: { name: "Bow", move: "Distance and patience; wins through other people, over time." }
  },
  epithets: {
    certainty: { explorer: "The Errant", builder: "The Castellan", director: "The Lancer", negotiator: "The Warden" },
    uncertainty: { explorer: "The Cutpurse", builder: "The Sapper", director: "The Raider", negotiator: "The Smuggler" },
    significance: { explorer: "The Duelist", builder: "The Templar", director: "The Champion", negotiator: "The Standard-bearer" },
    love: { explorer: "The Trickster", builder: "The Innkeeper", director: "The Herald", negotiator: "The Harper" },
    growth: { explorer: "The Alchemist", builder: "The Artificer", director: "The Seer", negotiator: "The Sage" },
    contribution: { explorer: "The Forager", builder: "The Gardener", director: "The Shepherd", negotiator: "The Grovekeeper" }
  },
  explain: {
    fear: { Low: "Threat barely registers until it is close. Good under fire; the risk is not bracing when you should.", Mid: "Threat registers and passes. The ordinary range.", High: "Threat registers early and stays. You see the cliff before anyone; the cost is a body that treats a board meeting like a predator." },
    hunger: { Low: "Wanting is quiet. You can leave a reward on the table; the risk is leaving the table.", Mid: "Wanting shows up when something is worth it. The ordinary range.", High: "Wanting is loud. You move on opportunity fast and feel every win; the cost is the phone being louder than the plan." },
    stats: { O: "Curiosity: appetite for new ideas and views that overturn yours.", C: "Order: finishing what you said you would, on the day you said.", E: "Spark: energy from rooms full of people, and starting the conversation.", A: "Warmth: assuming good intent and making time for others.", S: "Steadiness: how long a bad hour stays with you. Higher is steadier." },
    stance: { vanguard: "You play to win: gains loom larger than losses, and a missed chance stings more than a mistake. Goals should be framed as reaching, and the Vision ledger keeps the reach honest.", steady: "You weigh wins and losses about evenly. Goals can be framed either way.", warden: "You play not to lose: a mistake stays with you longer than a missed chance. Goals should be framed as protecting what matters, and Capability trains the reaching." },
    horizon: { past: "Your attention lives behind you: what happened explains what is. Useful memory, heavy to carry. Vision and Recovery pull the weight forward.", present: "Your attention lives in the day in front of you. Easy to be with; hard to plan with. Drive's cadence and Vision's check dates give it reach.", future: "Your attention lives ahead: lists, five-year shapes, today traded for later. Powerful and tiring. Enjoyment and the rituals bring you back into the room." },
    senses: { dim: "You read your body late, or not at all: you learn you were stressed from what you did. Body-first rituals come before verbal ones.", fair: "You read your body when you stop to check. The ordinary range.", keen: "You read your body early and in detail. An early-warning system; the Cleansing and Threshold rituals land fast for you." },
    hour: { morning: "Your best hours are early. The Guide will put the hard thing before noon.", day: "Your best hours sit in the middle of the day.", evening: "Your best hours come late. The Guide will not ask for the hard thing at eight in the morning." },
    latent: "Your second class and second weapon, greyed because they are near but untrained. One pick in three draws from them until they take color. Then the roads open."
  },
  stats: [["O", "Curiosity"], ["C", "Order"], ["E", "Spark"], ["A", "Warmth"], ["S", "Steadiness"]],
  words: { stance: { vanguard: "Vanguard", steady: "Steady", warden: "Rearguard" }, horizon: { past: "Behind", present: "Here", future: "Ahead" }, senses: { keen: "Keen", fair: "Fair", dim: "Dim" }, hour: { morning: "Morning", day: "Day", evening: "Evening" } },
  // trait signatures: target values (0–100) on the dimensions each class/weapon is made of. Used by the gap algorithm.
  signatures: {
    classes: { certainty: { prev: 70, C: 70, basF: 40 }, uncertainty: { basF: 75, O: 70, prom: 70 }, significance: { basD: 75, E: 65, A: 40 }, love: { A: 75, E: 60 }, growth: { O: 75, future: 70, C: 60 }, contribution: { A: 70, future: 65 } },
    styles: { explorer: { O: 75, basF: 75 }, builder: { C: 75, prev: 65 }, director: { basD: 75, A: 40, future: 70, prom: 65 }, negotiator: { A: 75, O: 60 } }
  },
  gapMoves: {
    bis: { down: "Fear down: Capability challenges, the Threshold ritual, and body work for the senses.", ids: ["capability", "rec:threshold", "rec:cleansing"] },
    basF: { down: "Spark into finishing: Drive cadence, the Foundations Add, one delegation held for its term.", up: "More play: Enjoyment adventures, Drive feed logged as toward.", ids: ["drive:feed", "detachment:delegate", "enj:"] },
    basD: { up: "More drive: Drive feed, Capability stretch challenges.", down: "Less push: Connection Perform on the Elevators, Receive it after wins.", ids: ["drive:feed", "capability", "connection:perform"] },
    O: { up: "Curiosity: Vision base-rate cards, attack the thesis.", down: "Fewer new things: Drive goal audit, Detachment delegation.", ids: ["vision:card", "vision:attack", "drive:goals"] },
    C: { up: "Order: same wake time, Drive cadence, a delegation held for its full term.", down: "Looser grip: Enjoyment adventures, Detachment absence.", ids: ["drive:feed", "detachment:delegate", "checkin"] },
    E: { up: "Spark: Communication sets, Connection Perform.", down: "Quieter: Calm adventures, Shut the shop.", ids: ["communication", "connection:perform"] },
    A: { up: "Warmth: Connection Perform on the Elevators, Four lines.", down: "Edge: Connection Perform on Reality Tester and Strict Enforcer, Communication sets.", ids: ["connection:perform", "rec:hooponopono", "communication"] },
    prev: { up: "Caution that is data, not dread: the prediction ledger, base-rate cards, Review and close.", down: "Less bracing: Capability challenges, Vision attack the thesis.", ids: ["vision:predict", "vision:card", "rec:review-close"] },
    prom: { up: "Playing to win: Drive goal rewrite, Capability stretch.", down: "Playing not to lose, on purpose: prediction ledger with check dates.", ids: ["drive:goals", "capability", "vision:predict"] },
    future: { up: "Horizon ahead: narrative audit, the succession letter.", down: "Horizon here: Enjoyment adventures, Receive it.", ids: ["vision:audit", "detachment:letter"] },
    sense: { up: "Senses: Cleansing ritual, Calm adventures.", ids: ["rec:cleansing", "enj:"] }
  },
  roads: {
    intro: "Seven days closed. Three roads from here. Most builds should take the first; the sheet moves most when the need you already have stops costing you.",
    proving: "Who are you proving this to?",
    provingOpts: [["person", "A person"], ["group", "A group"], ["younger", "A younger me"], ["nobody", "Nobody. I am tired of living like this."]],
    routed: "Then the road is Mastery, and the proving goes to the goal audit. The other road stays on the shelf, not locked; it is offered again at the next review.",
    open: "Then the road is open. The sheet changes only when the numbers do: retested every four weeks, a quarter at least.",
    master: "Same build, higher level. The work is meeting the need you have in a way that stops costing you."
  }
};
(function (I) {
  const ids = b => I.items.filter(i => i.block === b).map(i => i.id);
  const weave = (...ls) => { const o = []; for (let k = 0; ls.some(l => k < l.length); k++) ls.forEach(l => { if (k < l.length) o.push(l[k]); }); return o; };
  const core = weave(ids("V"), ids("A"), ids("C"), ids("R"));
  const rest = weave(ids("B"), ids("D"), ids("E"), ids("F")).concat(ids("G"), ids("H"));
  I.order = core.concat(rest); I.coreCount = core.length;
})(window.ASCENT_INTAKE);
