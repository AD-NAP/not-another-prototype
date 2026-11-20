# Evals

Each skill's tests, run with [`claude plugin eval`](https://code.claude.com/docs/en/plugin-evals). They are written before the skill ([decision 4](../docs/decisions.md#4-tests-before-skills-2026-11-20)). The cases for each phase are listed in the [roadmap](../docs/roadmap.md).

## Layout

```
evals/
  nap-start/                 one folder per skill
    starts-on-an-idea/       one folder per case
      prompt.md              frontmatter: tags, limits and tools. Body: what the user types
      graders/
        skill-ran.md         one check per file
      case.yaml              only for a saved conversation or fixture files
  results/                   written by each run, ignored by git
```

Each run starts in an empty folder, with only NAP's skills loaded: no personal settings, `CLAUDE.md` or other plugins.

## Run

You need Claude Code with `claude plugin eval`, and git 2.31 or later. Every run is a real model call on your plan. Run from the repo root.

While writing a skill: one run per case, with NAP only.

```bash
claude plugin eval . --tag nap-start --runs 1 --ablation none --allow-tools Write --scaffold --model sonnet --judge-model opus
```

Before a phase is done: three runs per case, with NAP and without it. Δ is what the skill adds over plain Claude.

```bash
claude plugin eval . --tag nap-start --allow-tools Write --scaffold --model sonnet --judge-model opus
```

- `--allow-tools Write` lets cases write files, such as `docs/brief.md`. Skills that use no Bash need no sandbox, so this runs on Windows without WSL.
- `--scaffold` runs a case's setup script, such as the README for `reads-first`.
- `--model sonnet` is the model under test, from phase 3 on. Phases 1 and 2 were tested on Haiku, the cheapest: the whole `nap-start` suite at three runs, with and without NAP, took about two minutes and $0.15 at list price.
- `--judge-model opus` grades the `llm` graders with Opus. The judge should be stronger than the model under test: in phase 2 the default Haiku judge failed clean drafts 3 of 3 on criteria like "PASS if it has no...", then passed the same text when asked for its reasons.
- `--case <name>` runs one case: the quick way to check a fix. Only the last `--case` counts, so run cases one after another, or use a glob such as `--case '*-depth'`.
- Run from the repo root. In phase 2 one run started from `evals/nap-prd/`, so `.` was a folder with no skills, and Claude said the skill "isn't available here".
- From a script or another Claude session, add `--trust-plugin`, since there is no terminal to ask.

## Writing cases

- Give every case `tags: [<skill>]` in its `prompt.md` frontmatter, so one skill's cases run alone, and list the tools it needs in `allowed_tools`, such as `[Read, Glob, Grep, Skill, Write]`.
- A case that checks whether the skill starts describes the idea the way a user would, without naming the skill. Other cases can call the skill directly.
- Check that the skill ran with a `tool_used` grader on `Skill`, with `input_match: '"skill"\s*:\s*"(?:[\w-]+:)?nap-start"'`.
- Prefer graders that cost nothing: `file_exists`, `regex` and `tool_used`. Keep `llm` graders for short answers, with PASS and FAIL written as concrete conditions. Check headings with a `regex`. Check banned words with an `llm` grader that reads only the draft: a `regex` reads the whole reply, and failed a note saying the draft leaves those words out.
- To check that nothing was written, use a `tool_used` grader on `Write` with `max: 0`. A `file_exists` check on one path misses a file written under another name, such as `docs/prd.md` for `docs/PRD.md`.
- Quote a `description` that holds ": ", or the case won't load.
- To test a step after "Approve", save the conversation up to that point as a `.jsonl` file in the case, and name it in `case.yaml` under `context.history_file`. Keep only the user and assistant messages. A recording also carries what Claude Code injects, such as account IDs and local paths, and this repo is public. Drop tool calls and thinking too: with old paths in the history, the resumed run writes to the wrong folder.
- A saved conversation holds a copy of the skill's text, in its `isMeta` message. Update that copy when `SKILL.md` changes, or record the conversation again.
- Each run that resumes a saved conversation writes a session file beside it, named after its session ID, with the account details of whoever ran it. `.gitignore` keeps it out of git. Delete it after a run.
- Read the report's transcripts, not just the scores. A case that passes without NAP tests Claude, not the skill.
