# NAP: Not Another Prototype

Plans a project before code, the way a team with good practice would. `/nap-start` works out what kind of project it is and which documents it needs. Then one skill per document writes them: a brief, a PRD, a tech plan and a backlog. Local files only, written after the user approves. Building is up to the user. The team version (a Personal Assistant, Engineer, Reviewer and finish line check) is parked at tag `nap--v0.2.0` (`docs/decisions.md#1-nap-writes-the-documents-before-code-2026-11-20`). The user merges every PR.

## Start here
- `docs/design.md`: the types, traits, documents and skills.
- `docs/decisions.md`: the decisions that hold today, and why. Keep it current: remove or rewrite an entry that stops being true.
- `docs/roadmap.md`: the phases, and what is next.
- `docs/skill-writing.md`: how we write and test skills. Follow its checklists when editing one.
- `docs/skill-research.md`: other people's skills worth learning from.
- `evals/README.md`: how to write and run a skill's tests.

## Layout
- `skills/nap-<name>/SKILL.md`: `/nap-start`, then one skill per document, named after it. Commands read like `/nap-prd`.
- `evals/<skill>/<case>/`: each skill's test cases, for `claude plugin eval`.
- `.claude-plugin/plugin.json`: only so the evals can load the skills. To use NAP, copy `skills/` into `~/.claude/` or a project's `.claude/`.
- No hooks, agents, scripts or CI.

## How we work
- Keep it simple. Add a skill, rule or document only when a real project shows it is needed.
- Tests before skills. Write a skill's eval cases first, run a few without the skill, and write only what fixes what went wrong (`docs/decisions.md#4-tests-before-skills-2026-11-20`).
- A skill is done when its cases pass at 3 runs, it beats plain Claude, and one real use writes a document the user keeps.
- In skill frontmatter, keep ": " out of an unquoted description, or quote it: it breaks the YAML and the skill loads with its settings dropped.
- Keep writing plain and short. No em dashes.
- Commits and PRs carry no Claude attribution: no co-author lines, session links or "Generated with" footers.
- `.claude/settings.json` denies `gh pr merge` here, since the user merges NAP's own PRs.
