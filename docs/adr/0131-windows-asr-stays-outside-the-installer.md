# ADR-0131：Windows 安装包不携带日语转写的 CUDA 运行库

- 状态：已采纳
- 日期：2026-11-02
- 关系：补充 [ADR-0125](0125-packaged-scraping-runtime.md) 的桌面分发边界。采集桥仍随包装进安装包；日语转写不沿用那条「运行时不依赖用户环境」的做法。

## 背景

中文字幕在没有可用日语外挂时用 faster-whisper 加载 kotoba-whisper。可选依赖 `asr` 在已有 NVIDIA 虚拟环境里大约 2GB，其中绝大部分是 `nvidia` 的 CUDA 动态库。当前 Windows 安装包大约 188MB。把 CUDA 打进 `setup.exe` 会使安装包体积和许可证都变成另一件事，PyInstaller 冻结进程里的 DLL 搜索也不稳定。

开始菜单入口是安装目录里的 `Peach.exe --show`。托盘拉起的 `peach serve` 在独立包里就是这个冻结程序，进程内导入不到 faster-whisper。手工再开一个源码 `peach serve` 会和托盘抢端口，也留着控制台。

## 决策

1. `scripts/build_windows.ps1` 不收集 `faster_whisper` 和 `ctranslate2`。安装包只带不导入 Peach 的 `asr_worker.py`。
2. 冻结进程或当前解释器导入失败时，按 `PEACH_ASR_PYTHON`、`PEACH_ASR_HOME`、`subtitles.asr_python`、程序或源码树旁边带有 faster-whisper 的 `.venv` 寻找解释器，用子进程转写。当前解释器自己能导入时仍在进程内转写。
3. 子进程去掉冻结程序的 `PYTHONHOME`、`PYTHONPATH` 和 `_PYI_` 变量，并在 Windows 上把该虚拟环境的 `nvidia/*/bin` 加进 DLL 搜索路径。不弹出控制台。子进程由服务拉起，托盘的 Job 结束时一并退出。
4. 独立包的托盘继续按 `config.toml` 的 `[server] host` 和 `port` 启动服务，不绑定 80/443。源码托盘保持 80/443。

## 后果

日常入口仍是开始菜单图标。机器上需要已有的 `asr` 虚拟环境，并在配置或环境变量里指到它；没有这份环境时队列说明原因，不访问云端语音接口。翻译仍使用本机配置的 DeepSeek HTTP 接口，密钥仍只来自 `DEEPSEEK_API_KEY`。安装包体积保持现有量级。源码部署执行 `uv sync --locked --extra asr` 后行为与以前相同。
