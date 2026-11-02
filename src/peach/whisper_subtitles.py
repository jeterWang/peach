"""用 faster-whisper 为馆藏视频生成简体中文字幕。

全库扫描与采集结束时，若 `[whisper] enabled = true`，声明一条后继（ADR-0040）。
后继每次处理一部还没有中文字幕的视频，写完再接续，不占写账本那条通道：
抽音轨和识别是长时间的本机计算，账本只在最后登记同目录字幕时写一下。

faster-whisper 的 `translate` 任务只产出英语。中文或粤语音频按中文转写；
其他语言先得到英语台词，再用 Helsinki-NLP OPUS-MT eng→zho（Tatoeba
`opus-2020-07-17`，CC-BY-4.0）译成简体中文。模型落在数据目录，不进仓库。

已有的 `视频名.zh.srt` 只登记、不覆盖。失败记在 `generated/whisper/attempts/`，
视频大小或修改时间变了会再试；删掉对应 json 也会再试。
"""
from __future__ import annotations

import hashlib
import json
import logging
import os
import re
import sqlite3
import subprocess
import tempfile
import time
import zipfile
from dataclasses import dataclass
from pathlib import Path, PureWindowsPath

from filelock import FileLock

from . import subtitles
from .followups import FollowupType, register
from .fsutil import atomic_write_text
from .media_sources import cost_for
from .strm import skip_background_read

LOGGER = logging.getLogger(__name__)

TASK_KEY = "whisper-subtitles"
TASK_LABEL = "生成中文字幕"
FOLLOWUP_KEY = f"{TASK_KEY}:stock"

MODELS = frozenset({"tiny", "base", "small", "medium", "large-v3", "large-v3-turbo"})
DEVICES = frozenset({"cpu", "cuda", "auto"})
OUTPUTS = frozenset({"sidecar", "data"})
COMPUTE_TYPES = frozenset({
    "", "default", "int8", "int8_float16", "int8_float32", "float16", "float32",
})
CHINESE_AUDIO = frozenset({"zh", "yue"})
SUBTITLE_NAME = ".zh.srt"

#: 官方 OPUS-MT 英语到中文（含简体书面语 `cmn_Hans`）模型包。
OPUS_URL = "https://object.pouta.csc.fi/Tatoeba-MT-models/eng-zho/opus-2020-07-17.zip"
OPUS_SHA256 = "ab90e5583fa3ec46d8c5c50f106cbd65221978cd052c7e2059981439325ae24b"
OPUS_TOKEN = ">>cmn_Hans<<"
OPUS_BYTES = 800 * 1024 * 1024
EXTRACT_TIMEOUT = 20 * 60

_MODELS: dict[tuple, object] = {}
_TRANSLATOR: dict[str, tuple] = {}

_PENDING = """
SELECT id, location, path, name FROM asset
WHERE medium='video' AND disposal IS NULL AND COALESCE(path,'')!=''
  AND NOT EXISTS (
    SELECT 1 FROM asset_subtitle
    WHERE asset_id=asset.id AND language IN ('zh','zh-Hans','zh-Hant')
      AND format IN ('srt','ass','ssa','vtt'))
ORDER BY id
"""


class WhisperError(RuntimeError):
    """这一部视频没有生成字幕。消息可以直接给人看。"""


class WhisperConfigError(WhisperError):
    """`[whisper]` 读不出来。"""


class WhisperUnavailable(WhisperError):
    """缺工具、缺依赖或模型没取到。这一部不要记成永久失败。"""


@dataclass(frozen=True)
class Cue:
    start: float
    end: float
    text: str


@dataclass(frozen=True)
class WhisperSettings:
    enabled: bool = False
    model: str = "small"
    device: str = "cpu"
    compute_type: str = ""
    output: str = "sidecar"


def is_chinese_audio(language: str) -> bool:
    code = (language or "").lower().split("-", 1)[0]
    return code in CHINESE_AUDIO or code.startswith("zh")


def srt_timestamp(seconds: float) -> str:
    millis = max(0, int(round(float(seconds) * 1000)))
    hours, millis = divmod(millis, 3_600_000)
    minutes, millis = divmod(millis, 60_000)
    secs, millis = divmod(millis, 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def cues_to_srt(cues: list[Cue]) -> str:
    blocks = []
    for index, cue in enumerate((item for item in cues if item.text.strip()), start=1):
        end = cue.end if cue.end > cue.start else cue.start + 0.2
        blocks.append(f"{index}\n{srt_timestamp(cue.start)} --> {srt_timestamp(end)}\n{cue.text.strip()}")
    return "\n\n".join(blocks) + ("\n" if blocks else "")


def generated_subtitle_file(generated_root: Path, asset_id: int) -> Path:
    if isinstance(asset_id, bool) or not isinstance(asset_id, int) or asset_id <= 0:
        raise WhisperError("视频编号无效")
    return Path(generated_root) / "subtitles" / f"{asset_id}{SUBTITLE_NAME}"


def accepted_generated_file(generated_root, asset_id, raw_path) -> Path | None:
    """只接受这部片子在数据目录里的那一个字幕文件。"""
    try:
        expected = generated_subtitle_file(Path(generated_root), int(asset_id))
        if Path(str(raw_path or "")).resolve() != expected.resolve() or not expected.is_file():
            return None
        return expected
    except (OSError, ValueError, WhisperError):
        return None


def generated_row(generated_root, asset_id: int) -> dict | None:
    try:
        path = generated_subtitle_file(Path(generated_root), int(asset_id))
    except (ValueError, WhisperError):
        return None
    if not path.is_file():
        return None
    return {"id": f"whisper:{asset_id}", "path": str(path), "name": path.name,
            "language": "zh", "format": "srt", "size": path.stat().st_size,
            "pairing": subtitles.SUFFIX}


def load_settings(config) -> WhisperSettings:
    path = Path(getattr(config, "path", "") or "")
    if not path.is_file():
        return WhisperSettings()
    import tomllib
    try:
        document = tomllib.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, tomllib.TOMLDecodeError) as error:
        raise WhisperConfigError(f"读不到设置里的 [whisper]：{error}") from error
    table = document.get("whisper", {})
    if table is None or table == {}:
        return WhisperSettings()
    if not isinstance(table, dict):
        raise WhisperConfigError("[whisper] 必须是表")
    unknown = sorted(set(table) - {"enabled", "model", "device", "compute_type", "output"})
    if unknown:
        raise WhisperConfigError("[whisper] 有不认识的键：" + "、".join(unknown))
    enabled = _boolean(table, "enabled", False)
    if not enabled:
        return WhisperSettings()
    model = _text(table, "model", "small")
    device = _text(table, "device", "cpu")
    compute = _text(table, "compute_type", "")
    output = _text(table, "output", "sidecar")
    if model not in MODELS:
        raise WhisperConfigError("[whisper] model 只能是 " + "、".join(sorted(MODELS)))
    if device not in DEVICES:
        raise WhisperConfigError("[whisper] device 只能是 cpu、cuda 或 auto")
    if compute not in COMPUTE_TYPES:
        raise WhisperConfigError("[whisper] compute_type 无效")
    if output not in OUTPUTS:
        raise WhisperConfigError("[whisper] output 只能是 sidecar 或 data")
    return WhisperSettings(True, model, device, compute, output)


def _boolean(table: dict, key: str, default: bool) -> bool:
    value = table.get(key, default)
    if not isinstance(value, bool):
        raise WhisperConfigError(f"[whisper] {key} 必须是 true 或 false")
    return value


def _text(table: dict, key: str, default: str) -> str:
    value = table.get(key, default)
    if not isinstance(value, str):
        raise WhisperConfigError(f"[whisper] {key} 必须是字符串")
    return value.strip()


def media_file(ledger_path: str, config) -> Path:
    """账本里的 Windows 路径在这台机器上的视频文件。"""
    from .platform import is_windows_path, resolve_root
    location, index, tail = resolve_root(ledger_path, getattr(config, "locations", None))
    if location is None:
        if os.name == "nt" and is_windows_path(ledger_path):
            return Path(ledger_path)
        raise WhisperError("视频不在已配置的媒体目录里")
    mounts = tuple(getattr(config, "mounts", {}).get(location, ()))
    if index < len(mounts) and str(mounts[index]):
        return Path(mounts[index]).joinpath(*tail)
    if os.name == "nt" and is_windows_path(ledger_path):
        return Path(ledger_path)
    raise WhisperError("这个来源没有本机目录，读不了视频")


def subtitle_paths(ledger_path: str, config) -> tuple[Path, str]:
    local = media_file(ledger_path, config)
    name = local.stem + SUBTITLE_NAME
    ledger = str(PureWindowsPath(ledger_path).with_name(name))
    return local.with_name(name), ledger


def extract_wav(ffmpeg: str, source: Path, destination: Path) -> None:
    """抽出 16 kHz 单声道 WAV。faster-whisper 吃的就是这份采样率。"""
    destination.parent.mkdir(parents=True, exist_ok=True)
    command = [ffmpeg, "-y", "-nostdin", "-v", "error", "-i", str(source),
               "-vn", "-ac", "1", "-ar", "16000", str(destination)]
    flags = subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0
    try:
        completed = subprocess.run(command, capture_output=True, timeout=EXTRACT_TIMEOUT, check=False,
                                   creationflags=flags)
    except (OSError, subprocess.TimeoutExpired) as error:
        raise WhisperError(f"抽出音轨失败：{error}") from error
    if completed.returncode != 0 or not destination.is_file() or destination.stat().st_size == 0:
        detail = (completed.stderr or b"").decode("utf-8", "replace").strip()
        raise WhisperError("抽出音轨失败" + (f"：{detail[-400:]}" if detail else ""))


def _ffmpeg(config) -> str:
    from .ffmpeg import FFmpegResolver
    choice = FFmpegResolver(config.directory("tools") / "ffmpeg").ffmpeg()
    if choice is None:
        raise WhisperUnavailable("没有找到 FFmpeg，无法抽出音轨")
    return str(choice.path)


def _fingerprint(path: Path) -> str:
    stat = path.stat()
    return f"{stat.st_size}:{stat.st_mtime_ns}"


def _attempt_path(generated_root: Path, asset_id: int) -> Path:
    return Path(generated_root) / "whisper" / "attempts" / f"{asset_id}.json"


def _settled(generated_root: Path, asset_id: int, fingerprint: str) -> bool:
    path = _attempt_path(generated_root, asset_id)
    try:
        record = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return False
    return isinstance(record, dict) and record.get("fingerprint") == fingerprint


def _remember(generated_root: Path, asset_id: int, fingerprint: str, detail: str) -> None:
    path = _attempt_path(generated_root, asset_id)
    path.parent.mkdir(parents=True, exist_ok=True)
    atomic_write_text(path, json.dumps({
        "fingerprint": fingerprint, "detail": detail,
        "at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }, ensure_ascii=False) + "\n")


def _forget(generated_root: Path, asset_id: int) -> None:
    _attempt_path(generated_root, asset_id).unlink(missing_ok=True)


def asset_action(row, settings: WhisperSettings, config, generated_root: Path) -> str:
    """`skip` 放过，`record` 登记已有字幕，`generate` 才跑识别。"""
    ledger_path = str(row["path"] or "")
    if not ledger_path or cost_for(str(row["location"] or ""), ledger_path, config) == "metered":
        return "skip"
    if skip_background_read(PureWindowsPath(ledger_path)):
        return "skip"
    try:
        local = media_file(ledger_path, config)
    except WhisperError:
        return "skip"
    if not local.is_file():
        return "skip"
    if settings.output == "data" and generated_subtitle_file(generated_root, int(row["id"])).is_file():
        return "skip"
    if settings.output == "sidecar" and local.with_name(local.stem + SUBTITLE_NAME).is_file():
        return "record"
    if _settled(generated_root, int(row["id"]), _fingerprint(local)):
        return "skip"
    return "generate"


def next_asset(connection, settings, config, generated_root: Path):
    for row in connection.execute(_PENDING):
        action = asset_action(row, settings, config, generated_root)
        if action != "skip":
            return row, action
    return None


def _generated_root(config, generated_root) -> Path:
    if generated_root is not None:
        return Path(generated_root)
    return Path(config.directory("generated"))


def plan(database, config, generated_root=None) -> list[dict]:
    """还有视频要生成中文字幕时，声明固定的那一条后继。"""
    try:
        settings = load_settings(config)
    except WhisperConfigError:
        LOGGER.warning("中文字幕配置无效，排入任务后会在任务中心说明原因", exc_info=True)
        return [_job()]
    if not settings.enabled or database is None:
        return []
    try:
        with database.read_connection() as connection:
            found = next_asset(connection, settings, config, _generated_root(config, generated_root))
    except (OSError, sqlite3.Error, WhisperError):
        LOGGER.warning("中文字幕没有排上", exc_info=True)
        return []
    return [_job()] if found is not None else []


def _job() -> dict:
    return {"key": FOLLOWUP_KEY, "task_key": TASK_KEY, "label": TASK_LABEL}


def record_sidecar(connection, location: str, ledger_video: str, ledger_subtitle: str, local: Path) -> None:
    stat = local.stat()
    now = time.strftime("%Y-%m-%d %H:%M:%S")
    sidecar = subtitles.Sidecar(
        path=ledger_subtitle, name=local.name, format="srt", language="zh",
        pairing=subtitles.SUFFIX, video=ledger_video, size=stat.st_size,
        mtime=time.strftime("%Y-%m-%d", time.localtime(stat.st_mtime)))
    subtitles.record(connection, location, [sidecar], now)


def to_chinese(cues: list[Cue], language: str, translate_batch) -> list[Cue]:
    if is_chinese_audio(language):
        return [cue for cue in cues if cue.text.strip()]
    texts = [cue.text.strip() for cue in cues if cue.text.strip()]
    if not texts:
        return []
    translated = list(translate_batch(texts))
    if len(translated) != len(texts):
        raise WhisperError("中文翻译的条数和原台词不一致")
    found = []
    for cue, text in zip((item for item in cues if item.text.strip()), translated):
        cleaned = " ".join(str(text).split())
        if cleaned:
            found.append(Cue(cue.start, cue.end, cleaned))
    return found


def resolve_device(device: str) -> str:
    if device != "auto":
        return device
    import ctranslate2
    count = ctranslate2.get_cuda_device_count() if hasattr(ctranslate2, "get_cuda_device_count") else 0
    return "cuda" if count else "cpu"


def resolve_compute(device: str, requested: str) -> str:
    if requested and requested != "default":
        return requested
    if requested == "default":
        return "default"
    return "float16" if device == "cuda" else "int8"


def transcribe(wav: Path, settings: WhisperSettings, download_root: Path) -> tuple[list[Cue], str]:
    """识别音轨。中文直接转写；其他语言用 faster-whisper 译成英语，调用方再译成中文。"""
    try:
        from faster_whisper import WhisperModel, decode_audio
    except ImportError as error:
        raise WhisperUnavailable(
            "未安装 faster-whisper。源码环境执行：uv sync --locked --extra whisper"
        ) from error
    device = resolve_device(settings.device)
    compute = resolve_compute(device, settings.compute_type)
    key = (settings.model, device, compute, str(download_root))
    model = _MODELS.get(key)
    if model is None:
        download_root.mkdir(parents=True, exist_ok=True)
        model = WhisperModel(settings.model, device=device, compute_type=compute,
                              download_root=str(download_root))
        _MODELS[key] = model
    audio = decode_audio(str(wav))
    if len(audio) == 0:
        return [], ""
    language, _probability, _all = model.detect_language(audio)
    task = "transcribe" if is_chinese_audio(language) else "translate"
    chosen = "zh" if is_chinese_audio(language) else language
    segments, _info = model.transcribe(audio, language=chosen or None, task=task, vad_filter=True)
    cues = []
    for segment in segments:
        text = " ".join(str(segment.text).split())
        if text:
            cues.append(Cue(float(segment.start), float(segment.end), text))
    return cues, language or ""


def opus_translate(texts: list[str], model_dir: Path) -> list[str]:
    """把英语台词译成简体中文。模型目录由 `ensure_translation_model` 准备。"""
    ensure_translation_model(model_dir)
    import ctranslate2
    import sentencepiece
    cached = _TRANSLATOR.get(str(model_dir))
    if cached is None:
        source = sentencepiece.SentencePieceProcessor(model_file=str(model_dir / "source.spm"))
        target = sentencepiece.SentencePieceProcessor(model_file=str(model_dir / "target.spm"))
        engine = ctranslate2.Translator(str(model_dir), device="cpu")
        cached = (source, target, engine)
        _TRANSLATOR[str(model_dir)] = cached
    source, target, engine = cached
    batch = [[OPUS_TOKEN, *source.encode(text, out_type=str)] for text in texts]
    results = engine.translate_batch(batch)
    output = []
    for result in results:
        hypothesis = result.hypotheses[0] if result.hypotheses else []
        text = target.decode(hypothesis).strip()
        text = re.sub(r"(?<=[\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])", "", text)
        output.append(text)
    return output


def translation_ready(model_dir: Path) -> bool:
    return all((Path(model_dir) / name).is_file() for name in ("model.bin", "source.spm", "target.spm"))


def ensure_translation_model(model_dir: Path) -> Path:
    model_dir = Path(model_dir)
    if translation_ready(model_dir):
        return model_dir
    from .jobs import require_free_space
    model_dir.parent.mkdir(parents=True, exist_ok=True)
    require_free_space(model_dir.parent, 2.0)
    with FileLock(str(model_dir) + ".lock", timeout=1800):
        if translation_ready(model_dir):
            return model_dir
        archive = model_dir.parent / "opus-2020-07-17.zip"
        _download_opus(archive)
        extracted = model_dir.parent / "opus-2020-07-17"
        _extract_opus(archive, extracted)
        _convert_opus(extracted, model_dir)
        archive.unlink(missing_ok=True)
    if not translation_ready(model_dir):
        raise WhisperUnavailable("英译中模型没有准备好")
    return model_dir


def _download_opus(destination: Path) -> None:
    if destination.is_file() and _sha256(destination) == OPUS_SHA256:
        return
    from .peach_proxy import http_client
    import httpx
    temporary = destination.with_suffix(".part")
    digest = hashlib.sha256()
    try:
        with http_client(timeout=600.0, follow_redirects=True) as client, client.stream("GET", OPUS_URL) as response:
            response.raise_for_status()
            with temporary.open("wb") as handle:
                for chunk in response.iter_bytes():
                    digest.update(chunk)
                    handle.write(chunk)
    except (OSError, httpx.HTTPError) as error:
        temporary.unlink(missing_ok=True)
        raise WhisperUnavailable(f"下载英译中模型失败：{error}") from error
    if digest.hexdigest() != OPUS_SHA256:
        temporary.unlink(missing_ok=True)
        raise WhisperUnavailable("英译中模型校验不符")
    temporary.replace(destination)


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _extract_opus(archive: Path, destination: Path) -> None:
    destination.mkdir(parents=True, exist_ok=True)
    total = 0
    with zipfile.ZipFile(archive) as package:
        for info in package.infolist():
            relative = Path(info.filename)
            if info.filename.startswith("/") or ".." in relative.parts:
                raise WhisperUnavailable("模型压缩包路径无效")
            total += info.file_size
            if total > OPUS_BYTES:
                raise WhisperUnavailable("模型压缩包过大")
            target = destination / relative
            if info.is_dir():
                target.mkdir(parents=True, exist_ok=True)
                continue
            target.parent.mkdir(parents=True, exist_ok=True)
            with package.open(info) as source, target.open("wb") as output:
                output.write(source.read())


def _convert_opus(extracted: Path, model_dir: Path) -> None:
    if not (extracted / "decoder.yml").is_file():
        raise WhisperUnavailable("模型压缩包里没有 decoder.yml")
    try:
        from ctranslate2.converters import OpusMTConverter
    except ImportError as error:
        raise WhisperUnavailable("未安装 CTranslate2，无法准备英译中模型") from error
    temporary = model_dir.parent / (model_dir.name + ".converting")
    if temporary.exists():
        import shutil
        shutil.rmtree(temporary)
    OpusMTConverter(str(extracted)).convert(str(temporary), quantization="int8", force=True)
    for name in ("source.spm", "target.spm", "LICENSE"):
        source = extracted / name
        if source.is_file():
            (temporary / name).write_bytes(source.read_bytes())
    notice = (
        "Helsinki-NLP OPUS-MT eng-zho，Tatoeba challenge opus-2020-07-17。\n"
        "许可证：CC-BY-4.0。\n"
        f"{OPUS_URL}\n"
    )
    (temporary / "NOTICE.txt").write_text(notice, encoding="utf-8")
    if model_dir.exists():
        import shutil
        shutil.rmtree(model_dir)
    temporary.rename(model_dir)
    import shutil
    shutil.rmtree(extracted, ignore_errors=True)


def _write_srt(path: Path, cues: list[Cue]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    atomic_write_text(path, cues_to_srt(cues))


def _default_extract(config):
    ffmpeg = _ffmpeg(config)

    def extract(source: Path, destination: Path) -> None:
        extract_wav(ffmpeg, source, destination)

    return extract


def _temporary_wav() -> Path:
    descriptor, name = tempfile.mkstemp(prefix="peach-whisper-", suffix=".wav")
    os.close(descriptor)
    return Path(name)


def run(contract, key: str, handle, *, settings=None, config=None, speech=None,
        translate_batch=None, extract=None) -> dict:
    """跑一条中文字幕后继。依赖缺失时失败并保留视频，下一轮全库处理会再排。"""
    del key
    from . import settings_file
    from .task_control import checkpoint
    config = settings_file.active() if config is None else config
    try:
        chosen = load_settings(config) if settings is None else settings
    except WhisperConfigError as error:
        raise WhisperUnavailable(str(error)) from error
    if not chosen.enabled:
        return {"outcome": "中文字幕生成已关闭", "continue": False}
    generated_root = Path(contract.candidate_root)
    checkpoint()
    with contract.database.read_connection() as connection:
        found = next_asset(connection, chosen, config, generated_root)
    if found is None:
        return {"outcome": "没有需要生成中文字幕的视频", "continue": False}
    row, action = found
    name = str(row["name"] or row["id"])
    if handle is not None:
        handle.progress(current=0, total=1, label=f"{TASK_LABEL}：{name}")
    if action == "record":
        local_subtitle, ledger_subtitle = subtitle_paths(str(row["path"]), config)
        with contract.database.write_transaction() as connection:
            record_sidecar(connection, str(row["location"]), str(row["path"]), ledger_subtitle, local_subtitle)
        detail = "登记了已有的中文字幕"
    else:
        download_root = generated_root / "whisper" / "models"
        model_dir = generated_root / "whisper" / "opus-mt-en-zh"
        speech = speech or (lambda wav, item: transcribe(wav, item, download_root))
        translate_batch = translate_batch or (lambda texts: opus_translate(texts, model_dir))
        extract = extract or _default_extract(config)
        try:
            detail = _generate(row, chosen, config, generated_root, contract, speech, translate_batch, extract)
        except WhisperUnavailable:
            raise
        except WhisperError as error:
            local = media_file(str(row["path"]), config)
            _remember(generated_root, int(row["id"]), _fingerprint(local), str(error))
            detail = str(error)
    if handle is not None:
        handle.progress(current=1, total=1, label=TASK_LABEL, throttle=0)
    with contract.database.read_connection() as connection:
        remaining = next_asset(connection, chosen, config, generated_root) is not None
    return {"outcome": f"{name}：{detail}", "continue": remaining, "asset_id": int(row["id"])}


def _generate(row, settings, config, generated_root, contract, speech, translate_batch, extract) -> str:
    ledger_path = str(row["path"])
    local_video = media_file(ledger_path, config)
    fingerprint = _fingerprint(local_video)
    wav = _temporary_wav()
    try:
        extract(local_video, wav)
        checkpoint_now()
        cues, language = speech(wav, settings)
        if not is_chinese_audio(language):
            cues = to_chinese(cues, language, translate_batch)
        if not cues:
            _remember(generated_root, int(row["id"]), fingerprint, "没有识别出对白")
            return "没有识别出对白"
        if settings.output == "data":
            _write_srt(generated_subtitle_file(generated_root, int(row["id"])), cues)
        else:
            local_subtitle, ledger_subtitle = subtitle_paths(ledger_path, config)
            if not local_subtitle.is_file():
                _write_srt(local_subtitle, cues)
            with contract.database.write_transaction() as connection:
                record_sidecar(connection, str(row["location"]), ledger_path, ledger_subtitle, local_subtitle)
        _forget(generated_root, int(row["id"]))
        return "已写入中文字幕"
    finally:
        wav.unlink(missing_ok=True)


def checkpoint_now() -> None:
    from .task_control import checkpoint
    checkpoint()


TYPE = register(FollowupType(
    task_key=TASK_KEY, label=TASK_LABEL, writes_ledger=False,
    run=lambda contract, key, handle: run(contract, key, handle)))
