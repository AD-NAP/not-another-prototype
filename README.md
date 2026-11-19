# NAP: Not Another Prototype

An AI planning team for developers. Talk to one agent, and it turns your idea into a PRD, an architecture, a roadmap of versions and the issues for each. Then it holds each version to a finish line, so you ship a real application, not another prototype.

> **Status: early.** On 19-11-2026 NAP changed direction ([decision 14](docs/decisions.md#14-nap-plans-and-enforces-the-finish-line-and-building-is-pluggable-2026-11-19)): it plans the work and enforces the finish line of each version, and building is pluggable. The planning half passed its last run on a test project; the finish-line gates are next. See the [roadmap](docs/roadmap.md).

## The idea

AI makes it faster to build, but without a shared process the quality drifts: one person installs a skill, another doesn't, and every project ends up different.

NAP does the work a team with good practice does before the code. You discuss the problem with one agent, the Personal Assistant, and it calls a PM and an Architect to write the PRD, the architecture, the ADRs, the versions (v0.1, v1.0 and later) and the issues for the current version. Build the issues however you like: with NAP's own Engineer and Reviewer, with another tool, or by hand. At the end of each version, NAP checks its finish line (for example tests, CI, deploy and the docs due) and keeps the version open until it passes. The finish-line check is being built ([roadmap](docs/roadmap.md) steps 9 and 10). You approve the plan and merge every PR yourself.

## The team

| Command | Role | What it does |
|---|---|---|
| `/nap-pa` | Personal Assistant | Runs the whole loop for you from your plans and goals. Calls each role in order and stops only for your answers, approvals and merges. Say "merge it" to have it merge an approved PR, or "merged" or "continue" to pick up again. |
| `/nap-vision` | PM | Once per project: asks how big it is, then refines the idea into versions (v0.1, v1.0 and later) and agrees which documents the project needs and when. Writes `docs/PRD.md` and a GitHub milestone per version after you approve. |
| `/nap-architect` | Architect | Once per project: records the goal, recommends a stack, and writes the architecture, ADRs and project rules after you approve. Again for any big decision. |
| `/nap-backlog` | PM | Turns one version's features, or a new idea, into GitHub issues with testable acceptance criteria, in that version's milestone |
| `/nap-build` | Engineer | Builds one issue, or a few related ones, test-first in a fresh context and opens one PR |
| `/nap-review` | Reviewer | Reviews a PR against its issue, the project rules and the ADRs in a fresh context, and runs the tests |
| `/nap-fix` | Engineer | Fixes the findings from a review on the same PR, up to three rounds |
| `/nap-finish-line` | Finish line check | At the end of each version: runs a script that checks the version's gates (tests, CI, checked PRs, docs due, deploy and more, by scope), asks you to sign off the ones that need judgement, and keeps the version open until it passes. `setup` adds NAP's files to `.gitignore`. |

`/nap-build`, `/nap-review` and `/nap-fix` are one optional way to build. They are frozen: they get fixes only when they stop a version from reaching its finish line ([decision 14](docs/decisions.md#14-nap-plans-and-enforces-the-finish-line-and-building-is-pluggable-2026-11-19)). More roles (UX Designer, Platform, QA) get added when a real project needs them.

## Known limits

- `/nap-pa` runs one build at a time, and waits for each PR to be merged before the next. It merges only when you say "merge it" for that PR, and Claude Code asks you to confirm.
- The Reviewer only runs the tests when your checkout is on the PR's branch. It never switches branches itself.
- All agents use your GitHub account. GitHub won't let you approve your own PR, so the Reviewer posts its verdict as a comment review.

## Install

You need [Claude Code](https://code.claude.com), `git`, and the [GitHub CLI](https://cli.github.com) (`gh`) signed in to your account. For `/nap-finish-line` you also need Python 3.10 or later.

NAP is plain files, with no plugin to install. Clone this repo, then copy `skills/` and `agents/` into `~/.claude/` to use the team in every project, or into one project's `.claude/` folder to use it there.

Then allow the commands the roles run after you approve, in the project's `.claude/settings.json` (or `~/.claude/settings.json`). A skill's `allowed-tools` only lasts for the turn it starts in, and the Architect, PM and PA act on a later turn, after your yes. Without this list, every post asks again.

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
      "Bash(gh pr checks *)",
      "Bash(gh api repos/{owner}/{repo}/milestones *)",
      "Bash(gh api -X PATCH repos/{owner}/{repo}/milestones/*)",
      "Bash(git status *)",
      "Bash(git pull *)",
      "Bash(git fetch *)",
      "Bash(git rev-parse *)",
      "Skill(nap-vision)",
      "Skill(nap-architect)",
      "Skill(nap-backlog)",
      "Skill(nap-build)",
      "Skill(nap-review)",
      "Skill(nap-fix)",
      "Skill(nap-finish-line)",
      "Bash(py *finish_line.py *)",
      "Bash(python3 *finish_line.py *)"
    ],
    "ask": ["Bash(gh pr merge *)"]
  }
}
```

The `git` and `gh pr` lines let the Architect open its docs PR and the PA move between branches, and the Engineer use them too. The `Skill` lines let the PA start each role on a later turn, such as after you say "merged", without asking. The `ask` line makes Claude Code confirm every merge, even one you asked the PA to run.

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
- [Finish line](docs/finish-line.md): the gates a version must pass, by scope. Built for Personal tool and App.
- [Skill writing](docs/skill-writing.md): how the skills and agents are written and refined.
- [Skill research](docs/skill-research.md): other people's skills worth learning from.
- [Third-party notices](THIRD_PARTY_NOTICES.md).

## License

MIT. See [LICENSE](LICENSE).
