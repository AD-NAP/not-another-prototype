# NAP: Not Another Prototype

An AI dev team for developers, with TDD, code review and CI built in. Ship production-ready work, not prototypes. You're the CEO.

> **Status:** early and private. Nothing works yet. This README is a placeholder.

## The idea

Developers ship prototypes all the time. Most never reach production. AI makes it faster to build them, but without a shared process the quality drifts: one person installs a skill, another doesn't, and every project ends up different.

NAP is a Claude Code plugin that gives you a team of agents modelled on a big tech dev team, all following the same process:

| Role | What it does |
|---|---|
| PM | Turns your brief into GitHub issues with acceptance criteria |
| Tech Lead | Writes a short design and splits the work into tasks |
| Test Engineer | Writes failing tests before any code exists |
| Engineer | Makes the tests pass, one issue per branch |
| Reviewer | Reviews each PR in a fresh context, read-only |

You brief the team, approve the big decisions, and a person approves every merge.

## How it fits together

| Folder | Layer | Status |
|---|---|---|
| `plugin/` | **The team.** Skills, agents and hooks for Claude Code. Works on its own. | Started |
| `runner/` | **The runner.** Runs the team in the background with the Claude Agent SDK. | Not started |
| `office/` | **The office.** A pixel-art office where you watch the team and make the calls. | Not started |

## Install the plugin

Once there is something to install:

```
/plugin marketplace add AD-NAP/not-another-prototype
/plugin install nap@not-another-prototype
```

## Built on

NAP plans to build on [Superpowers](https://github.com/obra/superpowers) for brainstorming, planning, worktrees and debugging, and add the team on top.
