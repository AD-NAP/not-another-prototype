# Decisions

The decisions that hold today, and why. Add a new entry for a new decision. When one stops being true, remove or rewrite it, so this file only says what is current.

The first 30 decisions (sprints, hooks, evals, the event log, releases, the runner) are in git history at tag `nap--v0.1.0`.

## 1. A simple team of four (2026-11-14)

**Decision.** NAP is four roles, each with the skills it needs: Architect, PM, Engineer, Reviewer. The Architect replaced the Tech Lead in [decision 10](#10-an-architect-instead-of-a-per-issue-tech-lead-2026-11-14). It is plain skill and agent files, named with a `nap-` prefix. There is no plugin, no hooks, no event log, no evals and no CI. A role, rule or tool is added only when a real project run shows it is needed.

**Why.** The goal was a team of agents with the right skills. The guardrails grew faster than the team: five roles came with 30 decisions, dozens of eval cases, about 1,000 lines of hooks and a 10-phase plan, and the loop still needed hand patches. Most open gaps came from the guardrails, not the roles. Packaging as a plugin also came before there was much to package.

**What we give up.** Tool-enforced rules and measured proof. Both can come back once the team works.

## 2. Skill or subagent per role (2026-10-30)

**Decision.** Roles that talk with the user run as skills in the main session. Roles that need a fresh context run as subagents.

| Role | Runs as | Why |
|---|---|---|
| Architect | Skill | Asks the user what shapes the build, and gets the stack approved live |
| PM | Skill | Needs a back-and-forth with the user to turn a brief into issues |
| Engineer | Subagent | Own context and branch per issue |
| Reviewer | Subagent | Sees only the change, the issue and the project's rules, never the Engineer's reasoning |
| Personal Assistant | Skill | Talks with the user, and starts the Engineer and Reviewer. Subagents can't start subagents. |

## 3. Subagent roles get an entry skill (2026-10-31)

**Decision.** Each subagent role has a thin skill that hands the work to it: `/nap-build` and `/nap-fix` for the Engineer, and `/nap-review` for the Reviewer. The procedure lives in the agent file.

**Why.** Without the skill, Claude did small tasks itself and the agent never ran. The skill also decides what the agent sees, so the Reviewer never gets the Engineer's notes.

## 4. One Engineer builds test-first (2026-11-14)

**Decision.** The Engineer writes the failing tests from the acceptance criteria, then the code, on a plain branch. There is no separate Test Engineer and no git worktree.

**Why.** The split caused the test hand-off bug, the worktree problems on Windows and the need for hooks to keep the two apart.

**What we give up.** Tests written blind to the code. The Reviewer checking the tests against the criteria covers part of it.

## 5. Work lives in GitHub issues (2026-10-30)

**Decision.** The PM writes GitHub issues with testable acceptance criteria and a priority label. Nothing is created until the user approves the draft.

**Why.** Issues are visible, a PR can close one, and every role can read the issue the same way with `gh issue view`.

## 6. The Reviewer posts a comment review on your own PR (2026-11-01)

**Decision.** The Reviewer posts one review per request. It tries a real approve or request-changes review first. GitHub refuses both on your own PR, so it then posts the same body as a comment review whose first line gives the verdict.

**Why.** Every agent runs as the user's GitHub account, so a real approval is impossible.

## 7. A person decides every merge (2026-11-14, updated 2026-11-15)

**Decision.** Agents never merge on their own. The user merges on GitHub, or tells the PA to merge one PR ("merge it"), and the PA then runs `gh pr merge` for that PR only, after checking it is approved and has no conflicts. The README's settings put `gh pr merge` under `ask`, so Claude Code asks the user to confirm every merge, whatever allow rules are added later. This repo's own `.claude/settings.json` still denies `gh pr merge`, since NAP's own PRs are merged by hand.

**Why.** AI can't be accountable for what ships, so a person owns it. Saying "merge it" after reading the review keeps that decision with the person, and saves a trip to GitHub for every PR, which the first PA run asked for. The `ask` rule is a check the model can't skip, unlike a line in a skill.

## 8. MIT license, and other projects are sources (2026-11-14)

**Decision.** NAP is MIT licensed. It does not install or depend on other skill collections such as [Superpowers](https://github.com/obra/superpowers). It adapts their best parts into its own words, with credit in `THIRD_PARTY_NOTICES.md`. Apache-2.0 sources can be adapted if their notices are kept there.

**Why.** The repo is public and meant to be copied, and most of the work worth adapting is MIT already ([skill-research.md](skill-research.md)). Superpowers triggers on its own and overrides NAP's routing when installed beside it, but its useful parts are small enough to adapt.

## 9. Approval needs a test run, and fixes stay on the PR (2026-11-14)

**Decision.** The Reviewer approves only after running the full test suite itself and seeing it pass, and only when each criterion has a test that would fail if it broke. It runs the tests only when the checkout is already on the PR's code, and never switches branches. `/nap-fix` hands a review's findings to the Engineer, who fixes them on the same branch and comments on the PR with what was fixed and what was not. After three rounds without an approval, the user rules on what is left.

**Why.** In the first full loop run the Reviewer approved a PR where a design task had no test, and it had never run the tests. There was also no way to fix findings without a person patching by hand. The cap is three because a loop that long usually means the two roles disagree or the issue is unclear, and each round costs usage.

**Adapted from** Superpowers' fix loop and its rule of evidence before claims ([skill-research.md](skill-research.md)).

## 10. An Architect instead of a per-issue Tech Lead (2026-11-14)

**Decision.** The Tech Lead and `/nap-design` are removed. The Architect (`/nap-architect`) runs once per project and again for a big decision. It records the goal and recommends a stack, then writes `docs/ARCHITECTURE.md`, `docs/ADR.md` and the project rules in `CLAUDE.md`, in a PR the user merges. On the first run it asks whether CI and deploy are needed. The PM starts from the Architect's goal and asks deeper only where it is vague. The Engineer builds within the architecture, decides the UI when there is no mock-up, and stops when an issue needs a big decision. The Reviewer checks the change against the project rules and ADRs instead of a per-issue design.

**Why.** Approving a design for every issue was too much work for the user, most of all on a new project with many issues, and on small issues the design repeated what the Engineer works out anyway. Meanwhile nobody owned the stack, the architecture or the ADRs. The step 3 run also showed the per-issue design check penalising private helpers (PR #9 on `nap-sprint-test`).

**Why the Architect and PM stay apart.** They run at different times (once per project, against every feature idea), and they judge different things (how it is built, against what the user needs). Kept apart, the PM's "what, never how" rule keeps stories free of the solution, and each skill stays small.

**What we give up.** A checked plan of names and files before each build. The Engineer picks them within the rules, and the Reviewer checks the rules, not the split into functions.

## 11. Related issues can share a PR (2026-11-14)

**Decision.** `/nap-build` takes one issue or several. The Engineer builds related issues (the same feature or the same code) on one branch and opens one PR with a `Closes #N` line for each. It leaves out any issue that isn't related, and keeps the PR to about 12 criteria. The Reviewer checks the criteria of every issue the PR closes, numbered by issue. The PM still writes each issue small enough for one PR on its own.

**Why.** A new project can start with 30 issues. One PR each means 30 builds, 30 reviews and 30 merges, and related issues often change the same code twice.

**What we give up.** Smaller PRs. A grouped PR takes longer to review, and one failing issue holds back the others until it is fixed. The cap keeps that bounded.

## 12. A Personal Assistant runs the loop (2026-11-14)

**Decision.** `/nap-pa` takes the user's plans and goals and runs the whole loop: the Architect when there is no architecture or a plan goes against an ADR, the PM for new plans, then for each group of related issues the build, review and fix rounds. It runs each role through its own skill with the Skill tool, so every role's instructions stay in one file. It keeps no state of its own: it reads the architecture docs, open issues and open PRs from GitHub at the start of each turn. It stops only for the user: a role's questions and approvals, a PR to merge, a big decision, findings still open after three rounds, and changes in the checkout it didn't make. Each PR is merged as it is approved, by the user or by the PA on the user's "merge it" ([decision 7](#7-a-person-decides-every-merge-2026-11-14-updated-2026-11-15)), and the PA waits for that before the next build.

**Why.** Typing each command, switching branches before a review and passing PR numbers between roles was manual work the user didn't need to do. Merging as you go keeps every build on the real main branch, which matters because issues often build on each other. Grouping related issues ([decision 11](#11-related-issues-can-share-a-pr-2026-11-14)) keeps the number of merges down.

**What we give up.** One build at a time, since there is one checkout. And the PA is one more file that can drift from the roles it runs, which is why it calls their skills instead of repeating them.

## 13. The PM starts with a vision, one milestone at a time (2026-11-15)

**Decision.** A new project starts with `/nap-vision`, the PM's second skill. It asks how big the project is first: Script, Personal tool, App, Product, Platform, or Unsure (then it asks two or three questions and suggests one). The scope decides how many questions follow: who and why, the end goal, what v0.1 and v1.0 must do, later phases, what is out of scope, and how we know it works. After approval it writes `docs/VISION.md` and a GitHub milestone per version. The Architect reads the vision and sizes the build to it, and commits it with its own docs on a new project. `/nap-backlog` then writes full stories for the current milestone only. The PA closes each milestone when its last issue is merged and asks before starting the next version.

**Why.** The user wanted the idea refined before anything is built: how big it should be, the end goal, the MVP and later versions. Nobody owned a vision or PRD before. Scope changes the architecture a lot, so it comes before the Architect. Full stories wait until their version is next, since what the user learns from v0.1 changes v1.0. It is a separate skill from `/nap-backlog` because it runs once per project, not for every feature.

**What we give up.** One more approval at the start of a project, and on a new project the PM's file waits uncommitted until the Architect commits it.

