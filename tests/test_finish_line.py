"""Tests for skills/nap-finish-line/finish_line.py. Run: py -m unittest discover tests"""

import importlib.util
import pathlib
import sys
import unittest

ROOT = pathlib.Path(__file__).resolve().parent.parent
_spec = importlib.util.spec_from_file_location(
    "finish_line", ROOT / "skills" / "nap-finish-line" / "finish_line.py"
)
fl = importlib.util.module_from_spec(_spec)
sys.modules["finish_line"] = fl
_spec.loader.exec_module(fl)


class FakeFacts:
    """A project where every Personal tool gate passes, unless a test changes it."""

    def __init__(self):
        self.files = {
            "README.md": "# app\n\n## Install\n\npip install .\n",
            ".github/workflows/tests.yml": "on:\n  push:\n  pull_request:\n",
            "docs/ARCHITECTURE.md": "# Architecture\n",
            "docs/ADR.md": "# Decisions\n\n## 0001. Python (2026-11-19)\n",
            "CHANGELOG.md": "# Changelog\n\n## v0.1\n\n- First version\n",
        }
        self.ignored = {
            ".claude/skills/nap-pa/SKILL.md",
            ".claude/agents/nap-engineer.md",
            ".claude/settings.local.json",
        }
        self.milestone_info = {"title": "v0.1", "open_issues": 0, "closed_issues": 2}
        self.issues = [
            {"number": 1, "state": "CLOSED", "labels": ["type: task"], "body": ""},
            {"number": 2, "state": "CLOSED", "labels": ["type: story"], "body": ""},
        ]
        self.closing = {1: [10], 2: [11]}
        self.prs = {
            10: {"state": "MERGED", "checks": ["SUCCESS"]},
            11: {"state": "MERGED", "checks": ["SUCCESS", "SKIPPED"]},
        }
        self.runs = [{"workflow": "tests", "status": "completed", "conclusion": "success"}]
        self.broken = set()

    def _maybe_break(self, name):
        if name in self.broken:
            raise fl.FactError(f"{name} failed")

    def read_file(self, path):
        self._maybe_break("read_file")
        return self.files.get(path)

    def list_files(self, folder):
        prefix = folder.rstrip("/") + "/"
        return sorted(p for p in self.files if p.startswith(prefix))

    def is_ignored(self, path):
        self._maybe_break("is_ignored")
        return path in self.ignored

    def milestone(self, number):
        self._maybe_break("milestone")
        return self.milestone_info

    def milestone_issues(self, number):
        self._maybe_break("milestone_issues")
        return self.issues

    def closing_prs(self, issue_number):
        return self.closing.get(issue_number, [])

    def pr(self, number):
        return self.prs[number]

    def main_runs(self):
        self._maybe_break("main_runs")
        return self.runs


def config(scope="Personal tool", gates=None, **version_extra):
    if gates is None:
        gates = fl.default_gates(scope)
    version = {"milestone": 1, "gates": gates}
    version.update(version_extra)
    return {"scope": scope, "versions": {"v0.1": version}}


def run(cfg, facts):
    return {r.gate: r for r in fl.check(cfg, "v0.1", facts)}


class DefaultGates(unittest.TestCase):
    def test_personal_tool_includes_script_gates(self):
        self.assertEqual(
            fl.default_gates("Personal tool"),
            ["readme", "tests-pass", "issues-closed", "ci-on-prs", "prs-checked", "ignore-nap", "docs-due"],
        )

    def test_app_adds_its_own(self):
        gates = fl.default_gates("App")
        self.assertEqual(gates[:7], fl.default_gates("Personal tool"))
        self.assertEqual(gates[7:], ["arch-docs", "changelog", "deploy", "data-migration"])


class AllPass(unittest.TestCase):
    def test_personal_tool_passes(self):
        results = fl.check(config(), "v0.1", FakeFacts())
        self.assertEqual([r.status for r in results], ["pass"] * 7)
        self.assertTrue(fl.passed(results))


class Readme(unittest.TestCase):
    def test_missing(self):
        f = FakeFacts()
        del f.files["README.md"]
        self.assertEqual(run(config(), f)["readme"].status, "fail")

    def test_no_section_on_running_it(self):
        f = FakeFacts()
        f.files["README.md"] = "# app\n\n## About\n"
        r = run(config(), f)["readme"]
        self.assertEqual(r.status, "fail")
        self.assertIn("how to run", r.detail)


class TestsPass(unittest.TestCase):
    def test_no_runs(self):
        f = FakeFacts()
        f.runs = []
        self.assertEqual(run(config(), f)["tests-pass"].status, "fail")

    def test_failed_run(self):
        f = FakeFacts()
        f.runs.append({"workflow": "lint", "status": "completed", "conclusion": "failure"})
        r = run(config(), f)["tests-pass"]
        self.assertEqual(r.status, "fail")
        self.assertIn("lint", r.detail)

    def test_still_running(self):
        f = FakeFacts()
        f.runs = [{"workflow": "tests", "status": "in_progress", "conclusion": ""}]
        self.assertEqual(run(config(), f)["tests-pass"].status, "fail")


class IssuesClosed(unittest.TestCase):
    def test_open_issue(self):
        f = FakeFacts()
        f.milestone_info = {"title": "v0.1", "open_issues": 1, "closed_issues": 1}
        self.assertEqual(run(config(), f)["issues-closed"].status, "fail")

    def test_empty_milestone(self):
        f = FakeFacts()
        f.milestone_info = {"title": "v0.1", "open_issues": 0, "closed_issues": 0}
        self.assertEqual(run(config(), f)["issues-closed"].status, "fail")


class CiOnPrs(unittest.TestCase):
    def test_push_only(self):
        f = FakeFacts()
        f.files[".github/workflows/tests.yml"] = "on:\n  push:\n"
        self.assertEqual(run(config(), f)["ci-on-prs"].status, "fail")

    def test_pull_request_target_does_not_count(self):
        f = FakeFacts()
        f.files[".github/workflows/tests.yml"] = "on: [pull_request_target]\n"
        self.assertEqual(run(config(), f)["ci-on-prs"].status, "fail")

    def test_inline_list(self):
        f = FakeFacts()
        f.files[".github/workflows/tests.yml"] = "on: [push, pull_request]\n"
        self.assertEqual(run(config(), f)["ci-on-prs"].status, "pass")


class PrsChecked(unittest.TestCase):
    def test_pr_with_no_checks(self):
        f = FakeFacts()
        f.prs[10]["checks"] = []
        r = run(config(), f)["prs-checked"]
        self.assertEqual(r.status, "fail")
        self.assertIn("#10", r.detail)
        self.assertIn("#1", r.detail)

    def test_failing_check(self):
        f = FakeFacts()
        f.prs[11]["checks"] = ["SUCCESS", "FAILURE"]
        self.assertEqual(run(config(), f)["prs-checked"].status, "fail")

    def test_unmerged_pr_ignored(self):
        f = FakeFacts()
        f.closing[2] = [11, 12]
        f.prs[12] = {"state": "CLOSED", "checks": []}
        self.assertEqual(run(config(), f)["prs-checked"].status, "pass")

    def test_no_merged_prs(self):
        f = FakeFacts()
        f.closing = {}
        self.assertEqual(run(config(), f)["prs-checked"].status, "fail")


class IgnoreNap(unittest.TestCase):
    def test_skills_not_ignored(self):
        f = FakeFacts()
        f.ignored.discard(".claude/skills/nap-pa/SKILL.md")
        r = run(config(), f)["ignore-nap"]
        self.assertEqual(r.status, "fail")
        self.assertIn(".claude/skills/", r.detail)


class DocsDue(unittest.TestCase):
    def docs_issue(self, state="CLOSED", body="**Written by:** Architect\n**File:** `docs/API.md`\n"):
        return {"number": 3, "state": state, "labels": ["type: docs"], "body": body}

    def test_none_due(self):
        self.assertEqual(run(config(), FakeFacts())["docs-due"].status, "pass")

    def test_written(self):
        f = FakeFacts()
        f.issues.append(self.docs_issue())
        f.files["docs/API.md"] = "# API\n"
        self.assertEqual(run(config(), f)["docs-due"].status, "pass")

    def test_issue_open(self):
        f = FakeFacts()
        f.issues.append(self.docs_issue(state="OPEN"))
        f.files["docs/API.md"] = "# API\n"
        self.assertEqual(run(config(), f)["docs-due"].status, "fail")

    def test_file_missing(self):
        f = FakeFacts()
        f.issues.append(self.docs_issue())
        r = run(config(), f)["docs-due"]
        self.assertEqual(r.status, "fail")
        self.assertIn("docs/API.md", r.detail)

    def test_names_no_file(self):
        f = FakeFacts()
        f.issues.append(self.docs_issue(body="**Written by:** Engineer\n"))
        self.assertEqual(run(config(), f)["docs-due"].status, "fail")


class AppGates(unittest.TestCase):
    def test_arch_docs_missing(self):
        f = FakeFacts()
        del f.files["docs/ARCHITECTURE.md"]
        self.assertEqual(run(config("App"), f)["arch-docs"].status, "fail")

    def test_changelog_without_version(self):
        f = FakeFacts()
        f.files["CHANGELOG.md"] = "# Changelog\n\n## v0.2\n"
        self.assertEqual(run(config("App"), f)["changelog"].status, "fail")

    def test_changelog_version_without_v(self):
        f = FakeFacts()
        f.files["CHANGELOG.md"] = "# Changelog\n\n## [0.1] - 2026-11-20\n"
        self.assertEqual(run(config("App"), f)["changelog"].status, "pass")

    def test_deploy_without_workflow_needs_sign_off(self):
        self.assertEqual(run(config("App"), FakeFacts())["deploy"].status, "sign")

    def test_deploy_workflow_passed(self):
        f = FakeFacts()
        f.runs.append({"workflow": "deploy", "status": "completed", "conclusion": "success"})
        cfg = config("App")
        cfg["deploy_workflow"] = "deploy"
        self.assertEqual(run(cfg, f)["deploy"].status, "pass")

    def test_deploy_workflow_missing_run(self):
        cfg = config("App")
        cfg["deploy_workflow"] = "deploy"
        self.assertEqual(run(cfg, FakeFacts())["deploy"].status, "fail")


class Signed(unittest.TestCase):
    def test_unsigned_needs_sign_off(self):
        r = run(config("App"), FakeFacts())["data-migration"]
        self.assertEqual(r.status, "sign")
        self.assertFalse(fl.passed(list(run(config("App"), FakeFacts()).values())))

    def test_signed(self):
        cfg = config("App", signed={"data-migration": {"answer": "No stored data changed", "date": "2026-11-20"}})
        r = run(cfg, FakeFacts())["data-migration"]
        self.assertEqual(r.status, "pass")
        self.assertIn("No stored data changed", r.detail)

    def test_empty_answer_is_not_signed(self):
        cfg = config("App", signed={"data-migration": {"answer": " ", "date": "2026-11-20"}})
        self.assertEqual(run(cfg, FakeFacts())["data-migration"].status, "sign")


class Removed(unittest.TestCase):
    def test_default_dropped_without_adr(self):
        gates = [g for g in fl.default_gates("Personal tool") if g != "ignore-nap"]
        r = run(config(gates=gates), FakeFacts())["ignore-nap"]
        self.assertEqual(r.status, "fail")
        self.assertIn("ADR", r.detail)

    def test_removed_with_real_adr(self):
        gates = [g for g in fl.default_gates("Personal tool") if g != "ignore-nap"]
        cfg = config(gates=gates, removed={"ignore-nap": "ADR 0001: no skills in this repo"})
        r = run(cfg, FakeFacts())["ignore-nap"]
        self.assertEqual(r.status, "removed")
        self.assertTrue(fl.passed(fl.check(cfg, "v0.1", FakeFacts())))

    def test_removed_with_missing_adr(self):
        gates = [g for g in fl.default_gates("Personal tool") if g != "ignore-nap"]
        cfg = config(gates=gates, removed={"ignore-nap": "ADR 0009: made up"})
        self.assertEqual(run(cfg, FakeFacts())["ignore-nap"].status, "fail")

    def test_removed_with_no_adr_number(self):
        gates = [g for g in fl.default_gates("Personal tool") if g != "ignore-nap"]
        cfg = config(gates=gates, removed={"ignore-nap": "not needed"})
        self.assertEqual(run(cfg, FakeFacts())["ignore-nap"].status, "fail")


class FailsClosed(unittest.TestCase):
    def test_fact_error_fails_the_gate(self):
        f = FakeFacts()
        f.broken.add("main_runs")
        r = run(config(), f)["tests-pass"]
        self.assertEqual(r.status, "fail")
        self.assertIn("could not check", r.detail)

    def test_unknown_gate(self):
        cfg = config(gates=fl.default_gates("Personal tool") + ["vibes"])
        self.assertEqual(run(cfg, FakeFacts())["vibes"].status, "fail")

    def test_gate_not_built_yet(self):
        cfg = config(gates=fl.default_gates("Personal tool") + ["release-tag"])
        r = run(cfg, FakeFacts())["release-tag"]
        self.assertEqual(r.status, "fail")
        self.assertIn("not built", r.detail)


class ConfigErrors(unittest.TestCase):
    def test_unknown_version(self):
        with self.assertRaises(fl.ConfigError):
            fl.check(config(), "v9", FakeFacts())

    def test_scope_not_built(self):
        with self.assertRaises(fl.ConfigError):
            fl.check(config("Product", gates=["readme"]), "v0.1", FakeFacts())


class WaitForRuns(unittest.TestCase):
    """Right after a merge, CI on main hasn't started or hasn't finished. The check waits for it."""

    def setUp(self):
        self.now = 0.0
        self.sleeps = 0

    def clock(self):
        return self.now

    def sleep(self, seconds):
        self.sleeps += 1
        self.now += seconds

    def wait(self, answers, timeout=600):
        answers = list(answers)
        fetch = lambda: answers.pop(0) if len(answers) > 1 else answers[0]
        return fl.wait_for_runs(fetch, sleep=self.sleep, clock=self.clock, timeout=timeout)

    def test_returns_at_once_when_finished(self):
        done = [{"workflow": "tests", "status": "completed", "conclusion": "success"}]
        self.assertEqual(self.wait([done]), done)
        self.assertEqual(self.sleeps, 0)

    def test_waits_for_a_running_run(self):
        running = [{"workflow": "tests", "status": "in_progress", "conclusion": ""}]
        done = [{"workflow": "tests", "status": "completed", "conclusion": "success"}]
        self.assertEqual(self.wait([running, running, done]), done)
        self.assertEqual(self.sleeps, 2)

    def test_waits_for_a_run_to_appear(self):
        done = [{"workflow": "tests", "status": "completed", "conclusion": "success"}]
        self.assertEqual(self.wait([[], done]), done)

    def test_gives_up_at_the_timeout(self):
        running = [{"workflow": "tests", "status": "queued", "conclusion": ""}]
        self.assertEqual(self.wait([running], timeout=60), running)
        self.assertLessEqual(self.now, 70)

    def test_no_runs_at_all_stops_after_a_minute(self):
        self.assertEqual(self.wait([[]]), [])
        self.assertLessEqual(self.now, 70)


class CheckConclusions(unittest.TestCase):
    def test_rollup_entries(self):
        rollup = [
            {"__typename": "CheckRun", "status": "COMPLETED", "conclusion": "SUCCESS"},
            {"__typename": "StatusContext", "state": "SUCCESS"},
            {"__typename": "CheckRun", "status": "IN_PROGRESS", "conclusion": ""},
        ]
        self.assertEqual(fl.rollup_conclusions(rollup), ["SUCCESS", "SUCCESS", "IN_PROGRESS"])


if __name__ == "__main__":
    unittest.main()
