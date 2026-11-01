# Evals

How we test NAP's skills and agents. Every new skill or agent follows this. The reasons are in [decision 9](../../docs/decisions.md#9-how-we-run-evals-2026-10-31) and [decision 11](../../docs/decisions.md#11-one-eval-format-per-case-scores-no-shell-2026-11-01).

The question an eval answers: **does the plugin do better than plain Claude?** Every case runs with the plugin and without it. The difference is Δ.

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
| **Plugin fired**: our skill or agent ran, or another of our skills did *not* | `arm: with-only` | Plain Claude can never pass these. They report but don't score. |

Rules for rubrics (`llm` graders):
- Say exactly what PASS and FAIL look like, with the values from the prompt.
- Point at the right thing with `focus`: `{ source: file, path: tests/test_x.py }` for a file, the default for the final reply.
- One idea per grader. Two ideas in one rubric make failures hard to read.

Traps we hit:
- **`tool_used` misses a subagent's calls.** It counts only the main conversation. To check that an agent didn't edit a file, check the file's contents with `regex` or `llm`.
- **A `focus` or `target` file that doesn't exist crashes the grader**, and the run scores it as a fail. If the role may stop before writing a file, have the scaffold create a starting version.
- **Without a shell, `gh` and `git` are refused.** For a PR or issue comment, judge what the agent tried or said (`focus: trace`), and say so in the rubric.

### What each role needs

- **At least one happy path.** The main job, done right.
- **At least one guardrail.** The role refuses or stops when it should (vague brief, no criteria, wrong test).
- **At least one should-not-fire case.** A nearby request that is not this role's job. Use `tool_used` with `min: 0`, `max: 0` and `arm: both`.
- **A cross-firing check in every case.** A `with-only` grader that another NAP skill did not fire.

## 2. Pilot

```bash
claude plugin eval plugin --tag <role> --runs 1 --ablation with-without --model sonnet --judge-model opus --no-publish
```

Add `--keep-temp` to keep each run's transcript (`out/trace.jsonl`) for reading. Delete the temp folders after. `--case` takes one name or glob; repeat it and only the last counts.

Open `report.html` and read the judge's evidence for every failure, in both arms. Fix graders that are unfair or unclear, not just the ones that fail. Repeat until the graders read right.

## 3. Full run

```bash
claude plugin eval plugin --tag <role> --runs 5 --ablation with-without --model sonnet --judge-model opus -j 4 --no-publish --max-cost-usd 15
```

Add as needed:
- `--allow-tools Write Edit` when the role writes files.
- `--scaffold` when a case has a `case.yaml` scaffold. Otherwise `--no-scaffold`.

Always pin `--model sonnet --judge-model opus`. Without them the agent may be Haiku and the judge defaults to Haiku.

## 4. Record

1. **Per-case table in the PR**, from `report.html`: case, with, without, Δ.
2. **One line in [the roadmap](../../docs/roadmap.md)**: number of cases, mean with, without and Δ, and which cases tie with plain Claude.
3. **Update [Latest scores](#latest-scores)** below.
4. **Clean up `results/`.** It is not committed. Keep only the latest full run per role and delete pilots.

## Reading the numbers

- **Read Δ per case, not the mean.** A case where both arms score 1.00 shows nothing about the plugin. The mean hides that.
- **Small Δ is noise.** Plain Claude's score on the same case moves by up to 0.2 between runs. Treat a case Δ under 0.2 as a tie.
- **5 runs per arm for normal work. 10 for the Proof step** (roadmap step 7), when numbers go in the README.

## No shell

Evals never grant `Bash` or `PowerShell`. On native Windows there is no sandbox for them, so the run refuses. On Linux they need `bubblewrap` and `socat`, which did not work reliably for us.

So the judge reads files instead of running them. A test file is judged by reading it, and code by reading it against the tests. Running the tests in an eval waits until there is a reliable sandbox, likely a Linux CI job.

## Latest scores

5 runs per arm, Sonnet agent, Opus judge.

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
