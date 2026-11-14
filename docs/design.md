# Design

How NAP works and why. Decisions and their reasons are in [decisions.md](decisions.md). What gets built when is in [roadmap.md](roadmap.md).

## Problem

- AI speeds up coding, but without a shared setup the work drifts. One developer installs a skill, another doesn't, and code quality ends up very different across projects and people.
- Good habits get lost: a vision and requirements before building, issues before code, tests before code, review before merge.
- Most AI-built work stays a prototype. It never reaches production quality.

## Vision

A virtual office. The user sits in the CEO's office. They brief the team on the vision and goals, and the agents get to work: the PM plans, the Architect designs, the Engineers build, the testers test, the Reviewer reviews. The user watches the office, makes the big calls and reads the reports.

In one line: a disciplined dev team of agents, working in agile sprints, with a pixel office as the CEO's view. The office makes it easy to understand. The discipline makes it useful.

## Three layers

| Layer | Folder | What it is |
|---|---|---|
| **The team** | `plugin/` | A Claude Code plugin: skills, agents and hooks. Decides how each role works and the rules it follows. Works on its own in Claude Code. |
| **The runner** | `runner/` | A Claude Agent SDK app. Loads the plugin, takes the brief, runs agents in the background and sends events to the office. |
| **The office** | its own repo | A pixel-art web app. Agents at desks, plus the CEO's controls: brief, approve, headcount, reports. It reads the event log, `.nap/events.jsonl`, and nothing else from this repo (see [decision 25](decisions.md#25-the-office-gets-its-own-repo-2026-11-14)). |

Each layer works without the ones above it. The team and the runner live in this repo; the office lives in its own.

## Org chart

```
CEO (the user)
 └─ Chief of Staff agent         <- runs the sprints, writes the Kopi Report
     ├─ Sprint 0: PM, UX Designer, Architect, Platform
     ├─ Sprints:  PM -> Tech Lead -> Test Engineer -> Engineers (1 to N) -> Reviewer
     └─ Architect checks designs that touch the architecture
```

## Two phases

### Sprint 0 (once per project)

Creates the foundational documents, in order: why, then what, then how. Each one is kept short.

| # | Document | Question it answers | Owner |
|---|---|---|---|
| 1 | Vision brief | Why build this, and for whom? | CEO + PM |
| 2 | PRD | What must it do? Personas, user journeys, epics, MVP vs later, non-functional requirements | PM |
| 3 | UX flows | How does it feel to use? Only for projects with a UI. | UX Designer |
| 4 | Architecture doc | How will we build it? Components, data, integrations, stack with alternatives | Architect |
| 5 | ADRs | Why X over Y? One per big decision | Architect |
| 6 | Engineering setup | How do we work here? Repo layout, standards, test strategy, CI, definition of done | Platform |
| 7 | Story map and first backlog | What do we build first? | PM |

Sprint 0 ends with a **walking skeleton**: a tiny version of the app that runs through the real stack, tests and CI. Existing projects skip most of Sprint 0. Their documents describe what is already there.

### Sprints (weekly)

A sprint is one week, ending at the weekly usage reset. Each 5-hour usage window is a work day.

| Agile | In NAP |
|---|---|
| Sprint planning | The CEO and the PM pick a sprint goal and the issues that fit the week's velocity |
| Daily standup | The Kopi Report at the end of each window |
| Sprint review | Before the weekly reset: the CEO accepts what shipped or sends it back |
| Retrospective | What went well, what didn't, one process change. The change becomes a real edit to a skill. |
| Velocity | Issues per window or week, used to size the next sprint |

Rules that make work ship:
1. **Finish before starting.** One issue per Engineer at a time, through tests, review and merge.
2. **Vertical slices.** Each issue is a thin feature that works end to end.
3. **Definition of done.** Tests pass, review approved, CI green, merged.
4. **Most valuable first.** If the week ends early, what's missing is the least important work.
5. **Just-in-time planning.** Detailed issues only for the next sprint.
6. **Protect the sprint.** New ideas go to the backlog. The CEO can swap one in, never just add it on top.

## Roles

A role can own several small skills, so no single skill carries too much. For example, the PM has separate skills for the vision brief, the PRD, the story map and the sprint backlog.

### Sprint 0 roles

| Role | Big tech equivalent | What it does | Hands off |
|---|---|---|---|
| PM | Product Manager | Turns the CEO's brief into a vision brief and a PRD. Asks the questions a good PM would ask. The CEO makes the product calls. | Vision brief, PRD |
| UX Designer | Product designer | User flows and screens, for projects with a UI | UX flows |
| Architect | Architect / Principal engineer | Designs the system, chooses the stack with alternatives, records the big decisions | Architecture doc, ADRs |
| Platform | Developer productivity | Not an agent. The plugin itself plus a setup skill: repo layout, standards, test framework, CI, walking skeleton | Engineering setup |
| PM | Product Manager | Lays the PRD's stories along the user journey and slices them into releases | Story map, first backlog |

### Sprint roles

| Role | Big tech equivalent | What it does | Hands off |
|---|---|---|---|
| PM | Product Manager | Orders the backlog and writes the next sprint's issues with testable acceptance criteria | Ordered backlog, issues |
| Tech Lead | Tech lead | Small design per feature, task split, labels issues `ready`, marks conflicts, proposes ADRs | Feature design, `ready` issues |
| Test Engineer | SDET / QA | Writes failing tests from the acceptance criteria before any code exists | Failing tests (TDD red) |
| Engineer | Software engineer | Pulls the next ready issue, writes the smallest code that passes the tests, then refactors | Code, PR |
| Reviewer | Peer reviewer | Reviews the PR in a fresh context against the standards, the design and the tests. Can block a merge. | Review: approve or request changes |
| Architect | Architect | Checks feature designs that touch the architecture. Accepts or rejects proposed ADRs. | Approval or changes |

The Test Engineer and the Engineer are split on purpose. If one agent writes both, the tests end up checking what the code happens to do, not what it should do. The Architect and the Tech Lead are split for the same reason. The boundary: anything that affects how parts connect, the stack, data storage or a non-functional requirement goes to the Architect.

### Later roles

- **Chief of Staff:** runs the sprints and the ceremonies, enforces the rules above, writes the Kopi Report.
- **Security Engineer:** threat model on the architecture, scans PRs for secrets and risky dependencies.
- **SRE / DevOps:** deploy pipelines, monitoring, incident write-ups, release notes.
- **Technical Writer:** keeps the README, API docs and changelog in step with the code.

## Workflow

```
Sprint 0:  Brief -> Vision -> PRD -> (UX flows) -> Architecture + ADRs
                 -> Engineering setup + walking skeleton -> Story map -> first backlog

Sprint:    Planning -> Tech Lead (design, `ready`) -> Engineer pulls an issue
                    -> Test Engineer (failing tests) -> Engineer (code passes)
                    -> Reviewer -> CI -> CEO approves merge
           Kopi Report after each window. Review and retro at the end of the week.
```

Each step hands off a file (doc, issue, tests, PR), not chat history. Any agent or person can pick up where the last step stopped. Each role also writes to an event log, `.nap/events.jsonl`, which the office and the Kopi Report read (see [decision 17](decisions.md#17-the-event-log-is-a-json-lines-file-written-by-a-hook-2026-11-08)).

## Who works on what

Nobody hands out issues. Engineers pull them.
- The **PM** orders the backlog.
- The **Tech Lead** labels issues `ready` and marks which ones conflict, with a `conflicts: #N` label on both (decision 16).
- A free **Engineer** takes the top `ready` issue that doesn't conflict with work in progress.

Picking the next issue is a plain rule, so the runner can do it in code without spending credits. Until the runner exists, the Chief of Staff skill, `/nap:run next`, applies the rule in the main session (see [decision 19](decisions.md#19-the-chief-of-staff-starts-as-a-skill-2026-11-14)).

## The CEO's gates

**Sprint 0.** The CEO approves the vision brief, the MVP scope in the PRD, and the stack choice.

**Sprints, early (Engineering Director).** The CEO approves the sprint plan, each design and each merge.

**Sprints, later (CEO).** The CEO approves the sprint plan, accepts work at the sprint review, sets headcount and approves merges. Design approval moves to the Tech Lead and the Architect.

A person always approves merges to `main`. Agents come to the CEO only when something is blocked, risky or over budget, or when a product question needs a human call.

## Headcount

The CEO can say yes to more Engineers on a project. It does not mean agents invent new roles.

- Each Engineer pulls a different issue, works in its own branch (a git worktree) and opens its own PR.
- Issues the Tech Lead marked as conflicting never run at the same time.
- Every PR still goes through the Test Engineer, the Reviewer and CI. More agents means more output, not lower standards.
- The CEO sets a cap, because each agent costs tokens.

## Rules against drift

1. **One source of truth.** Role definitions, skills and hooks live in one versioned plugin. Every project installs the same version. No private local copies.
2. **Enforce with tools, not prompts.** "Always do TDD" in a prompt drifts. A hook or CI check that fails without tests does not.
3. **Fresh context per role.** The Reviewer sees only the diff and the spec, never the Engineer's reasoning, like a human reviewer.
4. **Agents work only when there is work.** No "think every few seconds" loops. Agents start on an event: a new issue, a new PR, a failed CI run.

## Names in the product

- **Kopi Report:** the end-of-window standup report to the CEO. Agents take kopi breaks between issues.
- **Night Shift:** agents keep working on issues overnight, and the CEO reads the Kopi Report in the morning.
