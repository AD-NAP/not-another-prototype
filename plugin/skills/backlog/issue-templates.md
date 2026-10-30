# Issue templates

Pick the template for the issue's type. Keep every section. Write "None" when a section is empty.

## Story

For new behaviour a user will notice.

```markdown
## User story
As a <who>, I want <what>, so that <why>.

## Acceptance criteria
- [ ] Given <situation>, when <action>, then <observable result>.
- [ ] Given <situation>, when <action>, then <observable result>.
- [ ] Edge case: given <unusual situation>, when <action>, then <observable result>.

## Out of scope
- <what this issue deliberately leaves out>

## Constraints
- <limits the user gave, or "None">

## Notes
- <assumptions made, or "None">

Size: S | M
Priority: high | medium | low
Depends on: <issue title or number, or "None">
```

## Bug

For behaviour that is wrong today.

```markdown
## What happens
<the wrong behaviour, in one or two sentences>

## Steps to reproduce
1. <step>
2. <step>

## Expected
<what should happen>

## Acceptance criteria
- [ ] Given <the bug's situation>, when <the steps happen>, then <the correct result>.
- [ ] Edge case: given <related situation>, when <action>, then <observable result>.

## Out of scope
- <what this fix deliberately leaves out>

Size: S | M
Priority: high | medium | low
Depends on: <issue title or number, or "None">
```

## Task

For work users don't see directly, such as CI, setup or cleanup. Give a plain reason. Don't force an "As a developer" story.

```markdown
## Why
<why this is needed, in one or two sentences>

## Acceptance criteria
- [ ] Given <situation>, when <action>, then <observable result>.
- [ ] Edge case: given <unusual situation>, when <action>, then <observable result>.

## Out of scope
- <what this task deliberately leaves out>

Size: S | M
Priority: high | medium | low
Depends on: <issue title or number, or "None">
```

## A good example

Title: **Mark quiz answers right or wrong**

```markdown
## User story
As a learner, I want to see if each answer is right or wrong,
so that I learn from my mistakes straight away.

## Acceptance criteria
- [ ] Given a question with options A to D where B is correct,
      when the learner picks B,
      then the app shows "Correct" and adds 1 to the score.
- [ ] Given the same question,
      when the learner picks C,
      then the app shows "Wrong", shows that B was correct,
      and the score stays the same.
- [ ] Given a question that was already answered,
      when the learner answers it again,
      then the answer and the score don't change.
- [ ] Edge case: given no option is chosen,
      when the learner presses "Submit",
      then the app asks them to choose an option and nothing is marked.

## Out of scope
- Showing an explanation of why the answer is correct.
- Saving scores between sessions.

## Constraints
- None

## Notes
- Assumed one correct option per question.

Size: S
Priority: high
Depends on: Generate quiz questions for a topic
```

Why it's good: each criterion names a starting situation, one action and a result a test can check. There's an edge case. Nothing says how to build it.

## Common mistakes

| Mistake | Better |
|---|---|
| "The quiz should be fast." | "Given 10 questions, when the learner opens the quiz, then the first question shows within 1 second." |
| "Store answers in a Redis cache." | Leave the storage choice to the Tech Lead. If the user required Redis, list it under Constraints. |
| "Build the quiz feature." (size L) | Split into: generate questions, mark answers, show the final score. |
| "As a developer, I want CI." | Use the task template: "Why: PRs can be merged with failing tests today." |
| "Then the Engineer writes only the minimal code." | Can't be tested. Move the intent to Notes, or test something checkable: "then the full test suite passes, not only the new tests." |
| "Can be tested with the tests from issue 1." | Refer to other issues by title in the draft, and by #number once they exist. |
| A task with two hooks and a CI check, sized S. | Two or more separate mechanisms is at least M. Three or more: split it. |
