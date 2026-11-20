# Skill research

Other people's skills worth learning from. Researched 2026-11-14 for the team version's four roles, and trimmed the same day. The full survey of 15 roles is in git history at tag `nap--v0.1.0`.

> Since 20-11-2026 NAP writes the documents before code ([decision 1](decisions.md#1-nap-writes-the-documents-before-code-2026-11-20)). The PM and Architect sections now feed `/nap-prd`, `/nap-architecture` and `/nap-backlog`. The Engineer and Reviewer sections are parked with those roles at tag `nap--v0.2.0`. [Where to start](#where-to-start) maps the sources to the new skills.

## How this was checked

- **Sources.** obra/superpowers, mattpocock/skills, github/spec-kit and bmad-code-org/BMAD-METHOD (read from local clones), plus Anthropic's `claude-plugins-official`, read through the GitHub API.
- **Licenses.** Read from each repo's LICENSE file or the GitHub license endpoint.
- **Contents.** "Read" means the file was opened. "Survey" means the claim comes from an earlier pass and the file was not re-opened. Read every "Survey" file in full before adapting it.
- **Safety.** Nothing was installed or run. No instructions in third-party files were followed.

All of these are sources, not dependencies ([decision 5](decisions.md#5-mit-license-and-other-projects-are-sources-2026-11-14)). Adapt the ideas into NAP's own words and credit them in `THIRD_PARTY_NOTICES.md`.

---

## PM (`/nap-backlog`)

| Candidate | What it does | License |
|---|---|---|
| [mattpocock `to-tickets`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/to-tickets) | Breaks a plan into tracer-bullet vertical slices. Each ticket lists the tickets that block it and is sized to fit one fresh context window. The user approves the breakdown. Read. | MIT |
| [mattpocock `triage/AGENT-BRIEF.md`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/triage) | Durable agent brief: behaviour and contracts, no file paths or line numbers. Survey. | MIT |
| [spec-kit `clarify.md`](https://github.com/github/spec-kit/tree/HEAD/templates/commands) | Bounded clarification: at most 5 targeted questions, answers written back into the spec. Survey. | MIT |

What ours already does well: one question at a time, Given/When/Then with a required edge case, a banned-words list for untestable criteria, "what and why, never how", and nothing reaches GitHub before approval.

What theirs does that ours does not:
- **Blocking edges.** `to-tickets` records which tickets block which. Ours only writes "Depends on".
- **Wide refactors.** `to-tickets` has an expand, migrate, contract sequence for a change that cannot be sliced. Ours has no answer for that.
- **Prefactor first.** "Make the change easy, then make the easy change."
- **Context-sized slices.** A slice should fit one fresh context window. A useful second check beside S and M.
- **Bounded questions.** `clarify` caps the questions and writes the answers back. Ours can ask too much (issue #44).

---

## Tech Lead (`/nap-design`), now the Architect

The team version replaced the Tech Lead with the Architect, whose job is now `/nap-architecture`. The ADR sources below apply there. The per-issue ideas (seams, plans) have no skill to go in for now.

| Candidate | What it does | License |
|---|---|---|
| [mattpocock `tdd`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/tdd) (seams section) | Test only at agreed seams. Before any test, write the seams down, with a note on what each catches and misses. Read. | MIT |
| [mattpocock `codebase-design`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/codebase-design) (DESIGN-IT-TWICE) | Several parallel agents propose different interfaces. Survey. | MIT |
| [superpowers `writing-plans`](https://github.com/obra/superpowers/tree/HEAD/skills/writing-plans) | Tasks list files, what they consume and produce, and a run command with expected output. A plan longer than the code is a defect. Survey. | MIT |
| [mattpocock `ADR-FORMAT.md`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering) | Very short ADRs, 1 to 3 sentences. Survey. | MIT |
| [adr/madr `template/`](https://github.com/adr/madr/tree/HEAD/template) | Minimal and full ADR templates. | MIT OR CC0-1.0 |

What ours already does well: stops if criteria are untestable, one-screen design, tasks tied to criteria, approval before posting, a flag for big decisions.

What theirs does that ours does not:
- **Seams.** Name the public boundaries the tests will use, and what each misses. Ours lists "names the code will use", which is close. This also helps with design tasks that end up with no test (issues #34, #35).
- **Alternatives.** Compare two approaches. Costs tokens, so only when an issue touches several parts.
- **Consumes and produces.** What each task takes and returns.
- **ADR format.** Ours flags a big decision but has no format for recording it.

---

## Engineer (`/nap-build`, `nap-engineer`)

| Candidate | What it does | License |
|---|---|---|
| [mattpocock `tdd`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/tdd) (`SKILL.md`, `tests.md`, `mocking.md`) | What a good test is: behaviour through public interfaces. Names anti-patterns: implementation-coupled, tautological, horizontal slicing. One failing test, then one pass. Read. | MIT |
| [superpowers `test-driven-development`](https://github.com/obra/superpowers/tree/HEAD/skills/test-driven-development) | Single-agent TDD as an iron law. Not read in full. It was set aside when NAP had a separate Test Engineer, and fits now. | MIT |
| [superpowers `implementer-prompt.md`](https://github.com/obra/superpowers/tree/HEAD/skills/subagent-driven-development) | Implementer writes details to a report file and returns under 15 lines with a status: DONE, DONE_WITH_CONCERNS, BLOCKED or NEEDS_CONTEXT. Read. | MIT |
| [superpowers `verification-before-completion`](https://github.com/obra/superpowers/tree/HEAD/skills/verification-before-completion) | No success claim without fresh command output. Survey. | MIT |
| [mattpocock `implement`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/implement) | Typecheck often, run single test files often, full suite once at the end, commit, then call code review. Read. | MIT |

What ours already does well: failing tests before code, one test per criterion, a check that tests fail for the right reason, full suite required, honest "not run" rules.

What theirs does that ours does not:
- **Named anti-patterns.** Tautological tests (the expected value worked out the way the code does it) and implementation-coupled mocks. `mocking.md` is a small file worth adapting.
- **Independent source of truth.** Expected values come from a literal, a worked example or the spec.
- **One test at a time.** Ours writes all the tests for an issue, then the code. Theirs goes one failing test, one pass.
- **Clear statuses.** Ours reports "done, or stopped". Theirs has four fixed statuses.
- **Evidence.** The command and its result in the report, from this run, never from memory.
- **Cap on retries** for a test that keeps failing.

---

## Reviewer (`/nap-review`, `nap-reviewer`)

| Candidate | What it does | License |
|---|---|---|
| [official `code-review` plugin](https://github.com/anthropics/claude-plugins-official/tree/HEAD/plugins/code-review) | Parallel review agents, then a validation agent per finding. Only validated, high-signal findings are reported. Survey. | Apache-2.0 |
| [official `pr-review-toolkit`](https://github.com/anthropics/claude-plugins-official/tree/HEAD/plugins/pr-review-toolkit) | Six agents. The useful two: `pr-test-analyzer` (do tests cover behaviour?) and `silent-failure-hunter`. Survey. | Apache-2.0 |
| [mattpocock `code-review`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/code-review) | Two axes in fresh sub-agents: Standards (documented rules plus a smell baseline) and Spec (what the issue asked). Read. | MIT |
| [superpowers `task-reviewer-prompt.md`](https://github.com/obra/superpowers/tree/HEAD/skills/subagent-driven-development) | Spec verdict first, then Critical, Important, Minor with file and line. Says to distrust the implementer's report. Read. | MIT |
| [superpowers `fix-loop.md`](https://github.com/obra/superpowers/tree/HEAD/skills/subagent-driven-development/references) | Fixing review findings: one round is one fix plus one scoped re-review, with a round cap. The re-review gives ADDRESSED or NOT ADDRESSED per finding and looks only at the fix diff. Read. | MIT |
| [superpowers `receiving-code-review`](https://github.com/obra/superpowers/tree/HEAD/skills/receiving-code-review) | Clarify unclear items first, fix one at a time, push back with evidence when a finding is wrong. Survey. | MIT |

What ours already does well: read-only, never sees the Engineer's reasoning, reads `CLAUDE.md` from the base branch so a PR cannot excuse itself, per-criterion table with file and line, flags code outside the issue and the design, flags missing tests, posts one review.

What theirs does that ours does not:
- **Runs the tests** and **a fix loop**: both added 2026-11-14 (issues #43, #37).
- **Validate each finding** before reporting it.
- **Test quality.** Partly added 2026-11-14: each criterion needs a test that would fail if it broke. Theirs also rates how critical each gap is.
- **Standards pass.** Ours checks criteria, tests, scope and design, but not code quality.
- **Severity buckets.** Critical, Important, Minor.

---

## Documents to add later

Only when a real project needs them ([roadmap](roadmap.md#later-by-need)).

| Document | Where to start | License |
|---|---|---|
| UX flows (`/nap-ux`) | [mastepanoski](https://github.com/mastepanoski/claude-skills/tree/HEAD/skills) heuristics, cognitive walkthrough and WCAG audit. Nothing found does user flows and wireframes from a brief. | MIT |
| Operations and setup | [dwmkerr `project-setup`](https://github.com/dwmkerr/claude-toolkit/tree/HEAD/plugins/dwmkerr/skills/project-setup) for repo setup and branch protection with `gh`. No safe ready-made check for "code changed without tests" was found. | MIT |

---

## Rules for adapting

- Read the LICENSE in the plugin or skill folder, not only the one at the repo root. In `claude-plugins-official`, `code-review` and `pr-review-toolkit` are Apache-2.0, but `claude-security` is all rights reserved.
- Apache-2.0 sources need their notice kept and changed files marked.
- Never use the BMad name. BMAD's code is MIT but the name is a trademark.
- Superpowers beside NAP: its session-start hook injects text into every session, and its `brainstorming` skill fires on the same requests as `/nap-start`. Run NAP's skills by name. The evals load NAP alone, so they don't see the clash.
- Do not copy from share-alike or non-commercial sources.

## Where to start

One source per phase of the [roadmap](roadmap.md), on top of the team version's own skill.

1. **`/nap-start`:** [superpowers `brainstorming`](https://github.com/obra/superpowers/tree/HEAD/skills/brainstorming) (MIT). Look before you ask, one open question about the biggest gap, play the idea back, mark your own proposals, and a fresh builder check. Read in full 2026-11-20.
2. **`/nap-prd`:** spec-kit `clarify` for a cap on questions, with the answers written back into the document.
3. **`/nap-architecture`:** mattpocock `ADR-FORMAT.md` and the adr/madr templates, for short ADRs.
4. **`/nap-backlog`:** mattpocock `to-tickets`, for blocking edges and slices that fit one fresh context.

Parked with the team version: the Engineer and Reviewer sources above, and the fix loop.
