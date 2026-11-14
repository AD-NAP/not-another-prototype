# Roadmap

Start small. Add only what a real project run shows is missing. The earlier 17-step roadmap is in git history at tag `nap--v0.1.0`.

| # | Step | What it delivers | Status |
|---|---|---|---|
| 1 | **Simplify** | Four roles, no hooks, event log, evals or runner ([decision 1](decisions.md#1-a-simple-team-of-four-2026-11-14)). | Done |
| 2 | **Learn from others** | Bring the best parts of existing skills into the four roles ([skill-research.md](skill-research.md)). Only what a real failure asked for: the Reviewer runs the tests, and `/nap-fix` fixes findings on the same PR. The rest waits for step 3. | Done, proven on `nap-sprint-test` PR #9 |
| 3 | **Run it** | Take a real project from brief to merged PRs with the four roles. List the blockers. | Done 14-11-2026 on `nap-sprint-test` (#6 to #9) |
| 4 | **Fix blockers** | Fix what step 3 found, one at a time. Add a role only if a blocker needs one. | Next |

## Blockers from the step 3 run

The run on `nap-sprint-test`, 14-11-2026. Fixed means the second loop (#8, #9) ran with no refused command in any role.

- **Chained commands were refused** in the PM, Tech Lead and Engineer. Fixed: a Gotchas line in each role with Bash.
- **The PM could not create issues.** Its `allowed-tools` lacked the `gh` write commands. Fixed.
- **Posts after approval asked again.** A skill's `allowed-tools` did not carry over to later turns (seen in headless runs). Fixed: the README's Install section now gives an allow list.
- **The Tech Lead read no issue.** Without a terminal, `gh issue view --comments` prints only the comments. Fixed: it reads with `--json`, like the Engineer and Reviewer.
- **Open: the Engineer works in the user's checkout.** Two builds at once would clash.
- **Open: "outside the design" catches private helpers.** On PR #9 the Reviewer flagged two small helpers, and the fix inlined them into a harder-to-read `main`. The check may need to cover public names only.

From the 13-11-2026 run, checked in step 3: `/nap-fix` and the Reviewer's test run work. Design tasks with no test and the PM drafting too much did not happen.
