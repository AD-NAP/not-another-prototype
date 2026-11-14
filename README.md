# NAP: Not Another Prototype

A small AI dev team for developers, with issues first, TDD and code review. Ship production-ready work, not prototypes.

> **Status: early, being simplified.** NAP was cut back to four roles on 14-11-2026 ([decision 31](docs/decisions.md#31-back-to-a-simple-team-of-four-2026-11-14)). The slimmed loop has not run on a real project yet. See the [roadmap](docs/roadmap.md).

## The idea

AI makes it faster to build, but without a shared process the quality drifts: one person installs a skill, another doesn't, and every project ends up different.

NAP is a set of Claude Code skills and agents that gives you a team of agents modelled on a real dev team, each with the skills its role needs. You brief the team, approve the design, and merge every PR yourself.

## The team

| Command | Role | What it does |
|---|---|---|
| `/nap-backlog` | PM | Turns a brief into GitHub issues with testable acceptance criteria |
| `/nap-design` | Tech Lead | Posts a short feature design on the issue after you approve it |
| `/nap-build` | Engineer | Builds one issue test-first in a fresh context and opens a PR |
| `/nap-review` | Reviewer | Reviews a PR against its issue and design in a fresh context |

More roles (UX Designer, Platform, QA) get added when a real project needs them.

## Known limits

- You run one command per role.
- No command fixes review findings yet, and the Reviewer reads the tests but doesn't run them.
- All agents use your GitHub account. GitHub won't let you approve your own PR, so the Reviewer posts its verdict as a comment review.

## Install

You need [Claude Code](https://code.claude.com), `git`, and the [GitHub CLI](https://cli.github.com) (`gh`) signed in to your account.

NAP is plain files, with no plugin to install. Clone this repo, then copy `skills/` and `agents/` into `~/.claude/` to use the team in every project, or into one project's `.claude/` folder to use it there.

## Principles

1. **For developers.** NAP is a team for one person and a way to keep AI code to real engineering standards. It does not replace developers.
2. **A person approves every merge.** Agents propose, people decide.
3. **All the work is visible.** Every issue, design, test and review is something a person can read.
4. **Honest limits.** Talking to users, product judgement, ethics and accountability stay with people.

## Docs

- [Design](docs/design.md): the roles and the loop.
- [Decisions](docs/decisions.md): what was decided and why.
- [Roadmap](docs/roadmap.md): what is next.
- [Skill research](docs/skill-research.md): other people's skills worth learning from.
- [Changelog](CHANGELOG.md) and [third-party notices](THIRD_PARTY_NOTICES.md).

## License

MIT. See [LICENSE](LICENSE).
