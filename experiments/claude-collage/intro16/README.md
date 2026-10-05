# 《纸的另一面》16 秒片头

- 画面：`index.html`，复用 `../cover4/assets` 里的素材。`node render.mjs all` 导出帧。
- 时间线：`timeline.json`，记录旁白、音乐和动画的所有时间点。
- 旁白：`tts/`，用 sherpa-onnx + Kokoro v1.1-zh 合成（Apache-2.0），音色 sid 90，1.1 倍速。模型没放进仓库，下载地址是 k2-fsa/sherpa-onnx 的 tts-models 发布页。
- 混音：`mix.py`。音乐是用户提供的 Suno 曲目，不在仓库里，需要把 `mix.py` 顶部的 `MUSIC` 指向本地文件。
- 成片：`claude_intro_16s_share.mp4`。
