import sherpa_onnx, soundfile as sf, numpy as np, sys
M = 'kokoro-multi-lang-v1_1'
cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(
    model=f'{M}/model.onnx', voices=f'{M}/voices.bin', tokens=f'{M}/tokens.txt', data_dir=f'{M}/espeak-ng-data',
    dict_dir=f'{M}/dict', lexicon=f'{M}/lexicon-us-en.txt,{M}/lexicon-zh.txt'), num_threads=4),
    rule_fsts=f'{M}/date-zh.fst,{M}/phone-zh.fst,{M}/number-zh.fst', max_num_sentences=1)
tts = sherpa_onnx.OfflineTts(cfg)
def say(text, sid, speed=1.0, out=None):
    a = tts.generate(text, sid=sid, speed=speed)
    x = np.array(a.samples, dtype=np.float32)
    if out: sf.write(out, x, a.sample_rate)
    return x, a.sample_rate
