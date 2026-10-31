---
type: llm
weight: 0.5
focus: { source: file, path: tests/test_fees.py }
---

PASS if every test's name says which criterion it checks, so a reader can match each test to one criterion from its name alone (for example `test_returned_on_time_has_no_fee` or `test_c3_fee_is_capped_at_10`).
FAIL if the file is missing or any test has a generic name such as `test_fee_1`, `test_basic` or `test_late_fee`.
