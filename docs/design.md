# Design

How NAP works. Decisions and their reasons are in [decisions.md](decisions.md). What comes next is in [roadmap.md](roadmap.md).

The first design (sprints, a runner, a pixel office, hooks, an event log, evals) is in git history at tag `nap--v0.1.0`. It was cut back in [decision 1](decisions.md#1-a-simple-team-of-four-2026-11-14).

## Problem

- AI speeds up coding, but without a shared setup the work drifts. Code quality ends up very different across projects and people.
- Good habits get lost: issues before code, tests before code, review before merge.

## The team

A team of agents, each with the skills its role needs. Plain skill and agent files, no plugin. The user briefs the team and makes the calls.

| Role | Runs as | What it does | Hands off |
|---|---|---|---|
| Architect | Skill, `/nap-architect` | Once per project, and again for a big decision. Asks what shapes the build, recommends a stack, and writes the goal, architecture, ADRs and project rules. Asks whether CI and deploy are needed. | `docs/ARCHITECTURE.md`, `docs/ADR.md`, rules in `CLAUDE.md`, in a PR |
| PM | Skill, `/nap-backlog` | Turns the goal or a brief into issues with testable acceptance criteria. Starts from the Architect's goal and asks deeper only where it is vague. Puts setup issues first on a new project. | GitHub issues |
| Engineer | Subagent, `/nap-build` | Builds one issue, or a few related ones in one PR, test-first within the architecture: failing tests, then code, then a PR. Decides the UI when there is no mock-up. Stops for a big decision. | PR with tests and code |
| Reviewer | Subagent, `/nap-review` | Reviews the PR against the issue, the project rules and the ADRs, without the Engineer's reasoning. Runs the tests. | One review |

**The Personal Assistant** (`/nap-pa`, a skill) runs the whole loop for the user: it calls each role's skill in order, groups related issues into builds, switches the checkout for reviews, and stops only for the user's questions, approvals and merges. It merges a PR only when the user says "merge it" for it. Each role can still be run on its own. See [decision 12](decisions.md#12-a-personal-assistant-runs-the-loop-2026-11-14).

The Architect and PM are skills because they talk with the user. The Engineer and Reviewer are subagents because they need a fresh context. See [decision 10](decisions.md#10-an-architect-instead-of-a-per-issue-tech-lead-2026-11-14) for why there is no per-issue design.

## The loop

```
Brief -> Architect (docs, stack, rules) -> PM (issues) -> Engineer (tests, code, PR) -> Reviewer -> user merges
            ^                                              ^                              |
            |                                              +---- /nap-fix, up to 3 rounds +
            +------------ big decision found mid-build (Engineer stops) ------------------+
```

Each step hands off something a person can read (docs, issue, PR, review), not chat history.

## Rules

1. **The user approves** the architecture, each batch of issues, every big decision and every merge.
2. **Tests come first.** The Engineer writes failing tests from the criteria before the code.
3. **Fresh context for review.** The Reviewer judges the change, not the story about it.
4. **Evidence before approval.** The Reviewer approves only after seeing the tests pass. Findings are fixed on the same PR with `/nap-fix` and reviewed again.
5. **Big decisions go through the Architect.** A new language, framework, service, major library or data store needs an ADR first.
6. **Grow on need.** A new role, rule or tool is added only when a real project run shows it is missing.

## Roles to add when needed

| Role | Trigger |
|---|---|
| UX Designer | The Engineer's UI choices keep needing rework. Until then the Engineer decides the UI. |
| Platform | CI or deploy setup is more than the Architect's docs and a setup issue can cover |
| QA | Unit tests pass but the app is broken end to end |
