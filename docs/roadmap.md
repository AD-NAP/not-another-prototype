# Roadmap

Start small. Add only what a real project run shows is missing. The earlier 17-step roadmap is in git history at tag `nap--v0.1.0`.

| # | Step | What it delivers | Status |
|---|---|---|---|
| 1 | **Simplify** | Four roles, no hooks, event log, evals or runner ([decision 1](decisions.md#1-a-simple-team-of-four-2026-11-14)). | Done |
| 2 | **Learn from others** | Bring the best parts of existing skills into the four roles ([skill-research.md](skill-research.md)). Only what a real failure asked for: the Reviewer runs the tests, and `/nap-fix` fixes findings on the same PR. The rest waits for step 3. | Done, proven on `nap-sprint-test` PR #9 |
| 3 | **Run it** | Take a real project from brief to merged PRs with the four roles. List the blockers. | Done 14-11-2026 on `nap-sprint-test` (#6 to #9) |
| 4 | **Fix blockers** | Fix what step 3 found, one at a time. Add a role only if a blocker needs one. The Tech Lead was replaced by the Architect ([decision 10](decisions.md#10-an-architect-instead-of-a-per-issue-tech-lead-2026-11-14)). | Done 14-11-2026 |
| 5 | **Personal Assistant** | A `/nap-pa` skill that runs the whole loop from your plans and goals: Architect, PM, then build, review and fix for each group of related issues. It stops for your approvals: the architecture, each issue batch, big decisions and each merge. Chosen 14-11-2026: you merge as you go, and the PA waits for each merge before the next build. | Built 14-11-2026 ([decision 12](decisions.md#12-a-personal-assistant-runs-the-loop-2026-11-14)). Checked: it hands off to the Architect and keeps the Architect's questions going across turns. |
| 6 | **New project** | Run a brand-new project through the PA, from brief to merged PRs. Check whether CI, deploy and UI need their own roles, whether grouped builds work, and whether the README's allow list stops permission prompts in an interactive session. | Next |

## Blockers from the step 3 run

The run on `nap-sprint-test`, 14-11-2026. Fixed means the second loop (#8, #9) ran with no refused command in any role.

- **Chained commands were refused** in the PM, Tech Lead and Engineer. Fixed: a Gotchas line in each role with Bash.
- **The PM could not create issues.** Its `allowed-tools` lacked the `gh` write commands. Fixed.
- **Posts after approval asked again.** A skill's `allowed-tools` only lasts for the turn it starts in. Fixed: the README's Install section now gives an allow list.
- **The Tech Lead read no issue.** Without a terminal, `gh issue view --comments` prints only the comments. Fixed: it reads with `--json`, like the Engineer and Reviewer.
- **Open: the Engineer works in the user's checkout.** Two builds at once would clash. The PA runs one build at a time, so this waits until parallel builds are needed.
- **"Outside the design" caught private helpers.** On PR #9 the Reviewer flagged two small helpers, and the fix inlined them into a harder-to-read `main`. Fixed: per-issue designs are gone, and the Reviewer checks the project rules and ADRs instead.

From the 13-11-2026 run, checked in step 3: `/nap-fix` and the Reviewer's test run work. Design tasks with no test and the PM drafting too much did not happen.
