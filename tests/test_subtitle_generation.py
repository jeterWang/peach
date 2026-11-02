"""日语转写后的中文字幕：已有中文则跳过，DeepSeek 只负责译文。"""
from __future__ import annotations

import json
import os
import sqlite3
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

from peach import settings_file, subtitle_generation as gen
from peach.settings_file import SettingsFileError, SubtitleSettings
from peach.subtitle_generation import (
    SubtitleService, VideoFile, load_glossary, parse_numbered, protect, restore,
    row_is_chinese, subtitle_tag_is_chinese, to_srt, translate_with_deepseek,
    videos_without_chinese,
)
from support.ledger import fresh_ledger


class TempTree:
    def __init__(self):
        self._temp = tempfile.TemporaryDirectory()
        self.root = Path(self._temp.name).resolve()
        self.project = self.root / "app"
        self.project.mkdir()
        self.data_root = self.root / "peach-data"
        self.data_root.mkdir()

    def write(self, text: str) -> None:
        (self.data_root / settings_file.SETTINGS_FILENAME).write_text(text, encoding="utf-8")

    def load(self, environ: dict[str, str] | None = None):
        return settings_file.load_config(project_root=self.project, environ=environ or {})

    def close(self) -> None:
        self._temp.cleanup()


class CaptionTests(unittest.TestCase):
    def test_glossary_keeps_the_longer_address(self):
        text, slots = protect("旦那さんと先輩", (("旦那", "老公"), ("旦那さん", "老公啊"), ("先輩", "前辈")))
        self.assertNotIn("旦那", text)
        self.assertEqual(restore(text, slots), "老公啊と前辈")

    def test_glossary_file_overrides_a_built_in_term(self):
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        path = Path(folder.name) / "terms.tsv"
        path.write_text("# 注释\n先輩\t学长\n", encoding="utf-8")
        glossary = load_glossary(SubtitleSettings(glossary=str(path)))
        self.assertIn(("先輩", "学长"), glossary)
        self.assertNotIn(("先輩", "前辈"), glossary)

    def test_numbered_translation_must_cover_every_line(self):
        self.assertEqual(parse_numbered("1|甲\n2|乙", 2), ["甲", "乙"])
        with self.assertRaises(gen.SubtitleGenerationError):
            parse_numbered("1|甲", 2)

    def test_deepseek_request_uses_the_env_key_and_keeps_it_out_of_the_body(self):
        previous = os.environ.get(gen.API_KEY_ENV)
        os.environ[gen.API_KEY_ENV] = "test-key-not-a-secret"
        seen = {}

        class Client:
            def post(self, url, json, headers):
                seen["url"] = url
                seen["json"] = json
                seen["headers"] = headers
                line = next(item for item in json["messages"][1]["content"].splitlines() if item[:1].isdigit())
                return SimpleNamespace(status_code=200, json=lambda: {
                    "choices": [{"message": {"content": f"1|{line.split('|', 1)[1]}"}}]})

            def close(self):
                pass

        try:
            result = translate_with_deepseek(["先輩"], SubtitleSettings(), client=Client())
        finally:
            if previous is None:
                os.environ.pop(gen.API_KEY_ENV, None)
            else:
                os.environ[gen.API_KEY_ENV] = previous
        self.assertEqual(result, ["前辈"])
        self.assertEqual(seen["url"], SubtitleSettings().deepseek_url)
        self.assertEqual(seen["headers"]["Authorization"], "Bearer test-key-not-a-secret")
        self.assertNotIn("test-key-not-a-secret", json.dumps(seen["json"]))
        self.assertIn("成人影片", seen["json"]["messages"][0]["content"])
        self.assertIn("口语", seen["json"]["messages"][0]["content"])
        self.assertEqual(seen["json"]["model"], "deepseek-chat")

    def test_missing_key_is_reported_without_calling_the_network(self):
        previous = os.environ.pop(gen.API_KEY_ENV, None)
        try:
            with self.assertRaises(gen.SubtitleGenerationError) as caught:
                translate_with_deepseek(["你好"], SubtitleSettings(), client=object())
        finally:
            if previous is not None:
                os.environ[gen.API_KEY_ENV] = previous
        self.assertIn("DEEPSEEK_API_KEY", str(caught.exception))

    def test_chinese_tags_and_sidecar_names_match_existing_detection(self):
        self.assertTrue(subtitle_tag_is_chinese("zh-CN", ""))
        self.assertTrue(subtitle_tag_is_chinese("chi", ""))
        self.assertTrue(subtitle_tag_is_chinese("", "简体中文"))
        self.assertFalse(subtitle_tag_is_chinese("ja", "日本語"))
        self.assertTrue(row_is_chinese({"language": "", "name": "ABP-758.chs.srt"}))
        self.assertTrue(row_is_chinese({"language": "", "name": "ABP-758.zh-CN.srt"}))
        self.assertTrue(row_is_chinese({"language": "zh-Hans", "name": "plain.srt"}))
        self.assertFalse(row_is_chinese({"language": "ja", "name": "ABP-758.jp.srt"}))

    def test_srt_timing_uses_a_comma(self):
        self.assertIn("00:00:01,500 --> 00:00:02,000", to_srt([(1.5, 2, "台词")]))


class SettingsTests(unittest.TestCase):
    def test_subtitles_roundtrip_and_reject_a_non_https_endpoint(self):
        tree = TempTree()
        self.addCleanup(tree.close)
        tree.write("[subtitles]\nenabled = true\ndevice = 'cuda'\n")
        loaded = tree.load()
        self.assertTrue(loaded.subtitles.enabled)
        self.assertEqual(loaded.subtitles.device, "cuda")
        self.assertEqual(loaded.subtitles.model, SubtitleSettings().model)
        tree.write(settings_file.render(loaded))
        self.assertTrue(tree.load().subtitles.enabled)
        tree.write("[subtitles]\ndeepseek_url = 'http://api.deepseek.com/chat/completions'\n")
        with self.assertRaises(SettingsFileError) as caught:
            tree.load()
        self.assertIn("https", str(caught.exception))

    def test_environment_turns_generation_on(self):
        tree = TempTree()
        self.addCleanup(tree.close)
        loaded = tree.load({"PEACH_SUBTITLES_ENABLED": "true", "PEACH_SUBTITLES_DEVICE": "cpu"})
        self.assertTrue(loaded.subtitles.enabled)


class GenerationTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name).resolve()
        self.video = self.root / "ABP-758.mp4"
        self.video.write_bytes(b"0" * 16)
        self.calls = 0

        def translate(lines, _settings):
            self.calls += 1
            return ["中文对白" for _line in lines]

        self.service = SubtitleService(
            root=self.root / "generated", database_path=self.root / "ledger.db",
            media=SimpleNamespace(
                filesystem=SimpleNamespace(allowed_roots=()),
                asset=lambda _asset_id: SimpleNamespace(path=str(self.video))),
            settings=SubtitleSettings(enabled=True),
            translator=translate,
            transcriber=lambda _wav, _settings: [(0.0, 1.2, "先輩")],
            extractor=lambda _source, dest: (dest.parent.mkdir(parents=True, exist_ok=True), dest.write_bytes(b"RIFF")),
            embedded=lambda _path: False,
        )

    def test_generation_writes_a_chinese_sidecar_and_does_not_repeat(self):
        self.service._run_one(7)
        path, marker = gen.sidecar_paths(self.video)
        self.assertIn("中文对白", path.read_text(encoding="utf-8"))
        self.assertEqual(json.loads(marker.read_text(encoding="utf-8"))["translator"], "deepseek")
        self.service._run_one(7)
        self.assertEqual(self.calls, 1)

    def test_an_existing_chinese_sidecar_is_left_alone(self):
        existing = self.video.with_name("ABP-758.chs.srt")
        existing.write_text("用户字幕\n", encoding="utf-8")
        self.service._run_one(7)
        self.assertEqual(existing.read_text(encoding="utf-8"), "用户字幕\n")
        self.assertEqual(self.calls, 0)
        self.assertEqual(self.service._status_of(7), "skipped")

    def test_an_embedded_chinese_track_skips_translation(self):
        self.service._embedded = lambda _path: True
        self.service._run_one(7)
        self.assertEqual(self.calls, 0)
        self.assertIn("内嵌", self.service._message_of(7))
        self.assertFalse(gen.sidecar_paths(self.video)[0].exists())

    def test_unwritable_directories_keep_the_caption_in_the_data_directory(self):
        original = gen._writable
        gen._writable = lambda _directory: False
        self.addCleanup(lambda: setattr(gen, "_writable", original))
        self.service._run_one(7)
        stored = self.service._stored_srt(7)
        self.assertIn("中文对白", stored.read_text(encoding="utf-8"))
        rows = self.service.extra_rows(7, self.video.name, [])
        self.assertEqual(rows[0]["language"], "zh-Hans")
        self.assertTrue(self.service.stored_root_has(stored))

    def test_catalog_query_skips_videos_that_already_have_chinese_rows(self):
        database = fresh_ledger(self.root)
        with sqlite3.connect(database) as connection:
            connection.execute(
                "INSERT INTO asset(id,location,path,name,medium,first_seen,last_seen) "
                "VALUES(1,'local','R:/a.mp4','a.mp4','video','2026-01-01','2026-01-01')")
            connection.execute(
                "INSERT INTO asset(id,location,path,name,medium,first_seen,last_seen) "
                "VALUES(2,'local','R:/b.mp4','b.mp4','video','2026-01-01','2026-01-01')")
            connection.execute(
                "INSERT INTO asset_subtitle(asset_id,location,path,name,language,format,pairing,first_seen,last_seen) "
                "VALUES(2,'local','R:/b.chs.srt','b.chs.srt','zh-Hans','srt','suffix','2026-01-01','2026-01-01')")
        self.assertEqual(videos_without_chinese(database), [1])


class ListingTests(unittest.TestCase):
    def test_the_subtitle_list_reports_generation_without_starting_work(self):
        from peach.api import create_app
        from peach.config import PeachSettings
        from support.web import route_client
        root = Path(tempfile.mkdtemp()).resolve()
        self.addCleanup(lambda: __import__("shutil").rmtree(root, ignore_errors=True))
        database = fresh_ledger(root)
        media = root / "media"
        media.mkdir()
        (media / "ABP-758.mp4").write_bytes(b"0")
        with sqlite3.connect(database) as connection:
            connection.execute(
                "INSERT INTO asset(id,location,path,name,medium,first_seen,last_seen) "
                "VALUES(1,'local',?,'ABP-758.mp4','video','2026-01-01','2026-01-01')",
                (str(media / "ABP-758.mp4"),))
        with route_client(create_app(PeachSettings(
                db_path=database, configured=True, token="",
                allowed_media_roots=(media,)))) as client:
            payload = client.get("/api/assets/1/subtitles").json()
        self.assertEqual(payload["generation"]["pending"], False)
        self.assertIn("subtitles", payload)
