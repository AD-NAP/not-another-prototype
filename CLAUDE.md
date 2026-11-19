# NAP: Not Another Prototype

An AI planning team for developers, as plain Claude Code skills and agents. A Personal Assistant runs the PM and Architect to turn an idea into a PRD, architecture, versions and issues, and holds each version to a finish line. Building is pluggable: the Engineer and Reviewer are one optional way to build, and are frozen (`docs/decisions.md#14-nap-plans-and-enforces-the-finish-line-and-building-is-pluggable-2026-11-19`). The user merges every PR.

## Start here
- `docs/design.md`: the roles and the loop.
- `docs/decisions.md`: the decisions that hold today, and why. Keep it current: remove or rewrite an entry that stops being true.
- `docs/roadmap.md`: what is next.
- `docs/finish-line.md`: the gates each version must pass, by scope. Built for Personal tool and App.
- `docs/skill-writing.md`: how we write and refine skills and agents. Follow its checklists when editing one.
- `docs/skill-research.md`: other people's skills worth learning from, per role.

## Layout
- `skills/nap-<name>/SKILL.md`: one skill per job. Commands read like `/nap-build`.
- `agents/nap-<name>.md`: subagents for roles that need a fresh context (Engineer, Reviewer).
- No plugin, hooks or CI. To use the team, copy `skills/` and `agents/` into `~/.claude/` or a project's `.claude/`.
- `skills/nap-finish-line/finish_line.py`: the one script, the finish line check. Python standard library only, Python 3.10+. Its tests are in `tests/`: run `py -m unittest discover tests` and keep them green. Change a gate in the script, its tests and `docs/finish-line.md` together.

## How we work
- Keep it simple. Add a role, rule or tool only when a real project run shows it is needed.
- Check a skill or agent change by running it on a real project.
- In skill and agent frontmatter, keep ": " out of an unquoted description, or quote it: it breaks the YAML and the agent loads with its settings dropped.
- Keep writing plain and short. No em dashes.
- Commits and PRs carry no Claude attribution: no co-author lines, session links or "Generated with" footers.
