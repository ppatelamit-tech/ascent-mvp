# Ascent — MVP

Mental fitness for founders, designed by a psychiatrist. Working name. Pilot build.

Seven capacities, each the working opposite of a block: capability/fear, enjoyment/guilt, drive/shame, connection/grief, communication/lies, vision/illusion, detachment/attachment. The app is organised as three pillars, parallel to physical fitness: **Development** (the seven capacities, like working out), **Foundations** (add and limit — sleep, movement, daylight, the phone — like nutrition) and **Recovery** (liminal rituals, like recovery). The Today screen asks for one from each; all three closes the day; seven closed days in the first ten makes a founding member (free first year, founder's rate locked). Development ships the Profile (baseline across all seven) and all seven blocks: **Enjoyment** (nine audio adventures in three grades, Calm / Active / Adventure, from 5 to 20 minutes, all recorded with narration, sound beds, one-shots, and a composed ElevenLabs Music score), **Capability** (three challenges a day from chosen priority areas, points, levels, leaderboard, evidence file) **Communication** (30-second sets graded against a six-dimension rubric), **Drive** (forced-choice values sort to five, goal audit against values and "who am I proving this to", daily feed with a toward/prove check, 14-day values-behaviour gap), **Connection** (the Status 27 grid: nine-scenario baseline, Perform exercises graded by the model on stance/direction/lever/hand-off, Read and Replace drills, Harmful moves performed on purpose then replaced), **Vision** (prediction journal with calibration and Brier score, attack-the-thesis counter-case built by the model, twelve base-rate cards with named sources, narrative audit) and **Detachment** (identity inventory with concentration score, delegation challenges, the full failure written once and read for a week, absence days growing from four hours, succession letter).

## Layout

- `index.html` — landing page
- `app/` — the app (vanilla JS, hash router, localStorage; no build step)
  - `app.js` — routes and views · `app.css` — Still Water tokens · `grader-local.js` — offline rubric estimate
- `data/` — all content, editable without touching code
  - `domains.js` · `profile.js` (42 items + safety layer) · `capability.js` (deck) · `communication.js` (topics, rubric dimensions, hedge list)
- `app/development.js` — Drive, Connection, Vision, Detachment · `data/drive.js`, `data/connection.js` (27 enactments, clusters, baseline, Perform/Read/Replace items), `data/vision.js` (base-rate cards with sources), `data/detachment.js`
- `app/today.js` — Today screen, Foundations (check-in, weekly Add/Limit, Dull after dark, brief AUDIT-C and Lie/Bet screens), Recovery (trigger shelf, three-beat ritual player, build-your-own, overuse brake) · `data/foundations.js`, `data/recovery.js`
- `app/enjoyment.js` — Enjoyment player: narration file + ambient bed + one-shots + generative Web Audio score driven by scene moods · `tools/mix_enjoyment.py` assembles narration and cues from per-scene files
- `netlify/functions/leaderboard.mjs` — Capability leaderboard on Netlify Blobs (one key per player, player writes only their own)
- `netlify/functions/grade.js` — model grader (Claude API): Communication rubric, Connection enactment rubric (`mode:"connection"`), Vision counter-case (`mode:"counter"`). Needs `ANTHROPIC_API_KEY` in the Netlify environment; optional `GRADER_MODEL`.
- `assets/marks/<domain>.svg` — illustrated animal marks (not yet drawn; the app falls back to the animal's initial)

## Run locally

Any static server from the repo root, e.g. `python3 -m http.server 8080`, then open `/app/?test` for test mode (reset button). The grader falls back to the offline estimate when the function is not running; `netlify dev` runs both.

## Clinical line

General-wellness product. No diagnosis anywhere. Clinical screeners never shown as scores. Safety item routes to a crisis card and marks the Profile for referral. Four or more Early readings also recommends a clinician. Nothing is stored server-side; Communication transcripts are graded and discarded.

## Not yet

Stripe authorize-and-release, accounts, lesson video, re-measurement at block end, wearable import, illustrated marks.
