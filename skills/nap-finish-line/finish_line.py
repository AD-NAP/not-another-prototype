"""NAP finish line: check that a version passes its gates, or set a project up for them.

Run from the project folder:
    py finish_line.py check v0.1          # report, exit 0 when every gate passes
    py finish_line.py check v0.1 --json   # the same, as JSON
    py finish_line.py setup               # add NAP's ignores, report branch protection

Exit codes: 0 passed, 1 a gate failed or needs sign-off, 2 the check could not start.
Gates are defined in docs/finish-line.md. Needs Python 3.10+, git and a signed-in gh.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
from dataclasses import asdict, dataclass

SCOPES = ["Script", "Personal tool", "App", "Product", "Platform"]
SCOPE_GATES = {
    "Script": ["readme", "tests-pass"],
    "Personal tool": ["issues-closed", "ci-on-prs", "prs-checked", "ignore-nap", "docs-due"],
    "App": ["arch-docs", "changelog", "deploy", "data-migration"],
    "Product": ["release-tag", "security-scan", "monitoring"],
    "Platform": ["runbooks"],
}
BUILT_SCOPES = {"Personal tool", "App"}
SIGN_QUESTIONS = {
    "deploy": "Is this version deployed, and does it work where it runs?",
    "data-migration": "Did stored data change shape in this version? If so, is there a migration, and does old data still load?",
    "monitoring": "Are errors and uptime watched, and is someone told when they fail?",
}
NAP_IGNORES = [".claude/skills/", ".claude/agents/", ".claude/settings.local.json"]
_IGNORE_PROBES = {
    ".claude/skills/": ".claude/skills/nap-pa/SKILL.md",
    ".claude/agents/": ".claude/agents/nap-engineer.md",
    ".claude/settings.local.json": ".claude/settings.local.json",
}
_OK_CHECKS = {"SUCCESS", "NEUTRAL", "SKIPPED"}
_RUN_HEADING = re.compile(r"^#+\s.*\b(run|running|usage|use|install|installing|getting started|quick ?start|set ?up|setup)\b", re.I | re.M)


class FactError(Exception):
    """A fact about the project could not be read. The gate that needed it fails."""


class ConfigError(Exception):
    """docs/finish-line.json can't be used for this check."""


@dataclass
class Result:
    gate: str
    status: str  # pass, fail, sign (needs the user's sign-off) or removed (by an ADR)
    detail: str


def default_gates(scope: str) -> list[str]:
    gates: list[str] = []
    for s in SCOPES[: SCOPES.index(scope) + 1]:
        gates += SCOPE_GATES[s]
    return gates


def passed(results: list[Result]) -> bool:
    return all(r.status in ("pass", "removed") for r in results)


def rollup_conclusions(rollup: list[dict]) -> list[str]:
    """One word per check on a PR: a check run's conclusion, or its status while it runs."""
    out = []
    for c in rollup:
        if c.get("__typename") == "StatusContext":
            out.append((c.get("state") or "").upper())
        elif (c.get("status") or "").upper() == "COMPLETED":
            out.append((c.get("conclusion") or "").upper())
        else:
            out.append((c.get("status") or "").upper())
    return out


def wait_for_runs(fetch, sleep=time.sleep, clock=time.monotonic, timeout=600, interval=10, appear=60):
    """Fetch CI runs until all have finished. Right after a merge, give runs `appear` seconds to start."""
    start = clock()
    while True:
        runs = fetch()
        elapsed = clock() - start
        if runs and all(r["status"] == "completed" for r in runs):
            return runs
        if elapsed >= timeout or (not runs and elapsed >= appear):
            return runs
        sleep(interval)


# Gates. Each takes the facts and the context, and returns (status, detail).


def _readme(facts, ctx):
    text = facts.read_file("README.md")
    if text is None:
        return "fail", "README.md is missing"
    m = _RUN_HEADING.search(text)
    if not m:
        return "fail", "README.md has no section on how to run it (a heading like Install, Usage or Run)"
    return "pass", f"README.md has \"{m.group(0).lstrip('#').strip()}\""


def _tests_pass(facts, ctx):
    runs = facts.main_runs()
    if not runs:
        return "fail", "no CI runs on the main branch's latest commit"
    bad = [r for r in runs if r["status"] != "completed" or r["conclusion"] != "success"]
    if bad:
        return "fail", "not passing on main: " + ", ".join(
            f"{r['workflow']} ({r['conclusion'] or r['status']})" for r in bad
        )
    return "pass", "CI passed on main: " + ", ".join(sorted({r["workflow"] for r in runs}))


def _issues_closed(facts, ctx):
    m = facts.milestone(ctx["milestone"])
    if m["open_issues"]:
        return "fail", f"{m['open_issues']} open issue(s) in milestone {m['title']}"
    if not m["closed_issues"]:
        return "fail", f"milestone {m['title']} has no issues"
    return "pass", f"all {m['closed_issues']} issues closed"


def _ci_on_prs(facts, ctx):
    trigger = re.compile(r"\bpull_request\b(?!_)")
    for path in facts.list_files(".github/workflows"):
        if path.endswith((".yml", ".yaml")) and trigger.search(facts.read_file(path) or ""):
            return "pass", f"{path} runs on pull requests"
    return "fail", "no workflow in .github/workflows runs on pull_request"


def _prs_checked(facts, ctx):
    problems, merged = [], []
    for issue in facts.milestone_issues(ctx["milestone"]):
        for n in facts.closing_prs(issue["number"]):
            pr = facts.pr(n)
            if pr["state"] != "MERGED":
                continue
            merged.append(n)
            bad = [c for c in pr["checks"] if c not in _OK_CHECKS]
            if not pr["checks"]:
                problems.append(f"PR #{n} (closes #{issue['number']}) merged with no checks")
            elif bad:
                problems.append(f"PR #{n} (closes #{issue['number']}) merged with checks {', '.join(bad)}")
    if problems:
        return "fail", "; ".join(problems)
    if not merged:
        return "fail", "no merged PRs close this milestone's issues"
    return "pass", f"{len(set(merged))} merged PR(s), all with passing checks"


def _ignore_nap(facts, ctx):
    missing = [p for p, probe in _IGNORE_PROBES.items() if not facts.is_ignored(probe)]
    if missing:
        return "fail", ".gitignore doesn't cover " + ", ".join(missing) + " (run setup)"
    return "pass", "NAP's files are ignored"


def _docs_due(facts, ctx):
    docs = [i for i in facts.milestone_issues(ctx["milestone"]) if "type: docs" in i["labels"]]
    if not docs:
        return "pass", "no docs due in this version"
    problems = []
    for i in docs:
        m = re.search(r"\*\*File:\*\*\s*`([^`]+)`", i["body"] or "")
        if i["state"] != "CLOSED":
            problems.append(f"#{i['number']} is open")
        if not m:
            problems.append(f"#{i['number']} names no **File:**")
        elif facts.read_file(m.group(1)) is None:
            problems.append(f"#{i['number']}: {m.group(1)} is missing")
    if problems:
        return "fail", "; ".join(problems)
    return "pass", f"{len(docs)} doc(s) written"


def _arch_docs(facts, ctx):
    missing = [p for p in ("docs/ARCHITECTURE.md", "docs/ADR.md") if facts.read_file(p) is None]
    if missing:
        return "fail", "missing " + ", ".join(missing)
    return "pass", "docs/ARCHITECTURE.md and docs/ADR.md exist"


def _changelog(facts, ctx):
    text = facts.read_file("CHANGELOG.md")
    if text is None:
        return "fail", "CHANGELOG.md is missing"
    number = re.escape(ctx["version"].lstrip("vV"))
    if re.search(rf"^#+\s.*\bv?{number}\b", text, re.I | re.M):
        return "pass", f"CHANGELOG.md has {ctx['version']}"
    return "fail", f"CHANGELOG.md has no heading for {ctx['version']}"


def _deploy(facts, ctx):
    workflow = ctx["config"].get("deploy_workflow")
    if not workflow:
        return _signed("deploy", ctx)
    runs = [r for r in facts.main_runs() if r["workflow"] == workflow]
    if any(r["status"] == "completed" and r["conclusion"] == "success" for r in runs):
        return "pass", f"{workflow} passed on main's latest commit"
    return "fail", f"no passing {workflow} run on main's latest commit"


def _signed(gate, ctx):
    entry = ctx["entry"].get("signed", {}).get(gate) or {}
    answer = (entry.get("answer") or "").strip()
    if answer:
        date = entry.get("date")
        return "pass", f"signed {date}: {answer}" if date else f"signed: {answer}"
    return "sign", SIGN_QUESTIONS[gate]


GATES = {
    "readme": _readme,
    "tests-pass": _tests_pass,
    "issues-closed": _issues_closed,
    "ci-on-prs": _ci_on_prs,
    "prs-checked": _prs_checked,
    "ignore-nap": _ignore_nap,
    "docs-due": _docs_due,
    "arch-docs": _arch_docs,
    "changelog": _changelog,
    "deploy": _deploy,
    "data-migration": lambda facts, ctx: _signed("data-migration", ctx),
}
ALL_GATE_IDS = [g for s in SCOPES for g in SCOPE_GATES[s]]


def _check_removal(gate, reason, facts):
    m = re.search(r"\bADR[ -]?(\d{4})\b", reason or "")
    if not m:
        return Result(gate, "fail", f"removed without an ADR number: \"{reason}\"")
    try:
        adrs = facts.read_file("docs/ADR.md") or ""
    except FactError as e:
        return Result(gate, "fail", f"could not check: {e}")
    if not re.search(rf"^#+\s*{m.group(1)}\b", adrs, re.M):
        return Result(gate, "fail", f"removed by ADR {m.group(1)}, which isn't in docs/ADR.md")
    return Result(gate, "removed", reason)


def check(config: dict, version: str, facts) -> list[Result]:
    scope = config.get("scope")
    if scope not in SCOPES:
        raise ConfigError(f"unknown scope {scope!r}; use one of {', '.join(SCOPES)}")
    if scope not in BUILT_SCOPES:
        raise ConfigError(f"the check isn't built for {scope} yet, only {', '.join(sorted(BUILT_SCOPES))}")
    entry = config.get("versions", {}).get(version)
    if entry is None:
        raise ConfigError(f"{version} isn't in docs/finish-line.json")
    if "milestone" not in entry:
        raise ConfigError(f"{version} has no milestone number")

    ctx = {"config": config, "entry": entry, "version": version, "milestone": entry["milestone"]}
    gates = list(entry.get("gates", []))
    removed = entry.get("removed", {})
    results = []

    for gate in default_gates(scope):
        if gate not in gates and gate not in removed:
            results.append(Result(gate, "fail", f"a default for {scope}, left out without an ADR"))
    for gate, reason in removed.items():
        results.append(_check_removal(gate, reason, facts))

    for gate in gates:
        fn = GATES.get(gate)
        if fn is None:
            known = gate in ALL_GATE_IDS
            results.append(Result(gate, "fail", "not built yet" if known else "unknown gate"))
            continue
        try:
            status, detail = fn(facts, ctx)
        except FactError as e:
            status, detail = "fail", f"could not check: {e}"
        results.append(Result(gate, status, detail))

    order = {g: i for i, g in enumerate(ALL_GATE_IDS)}
    return sorted(results, key=lambda r: order.get(r.gate, len(order)))


# Real facts, from the checkout, git and gh.


def _run(args, cwd, ok_codes=(0,)):
    try:
        p = subprocess.run(args, cwd=cwd, capture_output=True, text=True, encoding="utf-8")
    except FileNotFoundError as e:
        raise FactError(f"{args[0]} not found") from e
    if p.returncode not in ok_codes:
        raise FactError(f"{' '.join(args[:3])}: {(p.stderr or p.stdout).strip()[:200]}")
    return p


class GitHubFacts:
    def __init__(self, root: str, main_branch: str, wait: int = 600):
        self.root = root
        self.main_branch = main_branch
        self.wait = wait
        self._issues = {}
        self._runs = None

    def _gh_json(self, args):
        return json.loads(_run(["gh", *args], self.root).stdout or "null")

    def read_file(self, path):
        full = os.path.join(self.root, *path.split("/"))
        if not os.path.isfile(full):
            return None
        with open(full, encoding="utf-8") as f:
            return f.read()

    def list_files(self, folder):
        full = os.path.join(self.root, *folder.split("/"))
        if not os.path.isdir(full):
            return []
        return sorted(f"{folder}/{n}" for n in os.listdir(full))

    def is_ignored(self, path):
        return _run(["git", "check-ignore", "-q", path], self.root, ok_codes=(0, 1)).returncode == 0

    def milestone(self, number):
        m = self._gh_json(["api", f"repos/{{owner}}/{{repo}}/milestones/{number}"])
        return {k: m[k] for k in ("title", "open_issues", "closed_issues")}

    def milestone_issues(self, number):
        if number not in self._issues:
            title = self.milestone(number)["title"]
            raw = self._gh_json(["issue", "list", "--milestone", title, "--state", "all",
                                 "--limit", "500", "--json", "number,state,labels,body"])
            self._issues[number] = [
                {"number": i["number"], "state": i["state"], "body": i["body"],
                 "labels": [label["name"] for label in i["labels"]]}
                for i in raw
            ]
        return self._issues[number]

    def closing_prs(self, issue_number):
        data = self._gh_json(["issue", "view", str(issue_number), "--json", "closedByPullRequestsReferences"])
        return [p["number"] for p in data["closedByPullRequestsReferences"]]

    def pr(self, number):
        data = self._gh_json(["pr", "view", str(number), "--json", "state,statusCheckRollup"])
        return {"state": data["state"], "checks": rollup_conclusions(data["statusCheckRollup"] or [])}

    def main_runs(self):
        if self._runs is None:
            sha = _run(["git", "rev-parse", f"origin/{self.main_branch}"], self.root).stdout.strip()

            def fetch():
                runs = self._gh_json(["run", "list", "--commit", sha, "--limit", "50",
                                      "--json", "workflowName,status,conclusion"])
                return [{"workflow": r["workflowName"], "status": r["status"], "conclusion": r["conclusion"]}
                        for r in runs]

            first = fetch()
            if not first or any(r["status"] != "completed" for r in first):
                print(f"Waiting up to {self.wait}s for CI on {self.main_branch} to finish...", file=sys.stderr)
            self._runs = first if first and all(r["status"] == "completed" for r in first) \
                else wait_for_runs(fetch, timeout=self.wait)
        return self._runs


def _main_branch(root):
    data = json.loads(_run(["gh", "repo", "view", "--json", "defaultBranchRef"], root).stdout)
    return data["defaultBranchRef"]["name"]


def _ready_to_check(root, branch):
    """The checkout must be the main branch, in sync with GitHub, with no edits to tracked files."""
    _run(["git", "fetch", "--quiet", "origin", branch], root)
    current = _run(["git", "rev-parse", "--abbrev-ref", "HEAD"], root).stdout.strip()
    if current != branch:
        return f"the checkout is on {current}; switch to {branch} and pull first"
    head = _run(["git", "rev-parse", "HEAD"], root).stdout.strip()
    remote = _run(["git", "rev-parse", f"origin/{branch}"], root).stdout.strip()
    if head != remote:
        return f"{branch} isn't in sync with origin/{branch}; pull first"
    if _run(["git", "diff", "--quiet", "HEAD"], root, ok_codes=(0, 1)).returncode:
        return "tracked files have uncommitted changes"
    return None


def cmd_check(args):
    root = os.path.abspath(args.dir)
    config_path = args.config or os.path.join(root, "docs", "finish-line.json")
    try:
        with open(config_path, encoding="utf-8") as f:
            config = json.load(f)
        branch = _main_branch(root)
        problem = _ready_to_check(root, branch)
        if problem:
            raise ConfigError(problem)
        results = check(config, args.version, GitHubFacts(root, branch, wait=args.wait))
    except (OSError, ValueError, ConfigError, FactError) as e:
        print(f"Can't check {args.version}: {e}", file=sys.stderr)
        return 2

    ok = passed(results)
    if args.json:
        print(json.dumps({"version": args.version, "scope": config["scope"], "passed": ok,
                          "results": [asdict(r) for r in results]}, indent=2))
    else:
        print(f"Finish line for {args.version} ({config['scope']}, milestone {config['versions'][args.version]['milestone']})")
        width = max(len(r.gate) for r in results)
        for r in results:
            print(f"  {r.status.upper():8}{r.gate:{width + 2}}{r.detail}")
        not_passed = [r for r in results if r.status not in ("pass", "removed")]
        if ok:
            print(f"Passed: {args.version} is done.")
        else:
            print(f"Not passed: {len(not_passed)} of {len(results)} gates. {args.version} is not done.")
    return 0 if ok else 1


def cmd_setup(args):
    root = os.path.abspath(args.dir)
    path = os.path.join(root, ".gitignore")
    existing = ""
    if os.path.isfile(path):
        with open(path, encoding="utf-8") as f:
            existing = f.read()
    lines = {line.strip() for line in existing.splitlines()}
    missing = [p for p in NAP_IGNORES if p not in lines]
    if missing:
        with open(path, "a", encoding="utf-8", newline="\n") as f:
            if existing and not existing.endswith("\n"):
                f.write("\n")
            f.write("\n# NAP skills and agents copied in, and local settings\n")
            f.write("".join(p + "\n" for p in missing))
        print("Added to .gitignore: " + ", ".join(missing))
    else:
        print(".gitignore already covers NAP's files")

    try:
        branch = _main_branch(root)
        p = _run(["gh", "api", f"repos/{{owner}}/{{repo}}/branches/{branch}/protection"], root, ok_codes=(0, 1))
    except FactError as e:
        print(f"Branch protection: could not check ({e})")
        return 1
    text = p.stdout + p.stderr
    if p.returncode == 0:
        strict = (json.loads(p.stdout).get("required_status_checks") or {}).get("strict")
        print(f"Branch protection on {branch}: on" + (", with up-to-date checks" if strict else
              ", but checks don't have to be up to date"))
    elif "Upgrade to GitHub Pro" in text:
        print(f"Branch protection on {branch}: not available on this plan. The prs-checked gate covers it.")
    elif "not protected" in text.lower():
        print(f"Branch protection on {branch}: available but off. Turn it on with required, up-to-date checks.")
    else:
        print(f"Branch protection on {branch}: could not check ({text.strip()[:200]})")
    return 0


def main(argv=None):
    parser = argparse.ArgumentParser(description="NAP finish line")
    parser.add_argument("--dir", default=".", help="the project folder (default: here)")
    sub = parser.add_subparsers(dest="command", required=True)
    c = sub.add_parser("check", help="check a version's gates")
    c.add_argument("version")
    c.add_argument("--json", action="store_true")
    c.add_argument("--config", help="path to finish-line.json (default: docs/finish-line.json)")
    c.add_argument("--wait", type=int, default=600, help="seconds to wait for CI on main to finish (default 600)")
    sub.add_parser("setup", help="add NAP's ignores and report branch protection")
    args = parser.parse_args(argv)
    return cmd_check(args) if args.command == "check" else cmd_setup(args)


if __name__ == "__main__":
    sys.exit(main())
