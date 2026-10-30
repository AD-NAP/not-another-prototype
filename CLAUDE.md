# NAP: Not Another Prototype

An AI dev team for developers: PM, Tech Lead, Test Engineer, Engineer and Reviewer, all following one process (issues first, TDD, review, CI). The CEO (the user) briefs the team and watches it work in a pixel-art office.

## Layout
One repo, three layers. Each layer works without the ones above it.

- `plugin/`: **the team.** A Claude Code plugin named `nap`, so commands read like `/nap:pm`.
  - `plugin/.claude-plugin/plugin.json`: the plugin manifest.
  - `plugin/skills/<name>/SKILL.md`: one skill per role, the role's procedure.
  - `plugin/agents/<name>.md`: subagents for roles that need a fresh context (Test Engineer, Engineer, Reviewer).
  - `plugin/hooks/hooks.json`: shared rules. Plugin subagents ignore hooks in their own files, so all hooks go here.
- `runner/`: **the runner.** Not started. A Claude Agent SDK app that loads the plugin and runs agents in the background.
- `office/`: **the office.** Not started. The pixel-art web app the CEO uses.
- `.claude-plugin/marketplace.json`: makes the repo a marketplace, so people can install just the plugin.

## How we work
- Build in small increments. Each one should work on its own.
- Every skill and agent change needs a way to check it works, such as an eval case or a test project run.
- Run `claude plugin validate .` (the marketplace) and `claude plugin validate plugin` before committing.
- Keep writing plain and short. No em dashes.
