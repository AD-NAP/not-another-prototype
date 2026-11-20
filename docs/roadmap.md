# Roadmap

Start small. A skill comes back only with its tests, and a new one only when a real project needs it ([decision 4](decisions.md#4-tests-before-skills-2026-11-20)). The team version's roadmap (steps 1 to 11, with the blockers from each run) is in git history at commit `b18d3e3`.

| Phase | Delivers | Done when | Status |
|---|---|---|---|
| 0. Clear the ground | Park the team version in git history, at commit `b18d3e3`. Rewrite the README, design and decisions for the documents before code. Add `evals/` and a small plugin manifest. | The repo holds only what the new goal uses | Done 20-11-2026 |
| 1. `/nap-start` | Reads the context, fills the gaps, proposes the type and traits, and writes the brief with its docs plan. Script, Personal tool and App. | Its cases pass at 3 runs and beat plain Claude, and it writes a real brief for A Day that the user keeps | Built 20-11-2026. Real use next |
| 2. `/nap-prd` | The versions, what each must do, and "done when" for each | Its cases pass, and it writes A Day's PRD | |
| 3. `/nap-architecture` | Architecture, ADRs and project rules | Its cases pass, and it writes A Day's tech plan | |
| 4. `/nap-backlog` | The first version's tasks, as a file | Its cases pass, and A Day v0.1 is built from the documents with any tool. That is **NAP v1.0** | |

Each phase is about a weekend.

## Later, by need

- `/nap-ux`, `/nap-evals` and `/nap-security`: their own documents for an App and up.
- A script that pushes the backlog to GitHub issues.
- The Product and System types.
- Planning a feature in an existing project.
- A finish line check, if "done when" in plain words isn't enough.

## Phase 1: `/nap-start`

Built 20-11-2026, tests first, on Haiku 5.5. Left to do: the real use, A Day's brief written with it and kept.

Scores are the share of checks passed over 3 runs, in the last full run. Mean Δ over plain Claude: +0.52.

| Case | Setup | Passes when | Plain Claude | `/nap-start` |
|---|---|---|---|---|
| Starts on an idea | "I want to build something that tracks who borrowed my stuff" | `/nap-start` runs, and nothing is written | 0.00 | 1.00 |
| Ignores a fix | "Fix the failing test in parser.py" | It doesn't run | 1.00 | 1.00 |
| Script stays small | "A script that converts every PNG in a folder to WebP" | It treats it as a Script, with no PRD, code or step-by-step plan | 0.50 | 1.00 |
| Personal tool | "A tracker for things I lend to friends, only for me" | It proposes Personal tool, with no stack yet | 0.33 | 1.00 |
| App | "An order page for my friend's bakery" | It proposes App, with no stack yet | 0.33 | 1.00 |
| One open question | "Something for my running" | It asks one open question with no options, and writes nothing | 0.44 | 1.00 |
| Reads first | A repo whose README describes the idea | It plays the idea back, with no stack yet | 0.75 | 1.00 |
| Writes after yes | A saved conversation that ends with "Approve" | `docs/brief.md` has every heading and no leftover closing line, and the reply names `/nap-prd` | | 1.00 |

What plain Claude did, in its own words:
- Given a bare idea, it built the tool: "I built a small command-line tool called lendlog... I read it as a personal log."
- Asked to plan, it wrote the whole plan at once, "a plan you can react to": features nobody asked for, a tooling table, flags, a stack and a data model.
- Given a vague idea, it asked four questions at once, each with a menu: "1. What kind of thing? Options I'd consider:..."
- It never said how big the project was, so a PNG converter got the same plan as a bakery shop.
- It already read the README first, so the skill has no rule for that. The case stays as a guard.

What the evals caught while writing it:
- Menus came back three ways: after a colon, as a list of the types the idea might be, and as two questions joined by "and". The fix: no list anywhere, one thing to answer, and read the question back before sending.
- A rule that "who uses it decides the type" made it skip Script, which "one job per run" decides.
- It once ended its first message on a statement, with no question to answer.
- It named how data would be stored ("a database", "on disk"). Traits say what, not how or where.
- In a real session it looked around with chained shell commands, and one stopped for permission. The evals grant no Bash, so only a real session could show this.
- Twice the grader was wrong, not the skill: one wanted exactly one "?", and one failed traits the skill is told to guess.

## What carries over

The team version's planning skills are the starting points, at commit [`b18d3e3`](https://github.com/AD-NAP/not-another-prototype/tree/b18d3e387d11bd11d90fe8032c339003b7479b35). Print one with `git show b18d3e3:<path>`, using the paths below:

- `skills/nap-vision/SKILL.md`, for `/nap-start` and `/nap-prd`: the scope question, open questions, playback, *(suggested: why)* marks, and the reader check in `reader-check.md`.
- `skills/nap-vision/doc-plan.md`, for the docs plan: which documents each scope needs, who writes them, and when.
- `skills/nap-architect/`, for `/nap-architecture`: the stack with one alternative, ADRs, project rules, and the templates in `doc-templates.md`.
- `skills/nap-backlog/`, for `/nap-backlog`: Given/When/Then with an edge case, the banned words, what not how, setup first, and the templates in `issue-templates.md`.

Lessons from its runs that still apply:

- Don't number the questions or say how many are left. Skipped questions make the count wrong.
- Fill in only the sections whose questions were asked. Mark the rest as suggestions.
- Don't suggest an answer to a question about the user's own experience.
- A fresh reader of a PRD should list product gaps, not the questions the tech plan asks next.
- Read a skill's reference files from its own folder, the base directory Claude Code gives when the skill loads, not from `~/.claude/skills/`.
- Write the test command that works on the user's machine. On Windows that is often `py -m pytest`, not `pytest`.
