---
type: llm
focus: { source: file, path: tests/test_fees.py }
---

The issue has four criteria: (1) returned on or before the due date gives 0.00, (2) 3 days late gives 0.75, (3) 60 days late is capped at 10.00, (4) no return date raises ValueError.

PASS if the file has at least one test for each of the four criteria, each with concrete dates and the exact expected result from the criterion (0.00, 0.75, 10.00, ValueError). Extra tests are fine.
FAIL if the file is missing, any criterion has no test, or a test expects a different value than the criterion states.
