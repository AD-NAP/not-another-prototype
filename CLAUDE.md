# NAP: Not Another Prototype

A small AI dev team for developers, as plain Claude Code skills and agents. Four roles: PM, Tech Lead, Engineer, Reviewer. Issues first, TDD, review. The user merges every PR.

## Start here
- `docs/design.md`: the roles and the loop.
- `docs/decisions.md`: big decisions and why. Decision 31 says which older ones are retired.
- `docs/roadmap.md`: what is next.
- `docs/skill-research.md`: other people's skills worth learning from, per role.

## Layout
- `skills/nap-<name>/SKILL.md`: one skill per job. Commands read like `/nap-build`.
- `agents/nap-<name>.md`: subagents for roles that need a fresh context (Engineer, Reviewer).
- No plugin, hooks or CI. To use the team, copy `skills/` and `agents/` into `~/.claude/` or a project's `.claude/`.

## How we work
- Keep it simple. Add a role, rule or tool only when a real project run shows it is needed.
- Check a skill or agent change by running it on a real project.
- In skill and agent frontmatter, keep ": " out of an unquoted description, or quote it: it breaks the YAML and the agent loads with its settings dropped.
- Keep writing plain and short. No em dashes.
- Commits and PRs carry no Claude attribution: no co-author lines, session links or "Generated with" footers.
