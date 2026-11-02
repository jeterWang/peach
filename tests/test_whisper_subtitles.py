"""faster-whisper 中文字幕后继：配置、字幕文本、挑选视频和播放器能读到的文件。"""
from __future__ import annotations

import shutil
import tempfile
import unittest
import zipfile
from pathlib import Path

from peach import subtitles, whisper_subtitles
from peach.repository import LedgerDatabase
from peach.whisper_subtitles import Cue, WhisperSettings
from support.ledger import fresh_ledger


class FormatTests(unittest.TestCase):
    def test_timestamps_and_player_conversion(self):
        text = whisper_subtitles.cues_to_srt([Cue(1, 2.5, "你好"), Cue(3661.25, 3661.25, "下一句")])
        self.assertIn("00:00:01,000 --> 00:00:02,500\n你好", text)
        self.assertIn("01:01:01,250 --> 01:01:01,450\n下一句", text)
        vtt = subtitles.srt_to_vtt(text)
        self.assertTrue(vtt.startswith("WEBVTT"))
        self.assertIn("你好", vtt)
        self.assertIn("01:01:01.250 --> 01:01:01.450", vtt)

    def test_chinese_audio_keeps_the_transcript(self):
        cues = [Cue(0, 1, "原文")]
        self.assertEqual(whisper_subtitles.to_chinese(cues, "zh", lambda texts: ["不应出现"]), cues)
        self.assertTrue(whisper_subtitles.is_chinese_audio("yue"))

    def test_other_languages_use_the_chinese_translation(self):
        cues = whisper_subtitles.to_chinese(
            [Cue(0, 1, "hello"), Cue(1, 2, "   ")], "ja", lambda texts: ["你好" for _ in texts])
        self.assertEqual(cues, [Cue(0, 1, "你好")])


class SettingsTests(unittest.TestCase):
    def test_missing_file_stays_off(self):
        self.assertFalse(whisper_subtitles.load_settings(Config(Path("/missing/config.toml"))).enabled)

    def test_enabled_table_round_trips_the_supported_values(self):
        with tempfile.TemporaryDirectory() as raw:
            path = Path(raw) / "config.toml"
            path.write_text(
                "[whisper]\nenabled = true\nmodel = 'small'\ndevice = 'auto'\n"
                "compute_type = 'int8'\noutput = 'data'\n",
                encoding="utf-8")
            settings = whisper_subtitles.load_settings(Config(path))
        self.assertEqual(settings, WhisperSettings(True, "small", "auto", "int8", "data"))

    def test_unknown_model_is_rejected(self):
        with tempfile.TemporaryDirectory() as raw:
            path = Path(raw) / "config.toml"
            path.write_text("[whisper]\nenabled = true\nmodel = 'english-only'\n", encoding="utf-8")
            with self.assertRaises(whisper_subtitles.WhisperConfigError):
                whisper_subtitles.load_settings(Config(path))

    def test_turned_off_table_does_not_queue_work(self):
        with self._library(enabled=False) as library:
            self.assertEqual(whisper_subtitles.plan(library.database, library.config, library.generated), [])

    def test_a_video_without_chinese_subtitles_queues_one_followup(self):
        with self._library(enabled=True) as library:
            self.assertEqual(
                whisper_subtitles.plan(library.database, library.config, library.generated),
                [{"key": whisper_subtitles.FOLLOWUP_KEY, "task_key": whisper_subtitles.TASK_KEY,
                  "label": whisper_subtitles.TASK_LABEL}])

    def _library(self, *, enabled: bool):
        return _Library(self, enabled=enabled)


class JobTests(unittest.TestCase):
    def test_chinese_audio_writes_a_sidecar_the_player_can_load(self):
        with _Library(self, enabled=True) as library:
            calls = []

            def speech(wav, _settings):
                calls.append(wav)
                return [Cue(0.5, 1.5, "你好")], "zh"

            summary = whisper_subtitles.run(
                library.contract, whisper_subtitles.FOLLOWUP_KEY, None,
                settings=library.settings, config=library.config, speech=speech, extract=lambda *_: None)
            self.assertIn("已写入中文字幕", summary["outcome"])
            self.assertFalse(summary["continue"])
            subtitle = library.media / "x" / "ABP-758.zh.srt"
            self.assertIn("你好", subtitle.read_text(encoding="utf-8"))
            self.assertIn("你好", subtitles.srt_to_vtt(subtitle.read_text(encoding="utf-8")))
            with library.database.read_connection() as connection:
                rows = subtitles.subtitles_for(connection, 1)
            self.assertEqual(rows[0]["language"], "zh")
            self.assertEqual(rows[0]["name"], "ABP-758.zh.srt")
            whisper_subtitles.run(
                library.contract, whisper_subtitles.FOLLOWUP_KEY, None,
                settings=library.settings, config=library.config, speech=speech, extract=lambda *_: None)
            self.assertEqual(len(calls), 1)

    def test_japanese_audio_stores_the_translated_chinese_line(self):
        with _Library(self, enabled=True) as library:
            whisper_subtitles.run(
                library.contract, whisper_subtitles.FOLLOWUP_KEY, None,
                settings=library.settings, config=library.config,
                speech=lambda *_: ([Cue(0, 1, "hello")], "ja"),
                translate_batch=lambda texts: ["你好" for _ in texts],
                extract=lambda *_: None)
            self.assertIn("你好", (library.media / "x" / "ABP-758.zh.srt").read_text(encoding="utf-8"))

    def test_an_existing_sidecar_is_registered_and_left_in_place(self):
        with _Library(self, enabled=True) as library:
            subtitle = library.media / "x" / "ABP-758.zh.srt"
            subtitle.write_text("已有字幕\n", encoding="utf-8")
            summary = whisper_subtitles.run(
                library.contract, whisper_subtitles.FOLLOWUP_KEY, None,
                settings=library.settings, config=library.config,
                speech=lambda *_: ([Cue(0, 1, "新的")], "zh"), extract=lambda *_: None)
            self.assertIn("登记了已有的中文字幕", summary["outcome"])
            self.assertEqual(subtitle.read_text(encoding="utf-8"), "已有字幕\n")

    def test_data_directory_output_is_the_only_generated_file_the_player_accepts(self):
        with _Library(self, enabled=True, output="data") as library:
            whisper_subtitles.run(
                library.contract, whisper_subtitles.FOLLOWUP_KEY, None,
                settings=library.settings, config=library.config,
                speech=lambda *_: ([Cue(0, 1, "数据目录")], "zh"), extract=lambda *_: None)
            path = library.generated / "subtitles" / "1.zh.srt"
            self.assertIn("数据目录", path.read_text(encoding="utf-8"))
            self.assertEqual(whisper_subtitles.generated_row(library.generated, 1)["path"], str(path))
            self.assertEqual(
                whisper_subtitles.accepted_generated_file(library.generated, 1, path), path)
            self.assertIsNone(whisper_subtitles.accepted_generated_file(
                library.generated, 1, library.generated / "subtitles" / "2.zh.srt"))
            outside = library.root / "1.zh.srt"
            outside.write_text("别处\n", encoding="utf-8")
            self.assertIsNone(whisper_subtitles.accepted_generated_file(library.generated, 1, outside))
            with library.database.read_connection() as connection:
                self.assertEqual(list(subtitles.subtitles_for(connection, 1)), [])

    def test_metered_videos_are_not_read(self):
        with _Library(self, enabled=True) as library:
            library.add_video(2, "pikpak", r"P:\cloud\remote.mp4", "remote.mp4")
            calls = []
            summary = whisper_subtitles.run(
                library.contract, whisper_subtitles.FOLLOWUP_KEY, None,
                settings=library.settings, config=library.config,
                speech=lambda *_: calls.append(1) or ([Cue(0, 1, "你好")], "zh"),
                extract=lambda *_: None)
            self.assertEqual(calls, [1])
            self.assertFalse(summary["continue"])

    def test_silence_is_remembered_until_the_file_changes(self):
        with _Library(self, enabled=True) as library:
            calls = []

            def speech(*_):
                calls.append(1)
                return [], "zh"

            first = whisper_subtitles.run(
                library.contract, whisper_subtitles.FOLLOWUP_KEY, None,
                settings=library.settings, config=library.config, speech=speech, extract=lambda *_: None)
            second = whisper_subtitles.run(
                library.contract, whisper_subtitles.FOLLOWUP_KEY, None,
                settings=library.settings, config=library.config, speech=speech, extract=lambda *_: None)
            self.assertIn("没有识别出对白", first["outcome"])
            self.assertIn("没有需要生成", second["outcome"])
            self.assertEqual(calls, [1])

    def test_a_bad_setting_fails_the_job_instead_of_writing_a_subtitle(self):
        with _Library(self, enabled=True) as library:
            library.config.path.write_text("[whisper]\nenabled = true\nmodel = 'nope'\n", encoding="utf-8")
            with self.assertRaises(whisper_subtitles.WhisperUnavailable):
                whisper_subtitles.run(
                    library.contract, whisper_subtitles.FOLLOWUP_KEY, None, config=library.config)


class ArchiveTests(unittest.TestCase):
    def test_model_archive_rejects_parent_paths(self):
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            archive = root / "model.zip"
            with zipfile.ZipFile(archive, "w") as package:
                package.writestr("../outside.txt", "no")
            with self.assertRaises(whisper_subtitles.WhisperUnavailable):
                whisper_subtitles._extract_opus(archive, root / "out")
            self.assertFalse((root.parent / "outside.txt").exists())


class ExtractTests(unittest.TestCase):
    def test_ffmpeg_writes_a_sixteen_kilohertz_wav(self):
        ffmpeg = shutil.which("ffmpeg")
        if ffmpeg is None:
            self.skipTest("ffmpeg 不在 PATH")
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            source = root / "tone.wav"
            target = root / "speech.wav"
            made = __import__("subprocess").run(
                [ffmpeg, "-y", "-v", "error", "-f", "lavfi", "-i", "sine=frequency=440:duration=0.2", str(source)],
                capture_output=True, check=False)
            if made.returncode != 0:
                self.skipTest("ffmpeg 没有 lavfi")
            whisper_subtitles.extract_wav(ffmpeg, source, target)
            header = target.read_bytes()[:44]
        self.assertEqual(header[:4], b"RIFF")
        self.assertEqual(int.from_bytes(header[24:28], "little"), 16000)


class Config:
    def __init__(self, path: Path):
        self.path = path
        self.locations = {}
        self.mounts = {}
        self.media_costs = {}

    def directory(self, key: str) -> Path:
        return self.path.parent / key


class _Library:
    def __init__(self, test: unittest.TestCase, *, enabled: bool, output: str = "sidecar"):
        self._tmp = tempfile.TemporaryDirectory()
        test.addCleanup(self._tmp.cleanup)
        self.root = Path(self._tmp.name).resolve()
        self.media = self.root / "media"
        self.generated = self.root / "generated"
        (self.media / "x").mkdir(parents=True)
        self.generated.mkdir()
        (self.media / "x" / "ABP-758.mp4").write_bytes(b"video")
        self.config = Config(self.root / "config.toml")
        self.config.locations = {"local": (r"R:\media",)}
        self.config.mounts = {"local": (str(self.media),)}
        self.config.path.write_text(
            f"[whisper]\nenabled = {'true' if enabled else 'false'}\noutput = '{output}'\n",
            encoding="utf-8")
        self.db = fresh_ledger(self.root)
        self.database = LedgerDatabase(self.db)
        self.add_video(1, "local", r"R:\media\x\ABP-758.mp4", "ABP-758.mp4")
        self.contract = type("Contract", (), {})()
        self.contract.database = self.database
        self.contract.candidate_root = self.generated
        self.settings = WhisperSettings(enabled=enabled, output=output)

    def add_video(self, asset_id: int, location: str, path: str, name: str) -> None:
        with self.database.write_transaction() as connection:
            connection.execute(
                "INSERT INTO asset(id,location,path,name,medium,first_seen,last_seen) "
                "VALUES(?,?,?,?,'video','2026-09-01','2026-09-01')",
                (asset_id, location, path, name))

    def __enter__(self):
        return self

    def __exit__(self, *_exc):
        return False
