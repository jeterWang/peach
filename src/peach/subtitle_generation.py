"""把还没有中文字幕的影片转成可自动打开的中文字幕。

同目录已有可用日语外挂时，直接采用它的时间轴和对白，不再跑 faster-whisper。
没有这种外挂时，日语音轨用 faster-whisper 加载 kotoba-whisper（或配置里的其他
CTranslate2 权重），`language` 固定为 `ja`，并丢掉无语音、重复乱码和置信度过低的段。
识别或外挂文本先交给 DeepSeek 校对日语，空白行在翻译前丢掉，再整片译成中文。
校对只改文字。密钥只读 `DEEPSEEK_API_KEY`。
已经有中文外挂，或 ffprobe 能看见内嵌中文轨的，整条跳过。

生成的 `影片名.chs.srt` 和校对后的 `影片名.ja.srt` 跟正片同目录，沿用现有 sidecar 配对；
目录不可写时改放到数据目录，中文轨由字幕接口补进播放列表。
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
    "你是成人影片的字幕翻译。把日语对白译成能压在画面上的口语简体中文。"
    "顺着人物说话，同一部片子里的称呼、关系和专名始终用同一个说法；"
    "不要改成书面语，不要译得委婉或空泛。"
    "某一行如果像识别垃圾或不像人话（错词、碎句、对不上的假名、像「切り好き」这种胡话），"
    "不要照译错词。按前后文推断原意，写成自然的成人片口语。"
    "只写上下文已经能看出来的意思，不要另编情节。"
    "空白行保持空白。"
    "不要拒绝，不要点评，不要解释。"
)
OUTPUT_CONTRACT = (
    "占位符 __P0__、__P1__ 这种记号必须原样保留。"
    "识别垃圾或不通的句子按前后文推断原意，不要照译错词；空白行保持空白。"
    "只输出编号译文，不要加说明。"
)
POLISH_STYLE = (
    "你是成人影片的日语字幕校对。输入是语音识别的日语，不是译文。"
    "只修正同音误识别、口癖碎句和明显的幻听乱码，保留说话人的意思和口语。"
    "不要翻译，不要写成中文，不要添加原文没有的情节。"
    "成人片里的同音按对白改：把队伍「チーム」改回「タマ」或「玉」，"
    "把面包「パン」这类误听改回「ちんこ」。"
    "片头曲、背景音乐、歌词乱码和没有对白的幻听，这一行留空。"
    "不要拒绝，不要点评，不要解释。"
)
POLISH_CONTRACT = "只输出编号后的日语。没有对白的行在编号后留空。不要写成中文，不要加说明。"
TRANSLATE_INTRO = (
    "下面是同一部影片按时间排列的对白。"
    "把每一行日语译成一行口语简体中文，称呼和关系与前后文一致。"
    "误听、碎句或不像对白的胡话，按前后文推断原意再写中文，不要照译错词。"
    "不要编上下文里没有的情节。空白行保持空白，不要补对白。"
    "保持行数，每行以「编号|」开头。"
)
POLISH_INTRO = (
    "下面是同一部影片按时间排列的日语识别结果。"
    "逐行校对成日语，不要翻译。保持行数，每行以「编号|」开头。"
    "听得清的对白保留说话人的说法；片头曲、背景音乐和明显不是对白的行留空。"
    "同音按成人片对白改，例如「チーム」常是「タマ」，「パン」常是「ちんこ」。"
)
TRANSLATE_CARRY = "已确定的译法保持不变，这些行不要再次输出："
POLISH_CARRY = "前面已经改成这些说法，同一称呼保持一致，这些行不要再次输出："
_NUMBERED = re.compile(r"^\s*(\d+)\s*[\|｜]\s*(.*)$")
# 单次请求的安全预算是 900_000 token（输入估测 + 这次译文的输出估测）。
# deepseek-flash / deepseek-v4-pro 上下文约 1_000_000，输出上限 384_000（393_216）。
# 非思考模式省略 max_tokens 时接口默认只有 8_192，整部影片的译文会在中途截断，
# 所以放得下的请求把 max_tokens 提到 262_144，并且不超过预算里剩下的额度。
# 估测超过预算时按 600 行切块；这一块仍然放不下就降到 400 行。每块附上最多 24 条已译称呼。
_CONTEXT_BUDGET = 900_000
_MAX_OUTPUT_TOKENS = 262_144
_CHUNK_LINES = 600
_CHUNK_FLOOR = 400
_CARRY_PAIRS = 24
_CARRY_TOKEN_ALLOWANCE = 2_000
_NAME_HINT = re.compile(r"(?:さん|ちゃん|くん|様|先輩|先生|君|氏|[\u30a0-\u30ff]{3,})")
_READ_TIMEOUT = 3600.0
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
    """把一部影片的对白一次交给 DeepSeek。超长片才按大块续译。`client` 只在测试里替换。"""
    key = os.environ.get(API_KEY_ENV, "").strip()
    if not key:
        raise SubtitleGenerationError("未设置 DEEPSEEK_API_KEY")
    glossary = load_glossary(settings)
    protected: list[str] = []
    slots: list[tuple[tuple[str, str], ...]] = []
    originals: list[str] = []
    for line in lines:
        text, slot = protect(line, glossary)
        protected.append(text)
        slots.append(slot)
        originals.append(line)
    own = client is None
    if own:
        client = _translation_client()
    translated: list[str] = []
    memory: list[tuple[str, str]] = []
    try:
        for start, end in _slice_plan(protected, settings, glossary):
            piece = _deepseek_batch(
                protected[start:end], settings, glossary, key, client, _carry_pairs(memory),
            )
            for source, slot, text in zip(originals[start:end], slots[start:end], piece, strict=True):
                missing = [token for token, _target in slot if token not in text]
                if missing:
                    raise SubtitleGenerationError("译文丢掉了术语占位符")
                restored = "" if not str(source).strip() else restore(text, slot)
                translated.append(restored)
                _remember(memory, source, restored, slot)
    finally:
        if own:
            client.close()
    return translated


def polish_prompt(_settings: SubtitleSettings) -> str:
    """校对提示不使用翻译用的 `system_prompt`，避免把这一步写成中文。"""
    return POLISH_STYLE + "\n" + POLISH_CONTRACT


def polish_with_deepseek(
    lines: Sequence[str], settings: SubtitleSettings, *, client=None,
) -> list[str]:
    """把一部影片的日语识别校对成仍是日语的对白。超长片按与翻译相同的块续校。

    条数与输入一致，时间轴由调用方保留。明显的非对白留空，不合并字幕条。
    """
    key = os.environ.get(API_KEY_ENV, "").strip()
    if not key:
        raise SubtitleGenerationError("未设置 DEEPSEEK_API_KEY")
    system = polish_prompt(settings)
    originals = [str(line) for line in lines]
    own = client is None
    if own:
        client = _translation_client()
    polished: list[str] = []
    memory: list[tuple[str, str]] = []
    try:
        for start, end in _slice_plan(originals, settings, (), system=system, intro=POLISH_INTRO):
            piece = _deepseek_batch(
                originals[start:end], settings, (), key, client, _carry_pairs(memory),
                system=system, intro=POLISH_INTRO, carry_note=POLISH_CARRY,
            )
            for source, text in zip(originals[start:end], piece, strict=True):
                cleaned = " ".join(str(text).split())
                polished.append(cleaned)
                _remember_correction(memory, source, cleaned)
    finally:
        if own:
            client.close()
    return polished


def _translation_client():
    import httpx

    from .peach_proxy import http_client

    # 非流式接口要等整段译文写完才返回。读超时一小时，连接仍限 30 秒。
    return http_client(timeout=httpx.Timeout(_READ_TIMEOUT, connect=30.0))


def _estimate_tokens(text: str) -> int:
    """CJK 按一字一 token 估，其余按四字一 token 估。"""
    cjk = other = 0
    for char in text:
        code = ord(char)
        if 0x3040 <= code <= 0x30FF or 0x4E00 <= code <= 0x9FFF:
            cjk += 1
        elif not char.isspace():
            other += 1
    return cjk + (other + 3) // 4


def _fits(
    lines: Sequence[str], settings: SubtitleSettings, glossary, extra: int, *,
    system: str | None = None, intro: str | None = None,
) -> bool:
    system_text = style_prompt(settings, glossary) if system is None else system
    user = _numbered(lines) if intro is None else _message(intro, lines)
    incoming = _estimate_tokens(system_text) + _estimate_tokens(user) + extra + 32
    needed = min(_MAX_OUTPUT_TOKENS, max(8_192, _estimate_tokens(user) + len(lines) * 8))
    return incoming + needed <= _CONTEXT_BUDGET


def _slice_plan(
    lines: Sequence[str], settings: SubtitleSettings, glossary, *,
    system: str | None = None, intro: str | None = None,
) -> list[tuple[int, int]]:
    count = len(lines)
    if count == 0:
        return []
    if _fits(lines, settings, glossary, 0, system=system, intro=intro):
        return [(0, count)]
    slices: list[tuple[int, int]] = []
    start = 0
    while start < count:
        room = count - start
        size = min(_CHUNK_LINES, room)
        extra = _CARRY_TOKEN_ALLOWANCE if start else 0
        if size > _CHUNK_FLOOR and not _fits(
            lines[start:start + size], settings, glossary, extra, system=system, intro=intro,
        ):
            size = min(_CHUNK_FLOOR, room)
        slices.append((start, start + size))
        start += size
    return slices


def _max_tokens_for(system: str, user: str) -> int:
    incoming = _estimate_tokens(system) + _estimate_tokens(user) + 32
    room = _CONTEXT_BUDGET - incoming
    if room >= _MAX_OUTPUT_TOKENS:
        return _MAX_OUTPUT_TOKENS
    if room >= 8_192:
        return room
    return _MAX_OUTPUT_TOKENS


def _remember(memory: list[tuple[str, str]], source: str, target: str, slot) -> None:
    if slot or not target.strip() or not _NAME_HINT.search(source):
        return
    source, target = " ".join(source.split()), " ".join(target.split())
    if not source or not target or len(source) > 80 or len(target) > 80:
        return
    memory.append((source, target))


def _remember_correction(memory: list[tuple[str, str]], source: str, target: str) -> None:
    """校对块之间只带走改过的短称呼，避免把整句对白再送一遍。"""
    source, target = " ".join(source.split()), " ".join(target.split())
    if not source or not target or source == target or len(source) > 40 or len(target) > 40:
        return
    if not _NAME_HINT.search(source + target) and max(len(source), len(target)) > 16:
        return
    memory.append((source, target))


def _carry_pairs(memory: Sequence[tuple[str, str]]) -> list[tuple[str, str]]:
    chosen: dict[str, str] = {}
    for source, target in memory:
        chosen.pop(source, None)
        chosen[source] = target
    return list(chosen.items())[-_CARRY_PAIRS:]


def _deepseek_batch(
    lines, settings: SubtitleSettings, glossary, key: str, client, carry=(), *,
    system: str | None = None, intro: str | None = None, carry_note: str | None = None,
) -> list[str]:
    system_text = style_prompt(settings, glossary) if system is None else system
    if intro is None:
        user = _numbered(lines, carry)
    else:
        user = _message(intro, lines, carry, carry_note or POLISH_CARRY)
    payload = {
        "model": settings.deepseek_model,
        "temperature": 0.3,
        # 当前接口默认开启思考。思考模式下 temperature 不生效，推理还会占掉输出额度。
        "thinking": {"type": "disabled"},
        "max_tokens": _max_tokens_for(system_text, user),
        "messages": [
            {"role": "system", "content": system_text},
            {"role": "user", "content": user},
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


def _message(
    intro: str, lines: Sequence[str], carry: Sequence[tuple[str, str]] = (),
    carry_note: str = TRANSLATE_CARRY,
) -> str:
    text = intro
    if carry:
        rows = "\n".join(f"{source} → {target}" for source, target in carry)
        text += "\n" + carry_note + "\n" + rows
    body = "\n".join(f"{index}|{line}" for index, line in enumerate(lines, 1))
    return text + "\n" + body


def _numbered(lines: Sequence[str], carry: Sequence[tuple[str, str]] = ()) -> str:
    return _message(TRANSLATE_INTRO, lines, carry, TRANSLATE_CARRY)


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


# faster-whisper 默认要 no_speech_prob > 0.6 且 avg_logprob < -1.0 才当静音丢掉，
# compression_ratio > 2.4 才当失败。片头曲和低置信幻听经常只越过其中一条，
# 模型对错词仍可以很有信心。这里任一条成立就丢掉，阈值也收紧一点：
# no_speech_prob >= 0.5，compression_ratio >= 2.2，avg_logprob < -0.8。
_NO_SPEECH_PROB = 0.5
_COMPRESSION_RATIO = 2.2
_AVG_LOGPROB = -0.8


def segment_kept(segment) -> bool:
    """空文本、无语音、重复乱码或置信度过低的段不进入字幕。"""
    text = str(getattr(segment, "text", "") or "").strip()
    if not text:
        return False
    no_speech = float(getattr(segment, "no_speech_prob", 0.0) or 0.0)
    ratio = float(getattr(segment, "compression_ratio", 0.0) or 0.0)
    logprob = float(getattr(segment, "avg_logprob", 0.0) or 0.0)
    if no_speech >= _NO_SPEECH_PROB or ratio >= _COMPRESSION_RATIO or logprob < _AVG_LOGPROB:
        return False
    return True


def cues_from_model(model, wav: Path, settings: SubtitleSettings):
    options = {
        "language": "ja",
        "vad_filter": True,
        "condition_on_previous_text": False,
        "no_speech_threshold": _NO_SPEECH_PROB,
        "compression_ratio_threshold": _COMPRESSION_RATIO,
        "log_prob_threshold": _AVG_LOGPROB,
    }
    if "kotoba" in settings.model.casefold():
        options["chunk_length"] = 15
    segments, _info = model.transcribe(str(wav), **options)
    cues = []
    for segment in segments:
        if not segment_kept(segment):
            continue
        cues.append((float(segment.start), float(segment.end), str(segment.text).strip()))
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


def ja_sidecar_path(video: Path) -> Path:
    """校对后的日语轨，跟正片同目录。"""
    return video.with_name(f"{video.stem}.ja.srt")


_SUBTITLE_BYTE_LIMIT = 4 * 1024 * 1024
_KANA = re.compile(r"[\u3040-\u30ff]")
_KANA_MIN = 12
_CUE_TIME = re.compile(
    r"(\d{1,3}):([0-5]\d):([0-5]\d)[.,](\d{1,3})\s*-->\s*"
    r"(\d{1,3}):([0-5]\d):([0-5]\d)[.,](\d{1,3})"
)
_MARKUP = re.compile(r"<[^>]+>")


def sidecar_is_chinese_source(name: str, language: str = "") -> bool:
    """中文外挂不能当作日语对白。`.chs.srt` 靠文件名语言，标题里的「中文」同样排除。"""
    if row_is_chinese({"language": language, "name": name}):
        return True
    return subtitle_tag_is_chinese(language, name)


def _cue_seconds(hours: str, minutes: str, seconds: str, fraction: str) -> float:
    millis = int(fraction.ljust(3, "0")[:3])
    return int(hours) * 3600 + int(minutes) * 60 + int(seconds) + millis / 1000.0


def cues_from_subtitle_text(text: str, fmt: str) -> list[tuple[float, float, str]]:
    """SRT 或 VTT 的时间轴和对白。多行正文合成一行，空对白不留下。"""
    from .subtitles import srt_to_vtt, vtt_passthrough
    rendered = vtt_passthrough(text) if fmt == "vtt" else srt_to_vtt(text)
    normalized = rendered.replace("\r\n", "\n").replace("\r", "\n")
    cues = []
    for block in re.split(r"\n\s*\n", normalized.strip()):
        lines = [line for line in block.split("\n") if line.strip()]
        if not lines or lines[0].startswith(("WEBVTT", "NOTE", "STYLE", "REGION")):
            continue
        timing = None
        body_at = 0
        for index, line in enumerate(lines):
            match = _CUE_TIME.search(line)
            if match:
                timing = match
                body_at = index + 1
                break
        if timing is None:
            continue
        body = " ".join(_MARKUP.sub("", " ".join(lines[body_at:])).split())
        if not body:
            continue
        start = _cue_seconds(*timing.groups()[:4])
        end = _cue_seconds(*timing.groups()[4:])
        cues.append((start, end if end > start else start + 0.2, body))
    return cues


def _japanese_source_rank(video: Path, name: str, language: str) -> int | None:
    """0 同名 srt，1 同名 vtt，2 标成日语，3 未标语言但正文可能是日语。中文是 None。"""
    if sidecar_is_chinese_source(name, language):
        return None
    suffix = Path(name).suffix.lower()
    if suffix not in {".srt", ".vtt"}:
        return None
    plain = Path(name).stem.casefold() == video.stem.casefold()
    if plain and suffix == ".srt":
        return 0
    if plain and suffix == ".vtt":
        return 1
    if language.casefold().startswith("ja"):
        return 2
    return 3


def _read_subtitle(path: Path) -> str | None:
    from .subtitles import SubtitleUndecodable, decode
    try:
        size = path.stat().st_size
        if size <= 0 or size > _SUBTITLE_BYTE_LIMIT:
            return None
        return decode(path.read_bytes())
    except (OSError, SubtitleUndecodable):
        return None


def japanese_source_cues(video: Path) -> list[tuple[float, float, str]] | None:
    """同目录可用的日语外挂。没有、解析失败或没有对白时返回 None，调用方改走识别。

    同名 `.srt` 优先于同名 `.vtt`，再其次是标成日语的文件。未标语言的其他字幕
    只有假名够多才采用。`.chs.srt` 一类中文轨一律不读。
    """
    try:
        rows = discover_sidecars(video, set(VIDEO_EXTENSIONS))
    except OSError:
        return None
    ranked = []
    for row in rows:
        name = str(row.get("name") or "")
        language = str(row.get("language") or "")
        rank = _japanese_source_rank(video, name, language)
        if rank is None:
            continue
        ranked.append((rank, name.casefold(), row))
    if not ranked:
        return None
    ranked.sort()
    best = ranked[0][0]
    for rank, _name, row in ranked:
        if rank != best:
            break
        text = _read_subtitle(Path(str(row.get("path") or "")))
        if rank == 3:
            if text is None or len(_KANA.findall(text)) < _KANA_MIN:
                continue
        elif text is None:
            return None
        cues = cues_from_subtitle_text(text, str(row.get("format") or "srt"))
        if cues:
            return cues
        return None
    return None


def align_polished(
    cues: Sequence[tuple[float, float, str]], texts: Sequence[str],
) -> list[tuple[float, float, str]]:
    """校对结果按原时间轴配对，丢掉留空的行。"""
    if len(texts) != len(cues):
        raise SubtitleGenerationError("校对行数与原文不一致")
    kept = []
    for (start, end, _source), text in zip(cues, texts, strict=True):
        cleaned = " ".join(str(text).split())
        if cleaned:
            kept.append((float(start), float(end), cleaned))
    return kept


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
                 translator: Callable | None = None, polisher: Callable | None = None,
                 transcriber: Callable | None = None,
                 extractor: Callable | None = None, embedded: Callable | None = None,
                 persist_enabled: Callable[[bool], str] | None = None):
        self.root = Path(root)
        self.database_path = Path(database_path)
        self.media = media
        self.ffmpeg = ffmpeg
        self._settings = settings
        self._translator = translator or translate_with_deepseek
        self._polisher = polisher or polish_with_deepseek
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
        ids = [item for item in (
            current_id, *queue, *(row["id"] for row in failed), *(row["id"] for row in skipped),
        ) if item]
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
        stem = Path(video_name).stem if video_name else ""
        known = {str(row.get("name") or "").casefold() for row in rows}
        found = []
        path = self._stored_srt(asset_id)
        if path.is_file():
            name = f"{stem}.chs.srt" if stem else path.name
            if name.casefold() not in known:
                found.append({
                    "path": str(path), "name": name, "language": "zh-Hans", "format": "srt",
                    "size": path.stat().st_size, "pairing": "suffix", "generated": True,
                })
        ja = self._stored_ja_srt(asset_id)
        if ja.is_file():
            ja_name = f"{stem}.ja.srt" if stem else ja.name
            if ja_name.casefold() not in known:
                found.append({
                    "path": str(ja), "name": ja_name, "language": "ja", "format": "srt",
                    "size": ja.stat().st_size, "pairing": "suffix", "generated": True,
                })
        return found

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
                self._set(asset_id, "ready" if reason == "已是最新" else "skipped", "" if reason == "已是最新" else reason)
                return
            settings = self.settings()
            loaded = japanese_source_cues(video.path)
            source = "asr"
            if loaded:
                cues = loaded
                source = "sidecar"
            else:
                self._extract(video.path, wav)
                cues = self._transcribe(wav, settings)
            if not cues:
                raise SubtitleGenerationError("没有识别到日语对白")
            if self._abandoned(asset_id):
                return
            texts = [text for _start, _end, text in cues]
            if settings.polish_transcript:
                texts = list(self._polisher(texts, settings))
                cues = align_polished(cues, texts)
                texts = [text for _start, _end, text in cues]
            if not texts:
                raise SubtitleGenerationError("没有识别到日语对白")
            translated = self._translator(texts, settings)
            if len(translated) != len(cues):
                raise SubtitleGenerationError("译文行数与原文不一致")
            zh = [(start, end, text) for (start, end, _source), text in zip(cues, translated, strict=True) if text.strip()]
            if not zh:
                raise SubtitleGenerationError("译文是空的")
            if self._abandoned(asset_id):
                return
            self._publish(video, asset_id, zh, settings, japanese=cues, source=source)
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

    def _publish(
        self, video: VideoFile, asset_id: int, cues, settings: SubtitleSettings, *,
        japanese: Sequence[tuple[float, float, str]] = (), source: str = "asr",
    ) -> None:
        text = to_srt(cues)
        ja_text = to_srt(japanese) if japanese else ""
        record = json.dumps({
            "fingerprint": video.fingerprint, "model": settings.model, "translator": "deepseek",
            "source": source,
        }, ensure_ascii=False)
        path, marker = sidecar_paths(video.path)
        if _writable(video.path.parent):
            atomic_write_text(path, text)
            if ja_text:
                atomic_write_text(ja_sidecar_path(video.path), ja_text)
            atomic_write_text(marker, record)
            return
        folder = self.root / "tracks"
        folder.mkdir(parents=True, exist_ok=True)
        atomic_write_text(self._stored_srt(asset_id), text)
        if ja_text:
            atomic_write_text(self._stored_ja_srt(asset_id), ja_text)
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

    def _stored_ja_srt(self, asset_id: int) -> Path:
        return self.root / "tracks" / f"{asset_id}.ja.srt"

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
