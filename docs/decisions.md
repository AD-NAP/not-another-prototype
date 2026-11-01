# Decisions

Big decisions and why they were made. Newest at the bottom. Add a new entry instead of rewriting an old one. If a decision changes, add an entry that replaces it and say so in the old one.

## 1. Skill or subagent per role (2026-10-30)

**Decision.** The skill is the "how": the role's procedure, shared and versioned. The subagent is the "who": a fresh context, limited tools, a chosen model. Hooks and CI are the rules that can't be skipped. Every role gets a skill, so it can run in the main session now and as a subagent later.

Rule of thumb: roles that talk to the user run as skills in the main session. Roles that must not see each other's reasoning, or that run in parallel, run as subagents.

| Role | Runs as | Why | Tools and limits |
|---|---|---|---|
| PM | Skill, main session | Needs a back-and-forth with the user to turn a brief into issues | Read the repo, create GitHub issues |
| Tech Lead | Skill, main session (subagent later) | The user approves the design live at first. Becomes a subagent when the Chief of Staff runs the team. | Read the repo, write design docs |
| Test Engineer | Subagent | Fresh context: sees only the issue and the design, never the implementation | Writes and runs test files only |
| Engineer | Subagent, `isolation: worktree` | Own branch per issue. Running more of them in the background is how headcount works. | Edits code, not tests. Runs tests. |
| Reviewer | Subagent, read-only | Fresh context: sees only the diff, the issue and the design, never the Engineer's reasoning | Read, search, run tests. No edits. |
| Platform | Not an agent | It is the plugin itself | n/a |
| Chief of Staff (later) | Main-session agent | Runs the pipeline and dispatches the subagents | Everything |

**Facts from the Claude Code docs that shaped this:**
- Subagents can preload skills (`skills`), limit tools (`tools`, `disallowedTools`), pick a `model`, and run in their own git worktree (`isolation: worktree`). Up to 20 run at once by default. Nesting goes up to 3 levels.
- **Plugin subagents ignore `hooks`, `mcpServers` and `permissionMode` in their own file.** Rules like "the Engineer can't edit tests" go in the plugin's shared `hooks/hooks.json` and in CI.
- Plugins can declare `dependencies` on other plugins and pin a `version`.
- `claude plugin eval` runs test cases against a plugin.

## 2. Build on Superpowers (2026-10-30)

**Decision.** The plugin builds on [Superpowers](https://github.com/obra/superpowers) instead of rebuilding what it does well: brainstorming, writing plans, worktrees, debugging, verification before completion, and finishing a branch.

**What NAP adds:** the PM and GitHub issues, the split between Test Engineer and Engineer, a read-only Reviewer, CI gates, headcount, the Chief of Staff, the runner and the office.

**Risk to check in the TDD pair step:** Superpowers skills trigger on their own, and its TDD skill has one agent write both the test and the code. Its flow may fight the split. If it does, keep only the Superpowers skills that fit, or drop the dependency and credit it in the README.

## 3. Three layers, one repo (2026-10-30)

**Decision.** NAP has three layers (team, runner, office) in one repo, each in its own folder. See [design.md](design.md#three-layers).

**Why three layers.** A plugin only adds skills, agents and hooks to Claude Code. It can't draw an office or run agents in the background. The Claude Agent SDK can load the plugin directly, so the runner reuses the same team without rewriting it.

**Why the plugin first.** It is the hardest part to get right, it is useful on its own, and the office needs real work to show.

**Why one repo.** A change across layers (for example a new event the office must show) is one PR. All the attention goes to one repo. A root `.claude-plugin/marketplace.json` points to `plugin/`, so people can still install only the plugin.

**When to split.** Only for a real reason, such as making the plugin public while the office stays private, or the plugin needing its own release cycle. Git can keep the folder's history when splitting.

## 4. Agile sprints matched to usage limits (2026-10-30)

**Decision.** NAP works in agile sprints shaped around Claude's usage limits.

| Agile | In NAP |
|---|---|
| Sprint | One week, ending at the weekly usage reset |
| Work day | One 5-hour usage window |
| Sprint planning | The CEO and the PM pick a sprint goal and the issues that fit the week |
| Daily standup | The Kopi Report at the end of each window: done, in progress, waiting, questions |
| Sprint review | Before the weekly reset: see what shipped, accept it or send it back |
| Retrospective | What went well, what didn't, one process change. The change becomes a real edit to a skill. |
| Velocity | How many issues usually fit in a window or a week. Used to size the next sprint. |

**Why.** Agile's core promise is working software at the end of every short cycle. When credits run out, the user should have finished features, not only plans.

**Rules that make work ship:**
1. **Finish before starting.** Each Engineer works on one issue at a time, through tests, review and merge (a WIP limit of 1). Running out of credits loses at most one half-done issue per Engineer.
2. **Vertical slices.** Each issue is a thin feature that works end to end.
3. **Definition of done.** Tests pass, review approved, CI green, merged. "Almost done" doesn't count.
4. **Most valuable first.** If the week ends early, what's missing is the least important work.
5. **Just-in-time planning.** Detailed issues only for the next sprint. Planning must not eat the credits meant for building.
6. **Protect the sprint.** New ideas mid-sprint go to the backlog. The CEO can swap one in, but never just add it on top.

## 5. Engineers pull their work (2026-10-30)

**Decision.** Nobody hands out issues. Engineers pull them.

| Role | Responsibility |
|---|---|
| PM | Orders the backlog: what matters most next |
| Tech Lead | Labels issues `ready` and marks which ones conflict (touch the same files) |
| Engineer | Takes the top `ready` issue that doesn't conflict with work in progress |

**Why.** This is how Scrum teams work: the PM sets the order, the team assigns itself. Engineer agents are identical, so who takes an issue doesn't matter. What matters is the order and whether two issues can run side by side.

**Cost.** Picking the next issue is a plain rule, not judgement. The runner can do it in code, so no credits are spent deciding who works on what. Until the runner exists, the user starts the next issue.

## 6. Two phases: Sprint 0, then sprints (2026-10-30)

**Decision.** Each project starts with a one-time **Sprint 0** (inception) that creates the foundational documents, then moves to weekly sprints. The documents follow the usual order: why, then what, then how.

| # | Document | Question it answers | Owner |
|---|---|---|---|
| 1 | Vision brief | Why build this, and for whom? | CEO + PM |
| 2 | PRD | What must it do? Personas, user journeys, epics, MVP vs later, non-functional requirements | PM |
| 3 | UX flows | How does it feel to use? Only for projects with a UI. | UX Designer |
| 4 | Architecture doc | How will we build it? Components, data, integrations, stack with alternatives | Architect |
| 5 | ADRs | Why X over Y? One per big decision, continuing for the life of the project | Architect |
| 6 | Engineering setup | How do we work here? Repo layout, standards, test strategy, CI, definition of done | Platform |
| 7 | Story map and first backlog | What do we build first? Stories along the user journey, sliced into releases | PM |

**Why this order.** Each document needs the one before it. Good user stories need the users and the problem. The stack choice needs the requirements. Sprint 1 needs the MVP and the architecture.

**Just enough.** Each document is kept short, often one or two pages.

**Sprint 0 ends with running code:** a walking skeleton, a tiny version of the app that goes through the real stack, tests and CI. Even the planning sprint ships something.

**Existing projects** skip most of Sprint 0. Their documents describe what is already there.

**One role, several small skills.** A role can own more than one skill, so no single skill carries too much. For example, the PM owns separate skills for the vision brief, the PRD, the story map and the sprint backlog. Each skill loads only when its job comes up.

## 7. The Architect is its own role (2026-10-30)

**Decision.** The Architect is a separate role from the Tech Lead.

**Why.**
- One job per skill. Smaller skills follow their instructions more reliably.
- Different rhythm: the Architect works in Sprint 0 and on rare big changes, the Tech Lead every sprint. Sprints stay lighter because the Architect's skill only loads when needed.
- Different model: architecture is worth the strongest model, feature design often isn't.
- A second opinion: the Architect checks feature designs against the architecture, so nobody checks their own work.

**Boundary rule.** If a change affects how the parts connect, the stack, how data is stored, or a non-functional requirement (speed, security, cost), it goes to the Architect. Everything else stays with the Tech Lead.

| | Architect | Tech Lead |
|---|---|---|
| When | Sprint 0, plus big changes | Every sprint |
| Owns | Architecture doc, stack choice, system-level ADRs | Feature designs, task splits, `ready` and conflict labels |
| ADRs | Accepts or rejects them | Proposes one when a feature needs it |
| Checks | Feature designs flagged as touching the architecture | That the Engineers' work matches the design |
| Stays grounded by | Reading the walking skeleton and real code before deciding | Working close to the code every sprint |

**Costs accepted.** One more role to build and test, and one more handoff. Small projects may barely use it.

## 8. Step 2 scope: GitHub Issues, dogfooded on NAP (2026-10-30)

**Decision.**
- **Issues live in GitHub Issues.** They are visible, a PR can close one ("Closes #12"), labels track status, and the runner and office can read them later.
- **Priority is a label:** `priority: high`, `priority: medium` or `priority: low`, plus the order the PM gives. A GitHub Project board can come later with sprint planning.
- **Step 2 is issues only.** Brief, questions, draft issues, the user's approval, then the issues are created on GitHub in priority order. Sprint goals, velocity and picking the week's issues wait for step 6.
- **Dogfood on NAP.** The PM's first real job is writing NAP's own issues for step 3 (the TDD pair).

**Why.** Issues only is the smallest step that works on its own, and it gets the hardest part right first: testable acceptance criteria, which the Test Engineer turns straight into tests in step 3. Sprint planning works better once there is real velocity to plan with. Dogfooding tests the PM on a real project from day one, and "NAP was built by NAP" is a good story.

**Approval stays with the user.** The PM drafts first. Nothing reaches GitHub until the user says yes.

## 9. How we run evals (2026-10-31)

**Decision.** A full eval run compares the plugin against plain Claude with no plugin, and reports the difference (Δ):

`claude plugin eval plugin --runs 5 --ablation with-without --model sonnet --judge-model opus -j 4 --no-scaffold --no-publish --max-cost-usd 15`

- **Baseline arm.** Every case runs with and without the plugin. Δ is the number that matters, not the pass rate.
- **Pinned models.** The agent is Sonnet and the judge is Opus. The judge must be large and must not be the agent model, or it grades its own style. Without `--model`, the run uses the default from user settings, which may be Haiku.
- **5 runs per arm.** One run can pass by luck.
- **Outcome graders score fully.** They check what any good backlog needs: testable criteria, edge cases, tech kept out of stories, small slices.
- **House-style graders weigh 0.5.** Given / When / Then, sizes, approval prompts and "exactly one question" are the plugin's own format. Plain Claude can't know them, so full weight would inflate Δ.
- **At least one should-not-fire case.** It catches the skill firing when it shouldn't.
- **Pilot first.** Run `--runs 1`, read the judge evidence, fix unfair graders, then do the full run.

**Why.** The earlier runs had no baseline, used Haiku as both agent and judge, ran once, and had graders that rewarded the plugin's format. None of that could show whether the plugin helps.

## 10. Subagent roles get an entry skill (2026-10-31)

**Decision.** Each subagent role gets a thin skill that hands the work to it. The Test Engineer's is `/nap:failing-tests`: it finds the issue, passes the issue and the design to the `nap:test-engineer` agent word for word, leaves out any implementation code, and relays the report. The procedure itself lives in the agent file.

**Why.** In the first eval pilot, the agent alone never ran. Claude wrote the tests itself in every case, because small tasks rarely get delegated, so the plugin made no difference (Δ 0). With the skill as the entry point, the agent ran in every case. The skill is also where the fresh context is protected: it decides what the agent sees, so code the user pastes "in case it helps" never reaches it. This fits decision 1: the skill is the "how" of starting the role, the subagent is the "who".

**Eval command for cases that write files.** The decision 9 command plus `--allow-tools Write Edit`, so the agent can write test files. `--tag <tag>` runs only one role's cases. Bash stays off: native Windows has no sandbox for it, so these evals judge test files by reading them, not by running them.

## 11. One eval format, per-case scores, no shell (2026-11-01)

**Decision.** Every eval case uses `prompt.md` plus `graders/*.md`. A `case.yaml` is added only to set up starting files with `context.scaffold_script`. Evals never grant `Bash` or `PowerShell`, so the judge reads files instead of running them. Results are read per case: a case Δ under 0.2 counts as a tie. Normal runs stay at 5 per arm; the Proof step (roadmap step 7) uses 10. The full procedure is in [plugin/evals/README.md](../plugin/evals/README.md).

**Why.** The first Engineer cases put the whole case in `case.yaml`, with a different shape from the other 11 cases. Mixing the two made failures hard to follow. They also needed a shell, and the shell sandbox (none on native Windows, `bubblewrap` and `socat` on Linux) never worked reliably. On noise: plain Claude's score on one case moved by up to 0.2 between runs, and in both roles the cases where plain Claude already scored 1.00 pulled the mean Δ down without saying anything about the plugin. Reading each case's Δ shows where the plugin helps. Ten runs would steady the numbers but double the cost (the last full run was $11.54), so that waits until the numbers go in the README.

## 12. One-run evals until the MVP (2026-11-01)

**Decision.** Until the MVP, evals are checks: one run per case, with the plugin only (`--runs 1 --ablation none`). A new role's first check adds the baseline once, to see the plugin changes something. Measuring how much the plugin helps (10 runs per case, with and without it) waits until each role is refined after the MVP. This replaces the 5-run full run in decisions 9 and 11. The models, grader weights, format and no-shell rule stay.

**Why.** The project runs on a Claude Pro plan. A 5-run Engineer eval with the baseline would cost about $22 of usage, and the pilots alone kept hitting the 5-hour limit and eating the weekly one. The goal now is a working MVP across all roles. One run is enough to show a role works and its graders are fair; it can't show a reliable Δ, so we don't report one from it.
