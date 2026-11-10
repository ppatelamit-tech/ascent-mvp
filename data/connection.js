/* Connection block — read and manage status. The Elephant.
   Source: Dr. Patel's Status 27 table (provider → patient), translated here founder → counterpart.
   Three axes: where you stand relative to them (High / Neutral / Low), where they start (Low / Neutral / High), and which way you move them (raise / hold / lower).
   27 enactments, nine clusters, four valences. Levers are the replacement moves that let you hand off power without losing it.
   Three exercise types: Perform (60 s, a target enactment, graded), Read (name what someone else is doing), Replace (catch a harmful one, name what replaces it).
   Grief lives here: every healthy hand-off is a small loss of leverage. Draft content for Dr. Patel to correct. */
window.ASCENT_CONNECTION = {
  intro: "Every conversation moves someone's standing: up, down, or held. Founders do this all day, mostly by accident. The 27 enactments are the full set of moves. Train the ones you never reach for; catch the ones that cost you trust.",
  axes: {
    you: { H: "You stand above them", N: "You stand level", L: "You stand below them" },
    other: { L: "they are low", N: "they are level", H: "they are high" },
    shift: { raise: "raise them", hold: "hold them", lower: "lower them" }
  },
  levers: [
    { id: "contract", name: "Explicit agreement", line: "Say what each of you will do, by when. Power moves without being lost." },
    { id: "alliance", name: "Shared stake", line: "Make the outcome theirs as well as yours. 'We' with a specific object." },
    { id: "evidence", name: "Data", line: "A number, a trial, a result. Status set by what happened, not by who said so." },
    { id: "consultation", name: "Asking their view", line: "Ask before telling. Their standing rises on the question alone." },
    { id: "narrative", name: "The story", line: "Name the arc: where this started, where it goes. People climb a story." },
    { id: "environment", name: "The room", line: "Change who is in it, where it is, who speaks first. Status is set by the setting." },
    { id: "policy", name: "The rule", line: "The limit is the rule's, not yours. Use only for safety, harm, or imminent risk." },
    { id: "none", name: "None", line: "There is no lever here. The move itself is the problem." }
  ],
  valences: { Healing: "Builds them and keeps trust.", Neutral: "Holds; fine briefly, stalls if it lasts.", Risky: "Can work; costs you leverage fast or courts enmeshment.", Harmful: "Damages trust. Spot it and replace it." },
  // ---------- the 27 ----------
  enactments: [
    // You high
    { n: 1, id: "expert-elevator", name: "Expert Elevator", you: "H", other: "L", shift: "raise", valence: "Healing", levers: ["contract", "evidence"], note: "Use authority to teach the skill, then hand power back.", founder: "Your report missed; you show them the method, then give them the next one to own." },
    { n: 2, id: "power-mentor", name: "Power Mentor", you: "H", other: "L", shift: "raise", toHigh: true, valence: "Risky", levers: ["alliance", "consultation"], note: "Inspiring; you lose leverage fast. Set milestones and release authority on purpose.", founder: "You anoint a junior as the future. Fine if you name the milestones; a mess if you just crown them." },
    { n: 3, id: "static-commander", name: "Static Commander", you: "H", other: "L", shift: "hold", valence: "Harmful", levers: ["policy"], note: "Control without growth entrenches dependency and shame.", founder: "Every decision still runs through you, a year in. They stay small because you need them to." },
    { n: 4, id: "champion-advocate", name: "Champion Advocate", you: "H", other: "N", shift: "raise", valence: "Healing", levers: ["consultation", "alliance"], note: "Public endorsement lifts them. Shift to consultant once they pass you.", founder: "In front of the team: 'Priya owns this now; ask her, not me.' Then actually ask her." },
    { n: 5, id: "detached-authority", name: "Detached Authority", you: "H", other: "N", shift: "hold", valence: "Neutral", levers: ["evidence"], note: "Order is kept, growth stalls. Brief goals stop the drift.", founder: "Weekly one-to-ones that review numbers and change nothing. Safe, and nobody is growing." },
    { n: 6, id: "strict-enforcer", name: "Strict Enforcer", you: "H", other: "N", shift: "lower", valence: "Risky", levers: ["policy"], note: "Leverage rises. Only for safety, harm, or imminent risk. Frame it cleanly.", founder: "Someone shipped customer data to a personal inbox. The rule speaks, not your temper. Rare, clean, finished." },
    { n: 7, id: "affirming-ally", name: "Affirming Ally", you: "H", other: "H", shift: "hold", valence: "Healing", levers: ["consultation"], note: "Treat them as a high-functioning partner. Keep goals explicit.", founder: "Your strongest lead is flying. You stay out of the way and keep the goal written down." },
    { n: 8, id: "reality-tester", name: "Reality Tester", you: "H", other: "H", shift: "lower", valence: "Healing", levers: ["evidence", "contract"], note: "Gentle deflation of grandiosity with data and trials.", founder: "'Great. Let's run it on fifty accounts for two weeks and look.' The number lowers them, not you." },
    { n: 9, id: "confidence-crusher", name: "Confidence Crusher", you: "H", other: "H", shift: "lower", valence: "Harmful", levers: ["none"], note: "Humiliation damages alliance and outcomes.", founder: "Taking a confident person apart in front of others because they were confident. Nobody recovers from watching it." },
    // You level
    { n: 10, id: "motivational-coach", name: "Motivational Coach", you: "N", other: "L", shift: "raise", valence: "Healing", levers: ["contract", "alliance"], note: "Small wins, skill rehearsal, shared metrics.", founder: "A peer is down after a lost deal. One small, winnable thing this week, and you track it together." },
    { n: 11, id: "supportive-booster", name: "Supportive Booster", you: "N", other: "L", shift: "raise", toHigh: true, valence: "Healing", levers: ["alliance", "consultation"], note: "Celebrate independence. Ask permission before advice.", founder: "'Want my read, or do you want to run with yours?' Then honor the answer." },
    { n: 12, id: "passive-bystander", name: "Passive Bystander", you: "N", other: "L", shift: "hold", valence: "Harmful", levers: ["none"], note: "Warmth without work keeps them stuck.", founder: "Endless sympathy for a co-founder who is drowning, and never the hard conversation." },
    { n: 13, id: "good-friend", name: "The Good Friend", you: "N", other: "N", shift: "raise", valence: "Healing", levers: ["alliance", "contract"], note: "Strengths focus with stretch goals. Name the hand-off when leverage drops.", founder: "Your co-founder is good at this. You say so, set the stretch, and name the day it becomes theirs." },
    { n: 14, id: "steady-companion", name: "Steady Companion", you: "N", other: "N", shift: "hold", valence: "Neutral", levers: ["contract"], note: "Stabilising in a crisis. Reassess often to avoid stagnation.", founder: "During the bridge round you just stand next to them. Right for a month. Wrong for a year." },
    { n: 15, id: "critical-peer", name: "Critical Peer", you: "N", other: "N", shift: "lower", valence: "Harmful", levers: ["none"], note: "Undercuts status without authority. Breeds resentment.", founder: "Sniping at a peer's plan in the channel. You have no standing to lower them, so it reads as attack." },
    { n: 16, id: "egalitarian-supporter", name: "Egalitarian Supporter", you: "N", other: "H", shift: "hold", valence: "Healing", levers: ["consultation"], note: "Normalise success, spot overreach, protect autonomy.", founder: "A peer founder is winning. You treat it as normal, ask how, and say the one thing that looks like overreach." },
    { n: 17, id: "grounding-partner", name: "Grounding Partner", you: "N", other: "H", shift: "lower", valence: "Healing", levers: ["evidence"], note: "Reality-testing with collaborative experiments.", founder: "'Your forecast says 3x. What would we see by March if that's right? Let's check then.'" },
    { n: 18, id: "jealous-peer", name: "Jealous Peer", you: "N", other: "H", shift: "lower", valence: "Harmful", levers: ["none"], note: "Covert competition, sniping, moralising.", founder: "'Must be nice to have that network.' Said as a joke. Heard as what it is." },
    // You low
    { n: 19, id: "co-struggler", name: "Co-Struggler", you: "L", other: "L", shift: "raise", valence: "Risky", levers: ["alliance", "contract"], note: "Solidarity mobilises effort. Guard against enmeshment.", founder: "'We're both in the hole; let's climb.' Works if there is a plan. Becomes a pact of misery if not." },
    { n: 20, id: "underdog-riser", name: "Underdog Riser", you: "L", other: "L", shift: "raise", toHigh: true, valence: "Risky", levers: ["alliance", "environment"], note: "Model resilience. Celebrate them owning the process.", founder: "You've both been counted out. You show them how you get up, and make the win theirs." },
    { n: 21, id: "hopeless-ally", name: "Hopeless Ally", you: "L", other: "L", shift: "hold", valence: "Harmful", levers: ["none"], note: "Shared discouragement reinforces defeat.", founder: "Two founders at a bar agreeing the market is rigged. Comforting for an hour, corrosive for a quarter." },
    { n: 22, id: "underdog-inspirer", name: "Underdog Inspirer", you: "L", other: "N", shift: "raise", valence: "Healing", levers: ["narrative", "environment"], note: "They outgrow the frame. You pivot to facilitator.", founder: "You're the scrappy one; they're steady. You tell the story of where this goes and build the room for them to lead it." },
    { n: 23, id: "ineffective-advocate", name: "Ineffective Advocate", you: "L", other: "N", shift: "hold", valence: "Neutral", levers: ["contract"], note: "Good intentions without traction. Tighten goals or escalate.", founder: "You keep 'supporting' a peer and nothing moves. Either name a goal or admit you are not the help they need." },
    { n: 24, id: "sabotaging-underdog", name: "Sabotaging Underdog", you: "L", other: "N", shift: "lower", valence: "Harmful", levers: ["none"], note: "Pulling down to match your own status.", founder: "You're behind, so you find reasons their plan won't work. Not because it won't." },
    { n: 25, id: "respectful-learner", name: "Respectful Learner", you: "L", other: "H", shift: "hold", valence: "Healing", levers: ["consultation"], note: "Ask, reflect, learn. Useful with experts.", founder: "The investor is wrong on a fact. You bring it as a question with the data attached. Their standing holds; the fact lands." },
    { n: 26, id: "equalizing-pull", name: "Equalizing Pull", you: "L", other: "H", shift: "lower", valence: "Harmful", levers: ["none"], note: "Looks like reality-checking, reads as envy.", founder: "'Reality-checking' someone above you. Everyone in the room can tell what it is." },
    { n: 27, id: "envious-diminisher", name: "Envious Diminisher", you: "L", other: "H", shift: "lower", valence: "Harmful", levers: ["none"], note: "Status attack from below. Damages trust quickly.", founder: "A rival raised a huge round. You post the tweet. It costs you more than them, and it costs you fast." }
  ],
  // ---------- nine clusters ----------
  clusters: [
    { id: "auth-elev", name: "Authority Elevators", members: [1, 2, 4], line: "Start high, lift them, hand off power on purpose. Works when goals are concrete and the hand-off is said aloud." },
    { id: "auth-stab", name: "Authority Stabilizers", members: [3, 5, 7], line: "Hold the line. Steady (7) or stifling (3). Brief outcome metrics stop the drift." },
    { id: "auth-dim", name: "Authority Diminishers", members: [6, 8, 9], line: "Lower them to contain risk or correct grandiosity. Frame limits cleanly; never slide into 9." },
    { id: "peer-elev", name: "Peer Elevators", members: [10, 11, 13], line: "Stand beside them, set small wins, celebrate gains. As your leverage fades, shift to partner language." },
    { id: "peer-stab", name: "Peer Stabilizers", members: [12, 14, 16], line: "Hold ground. 14 and 16 calm; 12 drifts unless goals are revisited." },
    { id: "peer-dim", name: "Peer Diminishers", members: [15, 17, 18], line: "17 lowers gently with data. 15 and 18 erode trust and should be dropped." },
    { id: "under-elev", name: "Underdog Elevators", members: [19, 20, 22], line: "'We rise together.' Good with authority-averse people. Guard against enmeshment; mark where they outgrow you." },
    { id: "under-stab", name: "Underdog Stabilizers", members: [21, 23, 25], line: "Constructive humility (25) or mutual stagnation (21, 23). Re-evaluate fast if nothing moves." },
    { id: "under-dim", name: "Underdog Diminishers", members: [24, 26, 27], line: "Your insecurity drags them down. Spot it early and replace it, or step back from the relationship." }
  ],
  neutralizers: { up: [1, 10, 19], down: [8, 17, 26], line: "Centring moves. Up to level, or down to level. Lock the new equilibrium with an explicit agreement or a shared experiment." },
  // ---------- baseline: nine scenarios, three responses each, mapped to clusters ----------
  baseline: {
    intro: "Nine situations. Pick the thing you would actually say, not the thing you should. The result is which clusters you reach for and which you never touch.",
    items: [
      { t: "A report you manage has missed a deadline for the second time and looks defeated.", opts: [["I'll take it from here; send me what you have.", "auth-stab"], ["Walk me through where it stalled. Then you'll run the next one with the method we work out now.", "auth-elev"], ["This can't keep happening. Fix it by Friday.", "auth-dim"]] },
      { t: "Your co-founder is talking about 10x growth next year with no data.", opts: [["Love it. Let's go.", "peer-stab"], ["What would we see by March if that's right? Let's check then.", "peer-dim"], ["Come on. Be serious.", "peer-dim-harm"]] },
      { t: "A peer founder just closed a round three times the size of yours.", opts: [["Congrats. How did the process go? What surprised you?", "peer-stab"], ["Nice. Must be good to have those connections.", "peer-dim-harm"], ["Say nothing. Stew.", "under-dim"]] },
      { t: "Your investor states a market number you know is wrong.", opts: [["Can I check something? Our data shows X; I want to understand the gap.", "under-stab"], ["Actually, that's not right.", "under-dim"], ["Let it go.", "under-stab-weak"]] },
      { t: "A junior on your team shipped a feature that broke, and is spiralling.", opts: [["It's fine, don't worry about it.", "peer-stab-harm"], ["One thing to fix today, and we'll look at it together at five.", "peer-elev"], ["I'll roll it back myself.", "auth-stab"]] },
      { t: "A new hire is clearly better than you at the thing they were hired for.", opts: [["In the team meeting: 'Sam owns this now. Ask Sam.'", "auth-elev"], ["Review their work closely so quality holds.", "auth-stab"], ["Stay out of the way and keep the goals written down.", "auth-stab-good"]] },
      { t: "Your whole team is flat after losing the big account.", opts: [["Yeah. It's brutal out there right now.", "under-stab-harm"], ["Here is where this goes next, and here's the first step. Who wants it?", "under-elev"], ["Everyone back to work; we'll make it up.", "auth-dim"]] },
      { t: "Someone moved customer data to a personal account to work faster.", opts: [["Don't do that again.", "auth-stab"], ["That breaks the rule we all signed. It gets undone today, and here's what happens next.", "auth-dim"], ["I get why, but please don't.", "peer-stab-harm"]] },
      { t: "A struggling friend-founder asks for your read on their plan.", opts: [["Do you want my read, or do you want me to listen while you work it out?", "peer-elev"], ["Here's what I'd do.", "auth-elev"], ["Honestly, we're both screwed in this market.", "under-stab-harm"]] }
    ],
    // map opt tags onto clusters and valences
    tags: { "auth-elev": ["auth-elev", "Healing"], "auth-stab": ["auth-stab", "Neutral"], "auth-stab-good": ["auth-stab", "Healing"], "auth-dim": ["auth-dim", "Risky"], "peer-elev": ["peer-elev", "Healing"], "peer-stab": ["peer-stab", "Healing"], "peer-stab-harm": ["peer-stab", "Harmful"], "peer-dim": ["peer-dim", "Healing"], "peer-dim-harm": ["peer-dim", "Harmful"], "under-elev": ["under-elev", "Healing"], "under-stab": ["under-stab", "Healing"], "under-stab-weak": ["under-stab", "Neutral"], "under-stab-harm": ["under-stab", "Harmful"], "under-dim": ["under-dim", "Harmful"] }
  },
  // ---------- Perform: 60 seconds, a target enactment ----------
  perform: {
    prep_seconds: 10, speak_seconds: 60,
    intro: "A situation and a target move. Three ways in: choose the line, type it, or say it. Choosing teaches the shape; typing and speaking are graded on four things: your stance, the direction you moved them, the lever, and the hand-off. A few targets are Harmful on purpose, and the aim is to perform them well: as they really sound, plausible and deniable. Only a move you can do well is one you can recognise in the room, or in your own mouth.",
    modes: [["mc", "Choose the line"], ["type", "Type it"], ["speak", "Say it"]],
    dims: ["Stance", "Direction", "Lever", "Hand-off"],
    /* mc options: tag right = the enactment, subtle, with lever and hand-off · blunt = right direction, no subtlety, no lever · wrongdir = moves them the wrong way · wrongstance = speaks from the wrong position. */
    mcTags: { right: [3, "The move, with the lever and the hand-off said aloud."], blunt: [1, "Right direction, no subtlety: nothing is handed over and no lever carries it, so it lands as a verdict."], wrongdir: [0, "Wrong direction: this moves them the opposite way from the target."], wrongstance: [0, "Wrong stance: this speaks from a position you do not hold in this situation."] },
    // Harmful targets: "right" is the move done skilfully (how it sounds in real life); "blunt" is the cartoon nobody would actually say.
    mcTagsHarmful: { right: [3, "The move as it really sounds: plausible, deniable, even kind on the surface, and it still does the damage. This is the version to learn to hear."], blunt: [1, "The crude version. Almost nobody says it this way, which is why knowing only this version teaches you to miss the real one."], wrongdir: [0, "Wrong direction: this is the healthy replacement, not the harmful move."], wrongstance: [0, "Wrong stance: this speaks from a position you do not hold in this situation."] },
    items: [
      { id: "p1", target: 1, t: "Your report missed the deadline a second time and looks defeated. Teach them the method, then hand them the next one to own.", mc: [
        ["right", "Here is how I break one of these down: three steps, written Monday. Let's do this one together now, and the next one is yours. I won't look at it until Friday."],
        ["blunt", "You need to get more organised. Here's a method; use it next time."],
        ["wrongdir", "Twice now. I'll take this one back; send me what you have and I'll finish it."],
        ["wrongstance", "I've missed plenty of deadlines too, honestly. We'll figure it out somehow."]] },
      { id: "p2", target: 4, t: "In front of the team, a new hire has out-done you at the thing they were hired for. Endorse them publicly and hand over the decision.", mc: [
        ["right", "Priya's analysis is better than mine was, and that is why she is here. From today pricing decisions are hers. Priya, what do you need from us?"],
        ["blunt", "Priya did a good job on this. Well done."],
        ["wrongdir", "Priya has made a start here; I'll take it from this point and get it over the line."],
        ["wrongstance", "I guess Priya knows more about this than I do. I don't really know what I'm doing on pricing any more."]] },
      { id: "p3", target: 13, t: "Your co-founder is good at customer calls and does not believe it. Name the strength, set a stretch, and name the day it becomes theirs.", mc: [
        ["right", "You closed the last three on calls I would have lost. Take the Acme call solo next week, and from the first of the month the customer side is yours. I'll tell the team."],
        ["blunt", "You're good at calls. Do more of them."],
        ["wrongdir", "You're fine on calls, but let's keep me on the big ones for now. It's safer."],
        ["wrongstance", "As your CEO, I'm assigning you customer calls going forward. Report back weekly."]] },
      { id: "p4", target: 17, t: "Your co-founder's forecast says 3x next year. Lower it with data and a shared experiment, not with your opinion.", mc: [
        ["right", "If 3x is right, we'd see fifty new logos a month by January. Let's write that down and look together on the first. If it's there, I'm wrong."],
        ["blunt", "3x isn't realistic. Cut it in half."],
        ["wrongdir", "3x! Love it. Let's put it in the deck."],
        ["wrongstance", "I'm not sure I'm qualified to question your numbers. You know the market better than me."]] },
      { id: "p5", target: 25, t: "Your lead investor just stated a market number you know is wrong. Correct the fact while holding their standing.", mc: [
        ["right", "Can I check one number with you? Our panel data puts that segment at 40 million, not 400. I'd like to understand where the gap is."],
        ["blunt", "That number's wrong. It's 40 million."],
        ["wrongdir", "Right, 400 million, exactly, that's what we've been saying."],
        ["wrongstance", "Let me walk you through how this market actually works, because that figure is a common mistake."]] },
      { id: "p6", target: 6, t: "Someone moved customer data to a personal account. Let the rule speak, cleanly, and finish.", mc: [
        ["right", "That breaks the data rule we all signed, me included. It gets undone today, and here is what happens next. Then it's finished."],
        ["blunt", "You can't do that. Don't do it again."],
        ["wrongdir", "I get why you did it, it's faster. Just be careful."],
        ["wrongstance", "I'm really uncomfortable with this, and I'm not sure what we're supposed to do about it."]] },
      { id: "p7", target: 10, t: "A peer on the team is down after a lost deal. Set one small winnable thing this week with a shared metric.", mc: [
        ["right", "Rough one. Let's pick one account we can move by Friday, and we'll both look at the pipeline number together on Friday at four."],
        ["blunt", "Shake it off. Go win the next one."],
        ["wrongdir", "Yeah, that one was always going to be hard for you. Maybe leave the enterprise deals to Sam."],
        ["wrongstance", "As the founder I'm telling you: this is not acceptable. Fix the pipeline."]] },
      { id: "p8", target: 22, t: "The team is flat after losing the big account and you are the scrappy one. Tell the story of where this goes and build the room for them to lead.", mc: [
        ["right", "We lost the account we built the year around. Here is where this goes next, and the first step is this. Who wants to run it? I'll clear the room for whoever does."],
        ["blunt", "We'll bounce back. Everyone back to work."],
        ["wrongdir", "Honestly, it's brutal out there right now. I don't know what we do."],
        ["wrongstance", "I've decided the new direction. Here are your assignments."]] },
      { id: "p9", target: 8, t: "Your best engineer wants to rewrite the whole platform. Deflate it gently with a trial and a number.", mc: [
        ["right", "Could be right. Rewrite the billing service only, two weeks, and we measure p95 before and after. If it's better, you've earned the next one."],
        ["blunt", "No. We're not rewriting the platform."],
        ["wrongdir", "Yes! Let's do the whole thing. How long do you need?"],
        ["wrongstance", "You're the expert here, I'll stay out of it. Do what you think is right."]] },
      { id: "p10", target: 11, t: "A friend-founder is struggling and asks what you think. Ask permission before advice and celebrate the part they already own.", mc: [
        ["right", "Do you want my read, or do you want me to shut up and listen while you work it out? Either way, the part you've already fixed is the hard part."],
        ["blunt", "Here's what I'd do. First, cut burn."],
        ["wrongdir", "Honestly, we're both screwed in this market. There's not much anyone can do."],
        ["wrongstance", "Look, I've been through this more times than you. Let me tell you exactly how it goes."]] },
      { id: "p11", target: 27, harmful: true, replace: 16, t: "A rival founder just raised a round three times yours. Perform the status attack from below as it really sounds: sympathetic on the surface, diminishing underneath. Then you will perform the replacement.", mc: [
        ["right", "Startups are getting crushed these days. You put in all that work to get a tenth of what you should have. We just don't have any leverage anymore."],
        ["blunt", "Huge round. Must be nice to have that cap table. Anyway, the product's nothing special."],
        ["wrongdir", "Congrats. How did the process go, and what surprised you? Anything that looks like overreach from where you sit?"],
        ["wrongstance", "As someone who's raised more than you, let me tell you the mistakes you're about to make."]],
        mcNote: "Here the target is the Harmful move itself, done well. Which line is the Envious Diminisher as it really sounds?" },
      { id: "p12", target: 9, harmful: true, replace: 8, t: "Your most confident engineer is confidently wrong in front of everyone. Perform the Confidence Crusher as it really sounds: a reasonable request that happens to take them apart in public. Then the replacement.", mc: [
        ["right", "This is a good learning moment for all of us, so let's slow down. Walk the team through how you got there, step by step. Take your time; we'll wait."],
        ["blunt", "Everyone, this is what happens when confidence outruns competence. Sit down."],
        ["wrongdir", "Interesting. Let's test it on one service for two weeks and look at the number together."],
        ["wrongstance", "I mean, you probably know better than me, so, okay."]],
        mcNote: "Here the target is the Harmful move itself, done well. Which line is the Confidence Crusher as it really sounds?" },
      { id: "p13", target: 12, harmful: true, replace: 10, t: "Your co-founder is drowning and you only ever sympathise. Perform the Passive Bystander as it really sounds: generous, understanding, and asking nothing. Then the replacement.", mc: [
        ["right", "You have so much on your plate, of course things are slipping. Don't put more pressure on yourself this week. Take whatever time you need; nobody is keeping score."],
        ["blunt", "That sounds so hard. It'll be okay, it always is."],
        ["wrongdir", "It is hard. Let's pick one thing we can move by Friday and look at it together at four."],
        ["wrongstance", "You need to pull yourself together. The company can't carry you."]],
        mcNote: "Here the target is the Harmful move itself, done well. Which line is the Passive Bystander as it really sounds?" },
      { id: "p14", target: 3, harmful: true, replace: 1, t: "A year in, every decision still comes to you. Perform the Static Commander in a one-to-one as it really sounds: protective, complimentary, and keeping every decision. Then the replacement.", mc: [
        ["right", "You're doing great, and I don't want you carrying the risk on this one. Run it by me before it goes out, so I can cover you if the client pushes back. I'll take the call myself."],
        ["blunt", "Send me everything before it goes anywhere. I'll handle the client side."],
        ["wrongdir", "Here is how I'd approach it. The next one is yours, and I won't review it until Friday."],
        ["wrongstance", "I don't know, you decide, I'm too tired to think about it."]],
        mcNote: "Here the target is the Harmful move itself, done well. Which line is the Static Commander as it really sounds?" }
    ]
  },
  // ---------- Read: name what someone else is doing ----------
  read: {
    intro: "Someone else is speaking. Name the move, its valence, and the lever (or none). Fast reads first; the explanations come after.",
    items: [
      { id: "r1", speaker: "A CEO to a junior, in the all-hands", t: "“Dana found the bug that cost us the quarter and fixed it in a day. From now on, incident review is hers. Dana, what do you need from us?”", answer: 4, options: [4, 1, 7] },
      { id: "r2", speaker: "A founder to a peer founder, over coffee", t: "“Yeah, we're both getting killed by the same thing. The market's gone. There's nothing anyone can do until rates move.”", answer: 21, options: [21, 19, 14] },
      { id: "r3", speaker: "A manager to a report, in a one-to-one", t: "“Send me the draft before it goes anywhere. Actually, send me everything before it goes anywhere. I'll handle the client side.”", answer: 3, options: [3, 5, 1] },
      { id: "r4", speaker: "A co-founder to a co-founder", t: "“If we really are at 3x by March we'll see fifty new logos a month by January. Let's write that down and look on the first.”", answer: 17, options: [17, 15, 8] },
      { id: "r5", speaker: "A founder to their board chair", t: "“Can I check one number with you? Our panel data shows the segment at 40 million, not 400. I'd like to understand where the gap is.”", answer: 25, options: [25, 26, 17] },
      { id: "r6", speaker: "A founder, in the group chat, about another founder's raise", t: "“Huge round. Wild what you can do with that cap table. Anyway.”", answer: 18, options: [18, 16, 15] },
      { id: "r7", speaker: "A CTO to an engineer who wants to rewrite everything", t: "“Could be right. Rewrite the billing service only, two weeks, and we measure p95 before and after. If it's better, you've earned the next one.”", answer: 8, options: [8, 6, 17] },
      { id: "r8", speaker: "A founder to a struggling friend-founder", t: "“Do you want my read, or do you want me to shut up and listen while you work it out?”", answer: 11, options: [11, 10, 13] },
      { id: "r9", speaker: "A founder to a report who breached the data rule", t: "“That's the rule all of us signed, including me. It gets undone today, and this is what happens next. Then it's finished.”", answer: 6, options: [6, 9, 3] }
    ]
  },
  // ---------- Replace: catch the harmful one, name the replacement and the lever ----------
  replace: {
    intro: "You caught yourself mid-move. Which one replaces it, and with which lever? The replacement is always a move from the same corner of the grid.",
    items: [
      { id: "x1", caught: 27, t: "A rival raised. You have the tweet half-written.", answer: 16, lever: "consultation", options: [16, 26, 14] },
      { id: "x2", caught: 9, t: "Your confident engineer is wrong in front of everyone and you can feel the sentence coming.", answer: 8, lever: "evidence", options: [8, 6, 7] },
      { id: "x3", caught: 12, t: "Your co-founder is drowning and you are about to say 'it'll be okay' for the fifth time.", answer: 10, lever: "contract", options: [10, 14, 13] },
      { id: "x4", caught: 3, t: "A year in, and you are about to ask for the draft before it goes anywhere, again.", answer: 1, lever: "contract", options: [1, 2, 5] },
      { id: "x5", caught: 15, t: "Your peer posted a plan in the channel and you are typing 'this won't work because'.", answer: 17, lever: "evidence", options: [17, 16, 13] },
      { id: "x6", caught: 26, t: "Your investor is being the hero again and you want to 'reality-check' them.", answer: 25, lever: "consultation", options: [25, 17, 22] },
      { id: "x7", caught: 21, t: "You and a peer founder are agreeing the market is rigged, for the third evening running.", answer: 19, lever: "contract", options: [19, 20, 22] },
      { id: "x8", caught: 24, t: "You are behind, and you have found a reason their plan won't work. It is not the real reason.", answer: 22, lever: "narrative", options: [22, 23, 25] }
    ]
  },
  grief: { title: "Why grief lives here", body: "Every healthy hand-off is a loss. The Expert Elevator ends with the expert needed less. The Champion Advocate ends with the champion in the audience. Founders who cannot grieve a little hold on, and holding on is where the Harmful column comes from. The Releasing ritual in Recovery is this block's cooldown." }
};
