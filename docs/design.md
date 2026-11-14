# Design

How NAP works. Decisions and their reasons are in [decisions.md](decisions.md). What comes next is in [roadmap.md](roadmap.md).

The first design (sprints, a runner, a pixel office, hooks, an event log, evals) is in git history at tag `nap--v0.1.0`. It was cut back in [decision 31](decisions.md#31-back-to-a-simple-team-of-four-2026-11-14).

## Problem

- AI speeds up coding, but without a shared setup the work drifts. Code quality ends up very different across projects and people.
- Good habits get lost: issues before code, tests before code, review before merge.

## The team

A team of agents, each with the skills its role needs. The user briefs the team and makes the calls.

| Role | Runs as | What it does | Hands off |
|---|---|---|---|
| PM | Skill, `/nap:backlog` | Turns a brief into issues with testable acceptance criteria | GitHub issues |
| Tech Lead | Skill, `/nap:design` | Short design per issue: parts touched, approach, names, tasks. Also covers stack choices and ADRs. | Design comment on the issue |
| Engineer | Subagent, `/nap:build` | Builds one issue test-first: failing tests, then code, then a PR | PR with tests and code |
| Reviewer | Subagent, `/nap:review` | Reviews the PR against the issue and design, without the Engineer's reasoning | One review |

The PM and Tech Lead are skills because they talk with the user. The Engineer and Reviewer are subagents because they need a fresh context.

## The loop

```
Brief -> PM (issues) -> Tech Lead (design) -> Engineer (tests, code, PR) -> Reviewer -> user merges
```

Each step hands off something a person can read (issue, design, PR, review), not chat history.

## Rules

1. **The user approves** the issues, each design and every merge.
2. **Tests come first.** The Engineer writes failing tests from the criteria before the code.
3. **Fresh context for review.** The Reviewer judges the change, not the story about it.
4. **Grow on need.** A new role, rule or tool is added only when a real project run shows it is missing.

## Roles to add when needed

| Role | Trigger |
|---|---|
| UX Designer | First project with a real UI |
| Platform | First project that needs CI, Docker or a deploy |
| QA | Unit tests pass but the app is broken end to end |
