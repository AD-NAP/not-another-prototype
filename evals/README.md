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
claude plugin eval . --tag nap-start --runs 1 --ablation none --allow-tools Write
```

Before a phase is done: three runs per case, with NAP and without it. Δ is what the skill adds over plain Claude.

```bash
claude plugin eval . --tag nap-start --allow-tools Write
```

`--allow-tools Write` lets cases write files, such as `docs/brief.md`. Skills that use no Bash need no sandbox, so this runs on Windows without WSL.

## Writing cases

- Give every case `tags: [<skill>]` in its `prompt.md` frontmatter, so one skill's cases run alone, and list the tools it needs in `allowed_tools`, such as `[Read, Glob, Grep, Skill, Write]`.
- A case that checks whether the skill starts describes the idea the way a user would, without naming the skill. Other cases can call the skill directly.
- Check that the skill ran with a `tool_used` grader on `Skill`, with `input_match: '"skill"\s*:\s*"(?:[\w-]+:)?nap-start"'`.
- Prefer graders that cost nothing: `file_exists`, `regex` and `tool_used`. Keep `llm` graders for short answers, with PASS and FAIL written as concrete conditions.
- To test a step after "Approve", save the conversation up to that point as a `.jsonl` file in the case, and name it in `case.yaml` under `context.history_file`.
- Read the report's transcripts, not just the scores. A case that passes without NAP tests Claude, not the skill.
