# NAP: Not Another Prototype

A small AI dev team for developers, with issues first, TDD and code review. Ship production-ready work, not prototypes.

> **Status: early, being simplified.** NAP was cut back to four roles on 14-11-2026 ([decision 1](docs/decisions.md#1-a-simple-team-of-four-2026-11-14)). The loop ran end to end on a test project, fix round included. The Architect, which replaced the Tech Lead ([decision 10](docs/decisions.md#10-an-architect-instead-of-a-per-issue-tech-lead-2026-11-14)), has not run on a real project yet. See the [roadmap](docs/roadmap.md).

## The idea

AI makes it faster to build, but without a shared process the quality drifts: one person installs a skill, another doesn't, and every project ends up different.

NAP is a set of Claude Code skills and agents that gives you a team of agents modelled on a real dev team, each with the skills its role needs. You brief the team, approve the architecture and the issues, and merge every PR yourself.

## The team

| Command | Role | What it does |
|---|---|---|
| `/nap-pa` | Personal Assistant | Runs the whole loop for you from your plans and goals. Calls each role in order and stops only for your answers, approvals and merges. Say "merged" or "continue" to pick up again. |
| `/nap-architect` | Architect | Once per project: records the goal, recommends a stack, and writes the architecture, ADRs and project rules after you approve. Again for any big decision. |
| `/nap-backlog` | PM | Turns the goal or a brief into GitHub issues with testable acceptance criteria |
| `/nap-build` | Engineer | Builds one issue, or a few related ones, test-first in a fresh context and opens one PR |
| `/nap-review` | Reviewer | Reviews a PR against its issue, the project rules and the ADRs in a fresh context, and runs the tests |
| `/nap-fix` | Engineer | Fixes the findings from a review on the same PR, up to three rounds |

More roles (UX Designer, Platform, QA) get added when a real project needs them.

## Known limits

- `/nap-pa` runs one build at a time, and waits for you to merge each PR before the next.
- The Reviewer only runs the tests when your checkout is on the PR's branch. It never switches branches itself.
- All agents use your GitHub account. GitHub won't let you approve your own PR, so the Reviewer posts its verdict as a comment review.

## Install

You need [Claude Code](https://code.claude.com), `git`, and the [GitHub CLI](https://cli.github.com) (`gh`) signed in to your account.

NAP is plain files, with no plugin to install. Clone this repo, then copy `skills/` and `agents/` into `~/.claude/` to use the team in every project, or into one project's `.claude/` folder to use it there.

Then allow the commands the roles run after you approve, in the project's `.claude/settings.json` (or `~/.claude/settings.json`). In our runs a skill's `allowed-tools` did not carry over to later turns, and the Architect and PM write on a later turn, after your yes. Without this list, every post asks again.

```json
{
  "permissions": {
    "allow": [
      "Bash(gh issue view *)",
      "Bash(gh issue create *)",
      "Bash(gh issue edit *)",
      "Bash(gh issue comment *)",
      "Bash(gh label create *)",
      "Bash(git switch *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(git push *)",
      "Bash(gh pr create *)",
      "Bash(gh issue list *)",
      "Bash(gh pr list *)",
      "Bash(gh pr view *)",
      "Bash(git status *)",
      "Bash(git pull *)",
      "Bash(git fetch *)",
      "Bash(git rev-parse *)",
      "Skill(nap-architect)",
      "Skill(nap-backlog)",
      "Skill(nap-build)",
      "Skill(nap-review)",
      "Skill(nap-fix)"
    ],
    "deny": ["Bash(gh pr merge *)"]
  }
}
```

The `git` and `gh pr` lines let the Architect open its docs PR and the PA move between branches, and the Engineer use them too. The `Skill` lines let the PA start each role on a later turn, such as after you say "merged", without asking.

Claude Code only uses a project's allow rules once you have trusted the folder: open Claude Code there interactively once and accept the trust dialog. Trusting a parent folder doesn't count, and `claude -p` never shows the dialog, so in an untrusted folder it skips the rules with a warning. The Engineer and the Reviewer will still ask before running your tests and reviewing. Allow the ones you trust them with.

## Principles

1. **For developers.** NAP is a team for one person and a way to keep AI code to real engineering standards. It does not replace developers.
2. **A person approves every merge.** Agents propose, people decide.
3. **All the work is visible.** Every issue, design, test and review is something a person can read.
4. **Honest limits.** Talking to users, product judgement, ethics and accountability stay with people.

## Docs

- [Design](docs/design.md): the roles and the loop.
- [Decisions](docs/decisions.md): what was decided and why.
- [Roadmap](docs/roadmap.md): what is next.
- [Skill writing](docs/skill-writing.md): how the skills and agents are written and refined.
- [Skill research](docs/skill-research.md): other people's skills worth learning from.
- [Third-party notices](THIRD_PARTY_NOTICES.md).

## License

MIT. See [LICENSE](LICENSE).
