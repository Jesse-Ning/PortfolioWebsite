"""Procedural journal textures: paper, grid paper, washi tape, grain, light leaks."""
import numpy as np, pathlib
from PIL import Image, ImageFilter, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "tex"; OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)

def noise(h, w, scale):
    """Smooth value noise via upsampled random field."""
    small = rng.random((max(2, h // scale), max(2, w // scale)))
    return np.asarray(Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), np.float32) / 255

def paper(w, h, base, fiber=10, name="paper"):
    n = noise(h, w, 180) * 0.5 + noise(h, w, 40) * 0.3 + noise(h, w, 6) * 0.2
    fine = rng.normal(0, 1, (h, w)).astype(np.float32)
    img = np.zeros((h, w, 3), np.float32)
    for c in range(3):
        img[..., c] = base[c] + (n - 0.5) * fiber + fine * 2.2
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(OUT / f"{name}.jpg", quality=92)
    return img

# Cool, neutral notebook white (deliberately not cream/beige)
paper(1400, 2400, (236, 237, 234), name="paper")
# Grid notebook page
g = paper(1400, 2400, (240, 241, 239), name="_tmp")
im = Image.fromarray(np.clip(g, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(im)
for x in range(0, 1400, 44): d.line([(x, 0), (x, 2400)], fill=(178, 196, 204), width=2)
for y in range(0, 2400, 44): d.line([(0, y), (1400, y)], fill=(178, 196, 204), width=2)
im.save(OUT / "grid.jpg", quality=92)
# Dot grid
g = paper(1400, 2400, (238, 238, 236), name="_tmp")
im = Image.fromarray(np.clip(g, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(im)
for x in range(22, 1400, 44):
    for y in range(22, 2400, 44): d.ellipse([x - 3, y - 3, x + 3, y + 3], fill=(150, 156, 160))
im.save(OUT / "dots.jpg", quality=92)
# Charcoal desk surface (backdrop around the journal)
paper(1400, 2400, (38, 40, 42), fiber=22, name="desk")
# Newsprint grey
paper(900, 1200, (214, 214, 208), fiber=14, name="newsprint")
# Black card stock
paper(900, 1200, (24, 24, 24), fiber=10, name="blackcard")
(OUT / "_tmp.jpg").unlink()

def torn_mask(w, h, rough=10, seed=0):
    r = np.random.default_rng(seed)
    m = Image.new("L", (w, h), 0); d = ImageDraw.Draw(m)
    def edge(n, amp):
        v = np.cumsum(r.normal(0, 1, n)); v = v - np.linspace(v[0], v[-1], n)
        v = v / (np.abs(v).max() + 1e-6) * amp
        return v + r.normal(0, amp * 0.15, n)
    pts = []
    top = edge(w // 6, rough); right = edge(h // 6, rough); bot = edge(w // 6, rough); left = edge(h // 6, rough)
    for i, v in enumerate(top): pts.append((i * 6, rough + v))
    for i, v in enumerate(right): pts.append((w - rough + v, i * 6))
    for i, v in enumerate(bot[::-1]): pts.append((w - i * 6, h - rough + v))
    for i, v in enumerate(left[::-1]): pts.append((rough + v, h - i * 6))
    d.polygon(pts, fill=255)
    return m

# Washi tape strips
tapes = {
    "tape_mustard": ((230, 164, 34), None), "tape_teal": ((31, 95, 116), None), "tape_red": ((216, 67, 42), None),
    "tape_stripe": ((236, 236, 232), (216, 67, 42)), "tape_grid": ((228, 232, 234), (31, 95, 116)), "tape_clear": ((245, 245, 240), None),
}
for name, (c, c2) in tapes.items():
    w, h = 420, 96
    arr = np.zeros((h, w, 4), np.uint8); arr[..., :3] = c
    if c2 is not None and name == "tape_stripe":
        for x in range(-h, w, 34):
            for y in range(h):
                xs = x + y
                arr[y, max(0, xs):max(0, min(w, xs + 14)), :3] = c2
    if c2 is not None and name == "tape_grid":
        arr[::16, :, :3] = c2; arr[:, ::16, :3] = c2
    fib = (noise(h, w, 8) - 0.5) * 30
    arr[..., :3] = np.clip(arr[..., :3].astype(np.float32) + fib[..., None], 0, 255)
    alpha = 150 if name != "tape_clear" else 90
    m = np.zeros((h, w), np.uint8); m[:, :] = alpha
    # serrated torn ends
    r = np.random.default_rng(hash(name) % 1000)
    for y in range(h):
        a = int(abs(r.normal(0, 4))) + 2; b = int(abs(r.normal(0, 4))) + 2
        m[y, :a] = 0; m[y, w - b:] = 0
    arr[..., 3] = m
    Image.fromarray(arr, "RGBA").save(OUT / f"{name}.png")

# Film grain frames (overlay, mix-blend overlay)
for i in range(6):
    gr = rng.normal(128, 38, (960, 540)).astype(np.float32)
    gr = np.asarray(Image.fromarray(np.clip(gr, 0, 255).astype(np.uint8)).resize((1080, 1920), Image.NEAREST))
    Image.fromarray(gr).save(OUT / f"grain_{i}.png")

# Light leaks (screen blend)
for i, (cx, cy, col) in enumerate([(0.1, 0.2, (255, 110, 30)), (0.95, 0.7, (255, 60, 40)), (0.5, 0.0, (255, 180, 60))]):
    w, h = 540, 960
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    dd = np.sqrt(((xx / w - cx) * 1.3) ** 2 + ((yy / h - cy)) ** 2)
    a = np.clip(1 - dd / 0.75, 0, 1) ** 2.2
    a = a * (0.7 + 0.3 * noise(h, w, 60))
    arr = np.zeros((h, w, 3), np.float32)
    for c in range(3): arr[..., c] = col[c] * a
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).resize((1080, 1920), Image.BICUBIC).save(OUT / f"leak_{i}.jpg", quality=90)


print("textures ok")

if __name__ == "__main__":
    pass
