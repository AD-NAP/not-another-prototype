# Design

How NAP works and why. Decisions and their reasons are in [decisions.md](decisions.md). What gets built when is in [roadmap.md](roadmap.md).

## Problem

- AI speeds up coding, but without a shared setup the work drifts. One developer installs a skill, another doesn't, and code quality ends up very different across projects and people.
- Good habits get lost: issues before code, a design before building, tests before code, review before merge.
- Most AI-built work stays a prototype. It never reaches production quality.

## Vision

A virtual office. The user sits in the CEO's office. They brief the team on the vision and goals, and the agents get to work: the PM plans, the developers build, the testers test, the reviewer reviews. The user watches the office, approves the big decisions and reads the reports.

In one line: a disciplined dev team of agents, with a pixel office as the CEO's view. The office makes it easy to understand. The discipline makes it useful.

## Three layers

| Layer | Folder | What it is |
|---|---|---|
| **The team** | `plugin/` | A Claude Code plugin: skills, agents and hooks. Decides how each role works and the rules it follows. Works on its own in Claude Code. |
| **The runner** | `runner/` | A Claude Agent SDK app. Loads the plugin, takes the brief, runs agents in the background and sends events to the office. |
| **The office** | `office/` | A pixel-art web app. Agents at desks, plus the CEO's controls: brief, approve, headcount, reports. |

Each layer works without the ones above it.

## Org chart

```
CEO (the user)
 └─ Chief of Staff agent        <- turns the brief into work, runs the team
     ├─ PM -> Tech Lead -> Test Engineer -> Engineers (1 to N) -> Reviewer
     └─ Platform                <- keeps the shared standards
```

## Roles

### Core roles

| Role | Big tech equivalent | What it does | Hands off |
|---|---|---|---|
| PM | Product Manager | Turns a brief into issues with user stories and acceptance criteria. Ranks the backlog and keeps the roadmap. | Issues, roadmap |
| Tech Lead | Staff engineer | Writes a short design doc, picks patterns, splits work into small tasks, records decisions. | Design doc, decision records, task list |
| Test Engineer | SDET / QA | Writes failing tests from the acceptance criteria before any code exists. | Failing tests (TDD red) |
| Engineer | Software engineer | Writes the smallest code that passes the tests, then refactors. Keeps PRs small. | Code, PR |
| Reviewer | Peer reviewer | Reviews the PR in a fresh context against the standards, the design and the tests. Can block a merge. | Review: approve or request changes |
| Platform | Developer productivity | Not an agent. The plugin itself: role files, shared hooks, CI templates, and a setup skill that installs them into a project. | One standard toolkit |

The Test Engineer and the Engineer are split on purpose. If one agent writes both, the tests end up checking what the code happens to do, not what it should do.

### Later roles

- **Chief of Staff:** sits between the CEO and the team and runs the pipeline. Comes once the core roles work on their own.
- **Security Engineer:** threat model on the design, scans PRs for secrets and risky dependencies.
- **SRE / DevOps:** deploy pipelines, monitoring, incident write-ups, release notes.
- **Technical Writer:** keeps the README, API docs and changelog in step with the code.
- **UX Designer:** for projects with a frontend. UI specs, accessibility, consistent design.

## Workflow

```
Brief -> PM (issues) -> Tech Lead (design + tasks) -> Test Engineer (failing tests)
      -> Engineers (code passes) -> Reviewer (+ Security) -> CI gates -> merge
```

Each step hands off a file (issue, design doc, tests, PR), not chat history. Any agent or person can pick up where the last step stopped. Each agent also writes to an event log, which the office reads.

## The CEO's gates

The gates move up as trust grows.

**Early (Engineering Director).** Agents propose, the user approves:
1. Each issue and its acceptance criteria.
2. Each design.
3. Each merge.

**Later (CEO).** The user approves:
- The vision and the roadmap.
- Each milestone.
- Headcount (see below).

Agents and CI handle the rest, with the same rules checked by CI. A person always approves merges to `main`. Agents come to the CEO only when something is blocked, risky or over budget.

## Headcount

The CEO can say yes to more Engineers on a project. It does not mean agents invent new roles.

- Each Engineer takes a different issue, works in its own branch (a git worktree) and opens its own PR.
- The Tech Lead only hands out issues at the same time when they don't touch the same files, to avoid merge conflicts.
- Every PR still goes through the Test Engineer, the Reviewer and CI. More agents means more output, not lower standards.
- The CEO sets a cap, because each agent costs tokens.

## Rules against drift

1. **One source of truth.** Role definitions, skills and hooks live in one versioned plugin. Every project installs the same version. No private local copies.
2. **Enforce with tools, not prompts.** "Always do TDD" in a prompt drifts. A hook or CI check that fails without tests does not.
3. **Fresh context per role.** The Reviewer sees only the diff and the spec, never the Engineer's reasoning, like a human reviewer.
4. **Agents work only when there is work.** No "think every few seconds" loops. Agents start on an event: a new issue, a new PR, a failed CI run.

## Names in the product

- **Kopi Report:** the daily or weekly report to the CEO. Agents take kopi breaks between issues.
- **Night Shift:** agents keep working on issues overnight, and the CEO reads the Kopi Report in the morning.
