# NAP: Not Another Prototype

A small AI dev team for developers, as a Claude Code plugin. Four roles: PM, Tech Lead, Engineer, Reviewer. Issues first, TDD, review. The user merges every PR.

## Start here
- `docs/design.md`: the roles and the loop.
- `docs/decisions.md`: big decisions and why. Decision 31 says which older ones are retired.
- `docs/roadmap.md`: what is next.
- `docs/skill-research.md`: other people's skills worth learning from, per role.

## Layout
- `plugin/`: a Claude Code plugin named `nap`, so commands read like `/nap:build`.
  - `plugin/.claude-plugin/plugin.json`: the plugin manifest.
  - `plugin/skills/<name>/SKILL.md`: one skill per job.
  - `plugin/agents/<name>.md`: subagents for roles that need a fresh context (Engineer, Reviewer).
- `.claude-plugin/marketplace.json`: makes the repo a marketplace, so people can install the plugin.

## How we work
- Keep it simple. Add a role, rule or tool only when a real project run shows it is needed.
- Check a skill or agent change by running it on a real project.
- Run `claude plugin validate .` and `claude plugin validate plugin` before committing. In skill and agent frontmatter, keep ": " out of an unquoted description, or quote it: it breaks the YAML and the agent loads with its settings dropped.
- Keep writing plain and short. No em dashes.
- Commits and PRs carry no Claude attribution: no co-author lines, session links or "Generated with" footers.
