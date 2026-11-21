# Lessons from three prototypes

Written 20-11-2026, before the third restart. NAP was built three times in three weeks and reset each time. This note says what went wrong, what fixed it, what to keep and what to throw away. It is the reference for whatever comes next: read it before proposing a new skill, a new rule or another restart.

Sources: the git history, the decisions and roadmaps of each attempt, the eval results, and two real sessions on 20-11-2026. The attempts themselves are in [`prototypes/`](../prototypes/README.md).

## The three attempts

| | 1. The plugin | 2. The team | 3. The note-taker |
|---|---|---|---|
| Dates | 30-10 to 14-11-2026 | 14-11 to 20-11-2026 | 20-11-2026 |
| What it was | A Claude Code plugin: five roles, lane hooks, an event log, CI, sprints, and a planned pixel office | Plain files: a PM, an Architect, an Engineer, a Reviewer, a Personal Assistant that ran the loop, and a finish line check | Two skills that write a brief and a PRD as local files, tuned to add little |
| Size at the end | 299 files, 268 of them eval files. 30 decisions, about 1,000 lines of hooks | 29 files, 8 skills, 2 agents, 14 decisions | 105 files, 2 skills, 17 eval cases |
| Tested by | 11 eval cases | Full runs on three test projects, hours each | Evals against plain Claude, then two real sessions |
| What worked | The roles, one at a time. Dogfooding found real gaps | The planning half passed every run: scope, PRD, versions, milestones | The interview mechanics, and the eval method |
| Why it ended | The guardrails grew faster than the team, and the loop still needed hand patches | Every blocker came from the build half, and every test took hours | The documents were too thin to plan a real project |
| Where it is | Tag `nap--v0.1.0` | Commit `b18d3e3` | `prototypes/3-the-note-taker/` |

## What stayed the same

The name, and the aim behind it: plan a project the way a team with good practice would, so the result is not another prototype. Every attempt was a different guess at how.

## What went wrong

### In each attempt

**1. The plugin.** It tried to enforce good practice with tools before any project had gone from start to finish. Five roles came with 30 decisions and dozens of eval cases. Splitting the Test Engineer from the Engineer caused the test hand-off bug, the worktree problems and the need for lane hooks. Most open gaps came from the guardrails, not the roles.

**2. The team.** It was a chain of roles, and every hand-off could break. Almost every step acted on GitHub, so it met permission prompts, allow lists, self-approval rules and Windows paths. In the last full run, all nine blockers came from the build half, and most were problems of the environment that no prompt line fixes. The only test was a full run that took hours of a limited plan, found five to nine problems at once, and could not show which fix worked.

**3. The note-taker.** It overcorrected. Its eval cases were built by watching plain Claude over-plan and penalising that, so the skills learned restraint: "add little", two or three versions, about 300 words. On a real App, the PRD wrote down what the user said and little else. It parked the project's biggest risk as an open question while the first version built screens and an installer. It had no versions between v0.1 and v1.0, no quality targets and no risks.

### Across all three

1. **The design came before the knowledge.** NAP set out to copy how a good team plans, without first writing down what such a team writes, who writes it, and why. So the set of documents was guessed three times. The direction became clear only after walking through the real workflow, from a one-line request to developers picking up stories.
2. **Each reset threw away something that worked.** The first removed the evals, and attempt 2 then had no cheap test. The second removed the fuller planning that had passed every run in attempt 2, and attempt 3 then planned too little.
3. **Each reset swung past the middle.** Too heavy, then too hands-on, then too thin.
4. **Things were built before the last thing was used.** Five roles before one finished project. `/nap-prd` before `/nap-start` had been used once.
5. **The tests measured the wrong thing.** Attempt 3's evals checked that the skills followed their own rules. The reported gain over plain Claude measured restraint, not whether a document was worth building from. A real session showed the gap in one afternoon.
6. **Rules piled up to patch each miss.** Hooks in attempt 1, prompt lines in attempt 2, a sentence per failed run in attempt 3. Each patch fixed the miss it saw, and a different one appeared.
7. **No one else used it.** Every issue in the repo was filed by its owner. All feedback came from the builder and the builder's own tests.

## What fixed it

These worked when they were tried.

- **Local files only.** Skills that only read and write files are cheap to test and never stall on a permission prompt.
- **A plain-Claude baseline.** It shows which rules add nothing. A case that passes without the skill tests Claude, not NAP.
- **Red before green.** Run a new check against the old skill first. Several new checks passed on the old skill, so they tested nothing.
- **Nine runs for a flake.** A rule that holds two times in three passes three runs by luck too often.
- **A real session.** Two sessions found what no eval could: a worktree made before writing, a question left open that the user could have answered, guesses named in chat and missing from the file, and documents too thin to use. Pasting the whole transcript back was worth more than notes.
- **Saying what a thing is.** The first question was forbidden from being double in three places and still was, one run in three. Describing its shape took it to 9 of 9.
- **Narrowing a rule until it can hold.** "Mark anything the user didn't say" passed 2 runs in 5. "Mark the choices they might disagree with" passed 16 in 18.
- **A fresh session for each eval round,** with a cost estimate first and the judge's cost counted.
- **Reading how a project that worked had grown.** The [reference analysis](../prototypes/3-the-note-taker/docs/reference-analysis.md) showed a skill that settled in 24 days and improved only through use.

## What to keep

- The eval method: cases in the repo, a baseline, cheap graders first, a stronger judge than the model under test, and reading the transcripts.
- The interview mechanics that held up in real sessions: read what exists first, one question per message, a suggested answer for anything that isn't the user's own view, write only after a clear yes, and write in the current folder.
- Marking the skill's own choices in the document, so a reader can tell them from the user's.
- Sizing by type. A script still gets a short brief.
- Local files only, with the user committing.
- The decisions format: what was decided, why, and what was given up.
- Attempt 2's planning ideas: the scope question first, a fresh reader that lists what it would have to guess, and "done when" as checks a person can run.
- Plain, short writing, and one term per idea.

## What to throw away

- **"Add little" as a goal.** The skill is there to contribute what a senior planner knows. Restraint belongs to how a contribution is offered, marked and confirmed, not to whether it is made.
- **Word limits as a measure of quality.** A limit guards the reader's time. It does not say the document is complete.
- **A fixed number of versions.** Risks decide how many versions there are.
- **The mean gain over plain Claude as the headline.** It can rise while the documents get worse.
- **Skills that act on GitHub or run a build.** Attempt 2 showed where that goes.
- **Enforcement by hooks, an event log, sprints and ceremonies.** Attempt 1 showed where that goes.
- **Guessing the document set.** It is now derived from how a team works, by project type.

## What was never tested

- Whether fuller documents make an AI-built project go better. This is NAP's central claim, and no attempt has measured it.
- Whether a person reads a long document before approving it.
- The Product and System types, at all.
- A tech plan or a backlog written by attempt 3's skills. They were never built.
- An interview that runs in stages over several documents.
- Anyone but the owner using NAP.

## Warning signs

Stop and read this note when one of these shows up.

- A second skill is being built before the first has been used on a real project.
- A fix is the third sentence added to the same rule.
- A number is improving, and nobody has read the documents it measures.
- A new document, role or type is being added with no real project asking for it.
- A step needs a permission prompt, a network call or a full run to test.
- The plan has more phases than the product has users.
- "Start over" sounds better than "fix this line".

## What it cost

- Three weeks, from 30-10 to 20-11-2026.
- 166 commits on `main`, 94 pull requests and 36 issues.
- Full runs of attempt 2 took hours each, on a plan with usage limits.
- About $20 of evals on 20-11-2026 alone. One case-run costs about $0.12 with the judge, and a full pass of two suites about $11.

## When a restart is allowed

This is the third restart. To make it the last one, a fourth needs all three of these:

1. The current version has been used on at least two real projects, through to its last document.
2. A note names what that use showed, and why no fix to the current version can reach it.
3. The new direction is written down and approved before anything is moved.

If any of the three is missing, fix the line that failed.

## Where the new version starts

From an approved plan, not from a blank page: five project types, the documents each one needs, and the traits that add to them. It is in [design.md](design.md). The method above carries over. The skills are written again.

## What happened next

On 21-11-2026, before any new skill was written, a test showed that BMAD Method already does most of what the plan set out to do. NAP paused as a lessons-learnt repo ([decision 5](decisions.md#5-nap-pauses-as-a-lessons-learnt-repo-2026-11-21)).

**The eighth lesson: compare against what exists before building.** BMAD was in the prior-art research on 30-10-2026. It wasn't run against NAP's plan until three attempts later, and that one test changed the direction more than any eval had.
