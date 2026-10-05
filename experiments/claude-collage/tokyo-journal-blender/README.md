# 东京手账 · Blender 静帧

`scene.py` 用代码搭建整个场景并用 Cycles 渲染，所需贴图都在 `tex/` 里。

## 在你的电脑上用显卡渲染

1. 安装 Blender 4.2 或更高版本（https://www.blender.org/download/ ）。
2. 在本目录打开终端，运行：

```
blender -b -P scene.py -- device=gpu samples=128 res=200 key=36 view=standard
```

会生成 `render.png`，分辨率 2160×3840。

参数说明：
- `device=gpu`：自动按 OptiX/CUDA（NVIDIA）→ HIP（AMD）→ Metal（Mac）→ oneAPI（Intel）的顺序找显卡，找不到就用 CPU。
- `samples`：每像素采样数。越高噪点越少，也越慢。
- `res`：分辨率百分比，100 对应 1080×1920，200 对应 2160×3840。
- `key`：主光强度，默认 36。
- 其他可调：`tilt`（相机倾角，默认 26）、`dist`（相机距离，默认 92cm）、`fstop`（光圈，默认 5.6）、`fill`（补光）、`exposure`（曝光）。
- `out=路径`：指定输出文件。

参考耗时：云端 4 核 CPU 渲染 2160×3840、128 采样约 10 分钟。中高端显卡通常会快很多倍。

`preview.jpg` 是在云端 CPU 渲染的结果，额外加了暗角和颗粒。
