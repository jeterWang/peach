"""日语转写后的中文字幕：已有中文则跳过，DeepSeek 只负责译文。"""
from __future__ import annotations

import json
import os
import sqlite3
import tempfile
import tomllib
import unittest
from pathlib import Path
from types import SimpleNamespace

from peach import settings_file, subtitle_generation as gen
from peach.settings_file import SettingsFileError, SubtitleSettings
from peach.subtitle_generation import (
    SubtitleService, load_glossary, parse_numbered, protect, restore,
    polish_with_deepseek, row_is_chinese, subtitle_tag_is_chinese, to_srt,
    translate_with_deepseek, videos_without_chinese,
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
        self.assertEqual(seen["json"]["model"], "deepseek-flash")
        self.assertEqual(seen["json"]["temperature"], 0.3)
        self.assertEqual(seen["json"]["max_tokens"], gen._MAX_OUTPUT_TOKENS)
        self.assertEqual(seen["json"]["thinking"], {"type": "disabled"})
        self.assertIn("称呼", seen["json"]["messages"][0]["content"])

    def test_missing_key_is_reported_without_calling_the_network(self):
        previous = os.environ.pop(gen.API_KEY_ENV, None)
        try:
            with self.assertRaises(gen.SubtitleGenerationError) as caught:
                translate_with_deepseek(["你好"], SubtitleSettings(), client=object())
        finally:
            if previous is not None:
                os.environ[gen.API_KEY_ENV] = previous
        self.assertIn("DEEPSEEK_API_KEY", str(caught.exception))

    def test_one_film_is_one_request_and_keeps_glossary_placeholders(self):
        lines = [f"セリフ{index}" for index in range(80)]
        lines[3] = "先輩、こっち"
        calls = []

        class Client:
            def post(self, url, json, headers):
                calls.append(json)
                numbered = []
                for item in json["messages"][1]["content"].splitlines():
                    match = gen._NUMBERED.match(item.strip())
                    if match:
                        numbered.append(f"{match.group(1)}|{match.group(2)}")
                return SimpleNamespace(status_code=200, json=lambda body="\n".join(numbered): {
                    "choices": [{"message": {"content": body}}]})

            def close(self):
                pass

        previous = os.environ.get(gen.API_KEY_ENV)
        os.environ[gen.API_KEY_ENV] = "test-key-not-a-secret"
        try:
            result = translate_with_deepseek(lines, SubtitleSettings(), client=Client())
        finally:
            if previous is None:
                os.environ.pop(gen.API_KEY_ENV, None)
            else:
                os.environ[gen.API_KEY_ENV] = previous
        self.assertEqual(len(calls), 1)
        self.assertEqual(result[3], "前辈、こっち")
        self.assertEqual(len(result), 80)
        user = calls[0]["messages"][1]["content"]
        self.assertIn("80|セリフ79", user)
        self.assertIn("同一部影片", user)
        self.assertNotIn("→", user)

    def test_configured_model_overrides_the_default(self):
        seen = {}

        class Client:
            def post(self, url, json, headers):
                seen["model"] = json["model"]
                return SimpleNamespace(status_code=200, json=lambda: {
                    "choices": [{"message": {"content": "1|甲"}}]})

            def close(self):
                pass

        previous = os.environ.get(gen.API_KEY_ENV)
        os.environ[gen.API_KEY_ENV] = "test-key-not-a-secret"
        try:
            translate_with_deepseek(
                ["あ"], SubtitleSettings(deepseek_model="deepseek-v4-pro"), client=Client(),
            )
        finally:
            if previous is None:
                os.environ.pop(gen.API_KEY_ENV, None)
            else:
                os.environ[gen.API_KEY_ENV] = previous
        self.assertEqual(seen["model"], "deepseek-v4-pro")

    def test_oversized_dialogue_uses_large_chunks_and_carries_names(self):
        lines = [f"マリアさん{index}" for index in range(1000)]
        calls = []

        class Client:
            def post(self, url, json, headers):
                calls.append(json["messages"][1]["content"])
                numbered = []
                for item in json["messages"][1]["content"].splitlines():
                    match = gen._NUMBERED.match(item.strip())
                    if match:
                        text = match.group(2).replace("マリアさん", "玛丽亚")
                        numbered.append(f"{match.group(1)}|{text}")
                return SimpleNamespace(status_code=200, json=lambda body="\n".join(numbered): {
                    "choices": [{"message": {"content": body}}]})

            def close(self):
                pass

        previous = os.environ.get(gen.API_KEY_ENV)
        os.environ[gen.API_KEY_ENV] = "test-key-not-a-secret"
        original = gen._CONTEXT_BUDGET
        gen._CONTEXT_BUDGET = 1
        try:
            result = translate_with_deepseek(lines, SubtitleSettings(), client=Client())
        finally:
            gen._CONTEXT_BUDGET = original
            if previous is None:
                os.environ.pop(gen.API_KEY_ENV, None)
            else:
                os.environ[gen.API_KEY_ENV] = previous
        sizes = []
        for content in calls:
            sizes.append(sum(1 for item in content.splitlines() if gen._NUMBERED.match(item.strip())))
        self.assertEqual(sizes, [400, 400, 200])
        self.assertNotIn("→", calls[0])
        self.assertIn("玛丽亚", calls[1])
        self.assertIn("→", calls[1])
        self.assertTrue(result[0].startswith("玛丽亚"))
        self.assertEqual(len(result), 1000)

    def test_chunks_stay_at_600_lines_when_that_block_fits(self):
        lines = [f"マリアさん{index}" for index in range(1000)]
        settings = SubtitleSettings()
        glossary = load_glossary(settings)

        def budget(sample, extra=0):
            system = gen.style_prompt(settings, glossary)
            user = gen._numbered(sample)
            incoming = gen._estimate_tokens(system) + gen._estimate_tokens(user) + extra + 32
            needed = min(gen._MAX_OUTPUT_TOKENS, max(8_192, gen._estimate_tokens(user) + len(sample) * 8))
            return incoming + needed

        self.assertLess(budget(lines[:600]), budget(lines))
        calls = []

        class Client:
            def post(self, url, json, headers):
                calls.append(json["messages"][1]["content"])
                numbered = [
                    f"{match.group(1)}|{match.group(2)}"
                    for item in json["messages"][1]["content"].splitlines()
                    if (match := gen._NUMBERED.match(item.strip()))
                ]
                return SimpleNamespace(status_code=200, json=lambda body="\n".join(numbered): {
                    "choices": [{"message": {"content": body}}]})

            def close(self):
                pass

        previous = os.environ.get(gen.API_KEY_ENV)
        os.environ[gen.API_KEY_ENV] = "test-key-not-a-secret"
        original = gen._CONTEXT_BUDGET
        gen._CONTEXT_BUDGET = budget(lines[:600])
        try:
            translate_with_deepseek(lines, settings, client=Client())
        finally:
            gen._CONTEXT_BUDGET = original
            if previous is None:
                os.environ.pop(gen.API_KEY_ENV, None)
            else:
                os.environ[gen.API_KEY_ENV] = previous
        sizes = [sum(1 for item in content.splitlines() if gen._NUMBERED.match(item.strip())) for content in calls]
        self.assertEqual(sizes, [600, 400])
        self.assertIn("→", calls[1])

    def test_translation_client_waits_for_a_full_film(self):
        seen = {}

        class Client:
            def post(self, url, json, headers):
                return SimpleNamespace(status_code=200, json=lambda: {
                    "choices": [{"message": {"content": "1|甲"}}]})

            def close(self):
                seen["closed"] = True

        def fake_http_client(**kwargs):
            seen["timeout"] = kwargs.get("timeout")
            return Client()

        from peach import peach_proxy
        original = peach_proxy.http_client
        peach_proxy.http_client = fake_http_client
        previous = os.environ.get(gen.API_KEY_ENV)
        os.environ[gen.API_KEY_ENV] = "test-key-not-a-secret"
        try:
            self.assertEqual(translate_with_deepseek(["あ"], SubtitleSettings()), ["甲"])
        finally:
            peach_proxy.http_client = original
            if previous is None:
                os.environ.pop(gen.API_KEY_ENV, None)
            else:
                os.environ[gen.API_KEY_ENV] = previous
        self.assertTrue(seen["closed"])
        self.assertGreaterEqual(seen["timeout"].read, gen._READ_TIMEOUT)
        self.assertEqual(seen["timeout"].connect, 30)

    def test_blank_japanese_stays_blank_in_translation(self):
        class Client:
            def post(self, url, json, headers):
                numbered = []
                for item in json["messages"][1]["content"].splitlines():
                    match = gen._NUMBERED.match(item.strip())
                    if not match:
                        continue
                    text = match.group(2) if match.group(2).strip() else "不该出现"
                    numbered.append(f"{match.group(1)}|{text}")
                return SimpleNamespace(status_code=200, json=lambda body="\n".join(numbered): {
                    "choices": [{"message": {"content": body}}]})

            def close(self):
                pass

        previous = os.environ.get(gen.API_KEY_ENV)
        os.environ[gen.API_KEY_ENV] = "test-key-not-a-secret"
        try:
            result = translate_with_deepseek(["先輩", ""], SubtitleSettings(), client=Client())
        finally:
            if previous is None:
                os.environ.pop(gen.API_KEY_ENV, None)
            else:
                os.environ[gen.API_KEY_ENV] = previous
        self.assertEqual(result, ["前辈", ""])

    def test_polish_keeps_japanese_and_blanks_non_speech(self):
        calls = []

        class Client:
            def post(self, url, json, headers):
                calls.append(json)
                numbered = []
                for item in json["messages"][1]["content"].splitlines():
                    match = gen._NUMBERED.match(item.strip())
                    if not match:
                        continue
                    text = match.group(2).replace("せんぱい", "先輩")
                    if "音楽" in text:
                        text = ""
                    numbered.append(f"{match.group(1)}|{text}")
                return SimpleNamespace(status_code=200, json=lambda body="\n".join(numbered): {
                    "choices": [{"message": {"content": body}}]})

            def close(self):
                pass

        previous = os.environ.get(gen.API_KEY_ENV)
        os.environ[gen.API_KEY_ENV] = "test-key-not-a-secret"
        try:
            result = polish_with_deepseek(["せんぱい、こっち", "♪音楽♪"], SubtitleSettings(), client=Client())
        finally:
            if previous is None:
                os.environ.pop(gen.API_KEY_ENV, None)
            else:
                os.environ[gen.API_KEY_ENV] = previous
        self.assertEqual(result, ["先輩、こっち", ""])
        self.assertEqual(len(calls), 1)
        system = calls[0]["messages"][0]["content"]
        self.assertIn("不要翻译", system)
        self.assertIn("幻听", system)
        self.assertNotIn("译成", system)
        self.assertEqual(calls[0]["model"], "deepseek-flash")
        self.assertEqual(calls[0]["thinking"], {"type": "disabled"})
        self.assertEqual(calls[0]["max_tokens"], gen._MAX_OUTPUT_TOKENS)
        self.assertIn("1|せんぱい、こっち", calls[0]["messages"][1]["content"])

    def test_oversized_polish_uses_the_same_large_chunks(self):
        lines = [f"せんぱい{index}" for index in range(1000)]
        calls = []

        class Client:
            def post(self, url, json, headers):
                calls.append(json["messages"][1]["content"])
                numbered = []
                for item in json["messages"][1]["content"].splitlines():
                    match = gen._NUMBERED.match(item.strip())
                    if match:
                        numbered.append(f"{match.group(1)}|{match.group(2).replace('せんぱい', '先輩')}")
                return SimpleNamespace(status_code=200, json=lambda body="\n".join(numbered): {
                    "choices": [{"message": {"content": body}}]})

            def close(self):
                pass

        previous = os.environ.get(gen.API_KEY_ENV)
        os.environ[gen.API_KEY_ENV] = "test-key-not-a-secret"
        original = gen._CONTEXT_BUDGET
        gen._CONTEXT_BUDGET = 1
        try:
            result = polish_with_deepseek(lines, SubtitleSettings(), client=Client())
        finally:
            gen._CONTEXT_BUDGET = original
            if previous is None:
                os.environ.pop(gen.API_KEY_ENV, None)
            else:
                os.environ[gen.API_KEY_ENV] = previous
        sizes = [sum(1 for item in content.splitlines() if gen._NUMBERED.match(item.strip())) for content in calls]
        self.assertEqual(sizes, [400, 400, 200])
        self.assertIn("先輩", calls[1])
        self.assertIn("→", calls[1])
        self.assertTrue(result[0].startswith("先輩"))
        self.assertEqual(len(result), 1000)

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


class AsrDependencyTests(unittest.TestCase):
    def test_pyav_stays_on_the_release_that_accepts_metadata_errors(self):
        root = Path(__file__).resolve().parents[1]
        project = tomllib.loads((root / "pyproject.toml").read_text(encoding="utf-8"))
        extra = project["project"]["optional-dependencies"]["asr"]
        self.assertIn("av==18.1.0", extra)
        lock = tomllib.loads((root / "uv.lock").read_text(encoding="utf-8"))
        pinned = [item["version"] for item in lock["package"] if item["name"] == "av"]
        self.assertEqual(pinned, ["18.1.0"])


class SettingsTests(unittest.TestCase):
    def test_subtitles_roundtrip_and_reject_a_non_https_endpoint(self):
        tree = TempTree()
        self.addCleanup(tree.close)
        tree.write("[subtitles]\nenabled = true\ndevice = 'cuda'\n")
        loaded = tree.load()
        self.assertTrue(loaded.subtitles.enabled)
        self.assertEqual(loaded.subtitles.device, "cuda")
        self.assertEqual(loaded.subtitles.model, SubtitleSettings().model)
        self.assertEqual(loaded.subtitles.deepseek_model, "deepseek-flash")
        self.assertTrue(loaded.subtitles.polish_transcript)
        self.assertIn("polish_transcript = true", settings_file.render(loaded))
        tree.write(settings_file.render(loaded))
        self.assertTrue(tree.load().subtitles.enabled)
        tree.write("[subtitles]\ndeepseek_url = 'http://api.deepseek.com/chat/completions'\n")
        with self.assertRaises(SettingsFileError) as caught:
            tree.load()
        self.assertIn("https", str(caught.exception))

    def test_environment_turns_generation_on(self):
        tree = TempTree()
        self.addCleanup(tree.close)
        loaded = tree.load({
            "PEACH_SUBTITLES_ENABLED": "true", "PEACH_SUBTITLES_DEVICE": "cpu",
            "PEACH_SUBTITLES_DEEPSEEK_MODEL": "deepseek-v4-pro",
            "PEACH_SUBTITLES_POLISH": "false",
        })
        self.assertTrue(loaded.subtitles.enabled)
        self.assertEqual(loaded.subtitles.deepseek_model, "deepseek-v4-pro")
        self.assertFalse(loaded.subtitles.polish_transcript)


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
            self.translated = list(lines)
            return ["中文对白" for _line in lines]

        def polish(_lines, _settings):
            raise AssertionError("校对已关闭")

        self.service = SubtitleService(
            root=self.root / "generated", database_path=self.root / "ledger.db",
            media=SimpleNamespace(
                filesystem=SimpleNamespace(allowed_roots=()),
                asset=lambda _asset_id: SimpleNamespace(path=str(self.video))),
            settings=SubtitleSettings(enabled=True, polish_transcript=False),
            translator=translate,
            polisher=polish,
            transcriber=lambda _wav, _settings: [(0.0, 1.2, "先輩")],
            extractor=lambda _source, dest: (dest.parent.mkdir(parents=True, exist_ok=True), dest.write_bytes(b"RIFF")),
            embedded=lambda _path: False,
        )

    def test_polish_runs_before_translation_and_hides_the_raw_transcript(self):
        seen = {}

        def polish(lines, _settings):
            seen["polish"] = list(lines)
            return ["校正後の先輩", ""]

        def translate(lines, _settings):
            seen["translate"] = list(lines)
            return ["前辈" if line else "" for line in lines]

        service = SubtitleService(
            root=self.root / "polished", database_path=self.root / "ledger.db",
            media=self.service.media,
            settings=SubtitleSettings(enabled=True, polish_transcript=True),
            translator=translate,
            polisher=polish,
            transcriber=lambda _wav, _settings: [(0.0, 1.0, "せんぱい"), (1.2, 2.0, "♪音楽♪")],
            extractor=lambda _source, dest: (dest.parent.mkdir(parents=True, exist_ok=True), dest.write_bytes(b"RIFF")),
            embedded=lambda _path: False,
        )
        service._run_one(7)
        self.assertEqual(seen["polish"], ["せんぱい", "♪音楽♪"])
        self.assertEqual(seen["translate"], ["校正後の先輩", ""])
        self.assertNotIn("せんぱい", seen["translate"])
        path, _marker = gen.sidecar_paths(self.video)
        text = path.read_text(encoding="utf-8")
        self.assertIn("前辈", text)
        self.assertIn("00:00:00,000 --> 00:00:01,000", text)
        self.assertEqual(text.count("-->"), 1)

    def test_generation_writes_a_chinese_sidecar_and_does_not_repeat(self):
        self.service._run_one(7)
        path, marker = gen.sidecar_paths(self.video)
        self.assertIn("中文对白", path.read_text(encoding="utf-8"))
        self.assertEqual(self.translated, ["先輩"])
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
