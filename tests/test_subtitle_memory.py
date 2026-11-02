"""字幕内容、关闭状态与视频身份的持久化行为。"""
from __future__ import annotations

import tempfile
import unittest
from concurrent.futures import ThreadPoolExecutor
from dataclasses import replace
from pathlib import Path

from peach.subtitle_memory import SubtitleMemory

VTT = "WEBVTT\n\n00:00:00.000 --> 00:00:02.000\n字幕\n"


class SubtitleMemoryTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name).resolve()

    def test_local_online_and_off_survive_new_store_instances(self):
        store = SubtitleMemory(self.root, "item:1")
        for key, name in (("file:local", "本地.srt"), ("subtitlecat:42:0", "在线.srt")):
            store.update(key, {"key": key, "name": name, "text": VTT})
        reopened = SubtitleMemory(self.root, "item:1")
        self.assertEqual(reopened.read()["selected"], "subtitlecat:42:0")
        self.assertEqual(len(reopened.read()["tracks"]), 2)
        for track in reopened.read()["tracks"]:
            self.assertEqual(reopened.track_path(track["file"]).read_text(encoding="utf-8"), VTT)
        reopened.update("file:local")
        self.assertEqual(store.read()["selected"], "file:local")
        reopened.update(None)
        self.assertIsNone(store.read()["selected"])
        self.assertEqual(len(store.read()["tracks"]), 2)

    def test_video_and_post_media_have_independent_selections(self):
        for index, video in enumerate(("item:1", "item:2", "follow:1:main", "follow:1:0", "follow:1:1")):
            key = f"file:{index}"
            SubtitleMemory(self.root, video).update(key, {"key": key, "name": "字幕.srt", "text": VTT})
        for index, video in enumerate(("item:1", "item:2", "follow:1:main", "follow:1:0", "follow:1:1")):
            self.assertEqual(SubtitleMemory(self.root, video).read()["selected"], f"file:{index}")

    def test_same_import_is_idempotent_and_sidecar_identity_is_retained(self):
        store = SubtitleMemory(self.root, "item:1")
        for _ in range(2):
            store.update("file:local", {"key": "file:local", "name": "同名.srt", "text": VTT})
        store.update("sidecar:12")
        self.assertEqual(store.read()["selected"], "sidecar:12")
        self.assertEqual(len(store.read()["tracks"]), 1)

    def test_unregistered_tracks_and_path_traversal_are_rejected(self):
        store = SubtitleMemory(self.root, "item:1")
        with self.assertRaises(ValueError):
            store.update("file:missing")
        self.assertIsNone(store.track_path("../../private.vtt"))
        with self.assertRaises(ValueError):
            SubtitleMemory(self.root, "item:../../private")
        with self.assertRaises(ValueError):
            store.update("file:invalid", {"key": "file:invalid", "name": "a.srt", "text": "invalid"})

    def test_playback_preferences_share_subtitle_file_and_survive_partial_writes(self):
        store = SubtitleMemory(self.root, "item:1")
        store.update("file:local", {"key": "file:local", "name": "字幕.srt", "text": VTT})
        with ThreadPoolExecutor() as executor:
            list(executor.map(store.patch, [{"rotation": 90}, {"rate": 1.75},
                                           {"caption_style": {"size": "150"}},
                                           {"caption_style": {"color": "yellow"}}]))
        saved = SubtitleMemory(self.root, "item:1").read()
        self.assertEqual((saved["rotation"], saved["rate"]), (90, 1.75))
        self.assertEqual(saved["caption_style"], {"size": "150", "color": "yellow"})
        self.assertEqual(saved["selected"], "file:local")
        self.assertEqual(store.track_path(saved["tracks"][0]["file"]).read_text(encoding="utf-8"), VTT)
        store.update(None)
        self.assertEqual(store.read()["rotation"], 90)
        self.assertNotIn("rotation", SubtitleMemory(self.root, "item:2").read())
        store.patch({"rotation": 0, "rate": 1})
        self.assertEqual((store.read()["rotation"], store.read()["rate"]), (0, 1))

    def test_invalid_preferences_cannot_change_saved_memory(self):
        store = SubtitleMemory(self.root, "item:1")
        store.patch({"rotation": 180, "rate": 1.5})
        saved = store.manifest.read_bytes()
        for patch in ({}, {"rotation": True}, {"rotation": 45}, {"rate": True}, {"rate": 0},
                      {"rate": float("nan")}, {"rate": float("inf")}, {"rate": 3.1},
                      {"caption_style": {"color": "url(private)"}}, {"caption_style": {"size": []}},
                      {"caption_style": {"unknown": "white"}}, {"tracks": []}):
            with self.subTest(patch=patch), self.assertRaises(ValueError):
                store.patch(patch)
            self.assertEqual(store.manifest.read_bytes(), saved)


class SubtitleMemoryApiTests(unittest.TestCase):
    def setUp(self):
        from peach.api import create_app
        from peach.config import PeachSettings
        from tests.support.ledger import fresh_ledger
        from tests.support.web import route_client
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name).resolve()
        self.app = create_app(PeachSettings(db_path=fresh_ledger(self.root), configured=True,
                                            follow_state_root=self.root / "state", token=""))
        with self.app.state.database.write_transaction() as connection:
            connection.execute("INSERT INTO asset(id,location,path,name) VALUES(1,'local','R:/sample.mp4','sample.mp4')")
            connection.execute("INSERT INTO asset(id,location,path,name) VALUES(2,'local','R:/other.mp4','other.mp4')")
        self.client = route_client(self.app)

    def test_authenticated_memory_roundtrip_and_video_isolation(self):
        with self.client as client:
            url = "/api/subtitles/memory?video=item:1"
            self.assertEqual(client.get(url).json(), {"selected": None, "subtitle_chosen": False, "tracks": []})
            saved = client.put(url, json={"selected": "file:local", "track": {
                "key": "file:local", "name": "字幕.srt", "text": VTT}})
            self.assertEqual(saved.status_code, 200)
            track_url = saved.json()["tracks"][0]["src"]
            self.assertEqual(client.get(track_url).text, VTT)
            self.assertEqual(client.get(url).json()["selected"], "file:local")
            self.assertEqual(client.get("/api/subtitles/memory?video=item:2").json()["tracks"], [])
            self.assertEqual(client.get(track_url.replace("item:1", "item:2")).status_code, 404)
            self.assertEqual(client.put(url, json={"selected": None}).status_code, 200)
            self.assertIsNone(client.get(url).json()["selected"])
            self.app.state.settings = replace(self.app.state.settings, token="private")
            self.assertEqual(client.get(url).status_code, 401)
            self.assertEqual(client.put(url, json={"selected": None}).status_code, 401)
            self.assertEqual(client.get(track_url).status_code, 401)

    def test_missing_video_invalid_payload_and_missing_track(self):
        with self.client as client:
            self.assertEqual(client.get("/api/subtitles/memory?video=item:999").status_code, 404)
            self.assertEqual(client.get("/api/subtitles/memory?video=invalid").status_code, 400)
            url = "/api/subtitles/memory?video=item:1"
            self.assertEqual(client.put(url, json={"selected": "file:missing"}).status_code, 400)
            self.assertEqual(client.put(url, json=[]).status_code, 400)

    def test_player_memory_and_subtitle_routes_share_preferences_and_authorization(self):
        with self.client as client:
            url = "/api/player/memory?video=item:1"
            self.assertEqual(client.put(url, json={"rotation": 270, "rate": 2}).status_code, 200)
            subtitle_url = "/api/subtitles/memory?video=item:1"
            self.assertEqual(client.put(subtitle_url, json={"selected": "native:subtitles:zh:1"}).status_code, 200)
            self.assertEqual(client.get(url).json(), {"rotation": 270, "rate": 2,
                             "selected": "native:subtitles:zh:1", "subtitle_chosen": True, "tracks": []})
            self.assertEqual(client.put(url, json={"rotation": 360}).status_code, 400)
            self.assertNotIn("rotation", client.get("/api/player/memory?video=item:2").json())
            self.assertEqual(client.put("/api/player/memory?video=item:999", json={"rate": 1}).status_code, 404)
            self.app.state.settings = replace(self.app.state.settings, token="private")
            self.assertEqual(client.get(url).status_code, 401)
            self.assertEqual(client.put(url, json={"rate": 1}).status_code, 401)
