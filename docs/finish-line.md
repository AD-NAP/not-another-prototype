# Finish line

> **Agreed 20-11-2026 for [roadmap](roadmap.md) step 9.** Nothing here is built yet. Step 10 builds the check for Personal tool and App. The Product and Platform rows are sketches until a real project needs them.

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
| `docs-due` | Every doc the PRD's docs plan puts in this version exists | C: every `type: docs` issue in the milestone is closed and its file exists | | ✓ | | | |
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

## First test: `nap-test-v2` v0.1

Personal tool scope, milestone 1, already closed. Checked by hand on 19-11-2026. This is what the check should report:

| Gate | Expected | Why |
|---|---|---|
| `readme` | Pass | README exists (content not checked by hand) |
| `tests-pass` | Pass | Last 3 runs of `tests` on `main` succeeded |
| `issues-closed` | Pass | 7 closed, 0 open |
| `ci-on-prs` | Pass | `.github/workflows/tests.yml` has a `pull_request` trigger |
| `prs-checked` | **Fail** | PR #10 (closes #3) merged with no checks. PRs #9 and #11 passed |
| `ignore-nap` | **Fail** | `.gitignore` doesn't mention `.claude/` |
| `docs-due` | Pass | No docs issues were due in v0.1 |

Both failures are real step 7 blockers, so a check that reports exactly these two is working.

## Decided 20-11-2026

1. **Gates:** as in the table. Step 10 builds Personal tool and App only.
2. **Stale branches:** stay on the free plan. `prs-checked` catches a PR merged with no or failing checks at the milestone end. No up-to-date check after the fact: it is harder to check and catches a rarer case. If a project gets branch protection (a public repo, Pro, or a work organisation), the setup step turns it on with strict checks.
3. **Signed answers** live in `docs/finish-line.json`, so they travel with the repo and the script reads them directly.
4. **A failing version blocks the next one.** The PA won't plan the next version until the current one passes, or a gate is removed with an ADR.
