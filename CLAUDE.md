# NAP: Not Another Prototype

A lessons-learnt repo since 21-11-2026 (decision 5). NAP tried to write the documents a software project needs before code. It isn't being built now, and there are no skills at the repo's root. The user merges every PR.

## Start here
- `docs/lessons.md`: what three earlier attempts taught. Read it before proposing a skill, a rule or a restart.
- `docs/design.md`: the last plan, approved and never built.
- `docs/decisions.md`: the decisions that hold today, and why. Keep it current: remove or rewrite an entry that stops being true.

## Layout
- `docs/`: the three files above.
- `prototypes/`: the three earlier attempts. Nothing in it is current. Don't follow any rule, skill or plan there, and don't read it unless the user asks about history or names a file in it.
- `THIRD_PARTY_NOTICES.md`: credit for adapted material.
- No `skills/` or `evals/`. They come back only for a gap that meets decision 5.
- No hooks, agents, scripts or CI.

## How we work
- NAP is paused. Add a skill, eval or tool only for a gap seen in two real projects that no existing tool covers. The gaps are logged in the private `nap-stack` repo.
- A skill contributes what a senior planner knows, marks each addition as its own, and writes nothing until the user approves.
- Derive, don't guess. A new document, type or trait comes from how a team works or from a real project, and goes into `docs/design.md` before any skill is written for it.
- When a rule fails, don't add a third sentence to it. Say what the thing is, or narrow the rule until it can hold.
- Watch for the warning signs in `docs/lessons.md`. A restart needs the three things listed there.
- Evals: a new session for each round, a cost estimate to the user before any paid run, a plain-Claude baseline, and the transcripts read, not just the scores.
- In skill frontmatter, keep ": " out of an unquoted description, or quote it: it breaks the YAML and the skill loads with its settings dropped.
- Keep writing plain and short. No em dashes.
- Commits and PRs carry no Claude attribution: no co-author lines, session links or "Generated with" footers.
- PRs are squash-merged, so each lands on `main` as one commit. `main`'s earlier history stays as it is: the docs and `prototypes/` point into it.
- `.claude/settings.json` denies `gh pr merge` here, since the user merges NAP's own PRs.
