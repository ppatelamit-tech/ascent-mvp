/* Recovery — liminal rituals. The cooldown and the deload. Event-triggered, not scheduled: something ended; cross back.
   Every ritual has the same three beats (van Gennep): separation (name what ended) → liminal (the crossing) → reincorporation (step back in, changed).
   Fixed length, always ends with re-entry. A ritual that does not end with re-entry is rumination with candles.
   Each ritual is authored by a domain; the shelf has seven voices on it. Sources are named; nothing is dressed up as a tradition it is not. */
window.ASCENT_RECOVERY = {
  intro: "Something happened. Cross back. Three beats, a few minutes, always ending in the room you are in. On a quiet day, shut the shop.",
  triggers: [
    { id: "day", name: "End of day", line: "Nothing in particular. Close the day so it does not follow you to bed." },
    { id: "hard", name: "A hard day", line: "Everything went wrong at once and you are still carrying it." },
    { id: "fail", name: "A failure", line: "Something you did, or did not do, and you are ashamed." },
    { id: "loss", name: "A loss", line: "A person, a hire, a deal, a company. Something is gone." },
    { id: "rupture", name: "A rupture", line: "A fight, a betrayal, a bridge burned or singed." },
    { id: "before", name: "Before something big", line: "A pitch, a board, a hard conversation. Cross the threshold on purpose." },
    { id: "win", name: "A win", line: "Something went right. Founders never let it land. Let it land." },
    { id: "week", name: "Week's end", line: "Review and close. Seven days, three lines." }
  ],
  rituals: [
    { id: "shut-the-shop", trigger: ["day", "hard"], author: "detachment", name: "Shut the shop", minutes: 2, needs: "Paper and a pen. A drawer.",
      beats: [
        { name: "Separation", seconds: 50, text: "Write the day's three unfinished things on paper. Only three. Not the list, the three that will follow you to bed." },
        { name: "Crossing", seconds: 30, text: "Say, out loud if you can: not tonight. Fold the paper once. Put it in the drawer. The phone goes in with it." },
        { name: "Return", seconds: 30, text: "Close the drawer. The shop is shut. It opens at eight, and everything in it will still be there. Stand up. Notice the room." }
      ] },
    { id: "cleansing", trigger: ["fail", "hard"], author: "drive", name: "Cleansing", minutes: 3, needs: "A sink. Cold water.",
      beats: [
        { name: "Separation", seconds: 40, text: "Name the thing once, out loud, plainly. Not the story about it. The thing. I did that. Or: I did not do that." },
        { name: "Crossing", seconds: 60, text: "Cold water on the wrists, then the face. Hold the wrists under for the full count. Let the cold be the only thing. Shame lives in the story; the body is not the story." },
        { name: "Return", seconds: 40, text: "Dry your face. Look at it. Say: I did that, and I am not only that. Tomorrow has one thing in it that fixes a corner of this. Name the corner. Done." }
      ] },
    { id: "releasing", trigger: ["loss"], author: "connection", name: "Releasing", minutes: 6, needs: "Paper and a pen, or a note on the phone you will delete.",
      beats: [
        { name: "Separation", seconds: 150, text: "Write a letter you will not send. To the person, the company, the version of the plan that is gone. Say what it was. Say what it cost. Do not be fair." },
        { name: "Crossing", seconds: 60, text: "Read it aloud, quietly. Then burn it, tear it, or delete it. While it goes, say one thing from this that you keep. One." },
        { name: "Return", seconds: 60, text: "Put your hand flat on something solid. The table, the wall, the floor. It is still here. So are you. Breathe out longer than in, three times. Then go and drink a glass of water." }
      ] },
    { id: "hooponopono", trigger: ["rupture", "fail"], author: "drive+connection", name: "Four lines", source: "Drawn from the Hawaiian practice of ho'oponopono as it has travelled; this is a borrowing, not the practice itself.", minutes: 4, needs: "Nothing. Somewhere you can speak.",
      beats: [
        { name: "Separation", seconds: 40, text: "Picture the person. If the rupture is with yourself, picture yourself at the moment it happened. Hold the picture still." },
        { name: "Crossing", seconds: 120, text: "Say the four lines to them, slowly, more than once. I'm sorry. Please forgive me. Thank you. I love you. You do not have to mean every line yet. Say them until one of them lands." },
        { name: "Return", seconds: 40, text: "Let the picture go. Say the four lines once more, to yourself, for yourself. Then look at something in the room that is not you. The ritual is over. Repair, if it is going to happen, happens tomorrow, in daylight, in words." }
      ] },
    { id: "threshold", trigger: ["before"], author: "capability", name: "Threshold", minutes: 2, needs: "A doorway.",
      beats: [
        { name: "Separation", seconds: 40, text: "Stand on the near side of the door. Say what you are leaving on this side: the last meeting, the thing you are worried about, the version of you that is small." },
        { name: "Crossing", seconds: 30, text: "Say what you are bringing through. One thing. The thing you actually know. Then step through, deliberately, like it costs something." },
        { name: "Return", seconds: 40, text: "You are on the other side. Feet flat. Shoulders down. The next thing is only the next thing. Go and do it." }
      ] },
    { id: "receive-it", trigger: ["win"], author: "enjoyment", name: "Receive it", minutes: 2, needs: "Nothing. Do this before you tell anyone.",
      beats: [
        { name: "Separation", seconds: 30, text: "Do not pick up the phone. Do not tell anyone yet. Sit down. Say what happened, plainly, as if reporting it to someone who was not there." },
        { name: "Crossing", seconds: 60, text: "Ninety seconds of letting it be true. Notice where it lands in the body. If the mind starts on the next thing, bring it back: this one, now. You did this." },
        { name: "Return", seconds: 30, text: "Now you can tell someone. Pick who. Tell them the plain version. Wins that are not received do not count, and you have just made this one count." }
      ] },
    { id: "review-close", trigger: ["week"], author: "vision", name: "Review and close", minutes: 5, needs: "Something to write on.",
      beats: [
        { name: "Separation", seconds: 120, text: "Three things that happened this week. Not the biggest. The three that are still moving in you." },
        { name: "Crossing", seconds: 90, text: "One thing you learned. Write it as a sentence you would believe if someone else said it." },
        { name: "Return", seconds: 60, text: "Write the word done under it. Say it. The week is closed; the next one has not started. Whatever is between them is yours." }
      ] }
  ],
  brake: { perDay: 3, text: "That is three today. Rituals work by being bounded; a fourth is the mind asking the ritual to do something it cannot do. Leave it here. If the pull to repeat is strong most days, that is worth a conversation with a clinician, and the Profile will carry the note." },
  build: { intro: "The research is clear that the content matters less than the shape and the repetition. Make one of your own: a trigger, three beats, and an ending in the room.", placeholders: ["What ended? Name it.", "The crossing. Something you do with your hands or your voice.", "Step back in. Where are you, and what is next?"] }
};
