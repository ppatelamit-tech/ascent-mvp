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
    intro: "A situation and a target move. Ten seconds to think, sixty to say it as you would say it to them. Graded on four things: your stance, the direction you moved them, the lever, and the hand-off. A few targets are Harmful on purpose: perform them so you know what they sound like coming out of you.",
    dims: ["Stance", "Direction", "Lever", "Hand-off"],
    items: [
      { id: "p1", target: 1, t: "Your report missed the deadline a second time and looks defeated. Teach them the method, then hand them the next one to own." },
      { id: "p2", target: 4, t: "In front of the team, a new hire has out-done you at the thing they were hired for. Endorse them publicly and hand over the decision." },
      { id: "p3", target: 13, t: "Your co-founder is good at customer calls and does not believe it. Name the strength, set a stretch, and name the day it becomes theirs." },
      { id: "p4", target: 17, t: "Your co-founder's forecast says 3x next year. Lower it with data and a shared experiment, not with your opinion." },
      { id: "p5", target: 25, t: "Your lead investor just stated a market number you know is wrong. Correct the fact while holding their standing." },
      { id: "p6", target: 6, t: "Someone moved customer data to a personal account. Let the rule speak, cleanly, and finish." },
      { id: "p7", target: 10, t: "A peer on the team is down after a lost deal. Set one small winnable thing this week with a shared metric." },
      { id: "p8", target: 22, t: "The team is flat after losing the big account and you are the scrappy one. Tell the story of where this goes and build the room for them to lead." },
      { id: "p9", target: 8, t: "Your best engineer wants to rewrite the whole platform. Deflate it gently with a trial and a number." },
      { id: "p10", target: 11, t: "A friend-founder is struggling and asks what you think. Ask permission before advice and celebrate the part they already own." },
      { id: "p11", target: 27, harmful: true, replace: 16, t: "A rival founder just raised a round three times yours. Perform the status attack from below, on purpose, so you hear it. Then you will perform the replacement." },
      { id: "p12", target: 9, harmful: true, replace: 8, t: "Your most confident engineer is confidently wrong in front of everyone. Perform the Confidence Crusher, on purpose. Then the replacement." },
      { id: "p13", target: 12, harmful: true, replace: 10, t: "Your co-founder is drowning and you only ever sympathise. Perform the Passive Bystander, on purpose. Then the replacement." },
      { id: "p14", target: 3, harmful: true, replace: 1, t: "A year in, every decision still comes to you. Perform the Static Commander in a one-to-one, on purpose. Then the replacement." }
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
