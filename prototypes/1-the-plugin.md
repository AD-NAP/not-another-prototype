# 1. The plugin

30-10 to 14-11-2026. The first NAP: an AI dev team for one developer, packaged as a Claude Code plugin and released as version 0.1.0.

## What it was

- **Five roles:** a PM that wrote GitHub issues (`/nap:backlog`), a Test Engineer that wrote failing tests from an issue, an Engineer that made them pass and opened a pull request, a Reviewer, and a Tech Lead that wrote a design for each issue.
- **Enforcement by tools:** lane hooks that stopped the Engineer editing tests and the Test Engineer reading code, an event log written by a hook, and CI that ran the hook tests on Ubuntu and Windows.
- **Plans around it:** agile sprints, a Chief of Staff, and a pixel office to watch the team work.

At the tag it had 299 files, 268 of them eval files, and 30 recorded decisions.

## How it ended

Reset on 14-11-2026. The guardrails had grown faster than the team: five roles came with 30 decisions, dozens of eval cases, about 1,000 lines of hooks and a 10-phase plan, and the loop still needed hand patches. Decision 31 in the reset commit gives the full reason.

## Where to find it

| | Link | With git |
|---|---|---|
| The files, as released | Tag [`nap--v0.1.0`](https://github.com/AD-NAP/not-another-prototype/tree/nap--v0.1.0) | `git checkout nap--v0.1.0` |
| Its history, 82 commits | [Commits up to the tag](https://github.com/AD-NAP/not-another-prototype/commits/nap--v0.1.0) | `git log d5cba88..nap--v0.1.0` |
| The first commit | [`d5cba88`](https://github.com/AD-NAP/not-another-prototype/commit/d5cba88cda6f59b1a3e8bebbe8a6781b51d58d63), 30-10-2026 | `git show d5cba88` |
| The reset that ended it | [`510ea5d`](https://github.com/AD-NAP/not-another-prototype/commit/510ea5d443307b06873a6ec022bcd5f4bf67b343), 14-11-2026 | `git show 510ea5d` |
| Its decisions | [`docs/decisions.md` at the tag](https://github.com/AD-NAP/not-another-prototype/blob/nap--v0.1.0/docs/decisions.md) | `git show nap--v0.1.0:docs/decisions.md` |

What it taught is in [docs/lessons.md](../docs/lessons.md).
