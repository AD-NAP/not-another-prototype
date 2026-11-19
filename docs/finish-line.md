# Finish line

> **Built 20-11-2026 for Personal tool and App** in `skills/nap-finish-line/` ([roadmap](roadmap.md) step 10). The Product and Platform rows are sketches until a real project needs them. Script has no milestones, so it has no check yet.

A version is done when it passes its finish line: a list of gates set by the project's scope. NAP checks the gates at the end of each milestone and keeps the milestone open until they pass ([decision 14](decisions.md#14-nap-plans-and-enforces-the-finish-line-and-building-is-pluggable-2026-11-19)). It does not matter who built the code.

## How it works

1. **The scope sets the defaults.** `/nap-vision` already asks the scope. Each scope has a default set of gates (below).
2. **The Architect writes the gates for each version** into `docs/finish-line.json`, starting from the defaults. It can add gates. It can only remove a default with an ADR that says why, so the bar is never lowered quietly.
3. **The PA runs the check at the end of each milestone,** before closing it. A failing gate keeps the milestone open, and the PA lists what is missing, with the fix for each. The PA won't plan the next version until it passes. A gate can still be removed with an ADR, so there is a way out, but it is on record.
4. **Every gate is checked or signed, never assumed.**
   - **Checked:** a script decides from files, `gh` or `git`. No model judgement.
   - **Signed:** the gate needs judgement. The PA asks the user and records the answer under `signed` in `docs/finish-line.json`, in a small PR that closes the milestone (with the changelog entry when the version has one).
   - A checked gate that can't run (no network, `gh` signed out) **fails**. It never passes by default.

## Gates

**C** is checked, **S** is signed. A mark means the scope includes the gate by default. Each scope also has every gate of the scopes to its left.

| ID | Gate | How | Script | Personal tool | App | Product | Platform |
|---|---|---|---|---|---|---|---|
| `readme` | `README.md` exists and has a section on how to run it | C: file and heading | ✓ | | | | |
| `tests-pass` | The tests pass | C: Script runs the project's test command; the rest read the latest CI run on `main` | ✓ | | | | |
| `issues-closed` | Every issue in the milestone is closed | C: `gh api .../milestones/N`, `open_issues` is 0 | | ✓ | | | |
| `ci-on-prs` | A CI workflow runs the tests on pull requests | C: a workflow in `.github/workflows/` with a `pull_request` trigger | | ✓ | | | |
| `prs-checked` | Every PR merged in this milestone had passing checks | C: each issue's closing PRs (`closedByPullRequestsReferences`), then each PR's `statusCheckRollup` is non-empty and all passed | | ✓ | | | |
| `ignore-nap` | `.gitignore` covers `.claude/skills/`, `.claude/agents/` and `.claude/settings.local.json` | C: `git check-ignore` | | ✓ | | | |
| `docs-due` | Every doc the PRD's docs plan puts in this version exists | C: every `type: docs` issue in the milestone is closed, and the file its **File:** line names exists | | ✓ | | | |
| `arch-docs` | `docs/ARCHITECTURE.md` and `docs/ADR.md` exist | C: files | | | ✓ | | |
| `changelog` | The changelog has an entry for this version | C: the version appears as a heading in `CHANGELOG.md` | | | ✓ | | |
| `deploy` | This version is deployed and works | C when there is a deploy workflow: its latest run on `main` passed after the milestone's last merge. S otherwise | | | ✓ | | |
| `data-migration` | If stored data changed shape, there is a migration, and old data still loads | S | | | ✓ | | |
| `release-tag` | A tag for this version exists, with release notes | C: `gh release view <version>` | | | | ✓ | |
| `security-scan` | Dependency and code scanning are on, with no open high or critical alerts | C: Dependabot and code scanning alerts through `gh api` | | | | ✓ | |
| `monitoring` | Errors and uptime are watched, and someone is told when they fail | S | | | | ✓ | |
| `runbooks` | A runbook for each service, and an owner for each in `CODEOWNERS` | C: files | | | | | ✓ |

The docs gate reuses the docs plan in `skills/nap-vision/doc-plan.md`, so the two never list documents twice.

**Script has no milestones** ([decision 13](decisions.md#13-the-pm-starts-with-a-prd-one-milestone-at-a-time-2026-11-15)), so its finish line runs once, when the user says it is done.

## The file

The Architect writes `docs/finish-line.json` with the architecture, and adds each version's entry when that version is planned. The check reads only this file and GitHub, so it gives the same answer every time.

```json
{
  "scope": "App",
  "test_command": "py -m pytest",
  "versions": {
    "v0.1": {
      "milestone": 1,
      "gates": ["readme", "tests-pass", "issues-closed", "ci-on-prs", "prs-checked", "ignore-nap", "docs-due", "arch-docs", "changelog", "data-migration"],
      "removed": { "deploy": "ADR 0004: v0.1 runs locally only" },
      "signed": { "data-migration": { "answer": "No stored data changed shape", "date": "2026-11-20" } }
    }
  }
}
```

`test_command` is the command that works on the user's machine, which fixes the step 7 blocker where the rules said `pytest` and it wasn't on PATH.

## Found while drafting

- **GitHub refuses branch protection on private repos** on the free plan. `gh api .../branches/main/protection` on `nap-test-v2` returned "Upgrade to GitHub Pro or make this repository public". So the finish line can't rely on protection being on. `prs-checked` checks every merged PR after the fact instead, which works on any plan. When protection is available, the setup step should still turn it on, since it blocks the bad merge before it happens.
- **PRs can be found from their issues.** `gh issue view N --json closedByPullRequestsReferences` gives the closing PRs, so the check doesn't need PRs to be in milestones (step 7 blocker 9).

## First run: `nap-test-v2` v0.1

Personal tool scope, milestone 1, already closed. Run on 20-11-2026 with the config outside the repo (`--config`):

| Gate | Result | Detail |
|---|---|---|
| `readme` | Pass | Has an "Install" section |
| `tests-pass` | Pass | `tests` passed on main's latest commit |
| `issues-closed` | Pass | All 7 closed |
| `ci-on-prs` | Pass | `.github/workflows/tests.yml` runs on pull requests |
| `prs-checked` | **Fail** | PR #10 (closes #3) and PR #8 (closes #1) merged with no checks |
| `ignore-nap` | **Fail** | `.gitignore` doesn't cover `.claude/skills/` or `.claude/agents/` |
| `docs-due` | Pass | No docs due |

The two predicted failures, plus PR #8, which the hand check missed. PR #8 was the skeleton, merged one PR before CI existed, so it really was unchecked. Past PRs can't be fixed: for this version the way past is an ADR that removes `prs-checked`. For new projects, `/nap-backlog` now puts CI into the skeleton task, because a PR that adds a `pull_request` workflow runs it on itself (PR #9 on `nap-test-v2` did).

`setup` on the same repo added the three ignores and reported "Branch protection on main: not available on this plan". With that edit uncommitted, `check` refused to run (exit 2), as it should.

## Decided 20-11-2026

1. **Gates:** as in the table. Step 10 builds Personal tool and App only.
2. **Stale branches:** stay on the free plan. `prs-checked` catches a PR merged with no or failing checks at the milestone end. No up-to-date check after the fact: it is harder to check and catches a rarer case. If a project has branch protection (a public repo, Pro, or a work organisation), `setup` reports whether it is on. Turning it on is left to the user until a real project with protection shows what the setup step should do.
3. **Signed answers** live in `docs/finish-line.json`, so they travel with the repo and the script reads them directly.
4. **A failing version blocks the next one.** The PA won't plan the next version until the current one passes, or a gate is removed with an ADR.
