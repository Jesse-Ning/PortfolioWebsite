"""Tokyo journal mix: the user's Suno track re-edited to the cut, paper/pen foley, loudness-normalised louder than before."""
import json, subprocess
import numpy as np
import soundfile as sf
import pyloudnorm as pyln
from scipy import signal

SR = 48000
TL = json.load(open('timeline.json'))
B, HIT, FIN, OFF, DUR = TL['beats'], TL['hit'], TL['finalHit'], TL['musicOffset'], TL['duration']
N = int(DUR * SR)
rng = np.random.default_rng(21)
MUSIC = '/root/.claude/uploads/819430ea-3f67-54d8-b365-5308cd4c4a03/ca6806e2-Full_Band_Hit.mp3'


def load(path, seconds):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-t', str(seconds), '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
def place(bus, t, x, gain=1.0, pan=0.0):
    i = int(round(t * SR))
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        x = np.stack([x * l, x * r], 1) * 1.414
    if i < 0: x, i = x[-i:], 0
    n = min(len(x), N - i)
    if n > 0: bus[i:i + n] += x[:n] * gain
def filt(x, kind, f, order=2): return signal.sosfilt(signal.butter(order, f, kind, fs=SR, output='sos'), x, axis=0)
def tt(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.standard_normal(int(d * SR))
def db(x): return 10 ** (x / 20)

# ---------------- music: groove from the hit to the last beat, then the band hit again as the button
song = load(MUSIC, 20)
music = np.zeros((N, 2))
body = song[:int((FIN - OFF + 0.03) * SR)].copy()
fo = int(0.03 * SR); body[-fo:] *= np.linspace(1, 0, fo)[:, None]
place(music, OFF, body)
hit = song[:int(1.6 * SR)].copy()
env = np.ones(len(hit)); k0 = int(0.55 * SR); env[k0:] = np.exp(-np.arange(len(hit) - k0) / (0.35 * SR))
place(music, FIN - 0.093, hit * env[:, None])
# lift the quiet middle of the track a little so the bed never drops away (no voiceover this time)
quiet = np.ones(N); a, b = int((HIT + 0.7) * SR), int((B[12]) * SR)
ramp = int(0.4 * SR); quiet[a:b] = db(3.5); quiet[a:a + ramp] = np.linspace(1, db(3.5), ramp); quiet[b - ramp:b] = np.linspace(db(3.5), 1, ramp)
music *= quiet[:, None]

# ---------------- foley
sfx = np.zeros((N, 2))
def crinkle(d, lo=1200, hi=8000, dens=0.02):
    n = filt(noise(d), 'bandpass', [lo, hi])
    imp = (rng.random(len(n)) < dens) * rng.uniform(0.3, 1, len(n))
    return n * np.clip(filt(imp, 'lowpass', 300) * 30, 0, 1.5)
def thump(f0, f1, d, dec=0.08):
    t = tt(d); f = f1 + (f0 - f1) * np.exp(-t / (d / 4))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t / 0.002) * np.exp(-t / dec)
def rip(d):
    x = crinkle(d, 1000, 9000) * 1.4 + filt(noise(d), 'bandpass', [2000, 6000]) * 0.2
    return x * np.minimum(1, tt(d) / 0.01) * np.exp(-tt(d) / (d * 0.5))
def pen(d):
    t = tt(d); am = filt((np.sin(2 * np.pi * 7 * t + 2 * np.sin(2 * np.pi * 2.3 * t)) > -0.2).astype(float), 'lowpass', 40)
    return filt(noise(d), 'bandpass', [2500, 7500]) * am * np.minimum(1, t / 0.03) * np.minimum(1, (d - t) / 0.05)
def whoosh(d, f0, f1):
    x = noise(d); out = np.zeros_like(x); steps = 16; seg = len(x) // steps
    for k in range(steps):
        f = f0 * (f1 / f0) ** (k / steps); y = filt(x[k * seg:(k + 2) * seg], 'bandpass', [f * 0.7, min(f * 1.4, SR / 2 - 100)])
        out[k * seg:k * seg + len(y)] += y * np.hanning(len(y))
    return out * np.sin(np.pi * np.clip(tt(d) / d, 0, 1)) ** 2

place(sfx, 0.0, crinkle(0.5, 600, 5000, 0.04) * np.linspace(1, 0, int(0.5 * SR)), 0.25)       # page settles
place(sfx, 0.08, pen(0.5), 0.12, 0.2)                                                         # writes the date
for t, d, g, p in [(HIT - 0.06, 0.32, 0.55, -0.2), (B[4] - 0.05, 0.3, 0.45, 0.3), (B[16] - 0.05, 0.26, 0.4, 0.1)]:   # the tears
    place(sfx, t, rip(d), g, p)
for t, d in [(B[1], 0.8), (B[2], 0.45), (B[13], 0.35), (B[13] + 0.4, 0.9), (B[15], 0.6), (B[15] + 0.3, 0.6), (B[20], 0.6), (FIN, 0.5)] + [(B[5 + i], 0.5) for i in range(6)]:
    place(sfx, t, pen(d), 0.09, rng.uniform(-0.3, 0.3))
for t in [B[2], B[9]]:                                                                         # washi tape
    place(sfx, t - 0.05, crinkle(0.18, 1500, 9000, 0.05) * np.exp(-tt(0.18) / 0.06), 0.2, 0.2)
for t in [B[8], B[11]]:                                                                        # polaroids slapped down
    place(sfx, t, thump(200, 80, 0.16, 0.04) + 0.5 * crinkle(0.16) * np.exp(-tt(0.16) / 0.03), 0.3)
place(sfx, B[12], thump(140, 55, 0.4, 0.1) * 1.2 + 0.4 * filt(noise(0.4), 'lowpass', 1500) * np.exp(-tt(0.4) / 0.03), 0.45)   # hanko
place(sfx, B[14] - 0.2, whoosh(0.4, 800, 3500), 0.12, 0.3)                                     # ticket slides out
for t in [B[17], B[18], B[21]]:
    place(sfx, t, thump(900, 600, 0.09, 0.03), 0.08)

# ---------------- master, louder than last time: -13 LUFS integrated, peaks under -1 dBFS
mix = music + sfx
mix = filt(mix, 'highpass', 30)
mix[:int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))[:, None]
fo = int(0.3 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
meter = pyln.Meter(SR)
mix = pyln.normalize.loudness(mix, meter.integrated_loudness(mix), -13.0)
# soft clip only what pokes above -1 dBFS
ceil = db(-1.0); mix = np.where(np.abs(mix) > ceil * 0.8, np.sign(mix) * (ceil * 0.8 + (ceil * 0.2) * np.tanh((np.abs(mix) - ceil * 0.8) / (ceil * 0.2))), mix)
sf.write('audio.wav', mix.astype(np.float32), SR, subtype='PCM_24')
print('LUFS', round(meter.integrated_loudness(mix), 1), 'peak dBFS', round(20 * np.log10(np.abs(mix).max()), 2))
