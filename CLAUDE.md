# NAP: Not Another Prototype

A Claude Code plugin that gives developers an AI dev team: PM, Tech Lead, Test Engineer, Engineer and Reviewer, all following one process (issues first, TDD, review, CI).

## Layout
- `.claude-plugin/plugin.json`: the plugin manifest. The plugin is named `nap`, so commands read like `/nap:pm`.
- `skills/<name>/SKILL.md`: one skill per role, the role's procedure.
- `agents/<name>.md`: subagents for roles that need a fresh context (Test Engineer, Engineer, Reviewer).
- `hooks/hooks.json`: shared rules. Plugin subagents ignore hooks in their own files, so all hooks go here.

## How we work
- Build in small increments. Each one should work on its own.
- Every skill and agent change needs a way to check it works, such as an eval case or a test project run.
- Run `claude plugin validate .` before committing.
- Keep writing plain and short. No em dashes.
