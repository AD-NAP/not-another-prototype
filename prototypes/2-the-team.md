# 2. The team

14-11 to 20-11-2026. The second NAP: the plugin cut back to plain skill and agent files, then grown into a team that took a brief all the way to merged pull requests.

## What it was

- **Planning:** `/nap-vision` asked the scope and wrote a PRD with versions and GitHub milestones. `/nap-architect` wrote the architecture, decision records and project rules. `/nap-backlog` wrote the issues.
- **Building:** an Engineer agent built test-first (`/nap-build`), a Reviewer agent reviewed the pull request (`/nap-review`), and `/nap-fix` fixed the findings on the same pull request.
- **Running it:** a Personal Assistant (`/nap-pa`) ran the whole loop and stopped for approval.
- **The finish line:** a script that checked each version's gates before its milestone closed.

At its last commit it had 29 files, 8 skills, 2 agents and 14 decisions. It was run on three test projects.

## How it ended

Reset on 20-11-2026. The planning half passed every run. The build half did not: in the last full run every blocker came from building, mostly from the environment, such as commit trailers, self-approval on GitHub and Windows paths. Each test was a full run that took hours. Decision 1 of attempt 3 gives the full reason, and its roadmap lists the blockers from each run.

## Where to find it

| | Link | With git |
|---|---|---|
| The files, at its last commit | Commit [`b18d3e3`](https://github.com/AD-NAP/not-another-prototype/tree/b18d3e387d11bd11d90fe8032c339003b7479b35) | `git checkout b18d3e3` |
| Its history, 45 commits | [Compare the reset with its last commit](https://github.com/AD-NAP/not-another-prototype/compare/510ea5d443307b06873a6ec022bcd5f4bf67b343...b18d3e387d11bd11d90fe8032c339003b7479b35) | `git log 510ea5d..b18d3e3` |
| The reset that started it | [`510ea5d`](https://github.com/AD-NAP/not-another-prototype/commit/510ea5d443307b06873a6ec022bcd5f4bf67b343), 14-11-2026 | `git show 510ea5d` |
| Its roadmap, with the blockers from each run | [`docs/roadmap.md` at the commit](https://github.com/AD-NAP/not-another-prototype/blob/b18d3e387d11bd11d90fe8032c339003b7479b35/docs/roadmap.md) | `git show b18d3e3:docs/roadmap.md` |
| Why it was parked | [Decision 1 of attempt 3](3-the-note-taker/docs/decisions.md) | |

To use it, check out the commit and follow its README.

What it taught is in [docs/lessons.md](../docs/lessons.md).
