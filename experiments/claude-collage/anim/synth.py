"""Synthesize the 10s soundtrack: 120 BPM music + SFX placed from cues.json (exported by anim.html)."""
import json
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 44100
DUR = 10.0
N = int(SR * DUR)
BEAT = 0.5
SIX = BEAT / 4
rng = np.random.default_rng(7)

music = np.zeros((N, 2))
sfx = np.zeros((N, 2))
kick_times = []


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tt(d):
    return np.arange(int(SR * d)) / SR


def add(bus, t, x, pan=0.0, gain=1.0):
    i = int(round(t * SR))
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        x = np.stack([x * l, x * r], axis=1) * 1.414
    if i < 0:
        x, i = x[-i:], 0
    n = min(len(x), N - i)
    if n > 0:
        bus[i:i + n] += x[:n] * gain


def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], 'bandpass', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def lp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, 'lowpass', fs=SR, output='sos'), x)


def hp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, 'highpass', fs=SR, output='sos'), x)


def noise(d):
    return rng.standard_normal(int(SR * d))


# ------------------------------------------------------------------ instruments
def kick(gain=1.0):
    t = tt(0.45)
    f = 45 + 110 * np.exp(-t / 0.04)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.28)
    click = hp(noise(0.45), 2000) * np.exp(-t / 0.004) * 0.3
    return np.tanh((body + click) * 1.6) * gain


def clap():
    d = 0.3
    t = tt(d)
    n = bp(noise(d), 900, 3500)
    e = np.zeros_like(t)
    for off in (0, 0.011, 0.022):
        k = t >= off
        e[k] += np.exp(-(t[k] - off) / (0.012 if off < 0.02 else 0.12))
    return n * e * 0.5


def snare(gain=1.0):
    t = tt(0.22)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.05)
    n = bp(noise(0.22), 1200, 7000) * np.exp(-t / 0.07)
    return (tone * 0.5 + n * 0.8) * gain


def hat(open_=False):
    d = 0.3 if open_ else 0.06
    t = tt(d)
    return hp(noise(d), 7000) * np.exp(-t / (0.09 if open_ else 0.018)) * 0.35


def shaker():
    t = tt(0.07)
    return bp(noise(0.07), 5000, 12000) * np.minimum(1, t / 0.015) * np.exp(-t / 0.025) * 0.18


def pluck(m, d=0.9, bright=0.5):
    """Karplus-Strong string (ukulele-ish), vectorised with lfilter."""
    f = mtof(m)
    L = int(SR / f)
    n = int(SR * d)
    exc = np.zeros(n)
    exc[:L] = lp(rng.uniform(-1, 1, L), 1500 + bright * 6000)
    a = np.zeros(L + 2)
    a[0] = 1
    a[L] = a[L + 1] = -0.4985
    y = signal.lfilter([1], a, exc)
    return y * env(n, 0.001, d * 0.5) * 0.6


def epiano(m, d=0.8):
    t = tt(d)
    f = mtof(m)
    tine = np.sin(2 * np.pi * f * t + 0.6 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / 0.15))
    bell = np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.05) * 0.15
    return (tine + bell) * env(len(t), 0.003, d * 0.45) * 0.28


def marimba(m, d=0.5):
    t = tt(d)
    f = mtof(m)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.22) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.03)
    return x * np.minimum(1, t / 0.002) * 0.42


def bass(m, d=0.24):
    t = tt(d)
    f = mtof(m)
    x = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2 * t)
    x = np.tanh(x * 1.5) * np.minimum(1, t / 0.005) * np.minimum(1, (d - t) / 0.02)
    return lp(x, 900) * 0.55


def pad(notes, d):
    t = tt(d)
    x = np.zeros_like(t)
    for m in notes:
        for det in (-0.08, 0.08):
            f = mtof(m + det)
            x += signal.sawtooth(2 * np.pi * f * t + rng.uniform(0, 6))
    x = lp(x, 1400) / (len(notes) * 2)
    e = np.minimum(1, t / 0.3) * np.minimum(1, (d - t) / 0.3)
    return x * e * 0.22


def crash(gain=1.0, d=2.2):
    t = tt(d)
    return hp(noise(d), 4500) * np.exp(-t / 0.7) * 0.32 * gain


# ------------------------------------------------------------------ arrangement
FMAJ7 = [53, 57, 60, 64]
G6 = [55, 59, 62, 64]
CMAJ7 = [48, 52, 55, 59]
AM7 = [57, 60, 64, 67]
F = [53, 57, 60, 65]
G = [55, 59, 62, 67]

# intro bars: pad + plucked arpeggio
add(music, 0.0, pad(FMAJ7, 2.0), gain=0.8)
add(music, 2.0, pad(G6, 1.9), gain=0.9)
for i in range(16):
    t = i * SIX * 2
    ch = FMAJ7 if t < 2 else G6
    if t >= 3.875:
        break
    m = (ch + [c + 12 for c in ch])[[0, 1, 2, 3, 4, 3, 2, 1][i % 8]] + 12
    add(music, t, pluck(m, 0.7), pan=-0.35, gain=0.55)

# intro drums
for t in (0.0, 1.0, 2.0, 2.5, 3.0, 3.5):
    add(music, t, kick(1.0 if t == 0 else 0.75)); kick_times.append(t)
for i in range(8, 30):  # shaker 16ths from 1.0
    add(music, i * SIX, shaker(), pan=0.4, gain=0.7 if i % 2 else 1.0)
# snare build-up 3.0 -> 3.875
for i, t in enumerate(np.arange(3.0, 3.5, SIX)):
    add(music, t, snare(0.25 + 0.6 * i / 7), pan=0.1)
for t in np.arange(3.5, 3.875, SIX / 2):
    add(music, t, snare(0.5), pan=-0.1)

# drop: 4.0 -> 9.5
add(music, 4.0, crash(1.2))
add(music, 8.0, crash(0.8))
for k in range(11):  # beats 4.0 .. 9.0
    t = 4.0 + k * BEAT
    add(music, t, kick()); kick_times.append(t)
    if k % 2 == 1:
        add(music, t, clap(), pan=0.05)
    add(music, t + BEAT / 2, hat(True), pan=0.3, gain=0.8)
for i in range(44):
    t = 4.0 + i * SIX
    add(music, t, hat(), pan=0.45, gain=1.0 if i % 4 == 2 else 0.55)
# snare fill into the final hit
for i, t in enumerate(np.arange(9.0, 9.5, SIX / 2)):
    add(music, t, snare(0.35 + 0.08 * i), pan=(-0.3 if i % 2 else 0.3))

bar_chords = [(4.0, CMAJ7, 36), (6.0, AM7, 33), (8.0, F, 29), (9.0, G, 31)]
for start, ch, root in bar_chords:
    length = 1.0 if start >= 8 else 2.0
    add(music, start, pad(ch, length), gain=0.7)
    for st in (0, 3, 6, 10, 12):
        t = start + st * SIX
        if t < start + length:
            for m in ch:
                add(music, t, epiano(m + 12, 0.5), pan=-0.15, gain=0.5)
    for j in range(int(length / (SIX * 2))):
        t = start + j * SIX * 2
        m = root + (12 if j % 2 else 0)
        add(music, t + 0.02, bass(m + 12, 0.22), gain=1.0)

melody = [
    (4.0, [(0, 76, 2), (3, 79, 1), (4, 81, 2), (6, 79, 2), (8, 76, 2), (10, 74, 2), (12, 76, 4)]),
    (6.0, [(0, 72, 2), (3, 76, 1), (4, 79, 2), (6, 76, 2), (8, 81, 2), (10, 79, 2), (12, 84, 3)]),
    (8.0, [(0, 81, 2), (2, 79, 1), (3, 77, 1), (4, 76, 2), (6, 74, 2), (8, 79, 1), (9, 81, 1), (10, 83, 2)]),
]
for start, notes in melody:
    for st, m, ln in notes:
        add(music, start + st * SIX, marimba(m, 0.25 + ln * SIX), pan=0.2, gain=0.75)

# final hit 9.5: big chord that rings out
FIN = [48, 55, 60, 62, 64, 67]
add(music, 9.5, kick(1.1)); kick_times.append(9.5)
add(music, 9.5, crash(1.3, 0.5))
add(music, 9.5, marimba(84, 0.5), pan=0.2, gain=0.9)
add(music, 9.5, bass(36 + 12, 0.48), gain=1.1)
for m in FIN:
    add(music, 9.5, epiano(m + 12, 0.5), gain=0.6)
    add(music, 9.5, pluck(m + 12, 0.5), pan=-0.3, gain=0.5)

# sidechain duck everything but drums on kicks (simple: duck whole music bus lightly)
duck = np.ones(N)
for t in kick_times:
    i = int(t * SR)
    n = min(int(0.2 * SR), N - i)
    duck[i:i + n] = np.minimum(duck[i:i + n], 1 - 0.35 * np.exp(-np.arange(n) / SR / 0.06))
music *= duck[:, None]


# ------------------------------------------------------------------ SFX
PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24]


def blip(f0, f1, d=0.08):
    t = tt(d)
    f = f1 + (f0 - f1) * np.exp(-t / (d / 4))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.001, d / 3)


def crinkle(d, lo=1500, hi=7000):
    n = bp(noise(d), lo, hi)
    imp = (rng.random(len(n)) < 0.02).astype(float) * rng.uniform(0.3, 1, len(n))
    imp = lp(imp, 300) * 30
    return n * np.clip(imp, 0, 1.5)


def whoosh(d=0.35, f0=300, f1=2600):
    t = tt(d)
    x = noise(d)
    out = np.zeros_like(x)
    steps = 24
    seg = len(x) // steps
    for k in range(steps):
        f = f0 * (f1 / f0) ** (k / steps)
        y = bp(x[k * seg:(k + 2) * seg], f * 0.7, min(f * 1.4, SR / 2 - 100))
        out[k * seg:k * seg + len(y)] += y * np.hanning(len(y))
    e = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    return out * e * 0.6


def mixl(*xs):
    out = np.zeros(max(len(x) for x in xs))
    for x in xs:
        out[:len(x)] += x
    return out


def make_sfx(c):
    kind, p, t = c['sfx'], c['p'], c['t']
    if kind == 'slap':
        d = 0.25
        x = mixl(blip(160, 60, 0.18) * (1.2 if p else 0.8), lp(noise(d), 2500) * env(int(SR * d), 0.001, 0.03) * 0.6, crinkle(d) * 0.25)
        return t, x, 0.0, 0.9
    if kind == 'tick':
        x = mixl(bp(noise(0.03), 2500, 8000) * env(int(SR * 0.03), 0.0005, 0.006), blip(1800 + p * 120, 1400 + p * 100, 0.03) * 0.3)
        return t, x, rng.uniform(-0.4, 0.4), 0.55
    if kind == 'pop':
        m = 72 + PENTA[max(0, p)] if p >= 0 else 60
        f = mtof(m)
        x = mixl(blip(f * 1.6, f, 0.14), crinkle(0.08) * 0.15)
        return t, x, np.clip(-0.5 + p * 0.2, -0.6, 0.6), 0.55
    if kind == 'blip':
        f = mtof(79 + PENTA[p])
        return t, blip(f * 0.6, f * 1.2, 0.09), 0.0, 0.4
    if kind == 'whoosh':
        d = 0.42
        return t - 0.3, whoosh(d), (-0.5 if p == 0 else 0.5 if p == 2 else 0), 0.7
    if kind == 'swish':
        d = 0.25
        return t - 0.12, whoosh(d, 900, 5000), 0.4, 0.55
    if kind == 'boom':
        tt_ = tt(1.2)
        f = 38 + 90 * np.exp(-tt_ / 0.08)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt_ / 0.5) + lp(noise(1.2), 800) * np.exp(-tt_ / 0.08) * 0.5
        return t, np.tanh(x * 1.4), 0.0, 0.8
    if kind == 'ding':
        tt_ = tt(1.4)
        f = mtof(91)
        x = sum(a * np.sin(2 * np.pi * f * r * tt_) * np.exp(-tt_ / dd) for r, a, dd in [(1, 1, 0.6), (2.0, 0.4, 0.3), (3.01, 0.25, 0.15), (4.2, 0.15, 0.08)])
        return t, x * 0.35, 0.3, 0.7
    if kind == 'scribble':
        d = max(0.15, p)
        tt_ = tt(d)
        am = 0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 15 * tt_ + 3 * np.sin(2 * np.pi * 4 * tt_)))
        am = lp(am, 60)
        x = bp(noise(d), 2500, 7000) * am * np.minimum(1, (d - tt_) / 0.03)
        return t, x * 0.45, 0.35, 0.8
    if kind == 'stamp':
        tt_ = tt(0.4)
        x = mixl(blip(140, 55, 0.3) * 1.2, np.sin(2 * np.pi * 420 * tt_) * np.exp(-tt_ / 0.02) * 0.4 + lp(noise(0.4), 1800) * np.exp(-tt_ / 0.025) * 0.6)
        return t, x, -0.35, 0.95
    if kind == 'thud':
        x = mixl(blip(240 + p * 40, 110 + p * 20, 0.12), lp(noise(0.12), 2000) * env(int(SR * 0.12), 0.001, 0.02) * 0.4)
        return t, x, 0.0, 0.55
    if kind == 'rip':
        d = 0.24
        tt_ = tt(d)
        x = crinkle(d, 1200, 9000) * 1.4 + bp(noise(d), 2000, 6000) * 0.25
        e = np.minimum(1, tt_ / 0.01) * np.exp(-tt_ / 0.12)
        return t - 0.02, x * e, -0.2, 0.9
    if kind == 'hit':
        f = [98, 110, 123, 131][p % 4]
        x = mixl(blip(f * 2.2, f, 0.22) * 1.1, bp(noise(0.06), 1500, 6000) * env(int(SR * 0.06), 0.0005, 0.012) * 0.6)
        return t, np.tanh(x * 1.3), 0.0, 0.7
    if kind == 'check':
        f = mtof(84 + PENTA[p])
        x = mixl(bp(noise(0.04), 3000, 9000) * env(int(SR * 0.04), 0.0005, 0.01) * 0.6, blip(f, f, 0.12) * 0.5)
        return t, x, 0.45, 0.55
    if kind == 'riser':
        d = p
        tt_ = tt(d)
        x = whoosh(d, 400, 9000) * 1.4
        f = 200 * (8 ** (tt_ / d))
        x += np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.12
        x *= (tt_ / d) ** 1.6
        x[int(SR * (d - 0.06)):] *= np.linspace(1, 0, len(x) - int(SR * (d - 0.06)))
        return t, x, 0.0, 0.7
    if kind == 'final':
        tt_ = tt(0.5)
        x = mixl(blip(120, 45, 0.5), crinkle(0.3) * 0.3)
        return t, x, 0.0, 0.7
    raise ValueError(kind)


cues = json.load(open('cues.json'))
for c in cues:
    t, x, pan, g = make_sfx(c)
    add(sfx, t, x, pan=pan, gain=g)

# ------------------------------------------------------------------ mix
def reverb(x, d=1.1, wet=0.18):
    t = tt(d)
    ir = np.stack([noise(d), noise(d)], axis=1) * np.exp(-t / 0.35)[:, None]
    ir = np.stack([lp(ir[:, 0], 6000), lp(ir[:, 1], 6000)], axis=1)
    ir /= np.sqrt((ir ** 2).sum(axis=0))
    y = np.stack([signal.fftconvolve(x[:, k], ir[:, k])[:N] for k in range(2)], axis=1)
    return x + y * wet


mix = reverb(music, wet=0.22) * 0.8 + reverb(sfx, 0.8, 0.12) * 0.95
mix = hp(mix.T, 25).T
fade = np.ones(N)
fade[-int(0.12 * SR):] = np.linspace(1, 0, int(0.12 * SR))
mix *= fade[:, None]
mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(mix * 1.6) / np.tanh(1.6) * 0.95  # soft limiter
wavfile.write('audio.wav', SR, (mix * 32767).astype(np.int16))
print('ok', len(cues), 'sfx cues')
