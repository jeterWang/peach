"""安装版发现本机 ASR 解释器，并用子进程转写。"""
from __future__ import annotations

import os
import sys
import tempfile
import textwrap
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from peach import asr_runtime, settings_file, subtitle_generation
from peach.settings_file import SettingsFileError, SubtitleSettings
from peach.subtitle_generation import SubtitleService

ROOT = Path(__file__).resolve().parents[1]


class DiscoveryTests(unittest.TestCase):
    def test_explicit_python_wins_and_a_missing_path_does_not_fall_through(self):
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            python = root / "python.exe"
            python.write_text("", encoding="utf-8")
            venv = root / ".venv" / "Scripts"
            venv.mkdir(parents=True)
            (venv / "python.exe").write_text("", encoding="utf-8")
            found, problem = asr_runtime.resolve_asr_python(
                environ={asr_runtime.PYTHON_ENV: str(python)},
                executable=root / "Peach.exe", configured=str(venv / "python.exe"))
            self.assertEqual(found, python)
            self.assertEqual(problem, "")
            missing, problem = asr_runtime.resolve_asr_python(
                environ={asr_runtime.PYTHON_ENV: str(root / "missing.exe")},
                executable=root / "Peach.exe")
            self.assertIsNone(missing)
            self.assertIn("PEACH_ASR_PYTHON", problem)

    def test_home_config_and_adjacent_venv_follow_that_order(self):
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            home = root / "asr-home"
            (home / "Scripts").mkdir(parents=True)
            home_python = home / "Scripts" / "python.exe"
            home_python.write_text("", encoding="utf-8")
            configured = root / "configured.exe"
            configured.write_text("", encoding="utf-8")
            found, problem = asr_runtime.resolve_asr_python(
                environ={asr_runtime.HOME_ENV: str(home)},
                executable=root / "Peach.exe", configured=str(configured))
            self.assertEqual((found, problem), (home_python, ""))
            found, problem = asr_runtime.resolve_asr_python(
                environ={}, executable=root / "Peach.exe", configured=str(configured))
            self.assertEqual((found, problem), (configured, ""))
            app = root / "app"
            app.mkdir()
            site = root / ".venv" / "Lib" / "site-packages" / "faster_whisper"
            site.mkdir(parents=True)
            (site / "__init__.py").write_text("", encoding="utf-8")
            (root / ".venv" / "Scripts").mkdir()
            (root / ".venv" / "Scripts" / "python.exe").write_text("", encoding="utf-8")
            found, problem = asr_runtime.resolve_asr_python(
                environ={}, executable=app / "Peach.exe", current_importable=False, frozen=True)
            self.assertEqual(found, root / ".venv" / "Scripts" / "python.exe")
            self.assertEqual(problem, "")

    def test_the_current_interpreter_stays_in_process_when_it_can_import(self):
        with tempfile.TemporaryDirectory() as raw:
            python = Path(raw) / "python"
            python.write_text("", encoding="utf-8")
            found, problem = asr_runtime.resolve_asr_python(
                environ={asr_runtime.PYTHON_ENV: str(python)},
                executable=python, current=python, current_importable=True, frozen=False)
            self.assertEqual((found, problem), (None, ""))

    def test_a_venv_without_faster_whisper_is_not_an_adjacent_match(self):
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            (root / ".venv" / "Scripts").mkdir(parents=True)
            (root / ".venv" / "Scripts" / "python.exe").write_text("", encoding="utf-8")
            found, problem = asr_runtime.resolve_asr_python(
                environ={}, executable=root / "dist" / "Peach.exe", frozen=True)
            self.assertEqual((found, problem), (None, ""))

    def test_nvidia_bins_are_prepended_and_the_install_directory_leaves_path(self):
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            site = root / "Lib" / "site-packages" / "nvidia" / "cublas" / "bin"
            site.mkdir(parents=True)
            python = root / "Scripts" / "python.exe"
            python.parent.mkdir()
            python.write_text("", encoding="utf-8")
            install = root / "Programs" / "Peach"
            env = asr_runtime.child_environment(
                {"PATH": str(install / "_internal") + os.pathsep + "C:\\Windows",
                 "PYTHONPATH": "hidden", "PYTHONHOME": "hidden", "_PYI_APPLICATION_HOME_DIR": "x",
                 "DEEPSEEK_API_KEY": "secret"},
                python, drop_path_prefix=install)
            self.assertNotIn("PYTHONPATH", env)
            self.assertNotIn("PYTHONHOME", env)
            self.assertNotIn("_PYI_APPLICATION_HOME_DIR", env)
            self.assertEqual(env["DEEPSEEK_API_KEY"], "secret")
            self.assertTrue(env["PATH"].startswith(str(site)))
            self.assertNotIn("_internal", env["PATH"])
            self.assertIn("Windows", env["PATH"])


class WorkerTests(unittest.TestCase):
    def test_a_stub_process_returns_cues_without_a_console_flag_on_posix(self):
        with tempfile.TemporaryDirectory() as raw:
            script = Path(raw) / "stub.py"
            script.write_text(textwrap.dedent("""
                import json, sys
                while True:
                    line = sys.stdin.readline()
                    if not line:
                        break
                    job = json.loads(line)
                    sys.stdout.write(json.dumps({
                        "id": job["id"],
                        "cues": [{
                            "start": 0, "end": 1.5, "text": "こんにちは",
                            "no_speech_prob": 0.1, "compression_ratio": 1.1,
                            "avg_logprob": -0.2,
                        }],
                    }) + "\\n")
                    sys.stdout.flush()
            """), encoding="utf-8")
            process = asr_runtime.AsrProcess(Path(sys.executable), script)
            self.addCleanup(process.close)
            cues = process.transcribe({"wav": "clip.wav", "model": "demo", "device": "cpu"})
            self.assertEqual(cues[0]["text"], "こんにちは")
            kept = subtitle_generation.cues_from_segments([SimpleNamespace(**cues[0])])
            self.assertEqual(kept, [(0.0, 1.5, "こんにちは")])

    def test_worker_reports_a_missing_backend_as_json(self):
        job = {"id": 3, "wav": "clip.wav", "model": "demo", "device": "cpu", "options": {}}
        with patch.dict(sys.modules, {"faster_whisper": None}):
            from peach.asr_worker import handle
            body = handle(job, {})
        self.assertEqual(body["id"], 3)
        self.assertIn("error", body)

    def test_windows_build_ships_the_worker_and_leaves_cuda_out(self):
        script = (ROOT / "scripts" / "build_windows.ps1").read_text(encoding="utf-8-sig")
        self.assertIn('src\\peach\\asr_worker.py', script)
        self.assertIn("--exclude-module faster_whisper", script)
        self.assertIn("--exclude-module ctranslate2", script)
        self.assertNotIn("collect-all faster_whisper", script)
        self.assertNotIn("collect-all ctranslate2", script)


class ExternalTranscriptionTests(unittest.TestCase):
    def test_service_uses_the_external_interpreter_and_drops_hallucinations(self):
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            video = root / "ABP-758.mp4"
            video.write_bytes(b"0" * 16)
            seen = {}

            class Fake:
                def __init__(self, python, script, **kwargs):
                    seen["python"] = python
                    seen["script"] = script
                    seen["prefix"] = kwargs.get("drop_path_prefix")

                def transcribe(self, job, timeout=0):
                    seen["job"] = job
                    return [
                        {"start": 0, "end": 1, "text": "こんにちは",
                         "no_speech_prob": 0.1, "compression_ratio": 1, "avg_logprob": -0.2},
                        {"start": 1, "end": 2, "text": "幻听",
                         "no_speech_prob": 0.9, "compression_ratio": 1, "avg_logprob": -0.2},
                    ]

                def close(self):
                    seen["closed"] = True

            python = root / "Scripts" / "python.exe"
            python.parent.mkdir()
            python.write_text("", encoding="utf-8")
            service = SubtitleService(
                root=root / "generated", database_path=root / "ledger.db",
                settings=SubtitleSettings(enabled=True, device="cuda", asr_python=str(python)),
                translator=lambda lines, _settings: ["中文" for _line in lines],
                polisher=lambda lines, _settings: lines,
            )
            with patch.object(sys, "frozen", True, create=True), patch(
                    "peach.asr_runtime.AsrProcess", Fake):
                cues = service._transcribe(root / "clip.wav", service.settings())
            self.assertEqual(cues, [(0.0, 1.0, "こんにちは")])
            self.assertEqual(seen["python"], python)
            self.assertEqual(seen["job"]["device"], "cuda")
            self.assertEqual(seen["job"]["compute_type"], "float16")
            self.assertEqual(seen["job"]["options"]["language"], "ja")
            self.assertEqual(seen["prefix"], Path(sys.executable).resolve().parent)
            service.stop()
            self.assertTrue(seen.get("closed"))


class SettingsPathTests(unittest.TestCase):
    def test_asr_python_roundtrips_and_rejects_a_newline(self):
        with tempfile.TemporaryDirectory() as raw:
            data = Path(raw)
            path = data / "config.toml"
            path.write_text(
                "[subtitles]\nasr_python = 'C:\\Tools\\python.exe'\n", encoding="utf-8")
            loaded = settings_file.load_config(
                project_root=data / "missing", environ={"PEACH_DATA_ROOT": str(data)})
            self.assertEqual(loaded.subtitles.asr_python, r"C:\Tools\python.exe")
            self.assertIn("asr_python", settings_file.render(loaded))
            path.write_text('[subtitles]\nasr_python = "one\\ntwo"\n', encoding="utf-8")
            with self.assertRaises(SettingsFileError):
                settings_file.load_config(
                    project_root=data / "missing", environ={"PEACH_DATA_ROOT": str(data)})
