#!/usr/bin/env python3
"""Assemble an Enjoyment adventure from per-scene narration files.
Usage: mix_enjoyment.py <adventure-id> <dir-with-scene-mp3s>
Expects <dir>/<sceneId>.mp3 for every scene (and optional bed.mp3, sfx-<scene>-<n>.mp3, which are copied through).
Writes assets/audio/<id>/narration.mp3 (scenes joined with each scene's pause of room tone after it) and cues.json (scene start/end seconds).
Scene order and pauses come from data/enjoyment.js, read via node."""
import json, os, shutil, subprocess, sys
ID, SRC = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "audio", ID); os.makedirs(OUT, exist_ok=True)
adv = json.loads(subprocess.check_output(["node", "-e", f"global.window={{}};require('{ROOT}/data/enjoyment.js');const a=window.ASCENT_ENJOYMENT.adventures.find(x=>x.id==='{ID}');console.log(JSON.stringify(a))"]))
def dur(p): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode().strip())
parts, cues, t = [], [], 0.0
LEAD = 1.5
for s in adv["scenes"]:
    f = os.path.join(SRC, s["id"] + ".mp3")
    if not os.path.exists(f): sys.exit(f"missing {f}")
    d = dur(f); start = t + LEAD if not cues else t
    cues.append({"id": s["id"], "start": round(start, 2), "end": round(start + d, 2)})
    parts.append((f, d, s["pause"])); t = start + d + s["pause"]
# build concat filter: lead-in silence, then each scene followed by its pause
inputs, filt, n = [], [], 0
inputs += ["-f", "lavfi", "-t", str(LEAD), "-i", "anullsrc=r=44100:cl=mono"]; filt.append(f"[{n}:a]"); n += 1
for f, d, pause in parts:
    inputs += ["-i", f]; filt.append(f"[{n}:a]"); n += 1
    inputs += ["-f", "lavfi", "-t", str(pause), "-i", "anullsrc=r=44100:cl=mono"]; filt.append(f"[{n}:a]"); n += 1
fc = "".join(filt) + f"concat=n={n}:v=0:a=1,loudnorm=I=-18:TP=-2:LRA=9[a]"
subprocess.check_call(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", fc, "-map", "[a]", "-ar", "44100", "-ac", "1", "-b:a", "96k", os.path.join(OUT, "narration.mp3")])
for name in os.listdir(SRC):
    if name == "bed.mp3" or name.startswith("sfx-"): shutil.copy(os.path.join(SRC, name), os.path.join(OUT, name))
total = dur(os.path.join(OUT, "narration.mp3"))
json.dump({"id": ID, "duration": round(total, 2), "scenes": cues}, open(os.path.join(OUT, "cues.json"), "w"), indent=1)
print(f"{ID}: {len(cues)} scenes, {total/60:.1f} min → {OUT}")
