# Roadmap

Start small. Add only what a real project run shows is missing. The earlier 17-step roadmap is in git history at tag `nap--v0.1.0`.

| # | Step | What it delivers | Status |
|---|---|---|---|
| 1 | **Simplify** | Four roles, no hooks, event log, evals or runner ([decision 1](decisions.md#1-a-simple-team-of-four-2026-11-14)). | Done |
| 2 | **Learn from others** | Bring the best parts of existing skills into the four roles ([skill-research.md](skill-research.md)). Only what a real failure asked for: the Reviewer runs the tests, and `/nap-fix` fixes findings on the same PR. The rest waits for step 3. | Done, not yet proven in a run |
| 3 | **Run it** | Take a real project from brief to merged PRs with the four roles. List the blockers. | Next |
| 4 | **Fix blockers** | Fix what step 3 found, one at a time. Add a role only if a blocker needs one. | |

## Known gaps from the first loop run

Carried over from the run on 13-11-2026. Check each in step 3 before fixing it.

- No command fixes review findings on the same PR. Addressed by `/nap-fix`, to check.
- The Reviewer reads the tests but doesn't run them. Addressed, to check.
- Design tasks with no test can drop out.
- The PM can ask too much and draft more than asked.
- Chained shell commands cause permission prompts.
