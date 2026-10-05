"""Lay narration lines on the master timeline (seconds). Output: script/timeline.json"""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
timing = json.loads((ROOT / "audio/vo/timing.json").read_text())
lines = {l["id"]: l for l in json.loads((ROOT / "script/vo.json").read_text())}

# (line id, pause after) ; ("@marker", seconds) inserts a non-narrated beat
PLAN = [
    ("@open", 0.7),
    ("L01", 0.35), ("L02", 0.45), ("L03", 0.5),
    ("@title", 3.4),
    ("@data", 0.3),
    ("L04", 0.3), ("L05", 0.5), ("L06", 0.45), ("L07", 0.6), ("L08", 0.5), ("L09", 0.5), ("L10", 0.9),
    ("@stop", 0.5),
    ("L11", 1.4),
    ("@question", 0.2),
    ("L12", 0.6), ("L13", 1.3),
    ("@r1", 2.2),
    ("L14", 0.4), ("L15", 0.5), ("L16", 0.7), ("L17", 0.5), ("L18", 0.5), ("L19", 1.4),
    ("@r2", 2.4),
    ("L20", 0.6), ("L21", 0.8), ("L22", 0.6), ("L23", 0.9), ("L24", 2.4),
    ("@r3", 2.0),
    ("L25", 0.5), ("L26", 0.5), ("L27", 0.5), ("L28", 1.0),
    ("@twist", 0.2),
    ("L29", 0.5), ("L30", 0.8), ("L31", 0.9), ("L32", 1.6),
    ("@end", 0.2),
    ("L33", 0.5), ("L34", 1.2), ("L35", 0.6),
    ("@outro", 3.4),
]
t, items, markers = 0.0, [], {}
for key, pause in PLAN:
    if key.startswith("@"):
        markers[key[1:]] = round(t, 3); t += pause; continue
    d = timing[key]["dur"]
    items.append(dict(id=key, start=round(t, 3), end=round(t + d, 3), text=lines[key]["text"],
                      clauses=[dict(c, start=round(c["start"] + t, 3), end=round(c["end"] + t, 3)) for c in timing[key]["clauses"]]))
    t += d + pause
markers["fin"] = round(t, 3)
(ROOT / "script/timeline.json").write_text(json.dumps(dict(duration=round(t, 3), markers=markers, lines=items), ensure_ascii=False, indent=1))
print("duration", round(t, 2)); print(markers)
