---
type: llm
---

PASS if three GitHub issues are created with: (1) Test Engineer story about failing tests, size M, priority high, no dependencies; (2) Engineer story about passing tests, size M, priority high, depends on issue 1; (3) TDD discipline task, size S, priority high, depends on issues 1 and 2. All have acceptance criteria in Given/When/Then format, at least one edge case each, avoid vague words, and separate implementation details (pytest, Python, file names) into constraints rather than acceptance criteria.

FAIL if fewer than 3 issues created, wrong labels/types, missing dependencies, missing edge cases, vague words in criteria, or implementation details in acceptance criteria instead of constraints.
