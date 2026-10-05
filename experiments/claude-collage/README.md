# Claude 撕纸拼贴实验

全部用代码生成（Canvas 2D + Python），没有用 AI 生图。

| 目录 | 内容 | 预览 |
|---|---|---|
| `poster/` | v1 撕纸插画海报 | `poster/poster.jpg` |
| `anim/` | 10 秒卡点动画（画面 + 合成配乐/音效） | `anim/claude_intro_10s.mp4` |
| `cover/` | v2 极简封面 | `cover/cover.jpg` |
| `cover2/` | v3《纸的另一面》拼贴封面 | `cover2/cover.jpg` |

`fonts/` 是从 Google Fonts 下载到本地的字体（Anton、Abril Fatface、Space Mono、Caveat、Noto Serif SC 与 ZCOOL KuaiLe 子集）。
`cover2/assets/deepfield.png` 由 scikit-image 自带的 NASA 哈勃深空照片（公共领域）处理而来。

## 预览

在本目录启动静态服务器，再用浏览器打开对应页面：

```
python3 -m http.server 8000
# http://localhost:8000/cover2/index.html
# http://localhost:8000/anim/anim.html?play   （循环播放动画）
```

## 渲染

需要 Node + Playwright（Chromium）。在各子目录里运行：

```
node render.mjs out.png          # poster/、cover/、cover2/
node render.mjs all              # anim/：导出 300 帧到 frames/，并更新 cues.json
python3 synth.py                 # anim/：按 cues.json 合成 audio.wav（需要 numpy、scipy）
ffmpeg -framerate 30 -i frames/f%04d.png -i audio.wav -c:v libx264 -crf 17 \
  -pix_fmt yuv420p -c:a aac -b:a 256k -shortest claude_intro_10s.mp4
```
