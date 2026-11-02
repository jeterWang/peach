"""faster-whisper 子进程。一行一个 JSON 请求，一行一个 JSON 结果。

这个文件不导入 Peach。安装版把解释器指到已安装 `asr` 的虚拟环境，由那个进程加载
CUDA 动态库。协议只传模型、音轨和识别参数，不传密钥。
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path


def prepare_windows_dlls() -> None:
    """把本环境 `nvidia/*/bin` 加进 DLL 搜索路径。安装包的 PATH 不包含这些目录。"""
    if os.name != "nt" or not hasattr(os, "add_dll_directory"):
        return
    roots = [Path(sys.prefix) / "Lib" / "site-packages"]
    try:
        import site
        roots.extend(Path(item) for item in site.getsitepackages())
    except Exception:
        pass
    seen: set[str] = set()
    for root in roots:
        nvidia = root / "nvidia"
        if not nvidia.is_dir():
            continue
        for bin_dir in sorted(nvidia.glob("*/bin")):
            if not bin_dir.is_dir():
                continue
            key = str(bin_dir)
            if key in seen:
                continue
            seen.add(key)
            os.add_dll_directory(key)
            os.environ["PATH"] = key + os.pathsep + os.environ.get("PATH", "")


def load_model(job: dict, cache: dict):
    key = (job.get("model"), job.get("device"), job.get("compute_type"), job.get("download_root"))
    if cache.get("key") != key:
        from faster_whisper import WhisperModel
        cache["model"] = WhisperModel(
            str(job.get("model") or ""),
            device=str(job.get("device") or "cpu"),
            compute_type=str(job.get("compute_type") or "int8"),
            download_root=str(job.get("download_root") or ""),
        )
        cache["key"] = key
    return cache["model"]


def transcribe(model, job: dict) -> list[dict]:
    options = job.get("options") if isinstance(job.get("options"), dict) else {}
    segments, _info = model.transcribe(str(job.get("wav") or ""), **options)
    cues = []
    for segment in segments:
        cues.append({
            "start": float(segment.start),
            "end": float(segment.end),
            "text": str(getattr(segment, "text", "") or "").strip(),
            "no_speech_prob": float(getattr(segment, "no_speech_prob", 0.0) or 0.0),
            "compression_ratio": float(getattr(segment, "compression_ratio", 0.0) or 0.0),
            "avg_logprob": float(getattr(segment, "avg_logprob", 0.0) or 0.0),
        })
    return cues


def handle(job: dict, cache: dict) -> dict:
    try:
        cues = transcribe(load_model(job, cache), job)
    except Exception as exc:
        return {"id": job.get("id"), "error": str(exc)[:300]}
    return {"id": job.get("id"), "cues": cues}


def main() -> None:
    prepare_windows_dlls()
    cache: dict = {}
    while True:
        raw = sys.stdin.readline()
        if not raw:
            break
        text = raw.strip()
        if not text:
            continue
        job: dict = {}
        try:
            loaded = json.loads(text)
            job = loaded if isinstance(loaded, dict) else {}
            if not isinstance(loaded, dict):
                body = {"id": None, "error": "请求必须是 JSON 对象"}
            else:
                body = handle(job, cache)
        except Exception as exc:
            body = {"id": job.get("id"), "error": str(exc)[:300]}
        sys.stdout.write(json.dumps(body, ensure_ascii=False) + "\n")
        sys.stdout.flush()


if __name__ == "__main__":
    main()
