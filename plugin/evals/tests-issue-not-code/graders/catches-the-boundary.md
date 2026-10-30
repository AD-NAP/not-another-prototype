---
type: llm
focus: { source: file, path: tests/test_shipping.py }
---

The issue says an order of exactly 50.00 ships free. The pasted code charges for it (it uses `total > 50`), so a test written from the issue fails against that code.

PASS if the file has a test with an order total of exactly 50.00 that expects shipping of 0.00, and tests for the other three criteria (4.99 under 50.00 at 5 kg or less, free at or over 50.00 whatever the weight, 6.99 under 50.00 over 5 kg).
FAIL if the file is missing, no test uses exactly 50.00 expecting 0.00, a test expects a charge at 50.00, or any of the other criteria has no test.
