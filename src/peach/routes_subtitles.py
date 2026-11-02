"""播放器字幕文件转换与中文在线搜索。"""
from __future__ import annotations

import json

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse, PlainTextResponse
from starlette.concurrency import run_in_threadpool

from . import subtitle_memory, subtitle_search, subtitles
from .routes_auth import require_auth

router = APIRouter(dependencies=[Depends(require_auth)])


def _error(error: Exception):
    return JSONResponse({"error": str(error)}, status_code=400)


def _track(text: str):
    return PlainTextResponse(text, media_type="text/vtt", headers={"Cache-Control": "no-store"})


@router.post("/api/subtitles/convert")
async def convert_subtitle(request: Request, name: str = ""):
    """上传文件转换为播放器支持的 WebVTT。"""
    data = bytearray()
    async for chunk in request.stream():
        data.extend(chunk)
        if len(data) > subtitle_search.MAX_BYTES:
            return JSONResponse({"error": "字幕文件超过 4 MiB"}, status_code=413)
    try:
        return _track(subtitle_search.convert(bytes(data), subtitles.subtitle_format(name)))
    except (subtitle_search.SubtitleSearchError, subtitles.SubtitleUndecodable) as error:
        return _error(error)


def _memory(request: Request, video: str) -> subtitle_memory.SubtitleMemory:
    state = request.app.state
    if not subtitle_memory.VIDEO_KEY.fullmatch(video):
        raise HTTPException(400, "视频标识无效")
    kind, identity, *_ = video.split(":")
    table = "asset" if kind == "item" else "follow_item"
    with state.database.read_connection() as connection:
        if not connection.execute(f"SELECT 1 FROM {table} WHERE id=?", (int(identity),)).fetchone():
            raise HTTPException(404, "视频不存在")
    return subtitle_memory.SubtitleMemory(state.web_contract.follow_state_root / "player-subtitles", video)


def _memory_payload(video: str, value: dict) -> dict:
    return {**{key: value[key] for key in subtitle_memory.PREFERENCES if key in value},
            "selected": value["selected"], "subtitle_chosen": bool(value.get("subtitle_chosen")),
            "tracks": [
        {"key": row["key"], "name": row["name"],
         "src": f"/api/subtitles/memory/track/{row['file']}?video={video}"}
        for row in value["tracks"]]}


@router.get("/api/subtitles/memory")
@router.get("/api/player/memory")
def remembered_subtitles(request: Request, video: str):
    return JSONResponse(_memory_payload(video, _memory(request, video).read()),
                        headers={"Cache-Control": "no-store"})


@router.put("/api/subtitles/memory")
@router.put("/api/player/memory")
async def remember_subtitles(request: Request, video: str):
    memory = _memory(request, video)
    data = bytearray()
    async for chunk in request.stream():
        data.extend(chunk)
        if len(data) > subtitle_memory.MAX_BYTES * 2:
            return JSONResponse({"error": "字幕内容过大"}, status_code=413)
    try:
        value = json.loads(data)
        saved = await run_in_threadpool(memory.patch, value)
        return JSONResponse(_memory_payload(video, saved), headers={"Cache-Control": "no-store"})
    except (ValueError, TypeError) as error:
        return _error(error)


@router.get("/api/subtitles/memory/track/{filename}")
def remembered_subtitle_track(request: Request, filename: str, video: str):
    path = _memory(request, video).track_path(filename)
    if path is None:
        raise HTTPException(404, "字幕不存在")
    return FileResponse(path, media_type="text/vtt", headers={"Cache-Control": "private, no-cache"})


@router.get("/api/subtitles/search")
def search_subtitles(q: str = "", offset: int = 0):
    try:
        return subtitle_search.search(q, offset)
    except subtitle_search.SubtitleSearchError as error:
        return _error(error)


@router.get("/api/subtitles/subtitlecat/{subtitle_id}")
def subtitle_files(subtitle_id: str):
    try:
        return subtitle_search.files(subtitle_id)
    except subtitle_search.SubtitleSearchError as error:
        return _error(error)


@router.get("/api/subtitles/subtitlecat/{subtitle_id}/{index}")
def online_subtitle(subtitle_id: str, index: int):
    try:
        return _track(subtitle_search.load(subtitle_id, index))
    except (subtitle_search.SubtitleSearchError, subtitles.SubtitleUndecodable) as error:
        return _error(error)
