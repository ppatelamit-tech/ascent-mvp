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
adv = json.loads(subprocess.check_output(["node", "-e", f"global.window={{}};require('{ROOT}/data/enjoyment.js');require('{ROOT}/data/enjoyment-more.js');const a=window.ASCENT_ENJOYMENT.adventures.find(x=>x.id==='{ID}');console.log(JSON.stringify(a))"]))
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

# ---- optional composed score: <SRC>/music-A.mp3, music-B.mp3 ... placed at the scene boundaries listed in <SRC>/music.json
#      music.json: [{"file":"music-A.mp3","start":0.0}, {"file":"music-B.mp3","start":101.18,"offset":40}, ...]  (offset = seconds into the cue to begin from)
#      Cues are cross-faded over XF seconds at each start, ducked under narration, and written to assets/audio/<id>/music.mp3.
mj = os.path.join(SRC, "music.json")
if os.path.exists(mj):
    cues_m = json.load(open(mj)); XF = 6.0
    narr_path = os.path.join(OUT, "narration.mp3")
    inputs, filt, n = ["-i", narr_path], [], 1
    for i, c in enumerate(cues_m):
        inputs += ["-i", os.path.join(SRC, c["file"])]
        start = max(0.0, c["start"] - (XF / 2 if i else 0))
        fade_in = f"afade=t=in:st=0:d={XF if i else 2}"
        nxt = cues_m[i + 1]["start"] + XF / 2 if i + 1 < len(cues_m) else total + 2
        length = nxt - start
        off = float(c.get("offset", 0))
        filt.append(f"[{n}:a]atrim={off:.2f}:{off + length:.2f},asetpts=PTS-STARTPTS,{fade_in},afade=t=out:st={max(0, length - (XF if i + 1 < len(cues_m) else 8)):.2f}:d={XF if i + 1 < len(cues_m) else 8},adelay={int(start * 1000)}|{int(start * 1000)},aformat=channel_layouts=stereo[m{i}]")
        n += 1
    mix = "".join(f"[m{i}]" for i in range(len(cues_m))) + f"amix=inputs={len(cues_m)}:normalize=0,volume=0.9[mus];"
    duck = "[0:a]aformat=channel_layouts=stereo[nar];[mus][nar]sidechaincompress=threshold=0.03:ratio=4:attack=200:release=1200:makeup=1[out]"
    subprocess.check_call(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", ";".join(filt) + ";" + mix + duck, "-map", "[out]", "-t", str(total), "-ar", "44100", "-b:a", "128k", os.path.join(OUT, "music.mp3")])
    print(f"  composed score: {len(cues_m)} cues → music.mp3 ({dur(os.path.join(OUT, 'music.mp3'))/60:.1f} min)")
