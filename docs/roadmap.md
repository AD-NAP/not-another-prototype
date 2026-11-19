# Roadmap

Start small. Add only what a real project run shows is missing. The earlier 17-step roadmap is in git history at tag `nap--v0.1.0`.

| # | Step | What it delivers | Status |
|---|---|---|---|
| 1 | **Simplify** | Four roles, no hooks, event log, evals or runner ([decision 1](decisions.md#1-a-simple-team-of-four-2026-11-14)). | Done |
| 2 | **Learn from others** | Bring the best parts of existing skills into the four roles ([skill-research.md](skill-research.md)). Only what a real failure asked for: the Reviewer runs the tests, and `/nap-fix` fixes findings on the same PR. The rest waits for step 3. | Done, proven on `nap-sprint-test` PR #9 |
| 3 | **Run it** | Take a real project from brief to merged PRs with the four roles. List the blockers. | Done 14-11-2026 on `nap-sprint-test` (#6 to #9) |
| 4 | **Fix blockers** | Fix what step 3 found, one at a time. Add a role only if a blocker needs one. The Tech Lead was replaced by the Architect ([decision 10](decisions.md#10-an-architect-instead-of-a-per-issue-tech-lead-2026-11-14)). | Done 14-11-2026 |
| 5 | **Personal Assistant** | A `/nap-pa` skill that runs the whole loop from your plans and goals: Architect, PM, then build, review and fix for each group of related issues. It stops for your approvals: the architecture, each issue batch, big decisions and each merge. Chosen 14-11-2026: you merge as you go, and the PA waits for each merge before the next build. | Built 14-11-2026 ([decision 12](decisions.md#12-a-personal-assistant-runs-the-loop-2026-11-14)). Checked: it hands off to the Architect and keeps the Architect's questions going across turns. |
| 6 | **New project** | Run a brand-new project through the PA, from brief to merged PRs. Check whether CI, deploy and UI need their own roles, whether grouped builds work, and whether the README's allow list stops permission prompts in an interactive session. | Done 15-11-2026 on `nap-test-v1`: 7 issues in 4 PRs, all approved first time, CI green, one permission prompt |
| 7 | **PRD and milestones** | `/nap-vision` asks the scope first, refines the idea into versions (each a GitHub milestone) and agrees a docs plan with timings in `docs/PRD.md`. The PM writes stories one milestone at a time, and the PA stops at the end of each ([decision 13](decisions.md#13-the-pm-starts-with-a-prd-one-milestone-at-a-time-2026-11-15)). | Run 19-11-2026 on `nap-test-v2` through v0.1: 7 issues, 5 PRs, milestone closed. Planning passed; the build half hit nine blockers (below) |
| 8 | **New direction** | NAP plans and enforces the finish line. Building is pluggable, and the build roles are frozen ([decision 14](decisions.md#14-nap-plans-and-enforces-the-finish-line-and-building-is-pluggable-2026-11-19)). | Decided 19-11-2026 |
| 9 | **Finish line per scope** | What "done" means for each scope and version: Script (tests, README), Personal tool, App (adds CI required on `main` and a working deploy), Product (adds security and monitoring), Platform. The Architect writes each version's gates into `docs/finish-line.json`. | Agreed 20-11-2026 in [finish-line.md](finish-line.md) |
| 10 | **Enforce the gates** | A setup step for the project (branch protection with required checks, `.gitignore` for `.claude/`) and a gate check the PA runs at the end of each milestone. A failing gate keeps the milestone open and lists what is missing. The check is a script with its own tests, not a prompt. | Built 20-11-2026: `/nap-finish-line` and its script, wired into the PA, Architect and PM. First run on `nap-test-v2` v0.1 failed `prs-checked` (PRs #8 and #10) and `ignore-nap`, as expected |
| 11 | **Cheap proof** | Run the planning half on two or three different briefs, about 20 minutes each with no code written. Test the gate check against a repo that is broken on purpose. No more multi-hour full runs. | Next |

## Blockers from the step 3 run

The run on `nap-sprint-test`, 14-11-2026. Fixed means the second loop (#8, #9) ran with no refused command in any role.

- **Chained commands were refused** in the PM, Tech Lead and Engineer. Fixed: a Gotchas line in each role with Bash.
- **The PM could not create issues.** Its `allowed-tools` lacked the `gh` write commands. Fixed.
- **Posts after approval asked again.** A skill's `allowed-tools` only lasts for the turn it starts in. Fixed: the README's Install section now gives an allow list.
- **The Tech Lead read no issue.** Without a terminal, `gh issue view --comments` prints only the comments. Fixed: it reads with `--json`, like the Engineer and Reviewer.
- **Open: the Engineer works in the user's checkout.** Two builds at once would clash. The PA runs one build at a time, so this waits until parallel builds are needed.
- **"Outside the design" caught private helpers.** On PR #9 the Reviewer flagged two small helpers, and the fix inlined them into a harder-to-read `main`. Fixed: per-issue designs are gone, and the Reviewer checks the project rules and ADRs instead.

From the 13-11-2026 run, checked in step 3: `/nap-fix` and the Reviewer's test run work. Design tasks with no test and the PM drafting too much did not happen.

## From the step 6 run

`nap-test-v1`, 14 to 15-11-2026, through `/nap-pa`. Brief to a working Streamlit app in about 45 minutes. The PA grouped related issues twice (#3 to #5, #6 and #7).

- **The PA stopped after the Architect** when there was no PR to merge, and relayed the Architect's own closing line. Fixed: it carries on to the PM, and decides each next step itself.
- **The CI issue was "tested" by reading the workflow file as text**, and the Reviewer never looked at the PR's checks. Fixed: config criteria are proved by the CI run, and the Reviewer checks `gh pr checks` before approving.
- **The skeleton built ahead** with a placeholder table for a later issue, which that issue then had to drop. Fixed: the Engineer builds nothing for later issues, and the Reviewer flags it as outside the issue.
- **The Architect read its template from `~/.claude/skills/`.** Fixed in #78.
- **Open, small:** no schema migrations (delete the local database after a change), the local Python version differed from the project rules, and one test uses a fixed 2030 date.
- **Not yet run:** `/nap-fix` in a PA run, and "merge it" (#79).

## From the step 7 run

`nap-test-v2` (`lent`, a lending tracker CLI), 19-11-2026, through `/nap-pa` in auto mode. v0.1 went from idea to a closed milestone: 7 issues, 5 PRs (#8 to #12), all merged by "merge it". `/nap-vision`, the Architect's first commit, milestones, `/nap-fix` (two rounds on PR #8) and the milestone end all passed. Not tested: docs tasks as issues (none came up), and permission prompts (auto mode).

Every blocker came from the build half. Under [decision 14](decisions.md#14-nap-plans-and-enforces-the-finish-line-and-building-is-pluggable-2026-11-19), the ones that belong to building leave NAP's scope, and the rest move into steps 9 and 10.

**Belong to whatever builds the code (not fixed in NAP):**
- **Engineer commits carried a `Co-Authored-By` trailer.** The auto mode classifier denied one, and the run stalled 42 minutes until "Retry the Engineer". A Claude Code attribution setting or a `commit-msg` hook fixes this in any project, whoever builds.
- **The Reviewer tried `--approve` and `--request-changes` first.** GitHub refuses both on your own PR, so all 9 reviews failed once before going up as a comment.
- **Windows backslash paths broke in Bash.** A venv landed at the repo root, `--body-file` failed twice, and a PR body was written into `.claude/`.
- **Project rules said `pytest`, which isn't on PATH.** Every agent fell back to `py -m pytest`.
- **The Reviewer flagged `.gitignore` as outside a skeleton issue,** which needed the user's ruling and a third review.
- **A second session in the same checkout** built #3, reviewed PR #10 and moved the branch. The PA noticed and stopped.

**Move into the finish line (steps 9 and 10):**
- **`.claude/` wasn't ignored**, so `git add .` would commit the skills. The setup step adds it.
- **PR #10 merged with no CI.** Its branch was cut before the CI PR merged, and nothing noticed. Branch protection with required, up-to-date checks stops this.
- **PRs aren't put in milestones,** only issues. The gate check can report them.

**Open from step 6:** schema migrations. `store.py` only uses `CREATE TABLE IF NOT EXISTS`, and v1.0 needs a new column. This becomes a question for the finish line of an App or larger: does a version that changes stored data need a migration?

## Step 11 runs

Three runs, none of which builds code. Run each in an interactive Claude Code session in the project folder, not in auto mode, so permission prompts are real. Count every prompt.

### Run A: the finish line live, `nap-test-v2`
Milestone v0.1 was reopened so the PA reaches its end. Start with `/nap-pa continue`.
- [x] The PA sees v0.1 open with every issue closed and goes to the end of the milestone, not to new issues.
- [x] `nap-finish-line` finds no `docs/finish-line.json`, stops and points to the Architect.
- [x] The Architect takes the "finish line" case: Personal tool defaults for v0.1 and v1.0, the right milestone numbers, `test_command` that works on this PC, NAP's ignores in `.gitignore`, one PR.
- [x] After that PR merges, the check fails only `prs-checked` (PRs #8 and #10).
- [x] Nothing edits a file to make a gate pass. The way past is offered as an ADR, and only the user decides it.
- [x] With the ADR merged, the check passes, and the PA closes v0.1 and asks before planning v1.0.
- [x] Permission prompts: count, and which commands. 2 before the user switched to auto mode: the Architect checking `pytest --version` and `py -m pytest --version`. The rest of the run is not counted.

**Result, 20-11-2026:** passed in about 7 minutes on Haiku 5.5. PRs #13 (finish line) and #14 (ADR 0004) on `nap-test-v2`, then v0.1 passed and closed. Two fixes followed:
- The check ran while CI on the new merge was still running, and `tests-pass` failed. The PA worked around it on its own with `gh run watch`. Fixed in the script: it now waits up to 10 minutes (`--wait`) for CI on main to start and finish.
- The Architect's first `gh pr create --body-file` used a backslash path and failed (blocker 3 again). Fixed: a forward slash gotcha in the Architect, `/nap-vision` and `/nap-backlog`.

### Run B: plan a Personal tool, `nap-test-v3`
Start with `/nap-pa <idea>`. Stop when v0.1's issues are created.
- [ ] `/nap-vision` asks the scope first, then open questions, and writes the PRD with versions and a docs plan after "Approve". Milestones created.
- [ ] The Architect's first commit on `main` has the PRD, architecture, ADRs, project rules, `docs/finish-line.json` (Personal tool defaults, one entry per version, milestone numbers match GitHub) and NAP's ignores.
- [ ] One test command everywhere, and it runs on this PC.
- [ ] The skeleton task is first and has CI on pull requests in its criteria.
- [ ] Every docs task has **Written by** and **File** lines.
- [ ] Permission prompts: count, and which commands.

### Run C: plan an App, `a-day`
A Day for real, on React, AppSync, DynamoDB and Lambda, with deploy. Same checks as run B, plus:
- [ ] `docs/finish-line.json` has the App gates. `deploy_workflow` names the deploy workflow, or `deploy` is left as a sign-off.
- [ ] The changelog rule is in the project rules, if the docs plan has a changelog.
- [ ] The architecture is sized to v0.1, not to the whole product.
- [ ] The output is good enough to keep as A Day's real start.
