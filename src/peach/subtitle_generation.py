"""把还没有中文字幕的影片转成可自动打开的中文字幕。

日语音轨用 faster-whisper 加载 kotoba-whisper（或配置里的其他 CTranslate2 权重），
`language` 固定为 `ja`。译文走 DeepSeek 的 chat completions，密钥只读
`DEEPSEEK_API_KEY`。已经有中文外挂，或 ffprobe 能看见内嵌中文轨的，整条跳过。

生成的 `影片名.chs.srt` 跟正片同目录，沿用现有 sidecar 配对；目录不可写时改放到
数据目录，由字幕接口补进播放列表。
"""
from __future__ import annotations

import json
import logging
import os
import re
import sqlite3
import subprocess
import threading
import uuid
from collections.abc import Callable, Mapping, Sequence
from contextlib import closing
from dataclasses import dataclass
from pathlib import Path

from filelock import FileLock

from .catalog_rules import VIDEO_EXTENSIONS
from .fsutil import atomic_write_text
from .settings_file import SubtitleSettings
from .strm import skip_background_read
from .subtitles import discover_sidecars, language_of

LOGGER = logging.getLogger(__name__)
API_KEY_ENV = "DEEPSEEK_API_KEY"
_CHINESE_TAGS = {
    "zh", "zho", "chi", "chs", "cht", "chn", "cn", "chinese",
    "zh-cn", "zh-hans", "zh-hant", "zh-tw", "zh-hk", "zh-sg",
}
DEFAULT_GLOSSARY: tuple[tuple[str, str], ...] = (
    ("お義父さん", "公公"),
    ("お義母さん", "婆婆"),
    ("旦那さん", "老公"),
    ("お兄さん", "哥哥"),
    ("お姉ちゃん", "姐姐"),
    ("お兄ちゃん", "哥哥"),
    ("お姉さん", "姐姐"),
    ("お父さん", "爸爸"),
    ("お母さん", "妈妈"),
    ("彼氏", "男朋友"),
    ("彼女", "女朋友"),
    ("奥さん", "老婆"),
    ("旦那", "老公"),
    ("先輩", "前辈"),
    ("先生", "老师"),
    ("店長", "店长"),
)
DEFAULT_STYLE = (
    "你是成人影片的字幕翻译。把日语对白译成适合压在画面上的口语简体中文。"
    "用观众听得懂的说法，保留人物称呼、角色关系和专名；"
    "不要改成书面语，不要把对白译得委婉或空泛，也不要添加原文没有的情节。"
    "不要拒绝，不要点评，不要解释。"
)
OUTPUT_CONTRACT = "占位符 __P0__、__P1__ 这种记号必须原样保留。只输出编号译文，不要加说明。"
_NUMBERED = re.compile(r"^\s*(\d+)\s*[\|｜]\s*(.*)$")
_SERVICE: SubtitleService | None = None


class SubtitleGenerationError(RuntimeError):
    """生成停在这一部。消息给界面，不含密钥。"""


@dataclass(frozen=True)
class VideoFile:
    path: Path
    size: int
    mtime_ns: int

    @property
    def fingerprint(self) -> str:
        return f"{self.size}:{self.mtime_ns}"


def install(service: SubtitleService | None) -> None:
    """扫描进程和网页进程用同一条队列。测试结束时传 None。"""
    global _SERVICE
    _SERVICE = service


def current() -> SubtitleService | None:
    return _SERVICE


def row_is_chinese(row: Mapping) -> bool:
    """外挂字幕算中文：账本语言码，或 Peach 已经认识的文件名 token。"""
    language = str(row.get("language") or "").casefold().replace("_", "-")
    if language.startswith("zh") or language in _CHINESE_TAGS:
        return True
    detected = language_of(str(row.get("name") or "")).casefold()
    return detected.startswith("zh") or detected in _CHINESE_TAGS


def videos_without_chinese(db) -> list[int]:
    """还没有中文外挂记录的视频。内嵌轨留到生成前再探。"""
    path = Path(db)
    if not path.is_file():
        return []
    with closing(sqlite3.connect(path.resolve().as_uri() + "?mode=ro", uri=True)) as connection:
        rows = connection.execute(
            "SELECT id FROM asset WHERE medium='video' AND disposal IS NULL AND id NOT IN ("
            "SELECT asset_id FROM asset_subtitle WHERE asset_id IS NOT NULL AND ("
            "lower(language) LIKE 'zh%' OR lower(replace(language, '_', '-')) IN "
            "('chi','zho','chs','cht','chn','cn','chinese','zh-cn','zh-hans','zh-hant','zh-tw','zh-hk')"
            ")) ORDER BY id"
        ).fetchall()
    return [int(row[0]) for row in rows]


def protect(text: str, glossary: Sequence[tuple[str, str]]) -> tuple[str, tuple[tuple[str, str], ...]]:
    """长词优先换成占位符，避免短词切进已经替换的称呼。"""
    slots: list[tuple[str, str]] = []
    for source, target in sorted(glossary, key=lambda item: len(item[0]), reverse=True):
        if not source or source not in text:
            continue
        token = f"__P{len(slots)}__"
        text = text.replace(source, token)
        slots.append((token, target))
    return text, tuple(slots)


def restore(text: str, slots: Sequence[tuple[str, str]]) -> str:
    for token, target in slots:
        text = text.replace(token, target)
    return text


def load_glossary(settings: SubtitleSettings) -> tuple[tuple[str, str], ...]:
    """内置称呼表。配置了术语表就按行覆盖同名日文。"""
    merged = list(DEFAULT_GLOSSARY)
    raw = settings.glossary.strip()
    if not raw:
        return tuple(merged)
    path = Path(raw)
    if not path.is_absolute():
        from .settings_file import active
        path = active().data_root / path
    if not path.is_file():
        raise SubtitleGenerationError(f"术语表不存在：{path.name}")
    for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if "\t" not in stripped:
            raise SubtitleGenerationError(f"术语表第 {number} 行要用制表符分开")
        source, target, *_rest = stripped.split("\t")
        source, target = source.strip(), target.strip()
        if not source or not target:
            raise SubtitleGenerationError(f"术语表第 {number} 行是空的")
        merged = [(item, value) for item, value in merged if item != source]
        merged.append((source, target))
    return tuple(merged)


def style_prompt(settings: SubtitleSettings, glossary: Sequence[tuple[str, str]]) -> str:
    base = settings.system_prompt.strip() or DEFAULT_STYLE
    table = "\n".join(f"{source} → {target}" for source, target in glossary)
    extra = f"\n术语按这个表：\n{table}" if table else ""
    return base + extra + "\n" + OUTPUT_CONTRACT


def parse_numbered(text: str, count: int) -> list[str]:
    found: dict[int, str] = {}
    for line in text.splitlines():
        match = _NUMBERED.match(line.strip())
        if match:
            found[int(match.group(1))] = match.group(2).strip()
    if any(index not in found for index in range(1, count + 1)):
        raise SubtitleGenerationError("译文行数与原文不一致")
    return [found[index] for index in range(1, count + 1)]


def to_srt(cues: Sequence[tuple[float, float, str]]) -> str:
    blocks = []
    for index, (start, end, text) in enumerate(cues, 1):
        if end <= start:
            end = start + 0.2
        blocks.append(f"{index}\n{_srt_time(start)} --> {_srt_time(end)}\n{text.strip()}\n")
    return "\n".join(blocks)


def _srt_time(seconds: float) -> str:
    total = max(0, int(round(float(seconds) * 1000)))
    hours, total = divmod(total, 3_600_000)
    minutes, total = divmod(total, 60_000)
    secs, millis = divmod(total, 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def _safe(text: str, key: str) -> str:
    if key and key in text:
        text = text.replace(key, "")
    collapsed = " ".join(text.split())
    return collapsed[:200] or "生成中文字幕失败"


def translate_with_deepseek(
    lines: Sequence[str], settings: SubtitleSettings, *, client=None,
) -> list[str]:
    """按批把日语对白译成中文。`client` 只在测试里替换。"""
    key = os.environ.get(API_KEY_ENV, "").strip()
    if not key:
        raise SubtitleGenerationError("未设置 DEEPSEEK_API_KEY")
    glossary = load_glossary(settings)
    protected: list[str] = []
    slots: list[tuple[tuple[str, str], ...]] = []
    for line in lines:
        text, slot = protect(line, glossary)
        protected.append(text)
        slots.append(slot)
    translated: list[str] = []
    own = client is None
    if own:
        from .peach_proxy import http_client
        client = http_client(timeout=180)
    try:
        for start in range(0, len(protected), 30):
            batch = protected[start:start + 30]
            piece = _deepseek_batch(batch, settings, glossary, key, client)
            translated.extend(piece)
    finally:
        if own:
            client.close()
    restored = []
    for text, slot in zip(translated, slots, strict=True):
        missing = [token for token, _target in slot if token not in text]
        if missing:
            raise SubtitleGenerationError("译文丢掉了术语占位符")
        restored.append(restore(text, slot))
    return restored


def _deepseek_batch(lines, settings: SubtitleSettings, glossary, key: str, client) -> list[str]:
    payload = {
        "model": settings.deepseek_model,
        "temperature": 0.3,
        "messages": [
            {"role": "system", "content": style_prompt(settings, glossary)},
            {"role": "user", "content": _numbered(lines)},
        ],
    }
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    last = "DeepSeek 请求失败"
    for _attempt in range(2):
        try:
            response = client.post(settings.deepseek_url, json=payload, headers=headers)
        except Exception as exc:
            last = _safe(str(exc), key)
            continue
        if getattr(response, "status_code", 0) != 200:
            last = f"DeepSeek 返回 HTTP {getattr(response, 'status_code', 0)}"
            continue
        try:
            body = response.json()
            content = body["choices"][0]["message"]["content"]
            return parse_numbered(str(content), len(lines))
        except (KeyError, IndexError, TypeError, ValueError, SubtitleGenerationError) as exc:
            last = _safe(str(exc), key)
    raise SubtitleGenerationError(last)


def _numbered(lines: Sequence[str]) -> str:
    body = "\n".join(f"{index}|{text}" for index, text in enumerate(lines, 1))
    return "把下面每一行日语译成一行简体中文。保持行数，每行以「编号|」开头。\n" + body


def load_whisper(settings: SubtitleSettings, download_root: Path):
    """加载一次日语模型。kotoba 的长音频按官方示例每 15 秒切一块。"""
    try:
        from faster_whisper import WhisperModel
    except ImportError as exc:
        raise SubtitleGenerationError("未安装日语转写组件（可选依赖 asr）") from exc
    compute = "float16" if settings.device == "cuda" else "int8"
    return WhisperModel(
        settings.model, device=settings.device, compute_type=compute,
        download_root=str(download_root),
    )


def cues_from_model(model, wav: Path, settings: SubtitleSettings):
    options = {"language": "ja", "vad_filter": True, "condition_on_previous_text": False}
    if "kotoba" in settings.model.casefold():
        options["chunk_length"] = 15
    segments, _info = model.transcribe(str(wav), **options)
    cues = []
    for segment in segments:
        text = str(segment.text or "").strip()
        if text:
            cues.append((float(segment.start), float(segment.end), text))
    return cues


def extract_wav(ffmpeg: Path, source: Path, dest: Path) -> None:
    from .smb_media import input_url
    dest.parent.mkdir(parents=True, exist_ok=True)
    command = [
        str(ffmpeg), "-y", "-v", "error", "-i", input_url(source),
        "-vn", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", str(dest),
    ]
    completed = subprocess.run(
        command, capture_output=True, timeout=7200,
        creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
    )
    detail = (completed.stderr or b"").decode("utf-8", "replace")[-180:].strip()
    if completed.returncode != 0 or not dest.is_file():
        raise SubtitleGenerationError(detail or f"提取音轨失败（{completed.returncode}）")


def subtitle_tag_is_chinese(language: str, title: str) -> bool:
    """内嵌轨的 language 或标题标成中文。"""
    normalized = language.strip().casefold().replace("_", "-")
    if normalized.startswith("zh") or normalized in _CHINESE_TAGS:
        return True
    return any(word in title for word in ("中文", "简体", "繁體", "繁体", "中字"))


def embedded_chinese(ffprobe: Path, source: Path) -> bool | None:
    """内嵌字幕流的语言或标题标成中文时返回 True。探不到就返回 None，不据此跳过。"""
    from .smb_media import input_url
    command = [
        str(ffprobe), "-v", "error", "-select_streams", "s",
        "-show_entries", "stream_tags=language,title", "-of", "json", input_url(source),
    ]
    try:
        completed = subprocess.run(
            command, capture_output=True, timeout=60,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
        )
        payload = json.loads(completed.stdout or b"{}")
    except (OSError, subprocess.TimeoutExpired, json.JSONDecodeError):
        return None
    if completed.returncode:
        return None
    for stream in payload.get("streams") or []:
        tags = stream.get("tags") or {}
        if subtitle_tag_is_chinese(str(tags.get("language") or ""), str(tags.get("title") or "")):
            return True
    return False


def sidecar_paths(video: Path) -> tuple[Path, Path]:
    path = video.with_name(f"{video.stem}.chs.srt")
    return path, path.with_name(path.name + ".peach.json")


def _writable(directory: Path) -> bool:
    probe = directory / f".peach-subtitle-{uuid.uuid4().hex}.tmp"
    try:
        probe.write_text("", encoding="utf-8")
        probe.unlink()
        return True
    except OSError:
        return False


def _marker_fresh(path: Path, fingerprint: str) -> bool:
    if not path.is_file():
        return False
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return False
    return payload.get("fingerprint") == fingerprint


def _queue_path(db) -> Path:
    from .update_tasks import state_for
    return state_for(Path(db)).parent / "subtitle-generation.json"


def _read_queue(db) -> dict:
    path = _queue_path(db)
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    return payload if isinstance(payload, dict) else {}


def _item_rows(value) -> list[dict]:
    if not isinstance(value, list):
        return []
    rows = []
    for item in value:
        if isinstance(item, dict) and isinstance(item.get("id"), int) and item["id"] > 0:
            rows.append({"id": item["id"], "message": str(item.get("message") or "")})
    return rows


def _named(asset_id: int, names: dict[int, str], status: str, message: str) -> dict:
    return {
        "id": asset_id, "name": names.get(asset_id) or f"作品 {asset_id}",
        "status": status, "message": message,
    }


def persist_subtitle_enabled(enabled: bool) -> str:
    """把开关写进设置文件。环境变量仍会在下次启动时盖过文件。"""
    from dataclasses import replace

    from .settings_file import load_config, reset_cache, write
    notice = ""
    if os.environ.get("PEACH_SUBTITLES_ENABLED", "").strip():
        notice = "环境变量 PEACH_SUBTITLES_ENABLED 会在下次启动时覆盖这个开关"
    try:
        config = load_config()
    except Exception:
        return "配置文件未写入，开关只在本次运行有效"
    if not config.present:
        return notice or "尚未完成首次设置，开关只在本次运行有效"
    if config.subtitles.enabled == enabled:
        return notice
    updated = replace(config, subtitles=replace(config.subtitles, enabled=enabled))
    try:
        with FileLock(str(config.path.with_suffix(".lock")), timeout=2):
            write(updated, force=True)
        reset_cache()
    except Exception:
        LOGGER.exception("中文字幕开关没有写进配置")
        return "配置文件未写入，开关只在本次运行有效"
    return notice


def _mutate_queue(db, change: Callable[[dict], None]) -> None:
    path = _queue_path(db)
    path.parent.mkdir(parents=True, exist_ok=True)
    with FileLock(str(path) + ".lock"):
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
            if not isinstance(payload, dict):
                payload = {}
        except (OSError, json.JSONDecodeError):
            payload = {}
        payload.setdefault("queue", [])
        change(payload)
        atomic_write_text(path, json.dumps(payload, ensure_ascii=False))


def enqueue_ids(db, ids, *, front: bool = False) -> None:
    incoming = [int(item) for item in ids if isinstance(item, int) and item > 0]

    def change(payload: dict) -> None:
        queue = [item for item in payload.get("queue", []) if isinstance(item, int)]
        if front:
            for item in incoming:
                if item in queue:
                    queue.remove(item)
            payload["queue"] = incoming + [item for item in queue if item not in set(incoming)]
            return
        seen = set(queue)
        for item in incoming:
            if item not in seen:
                queue.append(item)
                seen.add(item)
        payload["queue"] = queue

    if incoming:
        _mutate_queue(db, change)


def note_new_assets(db, ids) -> None:
    """扫描新片后排队。生成关闭时什么都不做；服务在另一个进程里也会看见队列文件。"""
    service = current()
    if service is not None:
        if not service.effective_enabled():
            return
    else:
        from .settings_file import active
        if not active().subtitles.enabled:
            return
    wanted = [int(item) for item in ids if isinstance(item, int) and item > 0]
    if not wanted:
        return
    videos: list[int] = []
    with closing(sqlite3.connect(Path(db).resolve().as_uri() + "?mode=ro", uri=True)) as connection:
        for offset in range(0, len(wanted), 900):
            batch = wanted[offset:offset + 900]
            videos.extend(int(row[0]) for row in connection.execute(
                "SELECT id FROM asset WHERE medium='video' AND id IN ("
                + ",".join("?" * len(batch)) + ")", batch))
    enqueue_ids(db, videos)
    service = current()
    if service is not None:
        service.wake()


class SubtitleService:
    """单线程队列：先把馆藏里缺中文的视频排上，正在看的一部插到前面。"""

    def __init__(self, *, root: Path, database_path: Path, media=None, ffmpeg=None,
                 settings: SubtitleSettings | Callable[[], SubtitleSettings] | None = None,
                 translator: Callable | None = None, transcriber: Callable | None = None,
                 extractor: Callable | None = None, embedded: Callable | None = None,
                 persist_enabled: Callable[[bool], str] | None = None):
        self.root = Path(root)
        self.database_path = Path(database_path)
        self.media = media
        self.ffmpeg = ffmpeg
        self._settings = settings
        self._translator = translator or translate_with_deepseek
        self._transcriber = transcriber
        self._extractor = extractor
        self._embedded = embedded
        self._status: dict[int, dict[str, str]] = {}
        self._guard = threading.Lock()
        self._wake = threading.Event()
        self._stop = threading.Event()
        self._thread: threading.Thread | None = None
        self._swept = False
        self._model = None
        self._model_key: tuple[str, str] | None = None
        self._enabled: bool | None = None
        self._current_id: int | None = None
        self._ignored: set[int] = set()
        self._persist_enabled = persist_enabled if persist_enabled is not None else persist_subtitle_enabled

    def settings(self) -> SubtitleSettings:
        if self._settings is None:
            from .settings_file import active
            return active().subtitles
        if callable(self._settings):
            return self._settings()
        return self._settings

    def effective_enabled(self) -> bool:
        """页面开关优先。没动过开关时跟配置文件和环境变量走。"""
        if self._enabled is not None:
            return self._enabled
        return bool(self.settings().enabled)

    def set_enabled(self, enabled: bool) -> dict:
        """打开或关闭自动生成。配置文件写不上时，开关仍在本次运行里生效。"""
        self._enabled = bool(enabled)
        notice = ""
        try:
            notice = self._persist_enabled(self._enabled)
        except Exception:
            LOGGER.exception("中文字幕开关没有写进配置")
            notice = "配置文件未写入，开关只在本次运行有效"
        if self._enabled:
            self.wake()
        return self.snapshot(notice=notice)

    def retry(self, asset_id: int) -> dict:
        """把这一部放回队首。失败和已忽略的都能再排。"""
        asset_id = int(asset_id)
        self._ignored.discard(asset_id)
        enqueue_ids(self.database_path, [asset_id], front=True)
        self._set(asset_id, "queued", "")
        self.wake()
        return self.snapshot()

    def ignore(self, asset_id: int) -> dict:
        """移出队列。正在生成的一部在写出字幕前停掉。"""
        asset_id = int(asset_id)
        self._ignored.add(asset_id)
        self._set(asset_id, "skipped", "已忽略")
        return self.snapshot()

    def snapshot(self, notice: str = "") -> dict:
        """给管理页：开关、数量、正在生成的一部，以及失败、排队和已忽略。"""
        payload = _read_queue(self.database_path)
        queue = [int(item) for item in payload.get("queue", []) if isinstance(item, int) and item > 0]
        failed = _item_rows(payload.get("failed"))
        skipped = _item_rows(payload.get("skipped"))
        with self._guard:
            current_id = self._current_id
        if current_id in queue:
            queue = [item for item in queue if item != current_id]
        ids = [item for item in [current_id, *queue, *(row["id"] for row in failed), *(row["id"] for row in skipped)] if item]
        names = self._names(ids)
        unavailable = ""
        if self.effective_enabled():
            unavailable = self._unavailable(self.settings())
        text = notice or self._standing_notice()
        return {
            "enabled": self.effective_enabled(),
            "notice": text,
            "unavailable": unavailable,
            "counts": {
                "queued": len(queue),
                "running": 1 if current_id else 0,
                "failed": len(failed),
                "ready": int(payload.get("ready") or 0),
                "skipped": len(skipped),
            },
            "current": _named(current_id, names, "running", "") if current_id else None,
            "queued": [_named(item, names, "queued", "") for item in queue[:40]],
            "failed": [_named(row["id"], names, "failed", row["message"]) for row in failed[:40]],
            "skipped": [_named(row["id"], names, "skipped", row["message"]) for row in skipped[:40]],
        }

    def start(self) -> None:
        if not self.effective_enabled():
            return
        with self._guard:
            alive = self._thread is not None and self._thread.is_alive()
        if alive:
            return
        self._requeue_interrupted()
        with self._guard:
            if self._thread is not None and self._thread.is_alive():
                return
            self._stop.clear()
            self._thread = threading.Thread(
                target=self._loop, name="PeachSubtitleZh", daemon=True)
            self._thread.start()

    def stop(self) -> None:
        self._stop.set()
        self._wake.set()
        thread = self._thread
        if thread is not None and thread is not threading.current_thread():
            thread.join(timeout=2)

    def wake(self) -> None:
        self._wake.set()
        self.start()

    def consider(self, asset_id: int, rows: Sequence[Mapping]) -> dict:
        """播放列表用。已有中文就不排队；失败不在轮询里自动重试。"""
        settings = self.settings()
        if any(row_is_chinese(row) for row in rows):
            return self._public(settings, "ready", "", pending=False)
        current = self._status_of(asset_id)
        if current in {"queued", "running"}:
            return self._public(settings, current, "", pending=True)
        if not self.effective_enabled():
            return self._public(settings, "idle", "", pending=False)
        reason = self._unavailable(settings)
        if reason:
            return self._public(settings, "skipped", reason, pending=False)
        if current == "failed" and not (
                self._message_of(asset_id) == "未设置 DEEPSEEK_API_KEY"
                and os.environ.get(API_KEY_ENV, "").strip()):
            return self._public(settings, "failed", self._message_of(asset_id), pending=False)
        enqueue_ids(self.database_path, [asset_id], front=True)
        self._set(asset_id, "queued", "")
        self.wake()
        return self._public(settings, "queued", "", pending=True)

    def extra_rows(self, asset_id: int, video_name: str, rows: Sequence[Mapping]) -> list[dict]:
        """目录不可写时，把数据目录里的字幕补进同一份列表。"""
        path = self._stored_srt(asset_id)
        if not path.is_file():
            return []
        name = f"{Path(video_name).stem}.chs.srt" if video_name else path.name
        if any(str(row.get("name") or "").casefold() == name.casefold() for row in rows):
            return []
        return [{
            "path": str(path), "name": name, "language": "zh-Hans", "format": "srt",
            "size": path.stat().st_size, "pairing": "suffix", "generated": True,
        }]

    def stored_root_has(self, path: Path) -> bool:
        try:
            return path.is_file() and path.resolve().is_relative_to(self.root.resolve())
        except OSError:
            return False

    def _loop(self) -> None:
        if not self._swept:
            self._swept = True
            try:
                enqueue_ids(self.database_path, videos_without_chinese(self.database_path))
            except (OSError, sqlite3.Error):
                LOGGER.exception("中文字幕队列没有列出来")
        while not self._stop.is_set():
            if not self.effective_enabled():
                self._wake.wait(2)
                self._wake.clear()
                continue
            asset_id = self._pop()
            if asset_id is None:
                self._wake.wait(2)
                self._wake.clear()
                continue
            self._run_one(asset_id)

    def _pop(self) -> int | None:
        found: list[int] = []

        def change(payload: dict) -> None:
            queue = [item for item in payload.get("queue", []) if isinstance(item, int)]
            if queue:
                found.append(queue.pop(0))
            payload["queue"] = queue

        try:
            _mutate_queue(self.database_path, change)
        except OSError:
            return None
        return found[0] if found else None

    def _abandoned(self, asset_id: int) -> bool:
        if asset_id not in self._ignored:
            return False
        self._ignored.discard(asset_id)
        self._set(asset_id, "skipped", "已忽略")
        return True

    def _run_one(self, asset_id: int) -> None:
        if self._abandoned(asset_id):
            return
        self._set(asset_id, "running", "")
        wav = self.root / "work" / f"{asset_id}.wav"
        try:
            video = self._resolve(asset_id)
            if video is None:
                self._set(asset_id, "skipped", "找不到可读取的视频")
                return
            if video.path.suffix.lower() not in VIDEO_EXTENSIONS or skip_background_read(video.path):
                self._set(asset_id, "skipped", "不读取光盘镜像或 STRM")
                return
            reason = self._skip_reason(video, asset_id)
            if reason:
                self._set(asset_id, "ready" if reason == "已是最新" else "skipped", reason)
                return
            settings = self.settings()
            self._extract(video.path, wav)
            cues = self._transcribe(wav, settings)
            if not cues:
                raise SubtitleGenerationError("没有识别到日语对白")
            if self._abandoned(asset_id):
                return
            translated = self._translator([text for _start, _end, text in cues], settings)
            if len(translated) != len(cues):
                raise SubtitleGenerationError("译文行数与原文不一致")
            zh = [(start, end, text) for (start, end, _source), text in zip(cues, translated, strict=True) if text.strip()]
            if not zh:
                raise SubtitleGenerationError("译文是空的")
            self._publish(video, asset_id, zh, settings)
            self._set(asset_id, "ready", "")
        except SubtitleGenerationError as exc:
            self._set(asset_id, "failed", _safe(str(exc), os.environ.get(API_KEY_ENV, "")))
        except Exception:
            LOGGER.exception("中文字幕生成失败 asset=%s", asset_id)
            self._set(asset_id, "failed", "生成中文字幕失败")
        finally:
            wav.unlink(missing_ok=True)

    def _skip_reason(self, video: VideoFile, asset_id: int) -> str:
        path, marker = sidecar_paths(video.path)
        if path.is_file() and not marker.is_file():
            return "已有中文字幕"
        if self._other_chinese(video.path):
            return "已有中文字幕"
        if path.is_file() and _marker_fresh(marker, video.fingerprint):
            return "已是最新"
        stored = self._stored_marker(asset_id)
        if self._stored_srt(asset_id).is_file() and _marker_fresh(stored, video.fingerprint):
            return "已是最新"
        embedded = self._embedded_chinese(video.path)
        if embedded:
            return "已有内嵌中文字幕"
        return ""

    def _other_chinese(self, video: Path) -> bool:
        ours = sidecar_paths(video)[0].name.casefold()
        try:
            rows = discover_sidecars(video, set(VIDEO_EXTENSIONS))
        except OSError:
            return False
        return any(row["name"].casefold() != ours and row_is_chinese(row) for row in rows)

    def _embedded_chinese(self, video: Path) -> bool:
        if self._embedded is not None:
            return bool(self._embedded(video))
        choice = self.ffmpeg.ffprobe() if self.ffmpeg is not None else None
        if choice is None:
            return False
        return bool(embedded_chinese(choice.path, video))

    def _publish(self, video: VideoFile, asset_id: int, cues, settings: SubtitleSettings) -> None:
        text = to_srt(cues)
        record = json.dumps({
            "fingerprint": video.fingerprint, "model": settings.model, "translator": "deepseek",
        }, ensure_ascii=False)
        path, marker = sidecar_paths(video.path)
        if _writable(video.path.parent):
            atomic_write_text(path, text)
            atomic_write_text(marker, record)
            return
        folder = self.root / "tracks"
        folder.mkdir(parents=True, exist_ok=True)
        atomic_write_text(self._stored_srt(asset_id), text)
        atomic_write_text(self._stored_marker(asset_id), record)

    def _extract(self, source: Path, dest: Path) -> None:
        if self._extractor is not None:
            self._extractor(source, dest)
            return
        choice = self.ffmpeg.ffmpeg() if self.ffmpeg is not None else None
        if choice is None:
            raise SubtitleGenerationError("未找到 FFmpeg，不能提取音轨")
        extract_wav(choice.path, source, dest)

    def _transcribe(self, wav: Path, settings: SubtitleSettings):
        if self._transcriber is not None:
            return self._transcriber(wav, settings)
        key = (settings.model, settings.device)
        if self._model is None or self._model_key != key:
            self._model = load_whisper(settings, self.root / "models")
            self._model_key = key
        return cues_from_model(self._model, wav, settings)

    def _resolve(self, asset_id: int) -> VideoFile | None:
        if self.media is None:
            return None
        from .media import MediaNotFound, normalized_path
        from .platform import within_root
        try:
            asset = self.media.asset(asset_id)
        except MediaNotFound:
            return None
        if not asset.path:
            return None
        path = normalized_path(asset.path)
        roots = tuple(self.media.filesystem.allowed_roots)
        if roots and not any(within_root(path, root) for root in roots):
            return None
        try:
            stat = path.stat()
        except OSError:
            return None
        return VideoFile(path, stat.st_size, stat.st_mtime_ns)

    def _stored_srt(self, asset_id: int) -> Path:
        return self.root / "tracks" / f"{asset_id}.chs.srt"

    def _stored_marker(self, asset_id: int) -> Path:
        path = self._stored_srt(asset_id)
        return path.with_name(path.name + ".peach.json")

    def _unavailable(self, settings: SubtitleSettings) -> str:
        if not os.environ.get(API_KEY_ENV, "").strip():
            return "未设置 DEEPSEEK_API_KEY"
        if self._transcriber is None:
            try:
                import importlib
                importlib.import_module("faster_whisper")
            except ImportError:
                return "未安装日语转写组件（可选依赖 asr）"
        return ""

    def _set(self, asset_id: int, status: str, message: str) -> None:
        with self._guard:
            self._status[asset_id] = {"status": status, "message": message}
            if status == "running":
                self._current_id = asset_id
            elif self._current_id == asset_id:
                self._current_id = None
        try:
            self._record(asset_id, status, message)
        except OSError:
            LOGGER.exception("中文字幕队列状态没有写上")

    def _status_of(self, asset_id: int) -> str:
        with self._guard:
            return self._status.get(asset_id, {}).get("status", "idle")

    def _message_of(self, asset_id: int) -> str:
        with self._guard:
            return self._status.get(asset_id, {}).get("message", "")

    def _public(self, settings: SubtitleSettings, status: str, message: str, *, pending: bool) -> dict:
        return {
            "enabled": self.effective_enabled(), "pending": pending, "status": status, "message": message,
        }

    def _standing_notice(self) -> str:
        if os.environ.get("PEACH_SUBTITLES_ENABLED", "").strip():
            return "环境变量 PEACH_SUBTITLES_ENABLED 会在下次启动时覆盖这个开关"
        return ""

    def _names(self, ids: list[int]) -> dict[int, str]:
        wanted = list(dict.fromkeys(int(item) for item in ids if item))
        if not wanted or not self.database_path.is_file():
            return {}
        found: dict[int, str] = {}
        with closing(sqlite3.connect(self.database_path.resolve().as_uri() + "?mode=ro", uri=True)) as connection:
            for offset in range(0, len(wanted), 900):
                batch = wanted[offset:offset + 900]
                for row in connection.execute(
                        "SELECT id, name FROM asset WHERE id IN (" + ",".join("?" * len(batch)) + ")", batch):
                    found[int(row[0])] = str(row[1] or "")
        return found

    def _requeue_interrupted(self) -> None:
        current = _read_queue(self.database_path).get("current")
        if not isinstance(current, int) or current <= 0:
            return
        enqueue_ids(self.database_path, [current], front=True)

        def change(payload: dict) -> None:
            if payload.get("current") == current:
                payload["current"] = None

        try:
            _mutate_queue(self.database_path, change)
        except OSError:
            LOGGER.exception("中断的中文字幕任务没有放回队列")

    def _record(self, asset_id: int, status: str, message: str) -> None:
        def change(payload: dict) -> None:
            failed = [item for item in _item_rows(payload.get("failed")) if item["id"] != asset_id]
            skipped = [item for item in _item_rows(payload.get("skipped")) if item["id"] != asset_id]
            queue = [item for item in payload.get("queue", []) if isinstance(item, int)]
            if status == "queued":
                if asset_id not in queue:
                    queue.append(asset_id)
            elif status == "running":
                payload["current"] = asset_id
            else:
                queue = [item for item in queue if item != asset_id]
                if status == "failed":
                    failed.insert(0, {"id": asset_id, "message": message[:200]})
                elif status == "skipped":
                    skipped.insert(0, {"id": asset_id, "message": message[:200]})
                elif status == "ready" and not message:
                    payload["ready"] = int(payload.get("ready") or 0) + 1
            if status != "running" and payload.get("current") == asset_id:
                payload["current"] = None
            payload["queue"] = queue
            payload["failed"] = failed[:80]
            payload["skipped"] = skipped[:80]

        _mutate_queue(self.database_path, change)
