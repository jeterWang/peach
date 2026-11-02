"""安装版进程里没有 faster-whisper，也不携带 NVIDIA CUDA 运行库。

发现本机已经装好可选依赖 `asr` 的解释器，由它在子进程里转写。解释器按
`PEACH_ASR_PYTHON`、`PEACH_ASR_HOME`、`subtitles.asr_python`、可执行文件或源码树
旁边的 `.venv` 这个顺序找。当前进程自己能导入时继续在进程内转写。
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import threading
from collections.abc import Mapping, Sequence
from pathlib import Path

PYTHON_ENV = "PEACH_ASR_PYTHON"
HOME_ENV = "PEACH_ASR_HOME"
MISSING = (
    "未安装日语转写组件。安装版在 config.toml 写入 subtitles.asr_python，"
    "或设置 PEACH_ASR_PYTHON / PEACH_ASR_HOME，指向已执行 "
    "uv sync --locked --extra asr 的虚拟环境"
)
_STRIPPED = {"PYTHONHOME", "PYTHONPATH", "PYTHONNOUSERSITE"}
_INTERPRETER_NAMES = (
    ("Scripts", "python.exe"),
    ("Scripts", "python"),
    ("bin", "python"),
    ("bin", "python3"),
)


class AsrRuntimeError(RuntimeError):
    """转写子进程没有给出可用结果。消息给界面。"""


def interpreter_in(home: Path) -> Path | None:
    """虚拟环境根目录里的解释器。Windows 在 `Scripts`，POSIX 在 `bin`。"""
    root = Path(home)
    for parts in _INTERPRETER_NAMES:
        candidate = root.joinpath(*parts)
        if candidate.is_file():
            return candidate
    return None


def nearest_venv_python(start: Path) -> Path | None:
    """从文件或目录向上找最近的 `.venv`。"""
    origin = Path(start)
    cursor = origin if origin.is_dir() else origin.parent
    for parent in (cursor, *cursor.parents):
        found = interpreter_in(parent / ".venv")
        if found is not None:
            return found
    return None


def site_packages(python: Path) -> Path | None:
    """标准虚拟环境的 site-packages。认不出布局时返回 None，不猜系统解释器。"""
    program = Path(python)
    root = program.parent.parent if program.parent.name.casefold() in {"scripts", "bin"} else None
    if root is None:
        return None
    windows = root / "Lib" / "site-packages"
    if windows.is_dir():
        return windows
    lib = root / "lib"
    if not lib.is_dir():
        return None
    matches = sorted(path for path in lib.glob("python*/site-packages") if path.is_dir())
    return matches[-1] if matches else None


def has_faster_whisper(python: Path) -> bool:
    site = site_packages(python)
    return site is not None and (site / "faster_whisper" / "__init__.py").is_file()


def nvidia_bin_dirs(python: Path) -> list[Path]:
    """该虚拟环境里 `nvidia/*/bin`。Windows 要靠它们找到 CUDA 动态库。"""
    site = site_packages(python)
    if site is None:
        return []
    nvidia = site / "nvidia"
    if not nvidia.is_dir():
        return []
    return sorted(path for path in nvidia.glob("*/bin") if path.is_dir())


def _same_file(left: Path, right: Path) -> bool:
    try:
        return left.resolve() == right.resolve()
    except OSError:
        return False


def resolve_asr_python(
    *,
    environ: Mapping[str, str],
    executable: Path,
    configured: str = "",
    extra_roots: Sequence[Path] = (),
    current: Path | None = None,
    current_importable: bool = False,
    frozen: bool = False,
) -> tuple[Path | None, str]:
    """返回 `(解释器, 失败说明)`。

    说明非空时不再改用其他解释器。两者都空，表示用当前进程。
    """
    explicit = environ.get(PYTHON_ENV, "").strip()
    if explicit:
        path = Path(explicit)
        if not path.is_file():
            return None, "PEACH_ASR_PYTHON 指向的解释器不存在"
        if current_importable and not frozen and current is not None and _same_file(path, current):
            return None, ""
        return path, ""
    home = environ.get(HOME_ENV, "").strip()
    if home:
        found = interpreter_in(Path(home))
        if found is None:
            return None, "PEACH_ASR_HOME 下没有 Python 解释器"
        if current_importable and not frozen and current is not None and _same_file(found, current):
            return None, ""
        return found, ""
    chosen = configured.strip()
    if chosen:
        path = Path(chosen)
        if not path.is_file():
            return None, "subtitles.asr_python 指向的解释器不存在"
        if current_importable and not frozen and current is not None and _same_file(path, current):
            return None, ""
        return path, ""
    if current_importable and not frozen:
        return None, ""
    for start in (executable, *extra_roots):
        found = nearest_venv_python(Path(start))
        if found is not None and has_faster_whisper(found):
            return found, ""
    return None, ""


def child_environment(
    base: Mapping[str, str], python: Path, *, drop_path_prefix: Path | None = None,
) -> dict[str, str]:
    """子进程使用自己的解释器，不继承冻结程序的 Python 路径。

    NVIDIA 的 `bin` 目录放在 PATH 最前。安装目录里的目录从 PATH 去掉，避免冻结包里的
    动态库盖住虚拟环境的 CUDA 库。
    """
    env = {
        key: value for key, value in base.items()
        if not key.startswith("_PYI_") and key not in _STRIPPED
    }
    env["PYTHONIOENCODING"] = "utf-8"
    env["PYINSTALLER_RESET_ENVIRONMENT"] = "1"
    path = env.get("PATH", "")
    if drop_path_prefix is not None:
        needle = str(drop_path_prefix).rstrip("\\/").casefold()

        def inside_install(item: str) -> bool:
            folded = item.rstrip("\\/").casefold()
            return folded == needle or folded.startswith(needle + "\\") or folded.startswith(needle + "/")

        path = os.pathsep.join(item for item in path.split(os.pathsep) if item and not inside_install(item))
    bins = [str(item) for item in nvidia_bin_dirs(python)]
    if bins:
        path = os.pathsep.join(bins) + (os.pathsep + path if path else "")
    env["PATH"] = path
    return env


def worker_script() -> Path:
    """冻结包里的脚本在资源根，源码运行时用包内这份。"""
    bundled = Path(getattr(sys, "_MEIPASS", "")) / "asr_worker.py"
    if bundled.is_file():
        return bundled
    return Path(__file__).resolve().with_name("asr_worker.py")


class AsrProcess:
    """常驻的转写进程。模型留在子进程里，托盘结束服务时一并退出。"""

    def __init__(
        self, python: Path, script: Path, *,
        popen=subprocess.Popen, environ: Mapping[str, str] | None = None,
        drop_path_prefix: Path | None = None,
    ) -> None:
        self.python = Path(python)
        self.script = Path(script)
        self._popen = popen
        self._environ = environ if environ is not None else os.environ
        self._drop_path_prefix = drop_path_prefix
        self._proc: subprocess.Popen | None = None
        self._lock = threading.Lock()
        self._stderr = ""
        self._next_id = 0

    def transcribe(self, job: Mapping[str, object], *, timeout: float = 7200) -> list[dict]:
        with self._lock:
            self._ensure()
            process = self._proc
            if process is None or process.stdin is None or process.stdout is None:
                raise AsrRuntimeError("日语转写进程没有启动")
            self._next_id += 1
            payload = dict(job)
            payload["id"] = self._next_id
            try:
                process.stdin.write((json.dumps(payload, ensure_ascii=False) + "\n").encode("utf-8"))
                process.stdin.flush()
            except (BrokenPipeError, OSError) as exc:
                detail = self._stop()
                raise AsrRuntimeError(detail or "日语转写进程已退出") from exc
            line = self._read_stdout(process, timeout)
            if process.poll() not in (None, 0) and not line:
                detail = self._stop()
                raise AsrRuntimeError(detail or "日语转写进程已退出")
            if not line:
                self._stop()
                raise AsrRuntimeError("日语转写进程没有返回结果")
            try:
                body = json.loads(line)
            except json.JSONDecodeError as exc:
                self._stop()
                raise AsrRuntimeError("日语转写进程返回的不是 JSON") from exc
            if body.get("id") != payload["id"]:
                self._stop()
                raise AsrRuntimeError("日语转写进程返回了另一条结果")
            if body.get("error"):
                raise AsrRuntimeError(str(body["error"])[:300])
            cues = body.get("cues")
            if not isinstance(cues, list):
                raise AsrRuntimeError("日语转写进程没有返回字幕段")
            return [item for item in cues if isinstance(item, dict)]

    def close(self) -> None:
        with self._lock:
            self._stop()

    def _ensure(self) -> None:
        process = self._proc
        if process is not None and process.poll() is None:
            return
        if not self.script.is_file():
            raise AsrRuntimeError(f"日语转写脚本缺失：{self.script.name}")
        flags = getattr(subprocess, "CREATE_NO_WINDOW", 0) if os.name == "nt" else 0
        self._stderr = ""
        self._proc = self._popen(
            [str(self.python), "-X", "utf8", str(self.script)],
            stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            env=child_environment(self._environ, self.python, drop_path_prefix=self._drop_path_prefix),
            creationflags=flags,
        )
        self._drain_stderr(self._proc)

    def _drain_stderr(self, process: subprocess.Popen) -> None:
        stream = process.stderr
        if stream is None:
            return

        def read() -> None:
            chunks: list[bytes] = []
            while True:
                piece = stream.readline()
                if not piece:
                    break
                chunks.append(piece)
                text = b"".join(chunks).decode("utf-8", "replace")
                self._stderr = text[-400:]

        threading.Thread(target=read, name="PeachAsrStderr", daemon=True).start()

    def _read_stdout(self, process: subprocess.Popen, timeout: float) -> str:
        holder: dict[str, object] = {}

        def read() -> None:
            try:
                holder["line"] = process.stdout.readline() if process.stdout is not None else b""
            except Exception as exc:
                holder["error"] = exc

        thread = threading.Thread(target=read, name="PeachAsrStdout", daemon=True)
        thread.start()
        thread.join(timeout)
        if thread.is_alive():
            self._stop()
            raise AsrRuntimeError("日语转写超时")
        if "error" in holder:
            self._stop()
            raise AsrRuntimeError("日语转写进程读取失败") from holder["error"]
        raw = holder.get("line", b"")
        if isinstance(raw, bytes):
            return raw.decode("utf-8", "replace").strip()
        return str(raw).strip()

    def _stop(self) -> str:
        process = self._proc
        self._proc = None
        detail = self._stderr.strip()
        if process is None:
            return detail
        if process.stdin is not None:
            try:
                process.stdin.close()
            except OSError:
                pass
        try:
            process.wait(timeout=2)
        except subprocess.TimeoutExpired:
            process.kill()
            try:
                process.wait(timeout=2)
            except subprocess.TimeoutExpired:
                pass
        return detail or self._stderr.strip()
