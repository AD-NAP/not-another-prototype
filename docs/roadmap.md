# Roadmap

Start small. Each step works on its own and can be shown, so the project is never stuck half done.

The sprint loop comes before Sprint 0. The sprint loop is what turns plans into working software, and NAP can use it on itself right away, because NAP's own foundational docs already exist (this folder). Sprint 0 roles follow once the loop works.

| # | Step | What it delivers | Status |
|---|---|---|---|
| 1 | **Learn** | Try existing tools. Superpowers is kept and built on (see [decision 2](decisions.md#2-build-on-superpowers-2026-10-30)). | Done |
| 2 | **PM: sprint backlog** | A PM skill turns a short brief into GitHub issues with testable acceptance criteria and a priority label. The user approves them first. Its first job: NAP's own issues for step 3 (see [decision 8](decisions.md#8-step-2-scope-github-issues-dogfooded-on-nap-2026-10-30)). | **Done:** `/nap:backlog` dogfooded on NAP (issues #2 to #4 for step 3, fixed after review). 6 eval cases run against a no-plugin baseline, 5 runs each (see [decision 9](decisions.md#9-how-we-run-evals-2026-10-31)): with 1.00, without 0.74, mean Δ +0.26. Ties with plain Claude on splitting large briefs, asking before drafting, and not firing on a general question. Baseline scores vary between runs by up to 0.2 per case. |
| 3 | **TDD pair** | The Test Engineer writes failing tests for one issue. The Engineer makes them pass. CI fails without tests. | **In progress:** Test Engineer done (#2): the `nap:test-engineer` agent, started by `/nap:failing-tests` (see [decision 10](decisions.md#10-subagent-roles-get-an-entry-skill-2026-10-31)). 5 eval cases, 5 runs each: with 1.00, without 0.80, mean Δ +0.20. Plain Claude ties on not firing for a general question and nearly ties on testing the issue instead of pasted code. Without the plugin, plain Claude's tests import the missing module at the top, so the whole file errors instead of each test failing. The load helpers were narrowed later so they only report "Not implemented yet" when the code under test is missing, and let real errors show. Engineer done (#3, PR #13): the `nap:engineer` agent, started by `/nap:make-tests-pass`. 4 eval cases, checked with 1 run (see [decision 12](decisions.md#12-one-run-evals-until-the-mvp-2026-11-01)): with 1.00 on all four. Hooks done (#4): `plugin/hooks/lanes.mjs` blocks the Engineer from editing tests and the Test Engineer from reading or editing code (see [decision 13](decisions.md#13-lane-hooks-match-the-agent-and-stay-best-effort-in-the-shell-2026-11-01)), with 16 unit tests. Next: the CI check for missing tests (#10). |
| 4 | **Reviewer** | Reviews the PR in a fresh context. The user still approves the merge. | |
| 5 | **Tech Lead** | Adds a feature design, task split and `ready` and conflict labels before the tests. The full sprint loop runs on one project, with the event log. | |
| 6 | **Sprint ceremonies** | Sprint planning, the Kopi Report, sprint review and retro, and velocity. | |
| 7 | **Proof** | Run real sprints and measure the results: tests, review findings, rework, velocity. This becomes the README's main evidence. | |
| 8 | **Sprint 0: product** | PM skills for the vision brief, the PRD and the story map. | |
| 9 | **Sprint 0: architecture** | The Architect: architecture doc, stack choice, ADRs, and checking feature designs that touch the architecture. | |
| 10 | **Sprint 0: platform** | A setup skill: repo layout, standards, test framework, CI and the walking skeleton. Package everything as one versioned plugin and use it on a second project from scratch. | |
| 11 | **UX Designer** | User flows for projects with a UI. | |
| 12 | **Chief of Staff and runner** | The runner in `runner/` runs the sprints, picks the next issue in code, and writes the Kopi Report. The user's gates move up to the CEO level. | |
| 13 | **Headcount** | More than one Engineer on separate issues at the same time. | |
| 14 | **Office** | The pixel office in `office/`, reading the event log. | |
| 15 | **CEO controls** | Brief, approve, set headcount and read the Kopi Report from inside the office. | |

## Open questions

- Where agents run on their own: GitHub Actions, Claude cloud sessions, or the user's machine.
- Budget: a token cap per project or per agent.
- How velocity is measured: issues per window, or something closer to token cost.

## After the MVP

- **Measure every role.** Run each role's evals 10 times, with and without the plugin, and refine the skills and agents from the per-case Δ (see [decision 12](decisions.md#12-one-run-evals-until-the-mvp-2026-11-01)). The PM and Test Engineer scores are from 5-run evals before that decision; the Engineer has a 1-run check only.
