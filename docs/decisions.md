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

## 13. Lane hooks match the agent and stay best effort in the shell (2026-11-01)

**Decision.** One `PreToolUse` hook, `plugin/hooks/lanes.mjs`, keeps the TDD roles in their lanes. It reads `agent_type` from the hook input and acts only for `nap:engineer` and `nap:test-engineer`, matched exactly. The main session, other agents and a user's own agent named `engineer` are never blocked.

- **Engineer:** no edits to test files, with file tools or shell writes (`>`, `sed -i`, `rm`, `git checkout`, `Set-Content` and the like).
- **Test Engineer:** no reads of source files (Read, Grep, and shell readers such as `cat`, `grep`, `rg`, `Get-Content`), and no edits to anything but test files. Tests, docs and config stay readable.
- **Shell checks are best effort.** They catch the common commands. They can't catch everything (for example `python -c "open(...)"`), and the agent instructions still carry the rule.
- **Node, not bash or Python.** It runs the same on Windows, Mac and Linux. If Node is missing the hook fails open: it doesn't block, so NAP still works with the instructions alone.
- **Unit tests, not evals.** 16 `node:test` cases cover each rule and the exit code. They cost no usage.

**Why.** Instructions alone left the rules to the agents' goodwill. The hook docs confirm plugin hooks fire inside plugin subagents, with `agent_type` set to the plugin-scoped name (`nap:engineer`), so one shared hook can tell the roles apart. A real session confirmed the name and that the hook runs on Windows. Full shell enforcement would need a sandbox per role, which is out of reach for now (see decision 11), so the issue's note "say how much enforcement is enough" is answered here: common commands blocked, the rest left to instructions.

## 14. The Reviewer falls back to a comment review on your own PR (2026-11-01)

**Decision.** The `nap:reviewer` agent, started by `/nap:review`, posts one GitHub review per request. It tries a real "approve" or "request changes" review first. GitHub refuses both on your own PR, and NAP's agents run as the CEO's GitHub account, so the Reviewer then posts the same body once as a comment review whose first line is **Review: approve** or **Review: request changes**. The lane hook (decision 13) gets a third lane: the Reviewer can read and post its review, but can't edit files, commit, push, merge, close or write into the project from the shell.

**Why.** Issue #16 asks for one review that approves or requests changes. While every agent shares one GitHub account, a real approval is impossible, so the verdict moves into the review's first line. A separate bot account for the Reviewer would allow real approvals; that can wait until the runner (step 12). The hook makes "the PR has no new commits and is not merged" hold even if the agent tries.

**Update.** The Reviewer's own first real review (on PR #18) found that `gh api` could still merge a PR. Its `gh` rules are now an allowlist: only `gh pr view`, `diff`, `checks`, `review`, `list`, `gh issue view`, `list`, `gh repo view`, `gh auth status`, and `gh api` reads (no method other than GET, no fields, no GraphQL mutation). Any other `gh` command is blocked, including ones GitHub adds later. The hook still only sees commands, so the full fix is a GitHub account for the Reviewer that can review but not merge (roadmap step 12).

## 15. The Tech Lead posts the design as an issue comment (2026-11-07)

**Decision.** The Tech Lead is the `/nap:design` skill, run in the main session (decision 1). It checks the issue has testable criteria, reads only the code the issue needs, and drafts a one-screen design: approach, files it touches, the names the code will use, tasks linked to criteria by number, and risks. After the user approves, it posts the design as a comment on the issue that starts with `## Feature design`. Without `gh`, it saves the design to `docs/designs/` instead. A design that changes how parts connect, the stack, data storage or a non-functional requirement is marked "Needs Architect review: Yes".

**Why.** Issue #20 asks that anyone can open the design from the issue. A comment lives with the issue, needs no commit or branch, and the Test Engineer and Reviewer already read issues with `gh issue view`, so they can read the design the same way (issue #23). A file in the repo would need its own commit before the link works. "Names the code will use" is there so the Test Engineer can write tests without reading the code. The Architect doesn't exist yet (roadmap step 9), so for now the flag tells the user to check the design before it is built.

## 16. Conflicts are labels, one per issue number (2026-11-07)

**Decision.** `/nap:design` labels an issue `ready` once its design is approved, unless the design needs Architect review. It then compares the "Parts it touches" table of the issue's design with those of the other open `ready` issues. Two issues conflict when they share at least one file path, exactly (decision 5). Each conflict is marked on both issues with a label naming the other one: `conflicts: #290` on #301 and `conflicts: #301` on #290. The labels are shown with the design and added only after the user approves. Missing labels are created then too. The user can also ask to mark an issue with an existing design `ready`.

**Why.** Issue #22 asks for conflicts marked by number, so picking the next issue is a plain rule. Labels show in the issue list, so the user sees at a glance what can run side by side, and the runner (step 12) can read them with one `gh issue list` call, with no comment to parse. The `conflicts: #N` name follows the `priority: high` style the PM already uses. Comparing whole file paths keeps the rule exact: a shared folder is not a conflict.

**Cost.** One label per issue that has a conflict. Labels are not removed when an issue closes yet (out of scope for #22), so old ones pile up until that is built.

## 17. The event log is a JSON Lines file written by a hook (2026-11-08)

**Decision.** One hook, `plugin/hooks/events.mjs`, writes the event log for every NAP role. The log is `.nap/events.jsonl` in the project, one JSON object per line, oldest first: `time`, `role`, `event` (`started`, `finished` or `failed`), `issue`, `pr`, `detail` and `session`. `NAP_EVENT_LOG` sets another path.

- **Subagent roles** (any `nap:<name>` agent): started when the Agent tool is called, finished when the subagent stops, failed when the Agent call or the subagent fails. This works for agents in the background too.
- **Skill roles** in the main session (any `nap:<name>` skill): started when the skill runs or its slash command is typed, finished when the turn ends, failed when the turn stops with an error. Entry skills (`failing-tests`, `make-tests-pass`, `review`) are skipped, because their agent logs itself. `backlog` logs as `pm` and `design` as `tech-lead`; any other skill logs under its own name.
- **Numbers** come from the agent's prompt or the skill's arguments: `issue 21`, `#21`, `PR 26`, or an issue or pull URL. A bare number is an issue, except for the Reviewer, where it is a PR.
- **Best effort.** The hook never blocks and always exits 0. If the log can't be written, the role carries on. A small state file next to the log links each start to its finish.
- **Kept out of git.** When the hook creates `.nap/`, it adds a `.gitignore` there, so the log never lands in a PR.
- **Unit tests, not evals,** as in decision 13.

**Why.** Hooks fire whatever the agent does, so the log doesn't depend on the agent remembering to write it (rule 2 against drift), and no role's instructions change. JSON Lines is append-only, so entries stay in the order they happened, and any script reads it line by line with no library: `jq`, a few lines of Node, or the office later. A file in the project fits step 5 and needs no server; the runner (step 12) can point `NAP_EVENT_LOG` wherever it wants. A failed role can't log its own failure, so failures come from the `PostToolUseFailure` and `StopFailure` hook events. A live run on Claude Code 2.1 confirmed the events and fields.

**Limits.** A skill role that asks the user a question logs "finished" when it hands the turn back, with the question as its detail. If the user answers, the rest of that role's work isn't logged again until the skill runs again. Two hooks writing at the same moment can race on the state file; the log itself is safe, because each entry is one append.

## 18. The MVP is the loop, setup, a Chief of Staff skill and proof (2026-11-14)

**Decision.** v1.0.0, the MVP of decision 12, is four things: the sprint loop made reliable, `/nap:setup` with the CI gate, a Chief of Staff skill that chains the loop (decision 19), and measured proof on a second project. Sprint ceremonies, the Sprint 0 product and architecture roles, the UX Designer, the role template and event log contract v1 move to after the MVP. The roadmap steps are renumbered to match:

| Old step | New step |
|---|---|
| 6 Sprint ceremonies | 10 |
| 7 Proof | 9 |
| 8 Sprint 0: product | 11 |
| 9 Sprint 0: architecture | 12 |
| 10 Sprint 0: platform | 7 |
| 11 UX Designer | 13 |
| 12 Chief of Staff and runner | 8 (the skill) and 14 (the runner) |
| 13 to 15 Headcount, office, CEO controls | 15 to 17 |

Step numbers in decisions 1 to 17 are the old ones.

The proof project is `kopi`: a small TypeScript CLI that reads a repo's issues, milestones and PRs through `gh`, plus `.nap/events.jsonl`, and prints velocity, time from `ready` to merge, review rounds and what is blocked. NAP builds it from an empty folder.

**Why.** The first milestone 1 plan had 88 todos in 10 phases for one person on a Pro plan, and usage limits had already stopped eval runs (decision 12). It also ended with the CEO typing about six commands per issue, which is not the product in [design.md](design.md). What sets NAP apart from other agent teams is one standard set up the same way in every project and enforced by CI, so that part moves forward. The reduced list is about 59 todos.

**Why `kopi`.** It is useful, since the research found no tool that reads velocity from GitHub ([skill-research.md](skill-research.md)). It is mostly pure functions over JSON, so criteria turn into tests cleanly. It needs no cloud, accounts or UI. It measures the sprints that build it, and it later becomes the engine behind the Kopi Report (step 10).

**Costs accepted.** `kopi` is close to NAP's own tooling, so the proof is weaker than one on an unrelated product. It has no UI or database. A second proof on a product with both waits for steps 12 and 13.

## 19. The Chief of Staff starts as a skill (2026-11-14)

**Decision.** The Chief of Staff's first form is a skill in the main session, `/nap:run`. It needs no runner.

- `/nap:run <issue>` runs the Tech Lead's design and waits for the CEO's approval, then starts the Test Engineer, the Engineer and the Reviewer in turn, then fix rounds up to 3. It ends with a short report.
- It reads the next step from GitHub, not from the conversation: the design comment, the `ready` label, the test branch, the open PR and the latest review. A fresh session that runs the same command resumes where the last one stopped.
- It continues or stops on each agent's result status. BLOCKED and NEEDS_CONTEXT stop the run and go to the CEO.
- It never merges.

The runner (step 14) later does the same job in the background, in code. This narrows decision 1, which listed the Chief of Staff as a main-session agent, and it replaces the earlier plan to leave all chaining to the runner.

**Why.** It turns six commands per issue into one command and two decisions (approve the design, merge the PR), without building the runner first. Reading the state from GitHub fits the rule that each step hands off a file, and it survives a usage limit in the middle of a run, which is normal on a Pro plan.

**Risks.** Unproven: one session may not hold five handoffs in its context, and one issue may not fit a 5-hour window. If so, each role runs in its own session and only the next-step table is shared. Claude has already done the Engineer's work inline once instead of starting the agent (issue #36), so the skill gets an eval that fails when code appears without the Engineer.

## 20. The Reviewer posts its review without a CEO step (2026-11-14)

**Decision.** The Reviewer posts its review as soon as it finishes. The project's allow rules include `gh pr review`.

**Why.** The plugin never asked before posting. In the first full loop run (#24), the CEO held the posting back by blocking `gh pr review` and allowing it by hand. `/nap:run` cannot continue to the fix rounds if a person must release each review. The review is a comment (decision 14): it changes no code and merges nothing, and the CEO still merges every PR (decision 21). A wrong review costs a fix round, not a bad merge.

## 21. The CEO merges every PR now, and a sprint branch later (2026-11-14)

**Decision.** Two stages.

- **Now (stage A).** A person merges every PR. Branch protection requires a PR and green CI, and a project deny rule stops agents running `gh pr merge`.
- **Later (stage B), with the runner (step 14).** PRs that the Reviewer approved and CI passed merge into a `sprint-N` branch without the CEO. The CEO reviews and merges that branch into `main` once, at the sprint review.

Stage B starts only when all three hold:
1. Across two measured sprints, the CEO overruled the Reviewer on fewer than 1 in 10 PRs. Step 9 counts this.
2. CI runs on the project.
3. The Reviewer has its own GitHub account, so its approval is real and branch protection can require it (decision 14).

A person approves every merge to `main` in both stages. That rule does not change.

**Why.** In stage A the CEO is the bottleneck: work stops at every PR until a person arrives, which blocks unattended runs and headcount. But in the only full loop run so far the Reviewer approved a PR with a design task missing, and the CEO caught it. The Reviewer has to earn the change with numbers. Stage B matches the later CEO gates already in [design.md](design.md#the-ceos-gates): the CEO accepts work at the sprint review.

**Cost.** In stage B a bad PR can sit in the sprint branch while later PRs build on it. The sprint review is the backstop.

## 22. `/nap:run next` takes independent issues only (2026-11-14)

**Decision.** After an issue reaches a merge-ready PR, `/nap:run next` continues to the next one. It takes the top `ready` issue that neither conflicts with an open PR (the `conflicts: #N` labels, decision 16) nor is blocked by one ("blocked by" links that `/nap:backlog` records). Each issue branches from `main`. It stops when 3 PRs wait for the CEO, or when no issue qualifies, and reports what is ready and what is blocked. Stacked PRs, where an issue branches from an unmerged PR, wait for stage B of decision 21.

**Why.** Independent issues need no stacking. A stacked PR needs a rebase whenever the PR under it changes or is squash-merged, and a change request at the bottom reaches every PR above it. In stage A the stack would also grow while the CEO is away. With a sprint branch as the shared base, PRs merge as they pass, so stacking fits there. The cap of 3 keeps the CEO's queue short and limits the work at risk if an early PR is sent back.
