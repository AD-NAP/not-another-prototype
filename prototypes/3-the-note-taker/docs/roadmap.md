# Roadmap

Start small. A skill comes back only with its tests, and a new one only when a real project needs it ([decision 4](decisions.md#4-tests-before-skills-2026-11-20)). The team version's roadmap (steps 1 to 11, with the blockers from each run) is in git history at commit `b18d3e3`.

| Phase | Delivers | Done when | Built | Real use |
|---|---|---|---|---|
| 0. Clear the ground | Park the team version in git history, at commit `b18d3e3`. Rewrite the README, design and decisions for the documents before code. Add `evals/` and a small plugin manifest. | The repo holds only what the new goal uses | 20-11-2026 | Not needed |
| 1. `/nap-start` | Reads the context, fills the gaps, proposes the type and traits, and writes the brief with its docs plan. Script, Personal tool and App. | Its cases pass at 3 runs and beat plain Claude, and it writes a brief for the weight and IPPT log that the user keeps | 20-11-2026 | 20-11-2026. Brief kept |
| 2. `/nap-prd` | The versions, what each must do, and "done when" for each | Its cases pass, and it writes the log's PRD | 20-11-2026 | 20-11-2026. PRD kept |
| 3. `/nap-architecture` | Architecture, ADRs and project rules | Its cases pass, and it writes the log's tech plan | | |
| 4. `/nap-backlog` | The first version's tasks, as a file | Its cases pass, and the log's v0.1 is built from the documents with any tool. That is **NAP v1.0** | | |

A phase is done when both columns are filled, and the next one starts only then (`CLAUDE.md`). Phases 1 and 2 were both built before either was used. Both were used on 20-11-2026, on the weight and IPPT log, and the user kept the brief and the PRD. That session found problems in both skills, listed in their sections below. On 20-11-2026 those fixes passed their cases, with one known gap: `marks-its-guesses` has passed 18 of its 21 live runs since its grader was fixed, and 16 of the last 18. In the two latest misses, a "done when" line repeated a choice that was marked elsewhere in the brief, without its mark, and an example run showed output nobody asked for. Both were small, and both were in drafts that typed the idea as a Script. The user accepted this as a known gap on 20-11-2026, so it no longer holds phase 3 back. The full suite was also not rerun at 3 runs after the last change to `/nap-start`.

Each phase is about a weekend.

## Real uses

The projects NAP is used on for real, chosen 20-11-2026. One for each type, none close to an eval case, and none with code already.

| Project | Expected type | What it is | What it tests |
|---|---|---|---|
| Weight and IPPT log | Personal tool | Log weigh-ins and IPPT results, and see the trend against targets | The whole chain, phases 1 to 4. Only this one gates the phases, and its v0.1 is NAP v1.0 |
| Listing splitter | Script | Takes one URL or a list of them, and splits each listing into a fixed set of fields | That a Script gets a short brief and no PRD. `/nap-start` only |
| Brick builder | App, if other people use it | Takes a building's point list, uses an LLM to work out what each point means and which class it belongs to, and writes a Brick model as a TTL file | The App path and the "uses AI" trait. `/nap-start` first, and further if it is worth building |

The type is `/nap-start`'s call, not this table's. If it proposes another, note what it said and why.

A Day was the first choice. It is a set of skills, like NAP, not an application, so it would test little of what NAP plans.

## The README example

One idea, planned at three sizes: a weight and fitness goal tracker as a Script, as a Personal tool and as an App. The README shows the documents NAP writes for each. The idea stays the same, so the difference between the three is what the type changes, which is NAP's main claim. A System version joins them when that type is built.

To do after the fixes from the first real session pass. The briefs and PRDs come from real runs of the skills, not written by hand.

## Later, by need

- `/nap-ux`, `/nap-evals` and `/nap-security`: their own documents for an App and up.
- A script that pushes the backlog to GitHub issues.
- The Product and System types.
- Planning a feature in an existing project.
- A finish line check, if "done when" in plain words isn't enough.

## Phase 1: `/nap-start`

Built 20-11-2026, tests first, on Haiku 5.5. Left to do: the real use, the weight and IPPT log's brief written with it and kept.

Scores are the share of checks passed over 3 runs, in the last full run. Mean Δ over plain Claude: +0.52 over the seven cases with a baseline, and +0.53 over the five that aren't guards.

Two cases are guards, not evidence that the skill helps. "Starts on an idea" checks that `/nap-start` ran, and plain Claude has no such skill, so it scores 0.00 whatever it does. "Ignores a fix" ties. The Personal tool and App cases each hold one check of the same kind, for NAP's own type name, which plain Claude was never told. The case scores below can't separate that check from the other two, so report it apart at the next full run.

| Case | Setup | Passes when | Plain Claude | `/nap-start` |
|---|---|---|---|---|
| Starts on an idea (guard) | "I want to build something that tracks who borrowed my stuff" | `/nap-start` runs, and nothing is written | 0.00 | 1.00 |
| Ignores a fix (guard) | "Fix the failing test in parser.py" | It doesn't run | 1.00 | 1.00 |
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

What the first real session caught, on the weight and IPPT log (20-11-2026):
- Its guesses were named in a note after the draft, not marked in it: "under a minute", the run distance, and that entries are kept between uses. It also left the run distance as an open question, wrote "as I said" in the brief, and marked "no stack chosen yet" as a suggestion. The skill now checks the draft for all four, and the case `marks-its-guesses` tests them. At one run on Sonnet the case passes, but on the old skill only `marks-in-the-draft` failed, by 2 of 3 judge votes, so its other three checks don't yet test the fix.
- After "Approve" it tried to make a git worktree before writing the brief. The folder wasn't a git repo, so that failed and it wrote in place. In a repo, the brief would have landed in a worktree. Both skills now say to write in the folder they are in, with no worktree. The evals grant no such tool, so only a real session can show this.
- The full run showed the marks rule was too wide to hold: "anything the user didn't say" passed 2 of 5 runs. Decided 20-11-2026: mark only choices the user might disagree with, which are numbers, limits, features and "done when" lines. Inferences, such as a trait, aren't marked. The skill, the grader and the design say so now. Rerun at 3 runs with NAP: the old skill failed the marks check in 2 of 3, and the new one passed 2 of 3, with its one fail the grader's, for counting "no sign-in" as a choice, so the grader now exempts traits wherever they appear and a rerun passed. Two more runs, after the change to the opening question, passed 1 of 2: the other added "how many pages a day I'd need" to a "done when" line with no mark, a feature the user never asked for. On 20-11-2026 two wordings each passed 8 of 9: keeping each "done when" line to one thing, then also marking what a Script's example run shows, and both misses were Script drafts, the first with the pages a day needed in its example output unmarked and the second with "I can set one book with its title, total pages and finish-by date" unmarked.

On Sonnet with an Opus judge, the setup from phase 3 on, the mean Δ over the seven cases was +0.38. A stronger model already does more of this unasked. The run is described at the end of phase 2.

Full run on Sonnet with an Opus judge, 3 runs, after the fixes from the first real session (20-11-2026):

| Case | Plain Claude | `/nap-start` |
|---|---|---|
| Starts on an idea (guard) | 1.00 | 1.00 |
| Ignores a fix (guard) | 1.00 | 1.00 |
| Script stays small | 0.50 | 1.00 |
| Personal tool | 0.33 | 1.00 |
| App | 0.33 | 1.00 |
| One open question | 0.33 | 0.89 |
| Reads first | 0.75 | 1.00 |
| Marks its guesses | 0.67 | 0.92 |
| Writes after yes | | 1.00 |

- Mean Δ over plain Claude: +0.34 over the eight cases with a baseline, and +0.45 over the six that aren't guards. These means are from the full pass, before the marks rule changed.
- The `marks-its-guesses` row was rerun with NAP only after the marks rule changed, so its plain Claude figure is from before.
- Plain Claude now scores 1.00 on "Starts on an idea": the check that `/nap-start` ran only counts as an indicator, and plain Claude wrote nothing. With NAP, it ran 3 of 3.
- The type name checks, reported apart: plain Claude said "Personal tool" in 0 of 3 runs and "App" in 0 of 3. Without them, each case scores 0.50 for plain Claude, so its Δ is +0.50, not +0.67.
- In the full pass, `marks-its-guesses` failed `marks-in-the-draft` 3 of 3 with NAP, at 0.75. One draft left the same line unmarked as the real session: "My log is still there after I close it". The other two marked every "done when" line and missed only small inferences. That is why the rule was narrowed to choices, as the last entry of the list above says. The 0.92 in the table is from the rerun after that.
- `one-open-question` joined two questions with "and" in 1 of 3 runs. After the question was given a shape, and the type line became a statement instead of a request to confirm it, the case passed 9 of 9, and the five cases whose first message the same rule governs each passed once.
- Open, not fixed: the same idea, a daily reading log, was typed as a Script in some runs and as a Personal tool in others. The [design](design.md#types) says a Script keeps nothing between runs. The skill's type list only says "does one job per run", so a log that stores data can pass as a Script. Both of the latest `marks-its-guesses` misses were in such drafts.

## Phase 2: `/nap-prd`

Built 20-11-2026, tests first, on Haiku 5.5, from the team version's `/nap-vision` without its GitHub parts. Left to do: the real use, the weight and IPPT log's PRD written with it and kept.

Scores are the share of checks passed over 3 runs, in the last full runs. Mean Δ over plain Claude: +0.57 over the seven cases with a baseline, and +0.80 over the five that aren't guards. The cases that need a brief get one from `setup.sh`: a spending tracker (Personal tool), a bakery order page (App) or a PNG to WebP converter (Script).

| Case | Setup | Passes when | Plain Claude | `/nap-prd` |
|---|---|---|---|---|
| Starts on a request (guard) | Personal tool brief. "The brief is done. Now help me work out what each version should do." | `/nap-prd` runs, `/nap-start` doesn't, and nothing is written | 1.00 | 1.00 |
| Ignores a bare idea (guard) | No brief. "I want to build something that tracks who borrowed my stuff." | `/nap-prd` doesn't run | 1.00 | 1.00 |
| Reads the brief | Personal tool brief. "Let's do the PRD next." | It reads the brief, doesn't re-ask what it answers, asks at most one question, and writes nothing | 0.50 | 1.00 |
| Script gets no PRD | Script brief. "Write the PRD for this project." | It says a Script needs no PRD and points to building it, and writes nothing | 0.00 | 1.00 |
| Personal tool depth | Personal tool brief. "Draft the PRD from the brief now. Your call on anything it doesn't say, just mark it." | One version with what it must do, "done when" and out of scope, about a page, no App sections, and nothing written | 0.33 | 1.00 |
| App depth | App brief, same prompt | v0.1 to v1.0, each with what it must do and "done when", plus out of scope, anti-goals, how we'll know it works and key screens. No stack, and nothing written | 0.17 | 1.00 |
| No stack | Personal tool brief whose constraints name Python and SQLite, same prompt | The draft names no language, library, database or data model, and nothing is written | 0.00 | 1.00 |
| Writes after yes | Houseplant brief, and a saved conversation that ends with "Approve." | `docs/PRD.md` has its headings and no leftover closing line, and the reply names `/nap-architecture` | | 1.00 |

The trigger checks are indicators, not part of the score, so plain Claude ties on the first two cases. With NAP, `/nap-prd` ran on every request to plan versions, and `/nap-start` on none of them. On the bare idea, `/nap-start` ran and `/nap-prd` didn't. There was no trigger clash to fix.

What plain Claude did, in its own words:
- It wrote the PRD straight to a file, with no draft and no yes, every time: "I drafted the PRD at `docs/prd.md`." Always lowercase.
- A Script got a full PRD: "Functional requirements (FR-1 to FR-9)... Acceptance criteria (AC-1 to AC-8)".
- It added features nobody asked for: "Edit and delete... browse past months, and manage categories", and "a fixed default list of nine".
- It decided how it would be built: "Use a command-line interface", "Data stored in a plain local file", "Amounts: stored exactly, not as floating point", "WhatsApp sending needs a paid business API".
- Asked to plan the versions of a Personal tool, it invented v2 and v3, then asked four numbered questions with menus: "Where should the budget warning appear: on the monthly view, when logging a purchase, or both?"

What the evals caught while writing it:
- Asked for the draft now, with "your call", it asked a question first. The rule sat at the end of the questions step. Moving it to the top fixed it.
- A Personal tool's draft added Anti-goals and How we'll know it works, because the template listed every section. Marking the App-only sections in the template fixed it.
- One draft ran to 450 words, padded with tech plan questions such as how amounts are stored. A word target and "open questions are about the product" fixed it.
- In a real session it listed files with `find . | head`. In another, Glob was missing from that build, and the error told it to use `find` instead. "Glob and Read only, never Bash" held in three fresh sessions, reading by path where Glob was missing.
- The write after "Approve" asks for permission once in a real session: a skill's `allowed-tools` only lasts for the turn it starts in. `/nap-start` has the same prompt. The evals grant Write, so only a real session shows it.
- Most failures were the grader's. The Haiku judge failed clean drafts 3 of 3 on "PASS if it has no..." criteria, then passed the same text when asked for its reasons. A Sonnet judge (`--judge-model sonnet`), and a regex for the section headings, fixed it. Two other graders were wrong too: one failed a suggested answer as a second option, and one failed "keeps purchases between uses" as saying how data is stored.
- One run started from `evals/nap-prd/` instead of the repo root, so it loaded no skills: "that skill isn't available here". Run from the root.

What the first real session caught, on the weight and IPPT log (20-11-2026):
- After two questions, the draft left a product question in Open questions that the user could have answered on the spot: whether the first version needs a way to fix a mistyped entry. No document after the PRD decides what the product does, so the skill now asks such a question before it drafts, and keeps an open question only when nobody can answer it yet or the user says to leave it. The grader `open-questions-settled` checks this on the two draft-now cases. At one run on Sonnet it failed the old skill on `personal-tool-depth`, which left the same mistyped-entry question open, and passes on the new one, but on `app-depth` it passed the old skill too, so there it tests nothing yet.

Evals for phase 2 cost about $2.30 at list price, including two full runs with plain Claude.

Rerun on Sonnet with an Opus judge the same day, the setup from then on ([decision 4](decisions.md#4-tests-before-skills-2026-11-20)). `/nap-prd` passed every check over 3 runs but one: a regex for "Python" caught a note before the draft saying it left Python out, so that check moved into the `llm` grader. Mean Δ over plain Claude: +0.48 over the seven cases. `/nap-start` asked its one open question twice in other words in 1 of 3 runs ("Why do you want this for your running? What problem or itch is behind it?"). One line now says to ask it once, as the only "?" in the message, and the case passes 3 of 3. Mean Δ: +0.38 over the seven cases. Both suites cost about $7.

Full run on Sonnet with an Opus judge, 3 runs, after the fixes from the first real session (20-11-2026):

| Case | Plain Claude | `/nap-prd` |
|---|---|---|
| Starts on a request (guard) | 1.00 | 1.00 |
| Ignores a bare idea (guard) | 1.00 | 1.00 |
| Reads the brief | 0.75 | 1.00 |
| Script gets no PRD | 0.00 | 1.00 |
| Personal tool depth | 0.42 | 0.92 |
| App depth | 0.33 | 1.00 |
| No stack | 0.33 | 1.00 |
| Writes after yes | | 1.00 |

- Mean Δ over plain Claude: +0.44 over the seven cases with a baseline, and +0.62 over the five that aren't guards.
- In 1 of 3 runs, `personal-tool-depth` added Key screens to a Personal tool whose brief has no screens trait. The check before the draft now says so, and that case and `writes-after-yes` then passed 3 of 3.
- Both suites cost about $7.20, plus $3.00 for the Opus judge.

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
