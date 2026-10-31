---
type: llm
focus: { source: file, path: test/usernames.test.js }
---

`src/usernames.js` does not exist when these tests run. The issue requires every test to fail because the behaviour is missing, not because of a syntax or import error.

PASS if the file is valid JavaScript, the test runner could load it while `src/usernames.js` is missing (no top-level static `import ... from` of that module that would stop the whole file), and each test would fail on its own with an assertion or a clear "not implemented" style message.
FAIL if the file is missing, has a syntax error, statically imports `src/usernames.js` at the top so the whole file errors on load, or any test is skipped or marked todo.
