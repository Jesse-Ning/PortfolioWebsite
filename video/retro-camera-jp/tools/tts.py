"""Synthesize narration lines with zhtts (FastSpeech2 + MB-MelGAN, Baker voice).

Writes audio/vo/<id>.wav plus audio/vo/timing.json with clause-level timings for subtitles.
Run inside the venv that has zhtts + tensorflow-cpu 2.15.
"""
import json, re, sys, pathlib
import numpy as np
from scipy.io import wavfile
import zhtts

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "audio" / "vo"
OUT.mkdir(parents=True, exist_ok=True)
SR = 24000
PAUSE = {"，": 0.16, "、": 0.12, "。": 0.34, "：": 0.26, "？": 0.32, "！": 0.3}

tts = zhtts.TTS()
_speed = [1.0]
def prepare_input(input_ids):
    input_ids = np.expand_dims(np.array(input_ids, np.int32), 0)
    return (input_ids, np.array([0], np.int32), np.array([_speed[0]], np.float32),
            np.array([1.0], np.float32), np.array([1.0], np.float32))
tts.prepare_input = prepare_input

def trim(a, thr=0.012):
    idx = np.where(np.abs(a) > thr)[0]
    if len(idx) == 0: return a
    s = max(0, idx[0] - int(0.02 * SR)); e = min(len(a), idx[-1] + int(0.05 * SR))
    return a[s:e]

# Homophone substitutions that steer pypinyin to the right reading (display text is untouched).
FIX = [("老相机", "老象机"), ("拍得", "拍的"), ("看得", "看的"), ("照得", "照的"), ("值不值得", "值不值的"),
       ("调蓝", "条蓝"), ("差不多", "插不多"), ("一家", "亿家"), ("一进门", "移进门"), ("一台", "亿台"),
       ("一路", "移路"), ("一两千", "亿两千"), ("每一张", "每亿张"), ("一瞬间", "移瞬间"), ("一千多", "亿千多"),
       ("一刻", "移刻"), ("一份", "移份"), ("一张照片", "亿张照片"), ("上一次", "上移次"), ("前一年", "前亿年"),
       ("一种", "亿种"), ("戳中", "戳众"), ("一场", "亿场"), ("一代", "移代"), ("每按一次", "每按移次")]

def fix_text(text):
    for a, b in FIX:
        text = text.replace(a, b)
    return text

def synth_line(text, speed):
    _speed[0] = speed
    text = fix_text(text)
    parts = [p for p in re.split(r"(?<=[，、。：？！])", text) if p.strip()]
    chunks, clauses, t = [], [], 0.0
    for p in parts:
        clean = p.rstrip("，、。：？！")
        a = trim(tts.mel2audio(tts.text2mel(clean + ("？" if p.endswith("？") else "。"))))
        clauses.append(dict(text=clean, start=round(t, 3), end=round(t + len(a) / SR, 3)))
        chunks.append(a); t += len(a) / SR
        gap = PAUSE.get(p[-1], 0.1)
        chunks.append(np.zeros(int(gap * SR), np.float32)); t += gap
    audio = np.concatenate(chunks[:-1])  # drop trailing pause
    return audio, clauses

def main():
    lines = json.loads((ROOT / "script" / "vo.json").read_text())
    only = set(sys.argv[1:])
    tpath = OUT / "timing.json"
    timing = json.loads(tpath.read_text()) if tpath.exists() else {}
    for ln in lines:
        if only and ln["id"] not in only: continue
        audio, clauses = synth_line(ln["text"], ln.get("speed", 1.0))
        audio = audio / (np.abs(audio).max() + 1e-6) * 0.9
        wavfile.write(OUT / f"{ln['id']}.wav", SR, audio.astype(np.float32))
        timing[ln["id"]] = dict(dur=round(len(audio) / SR, 3), clauses=clauses)
        print(ln["id"], timing[ln["id"]]["dur"])
    tpath.write_text(json.dumps(timing, ensure_ascii=False, indent=1))
    print("total", round(sum(v["dur"] for v in timing.values()), 1))

main()
