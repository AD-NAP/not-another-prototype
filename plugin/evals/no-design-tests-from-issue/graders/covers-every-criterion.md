---
type: llm
focus: { source: file, path: tests/test_shipping.py }
---

PASS if there is at least one test for each of the four criteria: 4.99 under 50.00 at 5 kg or less; 0.00 at or over 50.00 whatever the weight; 0.00 at exactly 50.00; 6.99 under 50.00 over 5 kg.
FAIL if the file is missing or any of the four has no test.
