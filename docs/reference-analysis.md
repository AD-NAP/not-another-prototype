# Reference analysis: asd-ste100-skill and NAP

Written 20-11-2026. It compares NAP with [danyuchn/asd-ste100-skill](https://github.com/danyuchn/asd-ste100-skill), a public skill that many people use, and recommends what to do with NAP next.

**The short answer: clean up, don't restart.** Today's NAP is already a restart, one day old and under 1,000 lines. What it lacks is not a better structure. It lacks one real use. Section 5 has the reasons and the exact list.

**Update, later on 20-11-2026.** The decision was a cleanup. PR #90 (`/nap-prd`) was merged first, so two skills are now on `main`. Items 1 to 6 of section 5 are applied, in the commit after the one that added this document:

1. Agent material cut from `docs/skill-writing.md`.
2. Parked roles cut from `docs/skill-research.md`.
3. Unasked-for types, the "later" traits column and the waiting documents cut from `docs/design.md`.
4. History cut from `README.md`.
5. The gate added to `CLAUDE.md`: one skill at a time, real use included.
6. Real use and honest counts in `docs/roadmap.md`.

Still open: items 7 and 8 (two eval additions, which need a paid run), item 9 (the README example, which needs a real brief) and item 10 (the GitHub description, a repo setting). Sections 2 to 4 describe NAP as it was before the cleanup. One finding in section 2 was corrected while doing item 6, and is marked there.

Also decided: `main`'s history stays as it is, since the docs point into it. From now on PRs are squash-merged, so each lands as one commit.

The real use moved from A Day to a weight and IPPT log, with two more projects for the Script and App paths. A Day is a set of skills, not an application. Where the sections below say A Day, read the projects in the [roadmap](roadmap.md#real-uses).

How this was checked:

- The reference repo was cloned at commit `65c8ab6` (20-11-2026). All 97 commits were read with `git log --stat`, and the significant diffs were opened. Its 22 issues and 50 PRs were read from the GitHub pages.
- Nothing from the reference repo was run. Its linter's self-test was read, not executed.
- NAP was read in full at `bb9e60d` on `main`, plus the diff of PR #90 (`/nap-prd`), which was open at the time and has merged since.
- Why the reference repo got its stars can't be read from a repo. Section 1 only claims what the commits and issues show.

## 1. Reference repo: origin, evolution themes, and what drove the changes

### Where it started

One commit on 20-07-2026 (`8564f89`): 283 lines in five files.

- `SKILL.md`, 80 lines: a rule table, a five-step process, an output format and a Will / Will not list.
- A README with two before and after rows, an examples file, a rules reference and a license.
- No tests, no linter, no install command, no process documents.

It did one job. Paste English text, get it back rewritten under the rules of ASD-STE100, an aerospace standard for English that can't be misread. The first version printed a table of rule, original and rewrite on every run.

The first issue from a stranger came 15 days later (#1, 04-08-2026). The first outside PRs came three days after that.

### What it looks like now

- 97 commits in four months: 77 real commits and 20 merges. About 18 people wrote them.
- `SKILL.md` grew from 80 to 138 lines in its first 24 days, and is 140 lines today. It has been touched three times since 10-09-2026, each a fix of a line or two.
- `scripts/ste-lint.py` did not exist until 04-09-2026. It is now 3,417 lines. 53 of the 64 commits since it landed touch it.
- 6.7k stars and 386 forks, three ports to other languages, 22 issues and 50 PRs, all closed.

So the skill settled in under a month. Since then, nearly all the work has gone into a deterministic tool beside it.

### Themes

| # | Theme | What changed | What drove it | Evidence |
|---|---|---|---|---|
| 1 | The skill must not change what the text says | A "keep modality" rule in three places. Examples rewritten so they keep every hedge. "Never add a fact the source did not state." | A reader noticed the skill's own examples turned "may have failed" into "failed" and invented a claim. Later readers kept finding the same fault in other examples. | PR #4 (`ea8f776`, `b216e07`), issues #10, #11, #28, commits `004bcce`, `8da6b63`, `e41b316` |
| 2 | Say only what the skill can really check | Rules split into structural ones (apply with confidence) and dictionary ones (direction only). License terms for the dictionary stated. Limits added: it fixes form, not substance. The README says what the linter does not check. | A user's question, a contributor's reasoning, and the maintainer checking claims against the standard's PDF. The maintainer turned down a violations-per-100-words score, since it would read as a compliance score. | Issue #1 (`7deb2a2`), `cb923bb`, PR #3 review, `3419838`, `93cc182` |
| 3 | Triggering and frontmatter | Name changed to a plain slug. Description rewritten as when to use it, not a summary of the rules. "simplify this" dropped because it collides with `/simplify`. Version key moved under `metadata`. | Outside contributors who knew the skill spec, and a validator run by a user. | PR #2 (`3e934ce`, `16b94e6`), issue #68 (`9c35169`) |
| 4 | Output a user can paste | Default output became the rewritten text and nothing else. The rule table moved to "on request". No preamble, no mode line, no summary. | Direct user feedback: users "had to strip that out by hand". The commit names the user who reported it. | `d5ce157` |
| 5 | Scope: one widening, many refusals | Two modes added, so READMEs and PR descriptions are served, not refused. Everything else that widened or restructured was closed unmerged: Codex support, a module split, a restructure, a "plugin, split linter and measured evals" PR, an unrelated skill. | The widening came from a contributor. The refusals are the maintainer's. The repo doesn't record the reasons for all of them. | `e355af3`. Closed PRs #9, #18, #21, #37, #44, #57 |
| 6 | A deterministic linter, and its long tail | A stdlib-only script that flags the mechanical rules. Then about 50 fixes to how it reads Markdown: tables, lists, fences, HTML blocks, links, front matter, emphasis. | Failures found by use and by tools, not by instruction tuning. Users ran it on their own files (#12). An automated code review of a vendored copy found three defects (#17). Contributors compared it with GitHub's renderer case by case, and one scored it on 20,000 random documents against markdown-it (`ffc6618`). Many fixes repaired the fix before: #31 led to #46, #33 to #45, #47 and #48 to #49, `15f838e` to #65. | `6f7bb36` (PR #5), then issues #12, #17, #38, #45, #46, #52, #55, #58, #59, #65, #67, #71 |
| 7 | Getting it installed | One-line install with `npx skills add`. Plugin and marketplace files. An executable bit. Links to Hebrew, Indonesian and Russian ports. | Users who wanted it in their own setup. | `0244e99`, `d6e8539`, `0662c2c`, `bd7558f`, `666c9c8`, `7b4b235` |
| 8 | Following its own rules | Semicolons removed from the project's own prose. The README states how many findings the repo's own files give, and updates the number as the linter changes (41, 40, 36, 35). | A contributor applying the skill to the repo itself. | `99e0b16`, `15f838e`, `298847e`, `f52cbe9` |

### The pattern behind the themes

- **No change to the skill came from the author's plan.** After the first commit, every change to `SKILL.md` traces to a person who used it or read it: a user report (theme 4), a reader checking examples against the rules (theme 1), a question (theme 2), or a validator (theme 3).
- **Very little was instruction tuning.** There is no commit of the kind "the model ignored this line, so reword it". The skill changed when its content was wrong: a rule missing, an example that broke a rule, an output nobody wanted.
- **The examples were the most fragile part.** They were corrected five times. Four of those were because a hand-written "after" broke the skill's own rule.
- **Nothing was ever reorganised.** The layout of the first commit is the layout today, plus one script and two plugin files.

### What made it useful

Specific decisions, each visible in the files:

1. **One job with a fast loop.** Text in, text out, one turn. A new user sees the value in the first reply.
2. **The README shows the result.** Two before and after rows sit above the install steps. A reader knows what they get before they install anything.
3. **Output that needs no cleanup** (`d5ce157`). The default is the thing the user came for, and only that.
4. **One rule that protects the user's content.** "Keep modality" and "add no fact" are stated in the rule table, the process, and both halves of the Will / Will not list. People can trust the rewrite, because the skill says what it will never do to their text.
5. **Rules you can point at.** "You can point at the exact word or punctuation mark that breaks the rule, with no judgment call." A user can check the output without trusting the model.
6. **Honest scope.** It says which rules it can't verify, what the linter doesn't prove, and that an empty paragraph stays empty. It claims less than it could.
7. **A part that works without the model.** The linter gives the same answer every time and can run in CI. It also gave strangers a way to contribute: a bug is a three-line reproduction with a right answer, so it can be reported and fixed without knowing the author's taste.
8. **It shipped small and early.** 283 lines, public, before any testing. Everything after came from other people's use.

Two cautions when copying from it:

- **Its popularity is not proof of its method.** One contributor's commit says the material came from "a video transcript analyzing ASD-STE100 as a fix for LLM-generated prose" (`e355af3`). Attention may have come from the topic as much as the design.
- **The linter is also a warning.** It is 3,417 lines because it re-implements a Markdown parser with regular expressions, one edge case at a time. Two thirds of the project's commits went there. A deterministic check is worth having. This much of one is scope creep.

## 2. Their testing/eval approach vs ours

### Theirs

They have no evals of the skill. Nothing checks what the model does with `SKILL.md`. There is no CI either. A PR that offered "measured evals" (#37) was closed unmerged.

What they test is the deterministic part:

- `ste-lint.py --selftest`: a function of about 1,100 lines with 216 assertions, inside the linter itself. One guards the core rule: "may have failed" must pass clean.
- `examples/linter-edge-cases.md`: a file with two planted faults. The README says the linter must report exactly those two.
- A stated baseline: the README gives the number of findings on the repo's own `SKILL.md`, so anyone can rerun it.
- A reproduction in every bug report, and a new self-test case with every fix. The maintainer asked for tests before merging the linter (PR #5 review).

How problems in the skill itself were caught, with no evals:

- People read the examples against the rules (PR #4, issues #10 and #28).
- Users said what annoyed them (`d5ce157`).
- A user ran Anthropic's skill validator (#68).
- The maintainer checked contributed rule numbers against the standard's PDF (PR #3).

This works because of volume. Thousands of readers are a free test team. It would not work for a repo nobody reads yet.

### Ours

NAP tests the skill's behaviour, which they don't do at all:

- 8 cases for `/nap-start`, written before the skill, run with `claude plugin eval`.
- Each case runs with NAP and without it, so the score shows what the skill adds over plain Claude.
- Cheap graders first (`file_exists`, `regex`, `tool_used`), with `llm` graders for short judgments.
- A saved conversation tests the step after "Approve" without replaying the interview.
- Failures seen in testing become Gotchas lines in the skill.

NAP has no deterministic check of its output, and no report from any user.

### Compared

| | Reference | NAP |
|---|---|---|
| Tests of what the model does with the skill | None | 8 cases, 3 runs, with and without the skill |
| Tests of a deterministic part | 216 assertions, a fixture file, a baseline | No deterministic part |
| Tests written | After each bug, as a regression case | Before the skill |
| Where failures come from | Users and readers | The author's own cases |
| Real uses | Thousands | None for the current version. `/nap-start`'s first real use is still "next" |
| Cost of a test run | Free | $0.15 on Haiku, about $7 for both suites on Sonnet with an Opus judge (PR #90) |

Their gap is ours in reverse. They have real use and no measurement of the skill. We have measurement and no real use.

### What our evals do not show

Blunt notes on NAP's numbers, from reading the cases:

1. **Some checks pass or fail by construction.** `starts-on-an-idea` checks that the `nap-start` skill ran. Without the plugin there is no such skill, so plain Claude scores 0.00 whatever it does. `says-personal-tool` and `says-app` check for NAP's own type names, which plain Claude has never been told. These are fine as guards. They are not evidence that the skill helps. *Corrected during the cleanup:* an earlier draft of this point said the +0.52 was inflated by them. Recounting for the roadmap showed it is not, at the case level. Without the two guard cases the mean is +0.53, because one guard adds a full point and the other adds none. The type-name checks sit inside mixed cases, and the case scores in the repo can't separate them, so their effect is unknown until a run reports them apart.
2. **The honest gain is smaller on a stronger model.** PR #90 reran `/nap-start` on Sonnet: the mean gain fell from +0.52 to +0.38.
3. **Seven of eight cases test the first message only.** The eighth tests the write after "Approve". Nothing tests the middle: filling the gaps, the draft, and applying changes. That is most of the skill.
4. **The skill's core promise has no check.** Anything the user didn't say must end with *(suggested: why)*. No grader looks for that in the written brief. It is NAP's version of their "keep modality" rule, and theirs is asserted in a self-test.
5. **The cases check that the skill follows its own rules.** The same author wrote the rules and the graders on the same day. None of it shows that a brief is worth keeping. Only a real use can.

## 3. Side by side: what they do, what we do, and where our gaps are

| | Reference | NAP | Gap for NAP |
|---|---|---|---|
| The job | One: rewrite text under fixed rules | Four planned skills, two built, neither used on a real project | Wide plan, nothing proven in use |
| Time to first value | One turn | Two to seven questions, then a brief whose docs plan mostly follows from the type | Unknown whether the brief is worth a skill of its own. Real use decides |
| What "good" means | An outside standard, with rules you can point at | The author's judgment of what a good team writes | No outside yardstick. Not fixable, but it makes real use matter more |
| Rule that protects the user's content | Keep modality, add no fact. Stated five times and asserted in a test | Mark what the user didn't say. Stated in the skill, tested nowhere | Add the test |
| The README shows the result | Yes, above the install steps | No. Status, tables and history, with no example of a brief | Add one real brief |
| Default output | The thing itself, nothing around it | A brief after approval. Not yet seen in real use | Unknown |
| Honest limits | Specific: which rules, which checks, which claims | General: "honest limits" as a principle | Fine for now |
| A part that works without the model | The linter | None | None needed yet. See section 4 |
| Tests of the skill | None | Evals with a baseline | NAP is ahead |
| Where changes come from | Users, readers, validators | The author's plans and the author's evals | The largest gap |
| Shape of the history | One layout for four months. Restructures refused | Three architectures in three weeks. Two resets, on 14-11 and 20-11 | See below |
| Order of work | Shipped, then fixed what users met | Skill 2 built before skill 1 was used once | Breaks NAP's own "done" rule |
| Process documents | None | About 460 lines in `docs/` for one 111-line skill | Trim |
| Install | One command | Copy a folder | Cheap to fix, not urgent |
| Outside signal | 22 issues, 50 PRs, about 18 authors | 36 issues, all filed by the owner. No outside issue or PR | Follows from the rows above |

The history row, in numbers. NAP's `main` has 138 commits since 30-10-2026:

| Date | State | Files | Skills |
|---|---|---|---|
| 14-11-2026 | Tag `nap--v0.1.0`: plugin, hooks, event log, CI, 31 decisions | 299 | 5 |
| 14-11-2026, two hours later | First reset: four roles as plain files | 22 | 4 |
| 20-11-2026 | Team version with a Personal Assistant and a finish line (`b18d3e3`) | 29 | 8 |
| 20-11-2026, same day | Second reset: the documents before code | 49 | 1 |

Each reset was reasoned, and decision 1 gives good reasons for the last one. But each version was replaced before anyone had used it to finish a project. The reference repo's evidence points the other way: keep the shape, put it in front of use, and change what use breaks.

One more stale item outside the repo's files: the GitHub description of the repo still reads "An AI dev team for developers, with TDD, code review and CI built in." That is the first thing a visitor sees, and it describes the parked version.

## 4. What to adopt from them, and what to keep from NAP (with reasons)

### NAP as it stood before the cleanup

The audit behind the lists below. Blunt, part by part.

| Part | Verdict | Why |
|---|---|---|
| `CLAUDE.md` (26 lines) | Working | Short and accurate. It is missing one rule: don't start the next skill before the last one's real use. |
| `skills/nap-start/SKILL.md` (111 lines) | Working, unproven | Passes its cases. Its Gotchas come from watched failures, which is the right source. It has never run on a real project. Don't edit it again until it has. |
| `evals/nap-start/` (8 cases) | Working, with gaps | NAP's strongest asset. The gaps are in section 2: first message only, no check of the suggestion marks, and guard cases counted in the mean. |
| `evals/README.md` | Working | Clear and specific, with the traps written down. |
| `docs/decisions.md` (5 decisions) | Working | Each entry says what was decided, why, and what was given up. Keep the format. |
| `docs/design.md` (88 lines) | Salvageable | A design for four skills, five types and five traits, when one skill exists. Product and System, the "later" column of the traits table and "Documents that wait" describe things no project has asked for. `CLAUDE.md` says to add those only when a real project needs them. |
| `docs/roadmap.md` (71 lines) | Salvageable | It does three jobs: the phases, a results log and carry-over notes. The results and "what the evals caught" are worth keeping. The phase table lets phase 2 start before phase 1 is done. |
| `docs/skill-writing.md` (128 lines) | Half working, half dead | The skill half is good and current. The agent half, about 45 lines in three sections, is dead: NAP has no agents. |
| `docs/skill-research.md` (131 lines) | Mostly dead weight | The Engineer and Reviewer sections describe parked roles. The "what ours already does well" lists compare against skills that are no longer in the repo, and cite issues from the old version. About 40 lines are live: the PRD, ADR and backlog sources, the rules for adapting, and "Where to start". |
| `README.md` (61 lines) | Salvageable | It opens with "being rebuilt" and the team version's history. Three of the four skills in its table don't exist on `main`. It shows no output. |
| `THIRD_PARTY_NOTICES.md` | Working | Needed for the license. Its team-version entries point at files that are gone from `main`. Low priority. |
| `.claude-plugin/plugin.json`, `.gitignore`, `.gitattributes` | Working | Small, and each has a reason. |
| `.claude/settings.json` | Working | Left over from the version that touched GitHub. Harmless, and it still stops a session merging a PR. |
| Overall structure | Working | 49 files, under 1,000 lines. Nothing structural is in the way. |

### Adopt from the reference

1. **Use before more building.** Run `/nap-start` on A Day before any other change. Every change that made the reference skill better came from use, and none from a plan. NAP's own rule already says a skill is done after "one real use writes a document the user keeps". Hold to it.
2. **Show the result in the README.** Put the idea as typed and the brief NAP wrote above the install steps. Use the real brief from A Day. Their hand-written examples needed five corrections, so use real output, not an invented one.
3. **Test the rule that protects the user's content.** Add a grader that checks the written brief marks what the user didn't say. Their core rule has an assertion. Ours has none.
4. **Refuse to restructure.** Their layout never changed, and six PRs that would have changed or widened it were closed. NAP's next change should be to a line in a skill, caused by a real failure.
5. **Say what NAP can't check.** After the real use, list the specific things a brief can't know and NAP can't verify, the way their README does for the linter.
6. **One-command install, later.** A `marketplace.json` is 11 lines in their repo. Add it once there is a skill someone else would want. Not before.

### Do not adopt

1. **Having no evals of the skill.** They can afford it, because thousands of readers find the faults. NAP has no readers yet, so its evals are the only failure detector it has.
2. **A linter, for now.** Their rules are mechanical. NAP's are mostly judgment. The few mechanical checks NAP has (every heading present, no closing line left in the file) already live in regex graders. Write a standalone check only if real use shows documents drifting in a way a script could catch. Their 3,417 lines show where that road can lead.
3. **Hand-written examples as teaching material.** See item 2 above.

### Keep from NAP

1. **Evals with a plain-Claude baseline.** This is what the reference lacks, and what its closed PR #37 tried to add. It is the reason NAP can tell a useful rule from a decorative one.
2. **Tests before skills, and "watch plain Claude fail first".** It kept `/nap-start` to 111 lines and gave it a Gotchas section built from real transcripts.
3. **The rule for removing rules.** "A case that passes without the skill tests Claude, not NAP." The reference has no way to find a line that does nothing.
4. **`docs/decisions.md` in its current form.** Five entries, each with what was given up. The reference records its reasons only in commit messages.
5. **Decision 1: local files only, written after approval.** It made the skills cheap to test and removed the permission stalls. It also matches the reference's best trait: a small job that finishes.
6. **The short `CLAUDE.md`.**
7. **The lessons already written down.** "What the evals caught" and "Lessons from its runs" in the roadmap, and the traps in `evals/README.md`. These cost real runs to learn.

## 5. Recommendation

**A targeted cleanup. Not a restart.**

The reasons, from the findings above:

1. **A restart was done today.** Phase 0 parked the team version on 20-11-2026. What is on `main` is one day old and under 1,000 lines. Archiving it would archive the restart.
2. **Nothing in the current repo is structurally wrong.** The audit in section 4 found dead sections inside documents, and no dead structure. The skill, its cases and the decisions all work. A restart would rewrite the parts that are fine in order to remove about 150 lines that aren't.
3. **Restarting is NAP's failure pattern, not its cure.** Two resets in one week, each before the version had finished one real project. A third would be the same move again.
4. **The reference repo never restarted.** Its skill settled in 24 days and improved through use. Its maintainer closed every restructuring PR. The evidence from the project being copied is against restarting.
5. **The real gap can't be closed by either option.** NAP's missing piece is use. No file change supplies it. A cleanup is small enough to leave time for it. A restart puts it off again.

What would change this recommendation: if the real use of `/nap-start` on A Day produces a brief that isn't worth keeping, the question becomes whether the brief should be a skill at all. The likely answer then is to fold it into `/nap-prd`. That would be a change of design, made on evidence. It still would not be a restart of the repo.

### Before the cleanup: two things only the user can do

1. **Run `/nap-start` on A Day for real,** and keep or reject the brief. This comes first because several items below depend on it.
2. **Decide what to do with PR #90** (`/nap-prd`). Done: it was merged on 20-11-2026, before the cleanup. `/nap-prd` now waits for its real use, like `/nap-start`, and `CLAUDE.md` holds phase 3 until both have had one.

### Cut

One commit each.

1. **`docs/skill-writing.md`: the agent material.** Remove "How an agent differs from a skill", "Checklist for an agent" and "When an agent is the wrong tool", and the sources only they use. Retitle the file "How we write skills". Reason: NAP has no agents, and `CLAUDE.md` says so.
2. **`docs/skill-research.md`: the parked roles.** Remove the Engineer and Reviewer sections, the per-issue Tech Lead ideas, every "what ours already does well" and "what theirs does that ours does not" list, and "Documents to add later". Keep "How this was checked", the PRD, ADR and backlog source tables, "Rules for adapting" and "Where to start". Reason: the removed parts compare against skills that are no longer in the repo. They stay readable at commit `b18d3e3`.
3. **`docs/design.md`: what no project has asked for.** Reduce Product and System to one line under the types table. Remove the "Later, for App and up" column from the traits table, and the "Documents that wait" section. Reason: `CLAUDE.md`'s own rule, "add a skill, rule or document only when a real project shows it is needed".
4. **`README.md`: the history.** Reduce the status block and the team-version paragraphs to one line with the commit link.

### Rewrite

One commit each.

5. **`CLAUDE.md`: add the gate.** One line under "How we work": don't start the next skill until the last one has had its real use. Reason: phase 2 was built before phase 1 was used.
6. **`docs/roadmap.md`: make the gate visible, and count honestly.** Give the phase table a "Real use" column, apart from "Built". In the results table, mark `starts-on-an-idea`, `ignores-a-fix` and the type-name checks as guards, and give the mean gain without them. Add the Sonnet result next to the Haiku one.
7. **`evals/nap-start/`: test the core promise.** Add a grader to `writes-after-yes` that checks the written brief marks what the user didn't say with *(suggested: ...)*. This needs one eval run to confirm it passes.
8. **`evals/nap-start/`: test the middle.** Add one case from a saved conversation that stops after the user's first answer. It passes when the next message asks one question or shows the draft, with no stack and no plan. This also needs an eval run.
9. **`README.md`: show the result.** After the real use, put the idea and the brief it produced above "Install". List only the skills that exist on `main`. This item waits for the real use.
10. **The GitHub repo description.** Change it to match the README's first line. This is a repo setting, not a commit, so it is the user's to change.

### Keep as is

- `skills/nap-start/SKILL.md`. No edits until a real use or a failing case gives a reason.
- The 8 existing eval cases and `evals/README.md`.
- `docs/decisions.md`, all five decisions.
- `THIRD_PARTY_NOTICES.md`, `LICENSE`, `.claude-plugin/plugin.json`, `.claude/settings.json`, `.gitignore`, `.gitattributes`.
- The roadmap's "What the evals caught", "What carries over" and "Lessons from its runs".
- The tag `nap--v0.1.0` and commit `b18d3e3` as the archive of the earlier versions. Nothing needs moving into an `archive/` folder: git already holds it.

### If the decision is to restart anyway

So nothing valuable is lost, these carry over into a new version:

- `evals/nap-start/` whole, and `evals/README.md`. The cases describe behaviour, not the current skill's wording.
- `evals/nap-prd/` whole.
- The Gotchas section of `skills/nap-start/SKILL.md`, and "What plain Claude did" and "What the evals caught" from the roadmap.
- Decisions 1, 4 and 5.
- "How we test" and "Checklist for a skill" from `docs/skill-writing.md`.
- `THIRD_PARTY_NOTICES.md` and `LICENSE`.
- This document.
