# NAP milestone 1 todo

Written 2026-11-14. This list breaks milestone 1 (roadmap steps 6 to 11, plus the fixes from the first full loop run) into phases. Each phase ends in a release. Tick a box when its output exists. The step order and scope are in [roadmap.md](roadmap.md).

Each todo names who does it. H, S, O and F are the Claude model for the session: Haiku, Sonnet, Opus, Fable. "CEO" means a person runs it.

## Release map

| Phase | Goal | Version | Stage |
|---|---|---|---|
| 0 | Baseline: license, first release, CI, spikes | v0.1.0 | pre-MVP |
| 1 | The loop runs without hand patches | v0.2.0 | pre-MVP |
| 2 | The loop is complete | v0.3.0 | pre-MVP |
| 3 | Role template and event log contract v1 | v0.4.0 | pre-MVP |
| 4 | Step 6: sprint ceremonies | v0.5.0 | pre-MVP |
| 5 | Step 7: proof | v0.6.0 | pre-MVP |
| 6 | Step 8: Sprint 0 product | v0.7.0 | pre-MVP |
| 7 | Step 9: Sprint 0 architecture | v0.8.0 | pre-MVP |
| 8 | Step 10: Sprint 0 platform | v0.9.0 | pre-MVP |
| 9 | Step 11: UX Designer, then release | **v1.0.0** | **MVP, end of milestone 1** |

- **MVP is v1.0.0**, at the end of phase 9. It is the MVP that decision 12 refers to.
- Before v1.0.0: evals are 1-run checks with the plugin only.
- After v1.0.0: 10-run evals with a plain-Claude baseline, then milestone 2 (Chief of Staff, runner, headcount, the office in its own repo).
- Event log contract v1 is frozen at v0.4.0. The office repo can start reading it from then.

## Phase 0: baseline (v0.1.0)

- [ ] 0.1 Record the decisions of 2026-11-14 in `docs/decisions.md`, and confirm Superpowers as a source not a dependency (O drafts, CEO approves)
- [ ] 0.2 Add LICENSE (MIT), THIRD_PARTY_NOTICES.md, CHANGELOG.md. Add `license` and `homepage` to `plugin.json`. Set version 0.1.0 (H)
- [ ] 0.3 CI workflow: hook unit tests, and `claude plugin validate --strict` if the CLI runs in CI (S)
- [ ] 0.4 Protect `main` (PR and CI required). Commit a deny rule for `gh pr merge` (S, CEO applies)
- [ ] 0.5 README refresh: true status, prerequisites, "for developers" wording, no claim without evidence (S)
- [ ] 0.6 Tidy docs: roadmap step 5 cell, private repo name, decision 13 count, remove `office/` placeholder, vault note (H)
- [ ] 0.7 Issue hygiene through `/nap:backlog`: split #45 and #38, fold #39 to #42, fix #40, open the new issues (S)
- [ ] 0.8 Spike A: `isolation: worktree` on Windows (S, CEO runs)
- [ ] 0.9 Spike B: `context: fork` with a plugin agent (S, CEO runs)
- [ ] 0.10 Spike C: project allow rules inside a NAP subagent (S, CEO runs)
- [ ] 0.11 Spike D: what the eval result and trace really record (H)
- [ ] 0.12 Tag `nap--v0.1.0` and confirm the test project updates (H, CEO runs)

Done when: LICENSE and tag exist, a PR that breaks a hook test fails CI, `main` is protected, the README is true, each spike has a result, and phase 1 and 2 issues exist.

## Phase 1: the loop runs without hand patches (v0.2.0)

- [ ] 1.1 Evals first: cases for #33, #36, #38, #45. Fix wrong-reason graders. Correct the evals README (S)
- [ ] 1.2 Run the 7 design cases and re-run stale cases, one role per sitting (H runs, S reads failures)
- [ ] 1.3 Result block in the three agents. Entry skills read it (S)
- [ ] 1.4 `events.mjs` logs the outcome from the result block (#39, #42) (S)
- [ ] 1.5 Test handoff (#33): Test Engineer commits and pushes tests to `issue-N` (S)
- [ ] 1.6 Engineer uses `isolation: worktree` and `--body-file` (#45) (O designs, S builds)
- [ ] 1.7 Structural delegation for `/nap:make-tests-pass` (#36) (O)
- [ ] 1.8 Fix `allowed-tools` for `backlog` and `design`. Single commands everywhere (#38) (S)
- [ ] 1.9 Write `docs/project-settings.md` and commit the settings file in the test project (#38) (S)
- [ ] 1.10 Lane hooks: deny only what is certain, log guesses, better test detection, `if` filters (O designs, S builds)
- [ ] 1.11 Loop smoke run 1 on the test project (CEO runs, H reads logs)
- [ ] 1.12 Release v0.2.0 (H)

Done when: a smoke run reaches an open PR with zero permission denials and zero hand patches, the Engineer's worktree has the tests, the event log outcomes are right, and the four touched roles score 1.00 on a 1-run check.

## Phase 2: the loop is complete (v0.3.0)

- [ ] 2.1 Evals first: cases for #37, #43, #34, #35, #44 (S)
- [ ] 2.2 Reviewer runs tests (#43) (O designs, S builds)
- [ ] 2.3 Reviewer format: spec verdict, then findings by severity, each one checked (S)
- [ ] 2.4 New `/nap:fix-review` with a 3-round cap (#37) (O designs, S builds)
- [ ] 2.5 No-test tasks handled by every role. Test seams in the design (#34, #35) (O designs, S builds)
- [ ] 2.6 PM asks less and drafts only what was asked (#44) (S)
- [ ] 2.7 Token pass: reference files, one approval for labels, trigger-only descriptions (S)
- [ ] 2.8 Close the certain lane holes. Log a missing `agent_type` (S)
- [ ] 2.9 Re-score all eight components against the checklist (S)
- [ ] 2.10 Loop smoke run 2: brief to merge with one fix round (CEO runs, H reads logs)
- [ ] 2.11 Release v0.3.0. Update the roadmap (H)

Done when: a smoke run goes from brief to merged PR with one fix round and zero hand patches, the Reviewer reports a test result, and every role passes checklist items 1 to 15 and scores 1.00.

## Phase 3: role template and event log contract v1 (v0.4.0)

- [ ] 3.1 Design event log contract v1 (F)
- [ ] 3.2 Write `docs/event-log.md`, the JSON Schema and samples (S)
- [ ] 3.3 Implement v1 in `events.mjs` with contract tests (#40, #41) (S)
- [ ] 3.4 Write the role template and `templates/` folder (O)
- [ ] 3.5 One shared source for the "not fired" graders, with a sync check (S)
- [ ] 3.6 Prove the template with a throwaway role (S)
- [ ] 3.7 Add CONTRIBUTING.md and SECURITY.md (H)
- [ ] 3.8 Release v0.4.0 (H)

Done when: a throwaway role built from the template passes in one window, the contract doc and schema are published, and an example reader pairs every start and finish in the smoke run log.

## Phase 4: step 6, sprint ceremonies (v0.5.0)

- [ ] 4.1 Record the ceremony decisions: milestones, size points, report location (O drafts, CEO approves)
- [ ] 4.2 Issues and designs for the four skills and the script (S)
- [ ] 4.3 Velocity and sprint data script with tests (S)
- [ ] 4.4 `/nap:sprint-plan` (S)
- [ ] 4.5 `/nap:kopi-report` (S)
- [ ] 4.6 `/nap:sprint-review` (S)
- [ ] 4.7 `/nap:retro` (S)
- [ ] 4.8 Run one real sprint with all four (CEO runs, H reads logs)
- [ ] 4.9 Release v0.5.0 (H)

Done when: the four skills score 1.00, the velocity script matches a hand count, and one real sprint runs through all four with zero permission denials.

## Phase 5: step 7, proof (v0.6.0)

- [ ] 5.1 Define metrics and method (O)
- [ ] 5.2 Metrics script with tests (S)
- [ ] 5.3 Sprints 2 and 3 on the test project, pinned to a release (CEO runs)
- [ ] 5.4 Baseline: plain Claude on 3 matched issues (CEO runs, S compares)
- [ ] 5.5 Full 1-run eval sweep, one role per sitting (H)
- [ ] 5.6 Write the README evidence section and method doc (O)
- [ ] 5.7 Fix what the sprints broke (S)
- [ ] 5.8 Release v0.6.0 (H)

Done when: two measured sprints and the eval scores are in the README, with the method and its limits stated.

## Phase 6: step 8, Sprint 0 product (v0.7.0)

- [ ] 6.1 Record decisions. Issues and designs (O drafts, S issues)
- [ ] 6.2 `/nap:vision` (S)
- [ ] 6.3 `/nap:prd` (S)
- [ ] 6.4 `/nap:story-map`, handing the first slice to `/nap:backlog` (S)
- [ ] 6.5 Trial on a new idea, brief to backlog (CEO runs)
- [ ] 6.6 Release v0.7.0 (H)

Done when: the three skills score 1.00, each asks at most 5 questions, and a story map slice becomes issues with no retyping.

## Phase 7: step 9, Sprint 0 architecture (v0.8.0)

- [ ] 7.1 Record decisions. Issues and designs (O)
- [ ] 7.2 `/nap:architecture` (S)
- [ ] 7.3 `/nap:adr` (S)
- [ ] 7.4 `nap:architect` subagent and entry skill, with lane tests (O designs, S builds)
- [ ] 7.5 Wire the `ready` gate in `/nap:design` (S)
- [ ] 7.6 Trial: architecture for the phase 6 idea, one flagged design (CEO runs)
- [ ] 7.7 Release v0.8.0 (H)

Done when: the skills and agent score 1.00, and a flagged design cannot be labelled `ready` before the Architect's check.

## Phase 8: step 10, Sprint 0 platform (v0.9.0)

- [ ] 8.1 Record decisions. Reword #10. Issues and designs (O)
- [ ] 8.2 CI gate script and workflow template with tests (#10) (S)
- [ ] 8.3 `/nap:setup` with a dry run (O designs, S builds)
- [ ] 8.4 Pinning docs: pin, update, roll back (S)
- [ ] 8.5 Second project from scratch: Sprint 0, setup, one sprint (CEO runs, H reads logs)
- [ ] 8.6 Fix what the second project broke (S)
- [ ] 8.7 Release v0.9.0 (H)

Done when: `/nap:setup` configures a new project after one approval, the CI gate fails a code-only PR, and a second project runs a full sprint on a pinned version with zero permission denials.

## Phase 9: step 11, UX Designer, then v1.0.0 (MVP)

- [ ] 9.1 Record decisions. Issues and designs (O)
- [ ] 9.2 `nap:ux-designer` agent and entry skill, with lane tests (O designs, S builds)
- [ ] 9.3 UX check before `ready` (S)
- [ ] 9.4 Trial on one UI issue in the second project (CEO runs)
- [ ] 9.5 Final checklist score and full eval sweep (S scores, H runs)
- [ ] 9.6 Final sprint on the second project. Update README evidence (CEO runs, O writes)
- [ ] 9.7 Milestone review: what milestone 2 inherits (F)
- [ ] 9.8 Release **v1.0.0, the MVP** (H)

Done when: every role scores 1.00, a full sprint on the second project has zero denials and zero hand patches, the event log contract is unchanged or bumped with a reason, and every checklist item is met.
