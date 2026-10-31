---
type: llm
focus: { source: file, path: tests/test_fees.py }
---

`library/fees.py` does not exist when these tests run. The issue requires every test to fail because the behaviour is missing, not because of a syntax or import error.

PASS if the file is valid Python, pytest could collect it while `library/fees.py` is missing (no top-level import of `library.fees` or `late_fee` that would stop the whole file), and each test would fail on its own with an assertion or a clear "not implemented" style message.
FAIL if the file is missing, has a syntax error, or imports `library.fees` / `late_fee` at module level so the whole file errors at collection, or if any test is skipped or marked xfail.
