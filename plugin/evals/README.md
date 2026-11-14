# Evals

How we test NAP's skills and agents. Every new skill or agent follows this. The reasons are in [decision 9](../../docs/decisions.md#9-how-we-run-evals-2026-10-31), [decision 11](../../docs/decisions.md#11-one-eval-format-per-case-scores-no-shell-2026-11-01) and [decision 12](../../docs/decisions.md#12-one-run-evals-until-the-mvp-2026-11-01).

Evals run in two modes:
- **Check (now, until the MVP):** one run per case. Does the role work, and do the graders read right? Cheap enough for a Pro plan.
- **Measure (later, when refining a role):** 10 runs per case, with and without the plugin. Does the plugin do better than plain Claude? The difference is Δ.

## 1. Write the cases

One folder per behaviour, named for what it checks (`vague-brief-asks-one-question`, not `backlog-test-3`).

```
plugin/evals/<case>/
├── prompt.md          # the user's message, with run limits in frontmatter
├── graders/<name>.md  # one check per file
└── case.yaml          # only when the case needs starting files (see below)
```

### prompt.md

```markdown
---
description: When the caller pastes code, the tests still follow the issue.
tags: [tdd]
max_turns: 25
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---

Write the failing tests for issue #9 in tests/test_shipping.py ...
```

- **Write it the way a user would.** Don't name the skill. The case checks that the skill fires on natural phrasing.
- **Put everything the task needs in the prompt:** the issue text, the design, any code. Each run starts in an empty folder.
- **Tag every case with its role** (`backlog`, `tdd`, `engineer`), so `--tag` runs one role.
- **Never allow `Bash` or `PowerShell`.** See [No shell](#no-shell).

### Starting files (case.yaml)

Only when the task needs files already in the workspace, such as a project with failing tests for the Engineer. Keep the case in `prompt.md` and `graders/`, and add a `case.yaml` with nothing but the setup:

```yaml
schema_version: "1.1"
name: engineer-happy-path
context:
  scaffold_script: scaffold.sh
```

The scaffold script copies files and runs `git init`. Nothing else. Shared sample projects go in `_fixtures/`. Run these cases with `--scaffold`.

### Graders

Each file is one check. Pick the cheapest type that works:

| Type | Use for | Cost |
|---|---|---|
| `tool_used` | Did the skill or agent fire? Was a tool never called? | Free |
| `file_exists` | Did it create (or not create) a file? Only counts files made during the run. | Free |
| `regex` | Is a pattern in the reply or a file? | Free |
| `llm` | Anything needing judgement. The file body is the rubric. | Paid (judge) |

Weights:

| Kind of check | Weight | Why |
|---|---|---|
| **Outcome**: what any good result needs (testable criteria, tests cover each criterion, tests not edited) | `1` (default) | This is what Δ should measure. |
| **House style**: NAP's own format (Given/When/Then, sizes, "exactly one question", approval prompt) | `0.5` | Plain Claude can't know our format. Full weight would inflate Δ. |
| **Plugin fired**: our skill or agent ran, or another of our skills did *not* | `arm: with-only` | Plain Claude can never pass these. With a baseline (`--ablation with-without`) they report but don't score. In a check (`--ablation none`) there is no baseline, so they **do** score: a run where our agent never started fails the case. |

Rules for rubrics (`llm` graders):
- Say exactly what PASS and FAIL look like, with the values from the prompt.
- Point at the right thing with `focus`: `{ source: file, path: tests/test_x.py }` for a file, the default for the final reply.
- One idea per grader. Two ideas in one rubric make failures hard to read.

Traps we hit:
- **`tool_used` counts a subagent's calls too** (checked on Claude Code 2.1.316). It can't tell the main session from the agent, so "the main session wrote no code" can't be a `tool_used` check. Use `engineer-fired` and the file's contents instead.
- **A `focus` or `target` file that doesn't exist crashes the grader**, and the run scores it as a fail. If the role may stop before writing a file, have the scaffold create a starting version.
- **Without a shell, `gh` and `git` are refused.** For a PR or issue comment, judge what the agent tried or said (`focus: trace`), and say so in the rubric.
- **A subagent's first shell command is visible.** The agent still sends the `Bash` call, which is refused with "Bash is disabled". A `tool_used` grader on `Bash` with `input_match` sees that first command in full, so it can check its shape (one command, the right path). Most agents stop trying after the refusal, so later commands, such as `gh pr create`, never show. Check those in a smoke run on a real project.

### What each role needs

- **At least one happy path.** The main job, done right.
- **At least one guardrail.** The role refuses or stops when it should (vague brief, no criteria, wrong test).
- **At least one should-not-fire case.** A nearby request that is not this role's job. Use `tool_used` with `min: 0`, `max: 0` and `arm: both`.
- **A cross-firing check in every case.** A `with-only` grader that another NAP skill did not fire.

## 2. Check (the default for now)

Run one role at a time, once, with the plugin only:

```bash
claude plugin eval plugin --tag <role> --runs 1 --ablation none --model sonnet --judge-model opus --no-publish
```

- **Always pass `--runs 1`.** Without it each case runs 3 times.
- **`--ablation none`** skips the run without the plugin, which halves the usage.
- **A new role's first check** adds the baseline once (`--ablation with-without`), to see that the plugin changes something at all.
- After a small change, run only the cases it touches: `--case <name>` (one name or glob; repeat it and only the last counts).

Add as needed:
- `--allow-tools Write Edit` when the role writes files.
- `--scaffold` when a case has a `case.yaml` scaffold. Otherwise `--no-scaffold`.
- `--keep-temp` to keep each run's transcript (`out/trace.jsonl`) for reading. Delete the temp folders after.

Always pin `--model sonnet --judge-model opus`. Without them the agent may be Haiku and the judge defaults to Haiku.

Open `report.html` and read the judge's evidence for every failure. Fix graders that are unfair or unclear, not just the ones that fail.

## 3. Measure (later)

When a role is being refined, not before the MVP. 10 runs per case, with and without the plugin:

```bash
claude plugin eval plugin --tag <role> --runs 10 --ablation with-without --model sonnet --judge-model opus -j 4 --no-publish
```

This uses a lot of usage (the Engineer's 4 cases cost about $4.50 per run with the baseline), so plan it for when the weekly limit has room.

## 4. Record

1. **Per-case table in the PR**, from `report.html`. Say whether it was a check (1 run) or a measure (10 runs).
2. **One line in [the roadmap](../../docs/roadmap.md)** when a role is done.
3. **Update [Latest scores](#latest-scores)** after a measure.
4. **Clean up `results/`.** It is not committed. Keep only the latest run per role.

## Reading the numbers

- **A check is pass or fail.** One run says the role works and the graders are fair. It can't say how much the plugin helps, so don't read Δ from it.
- **In a measure, read Δ per case, not the mean.** A case where both arms score 1.00 shows nothing about the plugin. The mean hides that.
- **Small Δ is noise.** Plain Claude's score on the same case moved by up to 0.2 between runs. Treat a case Δ under 0.2 as a tie.

## Hooks are tested with unit tests

Hooks are code, so they get unit tests, not evals: `node --test plugin/hooks/lanes.test.mjs`. They are free and exact. Evals still load the hooks, so a role's eval checks also run with its lane rules on.

## What an eval can't check

Shell behaviour past the first command: committing and pushing tests (#33), opening a PR with `--body-file` (#56), permission denials (#57, #58), and stopping when git fails (#60). These are checked in the loop smoke run on the test project, which runs the real plugin with a real shell.

## No shell

Evals never grant `Bash` or `PowerShell`. On native Windows there is no sandbox for them, so the run refuses. On Linux they need `bubblewrap` and `socat`, which did not work reliably for us.

So the judge reads files instead of running them. A test file is judged by reading it, and code by reading it against the tests. Running the tests in an eval waits until there is a reliable sandbox, likely a Linux CI job.

## Latest scores

From before decision 12: 5 runs per arm, Sonnet agent, Opus judge. The Engineer has only a check so far (1 run, in PR #13).

**PM: `/nap:backlog`** (2026-10-30)

| Case | With | Without | Δ |
|---|---|---|---|
| full-brief-drafts-issues | 1.00 | 0.47 | +0.53 |
| required-tech-becomes-constraint | 1.00 | 0.50 | +0.50 |
| strips-implementation | 1.00 | 0.70 | +0.30 |
| vague-brief-asks-one-question | 1.00 | 0.80 | +0.20 |
| splits-large-brief | 1.00 | 1.00 | 0.00 |
| question-does-not-draft | 1.00 | 1.00 | 0.00 |

**Test Engineer: `/nap:failing-tests`** (2026-10-30)

| Case | With | Without | Δ |
|---|---|---|---|
| checklist-issue-still-tested | 1.00 | 0.67 | +0.33 |
| no-criteria-not-ready | 1.00 | 0.70 | +0.30 |
| gherkin-issue-tests-each-criterion | 1.00 | 0.71 | +0.29 |
| tests-issue-not-code | 1.00 | 0.93 | +0.07 |
| testing-question-no-agent | 1.00 | 1.00 | 0.00 |

These runs came before later skill changes (backlog one-question fix, narrowed load helpers), so they need a rerun.
