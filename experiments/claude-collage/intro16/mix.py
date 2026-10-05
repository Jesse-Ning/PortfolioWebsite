"""Mix the 16s intro: Suno track (re-edited), Kokoro voiceover, paper SFX — all placed from timeline.json."""
import json, subprocess
import numpy as np
import soundfile as sf
from scipy import signal

SR = 48000
TL = json.load(open('timeline.json'))
DUR = TL['duration']
N = int(DUR * SR)
rng = np.random.default_rng(3)
MUSIC = '/root/.claude/uploads/819430ea-3f67-54d8-b365-5308cd4c4a03/ca6806e2-Full_Band_Hit.mp3'


def load(path, seconds=None):
    cmd = ['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR)]
    if seconds: cmd[3:3] = ['-t', str(seconds)]
    raw = subprocess.run(cmd + ['-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


def place(bus, t, x, gain=1.0):
    i = int(round(t * SR))
    if x.ndim == 1: x = np.stack([x, x], 1)
    if i < 0: x, i = x[-i:], 0
    n = min(len(x), N - i)
    if n > 0: bus[i:i + n] += x[:n] * gain


def sos(kind, f, order=2): return signal.butter(order, f, kind, fs=SR, output='sos')
def filt(x, kind, f, order=2): return signal.sosfilt(sos(kind, f, order), x, axis=0)
def tt(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.standard_normal(int(d * SR))
def db(x): return 10 ** (x / 20)

# ---------------------------------------------------------------- music edit
OFF, FIN = TL['musicOffset'], TL['finalHit']
song = load(MUSIC, 20)
music = np.zeros((N, 2))
m_end = FIN - OFF + 0.03                                   # play the groove up to the final downbeat
body = song[:int(m_end * SR)].copy()
fo = int(0.03 * SR); body[-fo:] *= np.linspace(1, 0, fo)[:, None]
place(music, OFF, body)
# the opening band hit reused as the button ending, its hit (0.093s) landing on FIN
hit = song[:int(1.6 * SR)].copy()
tail = np.ones(len(hit)); k0 = int(0.55 * SR); tail[k0:] = np.exp(-np.arange(len(hit) - k0) / (0.32 * SR))
hit *= tail[:, None]
place(music, FIN - 0.093, hit)

# make the opening hit land as hard as the ending: +5 dB around it, easing back by 0.8 s
HIT = TL['hit']; w = np.ones(N); i0 = int((HIT - 0.03) * SR); n = int(0.8 * SR)
w[i0:i0 + n] = 1 + (db(5) - 1) * np.exp(-np.arange(n) / (0.25 * SR))
music *= w[:, None]

# ---------------------------------------------------------------- voiceover
vo = np.zeros((N, 2))
active = np.zeros(N)
for p in TL['vo']:
    x, sr = sf.read(f"tts/p{p['i']}.wav")
    x = signal.resample_poly(x, SR, sr)
    x = filt(x, 'highpass', 90)
    # gentle presence lift + low-mid warmth
    x = x + 0.25 * filt(x, 'bandpass', [2500, 5000]) + 0.15 * filt(x, 'bandpass', [150, 300])
    # simple compressor on a 20ms RMS envelope
    env = np.sqrt(np.convolve(x ** 2, np.ones(960) / 960, 'same')) + 1e-6
    thr = 0.08; gain = np.where(env > thr, (thr / env) ** 0.6, 1.0)
    x = x * gain
    x = x / (np.sqrt(np.mean(x[np.abs(x) > 0.01] ** 2)) + 1e-9) * 0.16
    place(vo, p['t'], x)
    a, b = int(p['t'] * SR), int((p['t'] + p['dur']) * SR)
    active[a:min(b, N)] = 1
# a small, dry room so the voice sits in the same space as the band
ir = noise(0.35) * np.exp(-tt(0.35) / 0.07); ir = filt(ir, 'lowpass', 5000); ir /= np.sqrt((ir ** 2).sum())
vo = vo + 0.08 * np.stack([signal.fftconvolve(vo[:, c], ir)[:N] for c in range(2)], 1)

# duck the band under the voice: -9 dB, 60ms attack, 350ms release
att, rel = np.exp(-1 / (0.06 * SR)), np.exp(-1 / (0.35 * SR))
g = np.zeros(N); cur = 0.0
for i in range(N):
    target = active[i]; c = att if target > cur else rel
    cur = target + (cur - target) * c; g[i] = cur
duck = db(-9) ** g
duck[int((FIN - 0.05) * SR):] = 1.0                       # the ending hit is never ducked
music *= duck[:, None]

# ---------------------------------------------------------------- SFX
sfx = np.zeros((N, 2))
def crinkle(d, lo=1200, hi=8000):
    n = filt(noise(d), 'bandpass', [lo, hi])
    imp = (rng.random(len(n)) < 0.02) * rng.uniform(0.3, 1, len(n))
    imp = filt(imp, 'lowpass', 300) * 30
    return n * np.clip(imp, 0, 1.5)
def thump(f0, f1, d, a=0.002, dec=0.08):
    t = tt(d); f = f1 + (f0 - f1) * np.exp(-t / (d / 4))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t / a) * np.exp(-t / dec)
def whoosh(d, f0, f1):
    x = noise(d); out = np.zeros_like(x); steps = 20; seg = len(x) // steps
    for k in range(steps):
        f = f0 * (f1 / f0) ** (k / steps); y = filt(x[k * seg:(k + 2) * seg], 'bandpass', [f * 0.7, min(f * 1.4, SR / 2 - 100)])
        out[k * seg:k * seg + len(y)] += y * np.hanning(len(y))
    return out * np.sin(np.pi * np.clip(tt(d) / d, 0, 1)) ** 2

# paper tension, then the long rip into the hit
t0 = 1.40; d = TL['hit'] - t0
rip = crinkle(d, 1000, 9000) * 1.5 + filt(noise(d), 'bandpass', [2000, 6000]) * 0.2
rip *= np.linspace(0.15, 1, len(rip)) ** 2
place(sfx, t0, rip, 0.55)
place(sfx, TL['hit'], whoosh(0.5, 400, 3000), 0.35)          # the lid flies up
place(sfx, TL['hit'], thump(150, 48, 0.6, dec=0.18), 0.5)
place(sfx, 0.0, crinkle(1.2, 2000, 7000) * np.linspace(0.6, 0, int(1.2 * SR)), 0.06)  # tiny paper rustle under the question
for t in TL['cards']:
    place(sfx, t, thump(170, 70, 0.18, dec=0.05) + 0.4 * crinkle(0.18)[:int(0.18 * SR)], 0.3)
place(sfx, TL['strip'], thump(130, 50, 0.4, dec=0.12) * 1.2 + 0.5 * filt(noise(0.4), 'lowpass', 1800) * np.exp(-tt(0.4) / 0.03), 0.45)
for i, t in enumerate(TL['ransom']):
    f = [523, 587, 659, 784][i]
    place(sfx, t, 0.5 * thump(f * 1.5, f, 0.12, dec=0.04) + 0.3 * crinkle(0.12) * np.exp(-tt(0.12) / 0.03), 0.18)
place(sfx, FIN, thump(160, 55, 0.5, dec=0.15) + 0.4 * crinkle(0.5) * np.exp(-tt(0.5) / 0.12), 0.4)

# ---------------------------------------------------------------- master
mix = music * 0.9 + vo * 1.0 + sfx
mix = filt(mix, 'highpass', 30)
mix[:int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))[:, None]
fo = int(0.25 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
pk = np.max(np.abs(mix)); mix = mix / pk * 1.15
mix = np.tanh(mix) / np.tanh(1.15) * db(-1)
sf.write('audio.wav', mix.astype(np.float32), SR, subtype='PCM_24')
print('ok', mix.shape[0] / SR, 's')
