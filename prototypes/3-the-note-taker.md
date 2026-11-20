# 3. The note-taker

20-11-2026. The third NAP: the documents before code, and nothing else.

## What it was

- **Two skills:** `/nap-start` worked out the project's type and wrote a one-page brief. `/nap-prd` planned the versions and wrote a PRD. Both wrote local files only, after a clear yes.
- **Two more were planned and never built:** `/nap-architecture` and `/nap-backlog`.
- **Tests first:** 17 eval cases, run against plain Claude.

## How it ended

Closed on 20-11-2026, the day it was built. Its skills were tuned to add little, because its tests rewarded restraint. Two real sessions showed the cost: on a real App, the PRD wrote down what the user said and little else. It had no versions between the first and the last, no quality targets and no risks, and it parked the project's biggest risk as an open question.

It was not all loss. Its interview mechanics and its eval method are what the next version starts from.

## Where to find it

| | Link | With git |
|---|---|---|
| The final files | [`3-the-note-taker/`](3-the-note-taker/), in this folder | |
| The files as they ran, at the repo's root | Commit [`6877e9d`](https://github.com/AD-NAP/not-another-prototype/tree/6877e9dbb9de95b9064ca434562bac97b6f4f28f) | `git checkout 6877e9d` |
| Its history on `main`, 35 commits | [Compare attempt 2's last commit with it](https://github.com/AD-NAP/not-another-prototype/compare/b18d3e387d11bd11d90fe8032c339003b7479b35...6877e9dbb9de95b9064ca434562bac97b6f4f28f) | `git log b18d3e3..6877e9d` |
| The analysis that came before the restart | [reference-analysis.md](3-the-note-taker/docs/reference-analysis.md) | |
| Its eval results | [roadmap.md](3-the-note-taker/docs/roadmap.md) | |

The folder holds four small commits made after `6877e9d`: two more sentences in `/nap-start` and their eval results.

What it taught is in [docs/lessons.md](../docs/lessons.md).
