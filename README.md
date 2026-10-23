# Ascent — MVP

Mental fitness for founders, designed by a psychiatrist. Working name. Pilot build.

Seven capacities, each the working opposite of a block: capability/fear, enjoyment/guilt, drive/shame, connection/grief, communication/lies, vision/illusion, detachment/attachment. The MVP ships the Profile (baseline across all seven) plus two live blocks: **Capability** (three challenges a day from chosen priority areas, points, levels, leaderboard, evidence file) and **Communication** (30-second sets graded against a six-dimension rubric).

## Layout

- `index.html` — landing page
- `app/` — the app (vanilla JS, hash router, localStorage; no build step)
  - `app.js` — routes and views · `app.css` — Still Water tokens · `grader-local.js` — offline rubric estimate
- `data/` — all content, editable without touching code
  - `domains.js` · `profile.js` (42 items + safety layer) · `capability.js` (deck) · `communication.js` (topics, rubric dimensions, hedge list)
- `netlify/functions/leaderboard.mjs` — Capability leaderboard on Netlify Blobs (one key per player, player writes only their own)
- `netlify/functions/grade.js` — model grader (Claude API). Needs `ANTHROPIC_API_KEY` in the Netlify environment; optional `GRADER_MODEL`.
- `assets/marks/<domain>.svg` — illustrated animal marks (not yet drawn; the app falls back to the animal's initial)

## Run locally

Any static server from the repo root, e.g. `python3 -m http.server 8080`, then open `/app/?test` for test mode (reset button). The grader falls back to the offline estimate when the function is not running; `netlify dev` runs both.

## Clinical line

General-wellness product. No diagnosis anywhere. Clinical screeners never shown as scores. Safety item routes to a crisis card and marks the Profile for referral. Four or more Early readings also recommends a clinician. Nothing is stored server-side; Communication transcripts are graded and discarded.

## Not yet

Stripe, accounts, the other five blocks, lesson video, re-measurement at block end, wearable import, illustrated marks.
