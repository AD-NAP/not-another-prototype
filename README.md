# NAP: Not Another Prototype

An AI dev team for developers, with TDD, code review and CI built in. Ship production-ready work, not prototypes. You're the CEO.

> **Status:** early. Four roles work today: PM, Test Engineer, Engineer and Reviewer. The Tech Lead is next, see the [roadmap](docs/roadmap.md).

## The idea

Developers ship prototypes all the time. Most never reach production. AI makes it faster to build them, but without a shared process the quality drifts: one person installs a skill, another doesn't, and every project ends up different.

NAP is a Claude Code plugin that gives you a team of agents modelled on a big tech dev team, all following the same process:

| Role | What it does |
|---|---|
| PM | Turns your brief into GitHub issues with acceptance criteria |
| Tech Lead | Writes a short design and splits the work into tasks (next) |
| Test Engineer | Writes failing tests before any code exists |
| Engineer | Makes the tests pass, one issue per branch |
| Reviewer | Reviews each PR in a fresh context, read-only |

You brief the team, approve the big decisions, and a person approves every merge.

## What works today

| Command | Role | What it does |
|---|---|---|
| `/nap:backlog` | PM | Turns a brief into GitHub issues with testable acceptance criteria |
| `/nap:failing-tests` | Test Engineer | Writes failing tests from an issue, without reading the code |
| `/nap:make-tests-pass` | Engineer | Writes code until the tests pass, without editing the tests |
| `/nap:review` | Reviewer | Reviews a PR against its issue, read-only, and flags missing tests and changes outside the issue |

Lane hooks enforce the split: the Engineer can't edit tests, the Test Engineer can't read the code, and the Reviewer can't write. The hooks have their own unit tests.

NAP is built by NAP: the PM writes the issues, the Test Engineer and Engineer build each one test-first, and the Reviewer reviews the PR.

**Evals.** On 11 cases for the PM and Test Engineer (5 runs each, Sonnet agent, Opus judge), NAP scored 1.00 on every case. Plain Claude scored 0.47 to 1.00, so NAP was clearly better (a gap of 0.2 or more) on 7 cases and tied on 4. These ran before later skill changes and need a rerun. Details in [plugin/evals](plugin/evals/README.md).

## How it fits together

| Folder | Layer | Status |
|---|---|---|
| `plugin/` | **The team.** Skills, agents and hooks for Claude Code. Works on its own. | Started |
| `runner/` | **The runner.** Runs the team in the background with the Claude Agent SDK. | Not started |
| `office/` | **The office.** A pixel-art office where you watch the team and make the calls. | Not started |

More in the docs: [design](docs/design.md), [decisions](docs/decisions.md), [roadmap](docs/roadmap.md).

## Install the plugin

Early and changing fast, but it installs:

```
/plugin marketplace add AD-NAP/not-another-prototype
/plugin install nap@not-another-prototype
```

## Built on

NAP plans to build on [Superpowers](https://github.com/obra/superpowers) for brainstorming, planning, worktrees and debugging, and add the team on top.
