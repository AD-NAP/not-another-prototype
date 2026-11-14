# NAP milestone 1 todo

Written 2026-11-14, reduced the same day (see [decisions 18 to 22](decisions.md#18-the-mvp-is-the-loop-setup-a-chief-of-staff-skill-and-proof-2026-11-14)). This list breaks milestone 1 (roadmap steps 6 to 9) into phases. Each phase ends in a release. Tick a box when its output exists. The step order and scope are in [roadmap.md](roadmap.md). Third-party sources to adapt, with licenses, are in [skill-research.md](skill-research.md).

Each todo names who does it. H, S, O and F are the Claude model for the session: Haiku, Sonnet, Opus, Fable. "CEO" means a person runs it.

## What the MVP is

At v1.0.0 the CEO can:

1. Run `/nap:setup` once in a new project.
2. Give a brief to `/nap:backlog` and approve the issues.
3. Run `/nap:run <issue>` or `/nap:run next`. The Chief of Staff skill takes the issue through design, failing tests, code, review and fix rounds.

The CEO decides twice per issue: approve the design, and merge the PR. Everything else runs without a command.

Not in the MVP: sprint ceremonies, the vision brief, PRD and story map, the Architect, the UX Designer, the role template, the full event log contract, the runner, headcount and the office.

## Release map

| Phase | Goal | Roadmap step | Version |
|---|---|---|---|
| 0 | Baseline: license, first release, CI, spikes | 6 | v0.1.0 |
| 1 | The loop runs without hand patches | 6 | v0.2.0 |
| 2 | The loop is complete | 6 | v0.3.0 |
| 3 | Platform: `/nap:setup`, CI gate, the `kopi` project | 7 | v0.4.0 |
| 4 | Chief of Staff skill: `/nap:run` | 8 | v0.5.0 |
| 5 | Proof on `kopi`, then release | 9 | **v1.0.0, the MVP** |

- **MVP is v1.0.0**, at the end of phase 5. It is the MVP that decision 12 refers to.
- Before v1.0.0: evals are 1-run checks with the plugin only.
- After v1.0.0: 10-run evals with a plain-Claude baseline, then roadmap steps 10 onward.
- **The proof project is `kopi`:** a small TypeScript CLI that reads a repo's issues, milestones and PRs through `gh`, plus `.nap/events.jsonl`, and prints velocity, time from `ready` to merge, review rounds and what is blocked. It is built from scratch by NAP in phases 3 to 5, and it produces the numbers for phase 5.

## Phase 0: baseline (v0.1.0)

- [x] 0.1 Record the other decisions of 2026-11-14 (decisions 18 to 22 were approved that day) in `docs/decisions.md`: MIT license, release policy (semver, `nap--vX.Y.Z` tags, CHANGELOG), the office moves to its own repo, hooks stay minimal, evals stay inside the plugin, Superpowers is a source and not a dependency (O drafts, CEO approves)
- [x] 0.2 Add LICENSE (MIT), THIRD_PARTY_NOTICES.md, CHANGELOG.md. Add `license` and `homepage` to `plugin.json`. Set version 0.1.0 (H)
- [x] 0.3 CI workflow: hook unit tests, and `claude plugin validate --strict` if the CLI runs in CI (S)
- [x] 0.4 Protect `main` (PR and CI required). Commit a deny rule for `gh pr merge` (S, CEO applies)
- [x] 0.5 README refresh: true status, prerequisites, "for developers" wording, no claim without evidence (S)
- [x] 0.6 Tidy docs: shorten the roadmap step 5 cell, private repo name, decision 13 count, remove `office/` placeholder, vault note (H)
- [x] 0.7 Issue hygiene through `/nap:backlog`: split #45 and #38, fold #39 to #42, fix #40, open the new issues (S)
- [x] 0.8 Spike A: `isolation: worktree` on Windows (S, CEO runs)
- [x] 0.9 Spike B: `context: fork` with a plugin agent (S, CEO runs)
- [x] 0.10 Spike C: project allow rules inside a NAP subagent (S, CEO runs)
- [x] 0.11 Spike D: what the eval result and trace really record (H)
- [ ] 0.12 Tag `nap--v0.1.0` and confirm the test project updates (H, CEO runs)

Do the four spikes first. They decide whether phase 1's design holds. Cap each at 30 minutes and write "unknown" if it is.

Done when: LICENSE and tag exist, a PR that breaks a hook test fails CI, `main` is protected, the README is true, each spike has a result, and phase 1 and 2 issues exist.

## Phase 1: the loop runs without hand patches (v0.2.0)

- [ ] 1.1 Evals first: cases for #33, #36, #38, #45. Fix wrong-reason graders. Correct the evals README (S)
- [ ] 1.2 Run the 7 design cases and re-run stale cases, one role per sitting (H runs, S reads failures)
- [ ] 1.3 Result block in the three agents: status (DONE, DONE_WITH_CONCERNS, BLOCKED, NEEDS_CONTEXT), issue, PR, branch, commit, test command and result. Entry skills read it (S)
- [ ] 1.4 `events.mjs` logs the outcome from the result block (#39, #42) (S)
- [ ] 1.5 Test handoff (#33): Test Engineer commits and pushes tests to `issue-N` (S)
- [ ] 1.6 Engineer uses `isolation: worktree` and `--body-file` (#45) (O designs, S builds)
- [ ] 1.7 Structural delegation for `/nap:make-tests-pass` (#36) (O)
- [ ] 1.8 Fix `allowed-tools` for `backlog` and `design`. Single commands everywhere (#38) (S)
- [ ] 1.9 Write `docs/project-settings.md` and commit the settings file in the test project (#38) (S)
- [ ] 1.10 Lane hooks: deny only what is certain, log guesses, better test detection, `if` filters (O designs, S builds)
- [ ] 1.11 Loop smoke run 1 on the test project. Note the usage one issue takes (CEO runs, H reads logs)
- [ ] 1.12 Release v0.2.0 (H)

Done when: a smoke run reaches an open PR with zero permission denials and zero hand patches, the Engineer's worktree has the tests, the event log outcomes are right, and the four touched roles score 1.00 on a 1-run check.

Stop rule: if smoke run 1 still needs hand patches, do not start phase 2. Read the transcript and simplify the design first.

## Phase 2: the loop is complete (v0.3.0)

- [ ] 2.1 Evals first: cases for #37, #43, #34, #35, #44 (S)
- [ ] 2.2 Reviewer runs tests (#43) (O designs, S builds)
- [ ] 2.3 Reviewer format: spec verdict, then findings by severity, each one checked before it is reported (S)
- [ ] 2.4 Reviewer posts its review without a CEO step: the project's allow rules include `gh pr review` (decision 20) (S)
- [ ] 2.5 New `/nap:fix-review` with a 3-round cap and a per-finding verdict (#37) (O designs, S builds)
- [ ] 2.6 No-test tasks handled by every role. Test seams in the design (#34, #35) (O designs, S builds)
- [ ] 2.7 PM asks less and drafts only what was asked (#44) (S)
- [ ] 2.8 Token pass: reference files, one approval for labels, trigger-only descriptions (S)
- [ ] 2.9 Close the certain lane holes. Log a missing `agent_type` (S)
- [ ] 2.10 Re-score all eight components against the checklist (S)
- [ ] 2.11 Loop smoke run 2: brief to merge with one fix round. Note the usage (CEO runs, H reads logs)
- [ ] 2.12 Release v0.3.0. Update the roadmap (H)

Done when: a smoke run goes from brief to merged PR with one fix round and zero hand patches, the Reviewer reports a test result and posts on its own, and all five roles score 1.00 on a 1-run check.

## Phase 3: platform (v0.4.0)

- [ ] 3.1 Record decisions: supported stacks (Python with pytest, Node with `node --test` or vitest), the CI gate rule and its `no-tests-needed` label, how a project pins the plugin. Reword #10. Issues and designs (O)
- [ ] 3.2 CI gate script and workflow template with tests (#10). It always runs and always reports. Actions pinned to SHAs (S)
- [ ] 3.3 `/nap:setup` with a dry run that shows every file and rule first: project `.claude/settings.json` (allow rules, deny `gh pr merge`), labels, the CI workflow, branch protection (O designs, S builds)
- [ ] 3.4 Pinning docs: pin, update, roll back (S)
- [ ] 3.5 Create `kopi` from an empty folder. Run `/nap:setup`. Write its first backlog with `/nap:backlog`. Take one issue through the loop by hand (CEO runs, H reads logs)
- [ ] 3.6 Fix what `kopi` broke (S)
- [ ] 3.7 Release v0.4.0 (H)

Done when: `/nap:setup` configures `kopi` after one approval, the CI gate fails a code-only PR and passes a docs-only PR, and one `kopi` issue reaches a merged PR with zero permission denials and no edit inside the plugin folder.

## Phase 4: Chief of Staff skill (v0.5.0)

- [ ] 4.1 Record the design of `/nap:run`: a table that maps what GitHub shows (design comment, `ready` label, test branch, open PR, latest review) to the next role, so a fresh session resumes where the last one stopped. Issue and design (O)
- [ ] 4.2 `/nap:backlog` records "blocked by" links between issues, so the picking rule can read them (S)
- [ ] 4.3 Evals first: fires, does not fire, resumes from a half-done issue, and a scored check that fails if code appears without the Engineer agent (S)
- [ ] 4.4 `/nap:run <issue>`: design and wait for approval, then failing tests, code, review, and fix rounds up to 3. Stops on BLOCKED or NEEDS_CONTEXT and says why. Never merges (O designs, S builds)
- [ ] 4.5 `/nap:run next`: take the top `ready` issue that neither conflicts with nor is blocked by an open PR. Continue to the next one. Stop at 3 open PRs waiting for the CEO, or when nothing qualifies. No stacked PRs (decision 22) (S)
- [ ] 4.6 End-of-run report, under 15 lines: ready to merge, blocked and why, needs the CEO (S)
- [ ] 4.7 Smoke run on `kopi`: two issues with `/nap:run next`, one of them interrupted and resumed in a new session. Note the usage per issue (CEO runs, H reads logs)
- [ ] 4.8 Release v0.5.0 (H)

Done when: `/nap:run next` takes two `kopi` issues to merge-ready PRs with only the design approvals from the CEO, an interrupted run resumes without repeating finished steps, and the delegation eval scores 1.00.

Stop rule: if one issue does not fit in one 5-hour window, or the session runs out of context, split `/nap:run` so each role runs in its own session and only the next-step table is shared.

## Phase 5: proof, then v1.0.0 (MVP)

- [ ] 5.1 Define metrics and method: tests written, review findings by severity, fix rounds, velocity in size points, permission prompts, time from `ready` to merge, and how often the CEO overrules the Reviewer (O)
- [ ] 5.2 Sprints 1 and 2 on `kopi` with `/nap:run`, pinned to a released version. `kopi` prints its own metrics by the end of sprint 1 (CEO runs)
- [ ] 5.3 Baseline: plain Claude on 3 matched issues (CEO runs, S compares)
- [ ] 5.4 Full 1-run eval sweep, one role per sitting, not in the same week as a sprint (H)
- [ ] 5.5 Fix what the sprints broke (S)
- [ ] 5.6 Write the README evidence section and method doc, with sample sizes and limits stated (O)
- [ ] 5.7 Milestone review: what the next steps inherit, open risks, and whether the Reviewer has earned the sprint branch (decision 21) (F)
- [ ] 5.8 Release **v1.0.0, the MVP** (H)

Done when: two measured sprints on `kopi` and the eval scores are in the README with the method and its limits, the final sprint has zero permission denials and zero hand patches, and every role scores 1.00.

## After the MVP

In roadmap order: sprint ceremonies (step 10), Sprint 0 product (11), Sprint 0 architecture (12), UX Designer (13), then the runner (14) with the sprint branch, stacked PRs and the Reviewer's own GitHub account. The role template and event log contract v1 come before step 10, since new roles and the office both need them.
