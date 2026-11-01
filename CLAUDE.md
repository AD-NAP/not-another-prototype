# NAP: Not Another Prototype

An AI dev team for developers, working in agile sprints. Sprint 0 roles (PM, UX Designer, Architect, Platform) create the foundational docs. Sprint roles (PM, Tech Lead, Test Engineer, Engineer, Reviewer) build, with issues first, TDD, review and CI. The CEO (the user) briefs the team and watches it work in a pixel-art office.

## Start here
- `docs/design.md`: how NAP works (roles, workflow, gates, headcount, rules).
- `docs/decisions.md`: big decisions and why. Add a new entry for a new decision.
- `docs/roadmap.md`: the build steps and which one is next. Update its status column when a step is done.

## Layout
One repo, three layers. Each layer works without the ones above it.

- `plugin/`: **the team.** A Claude Code plugin named `nap`, so commands read like `/nap:pm`.
  - `plugin/.claude-plugin/plugin.json`: the plugin manifest.
  - `plugin/skills/<name>/SKILL.md`: skills, each doing one job for a role. A role can own several.
  - `plugin/agents/<name>.md`: subagents for roles that need a fresh context (Test Engineer, Engineer, Reviewer).
  - `plugin/hooks/hooks.json`: shared rules. Plugin subagents ignore hooks in their own files, so all hooks go here.
  - `plugin/evals/<case>/`: eval cases for `claude plugin eval plugin`. One folder per behaviour, with `prompt.md` and `graders/`. How to write and run them: `plugin/evals/README.md`.
- `runner/`: **the runner.** Not started. A Claude Agent SDK app that loads the plugin and runs agents in the background.
- `office/`: **the office.** Not started. The pixel-art web app the CEO uses.
- `.claude-plugin/marketplace.json`: makes the repo a marketplace, so people can install just the plugin.

## How we work
- Build in small increments. Each one should work on its own.
- Every skill and agent change needs a way to check it works, such as an eval case or a test project run. New eval cases follow `plugin/evals/README.md`.
- Run `claude plugin validate .` (the marketplace) and `claude plugin validate plugin` before committing. After a hook change, also run `node --test plugin/hooks/lanes.test.mjs`. In skill and agent frontmatter, keep ": " out of an unquoted description, or quote it: it breaks the YAML and the agent loads with its settings dropped.
- Keep writing plain and short. No em dashes.
- When work is ready, open a PR without being asked. Commits and PRs carry no Claude attribution: no co-author lines, session links or "Generated with" footers.
