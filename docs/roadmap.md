# Roadmap

Start small. A skill comes back only with its tests, and a new one only when a real project needs it ([decision 4](decisions.md#4-tests-before-skills-2026-11-20)). The team version's roadmap (steps 1 to 11, with the blockers from each run) is in git history at tag `nap--v0.2.0`.

| Phase | Delivers | Done when | Status |
|---|---|---|---|
| 0. Clear the ground | Park the team version at tag `nap--v0.2.0`. Rewrite the README, design and decisions for the documents before code. Add `evals/` and a small plugin manifest. | The repo holds only what the new goal uses | Done 20-11-2026 |
| 1. `/nap-start` | Reads the context, fills the gaps, proposes the type and traits, and writes the brief with its docs plan. Script, Personal tool and App. | Its cases pass at 3 runs and beat plain Claude, and it writes a real brief for A Day that the user keeps | Next |
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

1. Write the cases below in `evals/nap-start/`.
2. Run a few without the skill, and note how plain Claude goes wrong, in its own words.
3. Write the skill from Superpowers' `brainstorming` and the team version's `/nap-vision`. Write only what fixes what step 2 found.
4. Run the cases with `--runs 1 --ablation none` while editing, then at 3 runs against plain Claude.
5. Write A Day's brief with it, for real.

| Case | Setup | Passes when |
|---|---|---|
| Starts on an idea | "I want to build something that tracks who borrowed my stuff" | `/nap-start` runs |
| Ignores a fix | "Fix the failing test in parser.py" | It doesn't run |
| Script stays small | "A script that converts every PNG in a folder to WebP" | It proposes Script, and the docs plan has no PRD |
| Personal tool | "A tracker for things I lend to friends, only for me" | It proposes Personal tool |
| App | "An order page for my friend's bakery" | It proposes App |
| One open question | "Something for my running" | It asks one question with no options, and writes nothing |
| Reads first | A repo whose README describes the idea | It plays the idea back instead of asking what it is |
| Writes after yes | A saved conversation that ends with "Approve" | `docs/brief.md` has every heading, and the reply names `/nap-prd` |

## What carries over

The team version's planning skills are the starting points, at tag `nap--v0.2.0`:

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
