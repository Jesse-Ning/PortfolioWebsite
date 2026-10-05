"""Turn raw photos into collage pieces: sticker cutouts, torn halftone prints, cropped strips."""
import pathlib, numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageEnhance

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW, OUT = ROOT / "assets/raw", ROOT / "assets/img"
OUT.mkdir(parents=True, exist_ok=True)
INK, MUSTARD = (22, 22, 22), (230, 164, 34)

def torn_mask(w, h, rough=12, seed=0, step=5):
    r = np.random.default_rng(seed)
    def edge(n):
        v = np.cumsum(r.normal(0, 1, n)); v -= np.linspace(v[0], v[-1], n)
        v = v / (np.abs(v).max() + 1e-6) * rough * 0.6
        return v + r.normal(0, rough * 0.22, n) + rough
    pts = []
    for i, v in enumerate(edge(w // step + 1)): pts.append((i * step, v))
    for i, v in enumerate(edge(h // step + 1)): pts.append((w - v, i * step))
    for i, v in enumerate(edge(w // step + 1)): pts.append((w - i * step, h - v))
    for i, v in enumerate(edge(h // step + 1)): pts.append((v, h - i * step))
    m = Image.new("L", (w, h), 0); ImageDraw.Draw(m).polygon(pts, fill=255)
    return m

def halftone(img, cell=7, angle=15, ink=INK, paper=(240, 240, 236)):
    g = ImageOps.autocontrast(img.convert("L"), cutoff=2)
    g = g.rotate(angle, expand=True, fillcolor=255)
    w, h = g.size
    out = Image.new("L", (w, h), 255); d = ImageDraw.Draw(out)
    small = np.asarray(g.resize((w // cell, h // cell), Image.BILINEAR), np.float32) / 255
    for y in range(small.shape[0]):
        for x in range(small.shape[1]):
            rr = (1 - small[y, x]) ** 0.85 * cell * 0.72
            if rr > 0.4:
                cx, cy = x * cell + cell / 2, y * cell + cell / 2
                d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=0)
    out = out.rotate(-angle, expand=True, fillcolor=255)
    ow, oh = out.size; W, H = img.size
    out = out.crop(((ow - W) // 2, (oh - H) // 2, (ow - W) // 2 + W, (oh - H) // 2 + H))
    rgb = Image.new("RGB", (W, H), paper)
    rgb.paste(Image.new("RGB", (W, H), ink), mask=ImageOps.invert(out))
    return rgb

def bw(img, contrast=1.35):
    g = ImageOps.autocontrast(img.convert("L"), cutoff=1)
    g = ImageEnhance.Contrast(g).enhance(contrast)
    n = np.random.default_rng(1).normal(0, 10, (g.size[1], g.size[0]))
    return Image.fromarray(np.clip(np.asarray(g, np.float32) + n, 0, 255).astype(np.uint8)).convert("RGB")

def torn_print(img, name, margin=26, seed=0, paper=(244, 244, 240)):
    w, h = img.size
    card = Image.new("RGB", (w + margin * 2, h + margin * 2), paper)
    card.paste(img, (margin, margin))
    m = torn_mask(*card.size, rough=14, seed=seed)
    rgba = card.convert("RGBA"); rgba.putalpha(m)
    rgba.save(OUT / f"{name}.png")

def sticker(img, mask, name, border=16):
    """Cut out subject by mask and give it a white die-cut sticker border."""
    mask = mask.filter(ImageFilter.GaussianBlur(1.2)).point(lambda v: 255 if v > 128 else 0)
    big = mask.filter(ImageFilter.MaxFilter(border * 2 + 1)).filter(ImageFilter.GaussianBlur(1.5))
    w, h = img.size
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out.paste(Image.new("RGBA", (w, h), (250, 250, 248, 255)), mask=big)
    subj = img.convert("RGBA"); subj.putalpha(mask)
    out.alpha_composite(subj)
    bb = big.getbbox(); out.crop(bb).save(OUT / f"{name}.png")

def bg_mask(img, tol=22, pad=40):
    """Foreground mask for objects shot on a light seamless background."""
    a = np.asarray(img.convert("RGB"), np.int16)
    corners = np.concatenate([a[:8, :8].reshape(-1, 3), a[:8, -8:].reshape(-1, 3), a[-8:, :8].reshape(-1, 3), a[-8:, -8:].reshape(-1, 3)])
    ref = np.median(corners, 0)
    diff = np.abs(a - ref).max(-1)
    m = Image.fromarray(((diff > tol) * 255).astype(np.uint8))
    m = m.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
    # keep largest blob by flood filling from outside
    arr = np.asarray(m).copy(); h, w = arr.shape
    from collections import deque
    outside = np.zeros_like(arr, bool); q = deque()
    for x in range(w): q.extend([(0, x), (h - 1, x)])
    for y in range(h): q.extend([(y, 0), (y, w - 1)])
    while q:
        y, x = q.popleft()
        if 0 <= y < h and 0 <= x < w and not outside[y, x] and arr[y, x] == 0:
            outside[y, x] = True; q.extend([(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)])
    return Image.fromarray(((~outside) * 255).astype(np.uint8))

def poly_mask(size, pts):
    m = Image.new("L", size, 0); ImageDraw.Draw(m).polygon(pts, fill=255); return m

def raw(n): return Image.open(RAW / n).convert("RGB")

if __name__ == "__main__":
    # Hero cameras as stickers
    q = raw("quicksnap_1.jpg")
    sticker(q, poly_mask(q.size, [(95, 150), (108, 88), (140, 60), (300, 56), (700, 68), (1238, 122), (1250, 142),
                                   (1214, 742), (1182, 762), (1118, 786), (600, 762), (282, 672), (112, 652), (92, 600)]), "st_quicksnap")
    for n in ["mju_5", "mju_2", "ixy_1", "instax_1", "x100_0"]:
        im = raw(n + ".jpg"); sticker(im, bg_mask(im), "st_" + n)
    # Street photos as torn halftone / bw prints
    s = raw("shinjuku_0.jpg")
    torn_print(halftone(s.crop((60, 0, 900, 855)), cell=8), "hp_shinjuku", seed=3)
    torn_print(bw(raw("shibuya_2.jpg")), "bw_shibuya", seed=5)
    torn_print(bw(raw("shinjuku_4.jpg")), "bw_shinjuku4", seed=6)
    # Negative strip crop
    neg = raw("negative_1.jpg"); neg.save(OUT / "neg_strip.jpg", quality=92)
    print("ok")

def paper_piece(w, h, color, name, seed=0, rough=10, fiber=14):
    """Solid torn paper scrap with fibre texture."""
    r = np.random.default_rng(seed)
    small = r.random((h // 30 + 2, w // 30 + 2))
    n = np.asarray(Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), np.float32) / 255
    fine = r.normal(0, 1, (h, w))
    arr = np.stack([np.clip(c + (n - 0.5) * fiber + fine * 3, 0, 255) for c in color], -1).astype(np.uint8)
    im = Image.fromarray(arr).convert("RGBA"); im.putalpha(torn_mask(w, h, rough=rough, seed=seed))
    im.save(OUT / f"{name}.png")

def stamp(img, name, bg=(31, 95, 116), w=300, h=380, label="日本郵便"):
    card = Image.new("RGB", (w, h), (246, 246, 242))
    inner = Image.new("RGB", (w - 36, h - 36), bg)
    im = img.copy(); im.thumbnail((w - 60, h - 120))
    inner.paste(im, ((inner.width - im.width) // 2, 24), im if im.mode == "RGBA" else None)
    card.paste(inner, (18, 18))
    m = Image.new("L", (w, h), 255); d = ImageDraw.Draw(m)
    rr, step = 9, 26
    for x in range(step // 2, w, step):
        d.ellipse([x - rr, -rr, x + rr, rr], fill=0); d.ellipse([x - rr, h - rr, x + rr, h + rr], fill=0)
    for y in range(step // 2, h, step):
        d.ellipse([-rr, y - rr, rr, y + rr], fill=0); d.ellipse([w - rr, y - rr, w + rr, y + rr], fill=0)
    out = card.convert("RGBA"); out.putalpha(m); out.save(OUT / f"{name}.png")
