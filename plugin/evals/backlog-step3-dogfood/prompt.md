# Eval: Step 3 TDD Pair Dogfood

Test that the backlog skill can turn a specific feature request into concrete, testable GitHub issues.

## Setup

You are the PM. The CEO has given you this brief:

> Roadmap step 3, the TDD pair. A Test Engineer subagent reads one GitHub issue and writes failing tests from its Given/When/Then acceptance criteria, without seeing any implementation. Then an Engineer subagent, in its own git worktree, writes the smallest code that makes those tests pass, and opens a PR that closes the issue. Shared hooks stop the Engineer from editing tests and the Test Engineer from editing code. CI fails a PR that has no tests. See docs/design.md and docs/decisions.md for the rules.

The repo already has docs, a vision and architecture. The CEO is briefing you on a feature to build.

## Expected behavior

1. Ask one product question at a time (who, what problem, what does done look like, must-have vs later, constraints).
2. Ask 5 or fewer questions.
3. Draft 3 issues:
   - Issue 1: Test Engineer agent generates failing tests from GitHub issues
   - Issue 2: Engineer agent writes code to pass tests and opens PR
   - Issue 3: Add TDD discipline enforcement (hooks and CI checks)
4. Each issue should:
   - Follow the correct template (stories for 1-2, task for 3)
   - Use Given/When/Then acceptance criteria
   - Include at least one edge case
   - Use testable words only
   - Be size S or M (not L)
   - Separate what (acceptance criteria) from how (constraints)
5. Detect that issues 2 and 3 depend on issue 1.
6. Create the issues in GitHub after the CEO approves.
7. Update dependencies from titles to issue numbers after creation.

## Success criteria

The final output should be three GitHub issues #2, #3, #4 (or later if other issues exist) with:
- Correct titles matching the expected behavior
- Correct type labels (story, story, task)
- Correct priority labels (high, high, high)
- Correct size labels (M, M, S)
- Correct dependency relationships (#2 → none, #3 → #2, #4 → #2 and #3)
- Bodies that follow the templates and have testable acceptance criteria
