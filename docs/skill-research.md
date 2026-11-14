# Skill research per role

Date: 2026-11-14.

## How this was done

Sources searched:
- github.com/anthropics/skills, claude-plugins-official, claude-plugins-community, knowledge-work-plugins
- obra/superpowers, mattpocock/skills, bmad-code-org/BMAD-METHOD, github/spec-kit (read from local clones kept outside this repo)
- wshobson/agents, alirezarezvani/claude-skills, mastepanoski/claude-skills, phuryn/pm-skills, product-on-purpose/pm-skills, Donchitos/Claude-Code-Game-Studios, navox-labs/agents, trailofbits/skills, and about 20 smaller repos
- GitHub search through web search, and skill catalog sites (skills.sh, skillselion, claudepluginhub and similar). Catalog pages were used only to find repo names. Nothing on a catalog page was trusted. Every repo below was then checked through the GitHub API.
- The earlier survey: section 4 of the first milestone 1 plan and findings C1 to C5. Both are kept outside this repo.

How things were checked:
- **Licenses.** "Verified (local)" means I read the LICENSE file in a local clone. "Verified (API)" means the GitHub license endpoint returned the repo's LICENSE file and its detected type. Where the API said NOASSERTION I read the file head myself and say what it is. "Unverified" means I could not read it.
- **Contents.** "Read" means I opened the file this session. "Survey" means the claim comes from the earlier findings and I did not re-open the file. "Path only" means I confirmed the file exists but did not read it.
- **Safety.** Nothing was installed, run or downloaded. Files were read as text through `gh api` and the local clones. No instructions in third-party files were followed.
- **Links.** All links point to GitHub folders or files whose path I confirmed in a repo tree listing or a local clone. I did not open the rendered web pages, so every link is "not opened in a browser". Links to `/tree/HEAD/` resolve to the default branch.

Recommendation key:
- **Copy as-is**: license permits it and the text fits NAP unchanged.
- **Adapt**: license permits reuse, but the text needs changes (NAP lanes, GitHub-only, short style).
- **Study and rewrite**: no license, restrictive license, share-alike, or poor fit. Read the ideas, write NAP's own words.

Note on "Copy as-is": almost nothing is copy as-is, because every NAP skill has its own lane rules, one-question style and approval gates. Where I write Adapt, the license is fine and only the fit is the issue. MIT and Apache-2.0 sources still need their notice kept in THIRD_PARTY_NOTICES (Apache also needs changed files marked).

---

## Role: PM, sprint backlog (`/nap:backlog`) **[Built]**

| Candidate | What it does | Match | License | Recommendation |
|---|---|---|---|---|
| [mattpocock `to-tickets`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/to-tickets) | Breaks a plan into tracer-bullet vertical slices. Each ticket lists the tickets that block it, is sized to fit one fresh context window, and the user approves the breakdown before publishing. Read. | Direct match | MIT (Verified, local) | **Adapt** |
| [mattpocock `triage/AGENT-BRIEF.md`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/triage) | Durable agent brief: behaviour and contracts, no file paths or line numbers. Survey. | Partial | MIT (Verified, local) | **Adapt** |
| [spec-kit `templates/commands/clarify.md`](https://github.com/github/spec-kit/tree/HEAD/templates/commands) | Bounded clarification: at most 5 targeted questions, answers written back into the spec. Survey. | Partial | MIT (Verified, local) | **Adapt** |

Our version is `plugin/skills/backlog/SKILL.md` (106 lines). It is stronger than every candidate on the points that matter for NAP: one question at a time with a read-back check, Given/When/Then plus a required edge case, a banned-words list for untestable criteria, "what and why, never how", and nothing reaches GitHub before approval. It also has evals. None of the candidates has these.

What theirs does that ours does not:
- **Blocking edges.** `to-tickets` records which tickets block which, and on a real tracker uses native links. Ours only writes "Depends on: title" in the draft, then swaps in numbers. (Read: the skill's description says "native blocking links on a real tracker". I did not read step 5 in full.)
- **Wide refactors.** `to-tickets` has an expand, migrate, contract sequence for one mechanical change that touches the whole codebase. Ours says "split into thin vertical slices" and has no answer for a change that cannot be sliced.
- **Prefactor first.** `to-tickets` says "make the change easy, then make the easy change" and puts any prefactor ticket first. Ours has no such rule.
- **Context-sized slices.** `to-tickets` sizes a slice to fit one fresh context window. Ours sizes by behaviours and criteria count (S or M). The context-window test is a useful second check for agents.
- **Granularity quiz.** `to-tickets` asks the user "too coarse or too fine?" and "are the blocking edges correct?". Ours asks only "approve or change".
- **Write answers back.** `clarify` writes the answers into the spec so they survive. Ours keeps assumptions only in the draft.

Verdict: keep ours. Adapt the blocking-edges and wide-refactor ideas into `issue-templates.md`.

---

## Role: Tech Lead (`/nap:design`) **[Built]**

| Candidate | What it does | Match | License | Recommendation |
|---|---|---|---|---|
| [mattpocock `tdd`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/tdd) (seams section) | Test only at pre-agreed seams. Before any test, write the seams down and confirm them, with a one-line note on what each catches and misses. Read. | Partial (design side of TDD) | MIT (Verified, local) | **Adapt** |
| [mattpocock `codebase-design`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/codebase-design) (DESIGN-IT-TWICE) | Three or more parallel agents propose different interfaces. Survey. | Inspiration only | MIT (Verified, local) | **Study and rewrite** |
| [spec-kit `plan-template.md`, `tasks-template.md`, `constitution-template.md`](https://github.com/github/spec-kit/tree/HEAD/templates) | Plan with a "constitution check" gate, and a task list template. Survey. | Partial | MIT (Verified, local) | **Adapt** |
| [superpowers `writing-plans`](https://github.com/obra/superpowers/tree/HEAD/skills/writing-plans) | Tasks list files, what they consume and produce, and a run command with expected output. A plan longer than the code is a defect. Survey. | Partial | MIT (Verified, local) | **Adapt** |

Our version is `plugin/skills/design/SKILL.md` (165 lines). Its strengths: stops if criteria are untestable, one-screen design, task split tied to criteria, `ready` and `conflicts: #N` labels from shared file paths, approval before posting, Architect flag, evals.

What theirs does that ours does not (I grepped ours for "seam", "alternative", "interface"; none found):
- **Seams.** `tdd` has the design name the public boundaries the tests will use, and confirm them. Ours names "the names the code will use", which is close, but has no "what this seam misses" note. The Test Engineer is told to test through the design's names, so a seam list is a small step.
- **Alternatives.** DESIGN-IT-TWICE and `code-architect` compare options. Ours gives one approach. This costs tokens, so use it only when the issue touches several parts.
- **Interfaces as Consumes and Produces.** `writing-plans` (survey) lists what each task takes and returns. Ours lists names but not the contract between tasks.
- **Constitution check.** `spec-kit` checks the plan against fixed project principles. NAP has no per-project principles file yet. This belongs with the Architect and Platform roles.

Verdict: keep ours. Add a seams line and a "when to compare two approaches" rule.

---

## Role: Test Engineer (`nap:test-engineer`, `/nap:failing-tests`) **[Built]**

| Candidate | What it does | Match | License | Recommendation |
|---|---|---|---|---|
| [mattpocock `tdd`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/tdd) (`SKILL.md`, `tests.md`, `mocking.md`) | What a good test is: behaviour through public interfaces. Names anti-patterns (implementation-coupled, tautological, horizontal slicing). Read. | Partial. It is a single-agent loop, so the split role does not match. | MIT (Verified, local) | **Adapt** |
| [tdd-guard `docs/enforcement.md`, hook source](https://github.com/nizos/tdd-guard) | PreToolUse hook that blocks edits breaking TDD. Counts test definitions before and after an edit to allow exactly one new test. Survey. | Inspiration only (for `lanes.mjs`) | MIT (Verified, API) | **Study and rewrite** |
| [official `pr-review-toolkit`: `pr-test-analyzer`](https://github.com/anthropics/claude-plugins-official/tree/HEAD/plugins/pr-review-toolkit/agents) | Reviews tests for behaviour coverage, not line coverage, and rates critical gaps. Path only, details from survey. | Inspiration only | Apache-2.0 (Verified, API) | **Study and rewrite** |

I found no skill or agent that matches "write failing tests from acceptance criteria without reading the implementation". This split is the NAP idea. `superpowers` `test-driven-development` is a single-agent iron law and conflicts with the split, so it is excluded.

Our version is `plugin/agents/test-engineer.md` (159 lines) and `plugin/skills/failing-tests/SKILL.md` (36 lines). Strengths: never reads implementation (also blocked by a hook), Assumptions list for unknown names, not-ready path that comments on the issue, one test per criterion table, and a check that tests fail for the right reason.

What theirs does that ours does not:
- **Named anti-patterns.** `tdd` calls out tautological tests (expected value recomputed the way the code does it) and implementation-coupled mocks. Ours says tests follow the issue, but does not name tautology or mocking rules. `mocking.md` is a small file worth adapting.
- **Independent source of truth.** `tdd` says expected values must come from a literal, worked example or the spec. Ours implies this through the criteria.
- **One test at a time.** `tdd` (and tdd-guard's counting) forces one failing test, then one pass. Ours writes the whole file for an issue at once. This is a design choice in NAP, since the Engineer comes later, but it is the main difference.

Verdict: keep ours. Adapt the anti-pattern list and mocking guidance.

---

## Role: Engineer (`nap:engineer`, `/nap:make-tests-pass`) **[Built]**

| Candidate | What it does | Match | License | Recommendation |
|---|---|---|---|---|
| [superpowers `subagent-driven-development/implementer-prompt.md`](https://github.com/obra/superpowers/tree/HEAD/skills/subagent-driven-development) | Implementer writes details to a report file and returns under 15 lines with a status: DONE, DONE_WITH_CONCERNS, BLOCKED or NEEDS_CONTEXT. I confirmed the status words in the file. | Partial (single-agent TDD inside) | MIT (Verified, local) | **Adapt** |
| [superpowers `using-git-worktrees`](https://github.com/obra/superpowers/tree/HEAD/skills/using-git-worktrees) | Detect existing isolation, prefer the native worktree tool, fall back to `git worktree add`. Survey. | Partial | MIT (Verified, local) | **Adapt** |
| [superpowers `verification-before-completion`](https://github.com/obra/superpowers/tree/HEAD/skills/verification-before-completion) | No success claim without fresh command output. Survey. | Partial | MIT (Verified, local) | **Adapt** |
| [mattpocock `implement`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/implement) | Short skill: typecheck often, run single test files often, full suite once at the end, commit, then call code-review. Read. | Partial | MIT (Verified, local) | **Study and rewrite** (too short to adapt) |

Our version is `plugin/agents/engineer.md` (109 lines). Strengths: never edits tests (hook enforced), checks tests against the issue first, a clear "when a test is wrong" stop path that comments on the issue, full suite required, short report, honest "not run" rules.

What theirs does that ours does not:
- **Status contract.** Ours reports "done, or stopped". Theirs has four fixed statuses, including DONE_WITH_CONCERNS and NEEDS_CONTEXT, which the runner can parse. This also helps the event log.
- **Report file plus short return.** Theirs writes the long report to a file and returns under 15 lines. Ours returns a medium report in chat.
- **Native worktree first.** Ours always runs `git worktree add ../<repo>-issue-N`. Theirs checks whether the session is already isolated and uses the built-in tool if present. The earlier survey says this matters on Windows.
- **Evidence line.** Theirs requires the command and its exit code in the report, from this run. Ours asks for "what you ran and the result", which is similar, but has no "never from memory" rule.
- **Cap on retries.** Theirs has a round cap in the fix loop. Ours has none for a test that keeps failing.

Verdict: keep ours. Adapt the status contract, worktree detection and evidence rule.

---

## Role: Reviewer (`nap:reviewer`, `/nap:review`) **[Built]**

| Candidate | What it does | Match | License | Recommendation |
|---|---|---|---|---|
| [official `code-review` plugin](https://github.com/anthropics/claude-plugins-official/tree/HEAD/plugins/code-review) | One command. Parallel review agents, then a validation agent per finding. Only validated, high-signal findings are reported. Command file exists (path confirmed). Details from survey. | Direct match for the finding filter | Apache-2.0 (Verified, API and file head) | **Adapt** (keep notice, mark changes) |
| [official `pr-review-toolkit`](https://github.com/anthropics/claude-plugins-official/tree/HEAD/plugins/pr-review-toolkit) | Six agents: code-reviewer, pr-test-analyzer, silent-failure-hunter, comment-analyzer, type-design-analyzer, code-simplifier (names confirmed). | Partial | Apache-2.0 (Verified, API) | **Adapt** (take `pr-test-analyzer` and `silent-failure-hunter` ideas only) |
| [mattpocock `code-review`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/code-review) | Two axes in parallel fresh sub-agents: Standards (documented rules plus a 12-smell baseline) and Spec (what the issue asked). Reports the axes side by side, never merged. Read. | Direct match | MIT (Verified, local) | **Adapt** |
| [superpowers `task-reviewer-prompt.md`](https://github.com/obra/superpowers/tree/HEAD/skills/subagent-driven-development) | Spec verdict first, then Critical, Important, Minor with file and line. Reads the diff from one file. Says to distrust the implementer's report. Read. | Direct match for format | MIT (Verified, local) | **Adapt** |
| [BMAD `bmad-code-review`](https://github.com/bmad-code-org/BMAD-METHOD/tree/HEAD/skills/method/bmad-code-review) | Five steps: gather context, review, triage, route, present, with separate review prompts. Folder read, step files not read. | Partial | MIT plus trademark notice (Verified, local) | **Study and rewrite** (never use the BMad name) |

Our version is `plugin/agents/reviewer.md` (110 lines) and `plugin/skills/review/SKILL.md` (35 lines). Strengths: read-only, reads `CLAUDE.md` from the base branch so a PR cannot excuse itself, per-criterion table with file and line, flags code outside the issue and outside the design, missing-tests finding, posts one real GitHub review, 10 evals.

What theirs does that ours does not:
- **Validate each finding.** The official plugin sends every finding to a second agent to confirm, and drops the ones that fail. Ours reports its own findings unchecked.
- **Standards axis.** `mattpocock` checks code against documented standards and a smell baseline. Ours checks only the criteria, tests, scope and design. It reads `CLAUDE.md` but only to excuse docs changes.
- **Severity buckets.** Superpowers sorts findings into Critical, Important and Minor. Ours has criterion results and findings, but no severity.
- **Runs the tests.** Ours is read-only and does not run the suite (earlier survey notes this as a gap). Superpowers' evidence rule would have the Reviewer see a fresh test run.
- **Diff as a file.** Superpowers hands the reviewer one diff file. Ours runs `gh pr diff`. Same effect, but a file saves tokens on re-review.
- **Test quality.** `pr-test-analyzer` judges whether tests cover behaviour. Ours only checks that test files exist.
- **Distrust the report.** Superpowers tells the reviewer to treat the implementer's report as claims. Ours never gets the report at all, which is stronger.

Verdict: keep ours. Adapt: validate-each-finding, severity buckets, and a short Standards pass.

---

## Role: Reviewer fix loop (`/nap:fix-review`) **[Planned]**

| Candidate | What it does | Match | License | Recommendation |
|---|---|---|---|---|
| [superpowers `subagent-driven-development/references/fix-loop.md`](https://github.com/obra/superpowers/tree/HEAD/skills/subagent-driven-development/references) | Read. Minor findings go to a ledger and never enter the loop. One round is one fix plus one scoped re-review. Max 5 rounds. Rounds 1 to 3 resume the same implementer with findings verbatim. Rounds 4 and 5 use a fresh implementer on a stronger model. The re-review gives ADDRESSED or NOT ADDRESSED per finding and looks only at the fix diff. After round 5 the controller decides. | Direct match | MIT (Verified, local) | **Adapt** |
| [superpowers `receiving-code-review`](https://github.com/obra/superpowers/tree/HEAD/skills/receiving-code-review) | Clarify unclear items first, fix one at a time, push back with evidence when a finding is wrong, reply in the review thread. Survey. | Direct match | MIT (Verified, local) | **Adapt** |
| [superpowers `re-review-prompt.md`](https://github.com/obra/superpowers/tree/HEAD/skills/subagent-driven-development) | The scoped re-review prompt. Listed in the folder, not read. | Partial | MIT (Verified, local) | **Adapt** |

This role has one strong source (Superpowers) and nothing else of note. The round cap and the ADDRESSED or NOT ADDRESSED verdict map straight to NAP's "capped rounds on the same PR". Two NAP differences: the fixer is the `nap:engineer` agent, which cannot edit tests, so a finding that says "the test is wrong" must go back to the issue (NAP's existing stop path), not into the loop. And the re-review must be a fresh `nap:reviewer`, not the old one.

---

## Role: Sprint ceremonies (planning, Kopi Report, review, retro, velocity) **[Planned]**

| Candidate | What it does | Match | License | Recommendation |
|---|---|---|---|---|
| [alirezarezvani `scrum-master`](https://github.com/alirezarezvani/claude-skills/tree/HEAD/project-management/skills/scrum-master) | Scripts `velocity_analyzer.py`, `sprint_health_scorer.py`, `retrospective_analyzer.py` (names confirmed). Input is JSON, not GitHub. Survey for details. | Partial | MIT (Verified, API) | **Adapt** (logic only; do not copy its `.mcp.json`) |
| [Donchitos `sprint-plan`, `sprint-status`, `retrospective`, `milestone-review`](https://github.com/Donchitos/Claude-Code-Game-Studios/tree/HEAD/.claude/skills) | Full set of ceremony skills for game studios. `sprint-status` read: read-only snapshot of burndown and risks from local sprint and story files, under 30 lines. | Partial | MIT (Verified, API) | **Adapt** (game-studio wording and local files, not GitHub) |
| [phuryn `sprint-plan`, `retro`](https://github.com/phuryn/pm-skills/tree/HEAD/pm-execution/skills) | Sprint plan: capacity, 15 to 20 percent buffer, story selection against a definition of ready, dependencies, risks. `sprint-plan` read, `retro` path only. | Partial | MIT (Verified, API) | **Adapt** |
| [mattpocock `retro`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/retro) | Retro that improves the agent's environment: navigation, automated checks, standards, tool cost, no-ops, information access. Read. | Direct match for NAP's "retro becomes a real edit" | MIT (Verified, local) | **Adapt** |
| [BMAD `bmad-retrospective`](https://github.com/bmad-code-org/BMAD-METHOD/tree/HEAD/skills/method/bmad-retrospective) | Retro flow from git evidence. Survey. | Partial | MIT plus trademark notice (Verified, local) | **Study and rewrite** |
| [knowledge-work-plugins `engineering/skills/standup`](https://github.com/anthropics/knowledge-work-plugins/tree/HEAD/engineering/skills/standup) | Standup template: yesterday, today, blockers. Path confirmed, body from survey. | Partial (Kopi Report) | Apache-2.0 (Verified, API) | **Adapt** |
| [github-community-projects/issue-metrics](https://github.com/github-community-projects/issue-metrics) | GitHub Action with Python modules for time to close, time to merge, time to first review (module names confirmed). Reads GitHub. | Partial (metric definitions) | MIT (Verified, API) | **Study and rewrite** (copy definitions, do not run the Action) |

Velocity from GitHub (a named gap). What I found:
- **No existing Claude skill computes velocity from GitHub issues and milestones.** A catalog blurb said `planning-sprints` ships `calculate-velocity.py` and `sprint-burndown.py`. I listed the plugin's file tree. It has no scripts, only a SKILL.md and a template. The blurb was wrong.
- The velocity logic in `scrum-master` and `sprint-plan` is sound but takes JSON or files.
- Tools that read GitHub are not usable: `radekstepan/burnchart` is AGPL-3.0 (Verified, API); `target/burndown-for-github-projects` is archived, license NOASSERTION (not read); `mrdkoz/gh-insight` has no detectable license.
- Practical route: a small `gh issue list --milestone ... --json closedAt,labels` script, using the scrum-master formulas and the issue-metrics definitions. By a decision of 14-11-2026, velocity is size points closed per sprint (S 1, M 2, L 3), with the issue count beside it.

Verdict: partial coverage. The maths and templates exist. The GitHub layer, the Kopi Report from the event log, and the sprint review are NAP's own.

---

## Role: PM, Sprint 0 product (vision brief, PRD, story map) **[Planned]**

| Candidate | What it does | Match | License | Recommendation |
|---|---|---|---|---|
| [BMAD `template-brief.md`](https://github.com/bmad-code-org/BMAD-METHOD/tree/HEAD/skills/method/bmad-agent-analyst/assets), [`template-prd-light.md`, `template-prd.md`](https://github.com/bmad-code-org/BMAD-METHOD/tree/HEAD/skills/method/bmad-agent-pm/assets) | Brief and PRD templates (paths confirmed in local clone). Survey for quality. The PM agent has trigger evals. | Direct match | MIT plus trademark notice (Verified, local) | **Adapt** (rewrite in NAP's words, never use the BMad name) |
| [phuryn `product-vision`, `lean-canvas`, `create-prd`](https://github.com/phuryn/pm-skills/tree/HEAD/pm-product-strategy/skills) | `product-vision` read: drafts 3 to 5 vision options and picks one. Generic, no interview. `lean-canvas` and `create-prd` paths confirmed, not read. | Partial | MIT (Verified, API) | **Adapt** |
| [mattpocock `to-spec`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/to-spec) | Spec shape: problem, solution, long user-story list, seams, out of scope. Survey. | Partial (PRD to backlog link) | MIT (Verified, local) | **Adapt** |
| [spec-kit `specify`, `clarify`, `spec-template.md`](https://github.com/github/spec-kit/tree/HEAD/templates) | Spec template and a bounded question pass. Survey. | Partial | MIT (Verified, local) | **Adapt** |
| [tomershahar/user-story-mapping-skill](https://github.com/tomershahar/user-story-mapping-skill), [MartinForReal/storymap-skill](https://github.com/MartinForReal/storymap-skill) | Patton-style story map coaching and release slicing. Small (about 5 stars each). Survey. | Direct match (story map only) | MIT (Verified, API) | **Adapt** |

Not usable: `deanpeters/Product-Manager-Skills` (lean UX canvas) is CC BY-NC-SA 4.0 (Verified, file head). Non-commercial and share-alike. Study only.

Lean canvas and vision: lean canvas skills exist (phuryn, product-on-purpose). A "vision brief" in NAP's sense (why, who for, approved by the CEO) is not a standard skill. phuryn's `lean-canvas` page notes it has no vision section (catalog statement, not verified in the file). The CEO-interview flow, with the bounded questions and the MVP-scope approval gate, must be written by NAP. The templates are easy to adapt.

---

## Role: Architect **[Planned]**

| Candidate | What it does | Match | License | Recommendation |
|---|---|---|---|---|
| [BMAD `bmad-architecture` and `bmad-agent-architect`](https://github.com/bmad-code-org/BMAD-METHOD/tree/HEAD/skills/method/bmad-architecture) | Architecture doc with numbered decisions and a reviewer gate. Folder has assets, references, scripts. Survey. | Direct match | MIT plus trademark notice (Verified, local) | **Adapt** (rewrite, no BMad name) |
| [adr/madr `template/`](https://github.com/adr/madr/tree/HEAD/template) | Minimal and full ADR templates (file names confirmed). | Partial (ADR format) | MIT OR CC0-1.0 (Verified, API and file head) | **Copy as-is** (license is the most open; still trim to NAP's single numbered `docs/ADR.md`) |
| [wshobson `architecture-decision-records`](https://github.com/wshobson/agents/tree/HEAD/plugins/documentation-generation/skills/architecture-decision-records) and [`c4-architecture`](https://github.com/wshobson/agents/tree/HEAD/plugins/c4-architecture) | ADR writing skill and four C4 agents (context, container, component, code). First lines read only. | Partial | MIT (Verified, API) | **Adapt** |
| [knowledge-work-plugins `architecture`, `system-design`](https://github.com/anthropics/knowledge-work-plugins/tree/HEAD/engineering/skills) | Short ADR and system-design checklists with output templates. Paths confirmed, bodies from survey. | Partial | Apache-2.0 (Verified, API) | **Adapt** |
| [mattpocock `domain-modeling` `ADR-FORMAT.md`, `improve-codebase-architecture`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering) | Very short ADRs (1 to 3 sentences). Survey. | Partial | MIT (Verified, local) | **Adapt** |

Not usable as text: `arc42/arc42-template` is CC-BY-SA-4.0 (survey, API not re-read). Read as an outline only.

Strong template coverage. Missing and NAP's own: the stack-choice checklist with alternatives, the rule for which feature designs go to the Architect (the boundary is in `design.md`), and the "checks flagged feature designs" step.

---

## Role: Platform (setup skill, CI gate, branch protection) **[Planned]**

| Candidate | What it does | Match | License | Recommendation |
|---|---|---|---|---|
| [dwmkerr `project-setup`](https://github.com/dwmkerr/claude-toolkit/tree/HEAD/plugins/dwmkerr/skills/project-setup) | Creates a private repo, blocks direct push to main, squash merges only, license, README, all with `gh`. Read (first 45 lines). | Partial (repo and branch protection) | MIT (Verified, API) | **Adapt** |
| [mattpocock `setup-matt-pocock-skills`, `setup-pre-commit`](https://github.com/mattpocock/skills/tree/HEAD/skills) | Explore, present findings, ask one section at a time with a recommended answer, then write config. Same pattern NAP needs for `/nap:setup`. Setup skill read. | Partial (the interview shape) | MIT (Verified, local) | **Adapt** |
| [claude-plugins-community `validate-plugins.yml`](https://github.com/anthropics/claude-plugins-community/tree/HEAD/.github/workflows) | CI that validates plugin manifests (file name confirmed). For NAP's own CI, not for user projects. | Partial | Apache-2.0 (Verified, API) | **Adapt** |

### CI gate that fails PRs with code but no tests

| Candidate | What it does | Match | License | Recommendation |
|---|---|---|---|---|
| [infection/tests-checker-action](https://github.com/infection/tests-checker-action) | Checks changed files by extension, test directory or glob. Read the source: it posts a REQUEST_CHANGES review and a comment. It calls `setFailed` only on its own errors, so it does not fail the check. Runs on `node16`. Last push 2025-06-14. | Partial | MIT (Verified, API) | **Study and rewrite** |
| [Bachmann1234/diff_cover](https://github.com/Bachmann1234/diff_cover) | Python tool. Reads a coverage report and fails with `--fail-under=N` when changed lines are under-covered. README read. | Partial. It tests coverage of changed lines, not "a test file changed". | Apache-2.0 (Verified, API) | **Adapt** (as an optional second gate) |
| Plain `gh pr diff --name-only` script in a NAP workflow | No candidate needed. Sort changed files into tests, docs and code (our Reviewer already has this rule), fail if code changed and no test file did, skip with an opt-out label. | Direct (built by NAP) | NAP's own | Build from scratch |

The search also showed a pitfall: GitHub path filters can skip a required job so the check never reports, and the PR cannot merge. The Pants team's fix is to run a changed-files step and decide inside the job. NAP's gate should always run and report.

Walking skeleton: none of the setup skills mention one. Branch protection through `gh api` is shown by `project-setup`, but I read only its first lines, so whether it uses rulesets or the older protection endpoint is not verified.

Verdict: partial. Repo creation and branch protection have MIT examples. The test framework choice, walking skeleton and the CI gate are NAP's own.

---

## Role: UX Designer **[Planned]**

| Candidate | What it does | Match | License | Recommendation |
|---|---|---|---|---|
| [BMAD `bmad-agent-ux-designer` and `bmad-ux`](https://github.com/bmad-code-org/BMAD-METHOD/tree/HEAD/skills/method/bmad-ux) | Two UX documents (look, behaviour). Folder confirmed. Survey. | Direct match | MIT plus trademark notice (Verified, local) | **Adapt** (rewrite, no BMad name) |
| [mastepanoski `nielsen-heuristics-audit`, `cognitive-walkthrough`, `wcag-accessibility-audit`](https://github.com/mastepanoski/claude-skills/tree/HEAD/skills) | Heuristic review, walkthrough, accessibility audit (folder names confirmed). Small repo (73 stars). Bodies from survey. | Direct match for checks | MIT (Verified, API) | **Adapt** |
| [wshobson `accessibility-compliance/wcag-audit-patterns`](https://github.com/wshobson/agents/tree/HEAD/plugins/accessibility-compliance/skills/wcag-audit-patterns), [`ui-design`](https://github.com/wshobson/agents/tree/HEAD/plugins/ui-design), [`ui-ux-designer.md`](https://github.com/wshobson/agents/blob/HEAD/plugins/multi-platform-apps/agents/ui-ux-designer.md) | WCAG audit skill, design review command, UI and accessibility agents. Paths confirmed, not read. | Partial | MIT (Verified, API) | **Adapt** |

Good coverage for review-style checks (heuristics, WCAG, walkthrough). Nothing I found does "user flows and text or HTML wireframes from a PRD", which is the part NAP needs first. Build that from scratch.

---

## Role: Chief of Staff **[Planned]**

| Candidate | What it does | Match | License | Recommendation |
|---|---|---|---|---|
| [mattpocock `chief-of-staff`](https://github.com/mattpocock/skills/tree/HEAD/skills/in-progress/chief-of-staff) | Long-running session. All work in fresh-context background subagents. Communication through context pointers, not copies. Keeps a dated wiki. Runs a retro on about 1 in 5 subagent sessions. Beta, can change without warning (README says so). Read. | Partial. It is a prompt for one long session, whereas NAP wants a runner that picks issues by a plain rule in code. | MIT (Verified, local) | **Adapt** (the "improve the environment" and pointer rules; skip the wiki) |
| [superpowers `subagent-driven-development`](https://github.com/obra/superpowers/tree/HEAD/skills/subagent-driven-development) | Controller dispatches an implementer and a reviewer per task, with a ledger, status contract, fix loop and final review. Read in part. | Partial | MIT (Verified, local) | **Adapt** |
| [Donchitos `producer` agent](https://github.com/Donchitos/Claude-Code-Game-Studios/blob/HEAD/.claude/agents/producer.md) | Sprint planning, milestones, scope and cross-team coordination. Presents 2 to 3 options with a recommendation, user decides, and asks before writing. Read (first 50 lines). | Partial | MIT (Verified, API) | **Study and rewrite** |
| [mattpocock `software-factory`](https://github.com/mattpocock/skills/tree/HEAD/skills/in-progress/software-factory) | Shared vocabulary for a factory: task, trigger, run, runner, ticket tracker, git host, orchestrator. "Start slow" brakes: checks, automated review, human review. Read (first 60 lines). | Inspiration only (vocabulary and design rules) | MIT (Verified, local) | **Study and rewrite** |

Skipped: `dbc-oduffy/coordinator-claude` is under the Commons Clause (Verified, file head), which bars selling the software.

Note from the search: a subagent cannot spawn other subagents, so an orchestrator has to be the top-level session or the runner (catalog claim, not verified by me). This fits NAP's runner design. The Superpowers and `software-factory` ideas (a run never waits for a human, state lives in the tracker and git host) match NAP's rule "agents work only on events" and are the best reference for the runner.

Verdict: partial and loose. Nothing here is the runner. The picking rule and the Kopi Report from the event log are NAP's own.

---

## Role: Security Engineer **[Planned]**

| Candidate | What it does | Match | License | Recommendation |
|---|---|---|---|---|
| [official `security-guidance`](https://github.com/anthropics/claude-plugins-official/tree/HEAD/plugins/security-guidance) | Hooks that flag vulnerable patterns while the agent writes code. Advisory by Anthropic's own docs (catalog summary of the docs, not read by me). Folder has hooks and tests. | Partial | Apache-2.0 (Verified, file head) | **Adapt** |
| [official `claude-security`](https://github.com/anthropics/claude-plugins-official/tree/HEAD/plugins/claude-security) | Agents that map the code, build a threat model, hunt, verify each finding, and suggest patches. Scans a branch or PR diff. README read. | Direct match | **All rights reserved** (Verified, file head). Not open source. | **Study and rewrite** |
| [anthropics/claude-code-security-review](https://github.com/anthropics/claude-code-security-review) | GitHub Action. Diff-aware security review of a PR with false-positive filtering and PR comments. README read. | Direct match for "scan PRs" | MIT (Verified, API) | **Adapt** (pin to a commit SHA; needs an API key secret) |
| [wshobson `security-scanning`](https://github.com/wshobson/agents/tree/HEAD/plugins/security-scanning/skills) | Skills for STRIDE, attack trees, security requirement extraction, threat-mitigation mapping, SAST setup. First lines of STRIDE read. | Direct match for threat model | MIT (Verified, API) | **Adapt** |
| [actions/dependency-review-action](https://github.com/actions/dependency-review-action) and [gitleaks](https://github.com/gitleaks/gitleaks) | Standard PR dependency check and secret scanner. Tools, not skills. Not read. | Partial | MIT (Verified, API both) | Use as tools, pinned |

Good existing coverage. The licensing trap: the most complete match (`claude-security`) cannot be copied. The two permissive routes are `security-guidance` (hooks) and the MIT security-review Action, plus wshobson's STRIDE skills for the threat model. Not found: a skill that ties the threat model to the architecture doc and files findings as GitHub issues in NAP's format. Build that part.

---

## Role: SRE / DevOps **[Planned]**

| Candidate | What it does | Match | License | Recommendation |
|---|---|---|---|---|
| [wshobson `incident-response`](https://github.com/wshobson/agents/tree/HEAD/plugins/incident-response/skills) | Skills for postmortem writing, runbook templates, on-call handoff, connectivity triage. `postmortem-writing` first lines read: blameless, root cause, timeline, action items. | Direct match (incidents) | MIT (Verified, API) | **Adapt** |
| [knowledge-work-plugins `incident-response`, `deploy-checklist`](https://github.com/anthropics/knowledge-work-plugins/tree/HEAD/engineering/skills) | Incident triage, communicate, postmortem. Deploy checklist. `incident-response` first lines read. Connector placeholders to remove. | Partial | Apache-2.0 (Verified, API) | **Adapt** |
| [wshobson `cicd-automation`](https://github.com/wshobson/agents/tree/HEAD/plugins/cicd-automation/skills) | `deployment-pipeline-design`, `github-actions-templates`. Paths confirmed, not read. | Partial | MIT (Verified, API) | **Adapt** |
| [wshobson `changelog-automation`](https://github.com/wshobson/agents/tree/HEAD/plugins/documentation-generation/skills/changelog-automation) | Changelog and release notes from Conventional Commits, Keep a Changelog format. First lines read. | Partial (release notes) | MIT (Verified, API) | **Adapt** |
| [release-please](https://github.com/googleapis/release-please), [release-drafter](https://github.com/release-drafter/release-drafter), [git-cliff](https://github.com/orhun/git-cliff) | Release PRs, drafted notes, changelog from commits. Tools, not skills. Not read. | Partial | Apache-2.0, ISC, Apache-2.0 (Verified, API) | Use as tools, pinned |

Good coverage for incident write-ups and release notes. Weak for deploy pipelines and monitoring: no skill I found is tied to a specific cloud stack. The wshobson `cicd-automation` templates are generic. A deploy and monitoring skill for the user's stack is NAP's own.

---

## Role: Technical Writer **[Planned]**

| Candidate | What it does | Match | License | Recommendation |
|---|---|---|---|---|
| [zbruhnke `changelog-writer`](https://github.com/zbruhnke/claude-code-starter/tree/HEAD/.claude/skills/changelog-writer) | Keeps `CHANGELOG.md` in Keep a Changelog format after notable changes. First lines read. Tiny repo (18 stars). | Partial | MIT (Verified, API) | **Adapt** |
| [wshobson `documentation-generation`](https://github.com/wshobson/agents/tree/HEAD/plugins/documentation-generation/skills) | `changelog-automation`, `openapi-spec-generation`, ADR skill. | Partial | MIT (Verified, API) | **Adapt** |
| [knowledge-work-plugins `documentation`](https://github.com/anthropics/knowledge-work-plugins/tree/HEAD/engineering/skills/documentation) | Short documentation checklist. Path confirmed, body not read. | Partial | Apache-2.0 (Verified, API) | **Adapt** |

Search note: catalog pages also listed a "sync-docs" skill from `avifenesh/awesome-slash`. I could not find it in that repo's tree, so I dropped it.

Decent coverage for changelog. The part NAP needs most, "docs checked against the code diff on every PR, as a CI or Reviewer rule", is not done by any candidate. A project CLAUDE.md pattern (a short "docs to update" rule the Reviewer enforces, as our Reviewer already does for roadmap docs) is cheaper than a standing agent.

---

## Summary

Strong existing coverage (adapt, with license checks passed):
- **Reviewer fix loop**: Superpowers `fix-loop.md` and `receiving-code-review` are close to a spec.
- **Architect templates**: MADR (MIT or CC0), BMAD, wshobson and Anthropic ADR skills.
- **Sprint ceremonies, the thinking part**: scrum-master formulas, sprint-plan, retro, standup. Source text exists and is permissively licensed.
- **Security Engineer**: wshobson STRIDE skills, `security-guidance`, the MIT security-review Action. Best match `claude-security` is all rights reserved.
- **SRE incident write-ups and release notes**: wshobson and Anthropic skills.
- **UX review checks**: heuristics, WCAG, walkthrough.

Partial coverage (take pieces, build the rest):
- **PM backlog, Tech Lead, Test Engineer, Engineer, Reviewer**: our versions are stronger on NAP's rules (split lanes, approval gates, evals). Take: blocking edges and wide-refactor slicing, seams, anti-pattern lists, the status contract, worktree detection, evidence rule, validate-each-finding, severity buckets, a Standards pass.
- **PM Sprint 0**: BMAD brief and PRD templates, phuryn vision and lean canvas, story map skills. The CEO interview flow is NAP's.
- **Platform**: repo creation and branch protection have MIT examples. Interview shape from `setup-matt-pocock-skills`.
- **Chief of Staff**: mattpocock `chief-of-staff` and Superpowers give rules, not a runner.
- **Technical Writer**: changelog skills exist. Docs-versus-diff checking does not.

Must be built from scratch:
- **CI gate for code without tests.** The only action built for it (`tests-checker-action`) only requests changes, and is on an old Node runtime. `tj-actions` has a supply-chain history. Write a short `gh` script. `diff_cover` can be a second, optional gate.
- **Velocity and burndown from GitHub issues.** No usable skill or permissive tool. Write a `gh` script with scrum-master formulas.
- **Vision brief with the CEO approval flow.**
- **Walking skeleton and test framework choice** in the setup skill.
- **UX flows and wireframes** from a PRD.
- **Chief of Staff picking rule and Kopi Report** from the event log.
- **Deploy and monitoring** for a specific cloud stack.
- **Docs-versus-code check** for the Technical Writer.

License traps to remember:
- All rights reserved: `claude-security`, and the `anthropics/claude-code` plugins folder (survey).
- Commons Clause: `borghei/Claude-Skills` (MIT plus Commons Clause, file head read), `dbc-oduffy/coordinator-claude`.
- Non-commercial share-alike: `deanpeters/Product-Manager-Skills`.
- Share-alike: `trailofbits/skills` (CC-BY-SA-4.0), arc42.
- AGPL: `burnchart`, `trufflehog`.
- Trademark notice: BMAD (MIT code, but the BMad name cannot be used).
- Apache-2.0 sources need the notice kept and changes marked. `anthropics/skills` has no repo-level license. I confirmed only `skill-creator` carries Apache-2.0 (file head).

Not verified or not opened:
- Every link, in a browser. All paths come from API tree listings or local clones.
- Bodies of files marked "Survey" or "Path only" above.
- wshobson `ui-ux-designer.md` and the `cicd-automation` skills: paths confirmed, content not read.
- `tj-actions/verify-changed-files` inputs. The compromise claim comes from a web search of CISA, Wiz and Sysdig pages that I did not open myself (CISA alert page title and the CVE number were in the results).
- Whether `security-guidance` and `claude-security` run on native Windows: not checked.
- `gitleaks/gitleaks-action` was left out because the API returned NOASSERTION and I could not read its license file.
- `trailofbits/skills` per-plugin licenses: the plugin-level LICENSE lookup returned 404, so only the repo-level CC-BY-SA-4.0 is verified.
- Skill counts and star numbers are from the GitHub API on 2026-11-14.

---

## Review notes (main session, 2026-11-14)

Spot-checks after the research pass:
- **Licenses re-checked through the GitHub API:** 23 repos. All match the tables. The four local clones (superpowers, mattpocock/skills, spec-kit, BMAD-METHOD) are MIT by their LICENSE files.
- **Per-plugin licenses in `anthropics/claude-plugins-official`:** the repo is Apache-2.0, but each plugin has its own LICENSE. `code-review`, `pr-review-toolkit`, `security-guidance`, `feature-dev`, `ralph-loop`, `claude-code-setup` and `claude-md-management` are Apache-2.0. `claude-security` is all rights reserved. Always read the LICENSE in the plugin folder, not the one at the repo root.
- **MADR:** the API reports NOASSERTION because the repo is dual licensed. Its LICENSE file says "MIT OR CC0-1.0".
- **Paths re-checked:** 31 folder and file paths across 14 repos, plus the local clone paths for mattpocock, superpowers and BMAD. All exist.
- **Removed 19 candidates** that were path-only, inspiration-only, archived, share-alike with no content read, or duplicates of a stronger row: phuryn `user-stories`, alirezarezvani `agile-product-owner`, `senior-security` and `changelog-generator`, official `feature-dev`, `ralph-loop`, `claude-code-setup` and `claude-md-management`, both Trail of Bits rows, superpowers `finishing-a-development-branch`, c0ntr0lledcha0s `planning-sprints`, product-on-purpose, slamb2k `start-right`, `tj-actions/verify-changed-files`, design-tokens-skill, navox-labs, Donchitos release skills, olehsvyrydov `technical-writer`.
- **Corrected:** the velocity unit now matches the decision of 14-11-2026 (size points, issue count beside it).
- **Still unverified:** file bodies marked "Survey" or "Path only". Read each one in full before adapting it.

## Recommendations

Order follows what unblocks the loop first, then what is cheapest to adopt, then what sets NAP apart. Later roles wait.

### Pursue first

1. **Superpowers status contract and `fix-loop.md` (MIT).** Target: the three agents, `events.mjs`, new `/nap:fix-review`. Why: the result block fixes three open problems at once (entry skills guessing the outcome, the event log logging "finished" for blocked runs, evals with nothing to grade). The fix loop is close to a spec for issue #37, with a round cap and a per-finding verdict. Both were read in full. Lower the cap from 5 rounds to 3 to save usage.
2. **Superpowers `using-git-worktrees` and `verification-before-completion` (MIT).** Target: `agents/engineer.md`, `agents/reviewer.md`. Why: issue #45 (Windows worktree) and the Reviewer approving without running tests are two failures seen in the only full loop run. Both bodies are "Survey", so read them first.
3. **Reviewer upgrades: official `code-review` (Apache-2.0), mattpocock `code-review` (MIT), superpowers `task-reviewer-prompt.md` (MIT).** Take validate-each-finding and severity buckets. Why: the Reviewer wrongly approved on its first real run, and it is the last gate before the human. Skip the parallel-agent fan-out, which costs too much on a Pro plan. Keep the Apache notice.
4. **mattpocock `tdd` seams and anti-patterns (MIT).** Target: `skills/design`, `agents/test-engineer.md`. Why: small text changes that close the "design task with no test" gap (#34, #35) from the design side.

### Pursue next, cheap wins

5. **MADR template (MIT or CC0).** The only copy-as-is item. Adopt it when the Architect work starts.
6. **mattpocock `to-tickets` blocking edges (MIT).** Target: `skills/backlog/issue-templates.md`. Why: it feeds the `conflicts` and `ready` logic, and later the runner's picking rule.
7. **mattpocock `setup-matt-pocock-skills` interview shape and dwmkerr `project-setup` (MIT).** Target: `/nap:setup`. Why: setup plus the CI gate is what sets NAP apart from Superpowers and BMAD, so it is worth pulling forward.

### Build from scratch, in this order

8. **CI gate for code without tests.** No safe candidate exists. Write a short `gh pr diff --name-only` script that always runs and always reports.
9. **Velocity script from GitHub milestones.** No candidate. Use the scrum-master formulas (MIT) as a reference only.

### Defer

- **Security Engineer, SRE, Technical Writer.** Coverage exists (wshobson, Anthropic Apache-2.0 plugins), but these roles come after milestone 1. Re-run this research then.
- **Update, same day:** the Chief of Staff skill moved into the MVP (decision 19, todo phase 4). Read superpowers `subagent-driven-development` and mattpocock `chief-of-staff` in full before designing `/nap:run`. The second is beta and may change or disappear.
- **Sprint ceremonies, Sprint 0 product, Architect, UX.** Templates are plentiful and permissive (BMAD, phuryn, spec-kit, mastepanoski). They are easy to adapt when their phase starts, so there is no reason to pull them forward.

### Rules for all adoption

- Add LICENSE and THIRD_PARTY_NOTICES.md to NAP before copying or adapting any text. NAP has no license today.
- Never use the BMad name. Do not copy from `claude-security`, Commons Clause repos, or share-alike sources (Trail of Bits, arc42).
- Do not install Superpowers beside NAP. Its session-start hook would override NAP's routing.
- Pin any third-party GitHub Action to a commit SHA.
