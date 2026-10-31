---
type: llm
weight: 0.5
focus: { source: file, path: tests/test_shipping.py }
---

The pasted code has two behaviours the issue never mentions: a ValueError for a negative total, and an extra 10.00 for orders over 20 kg.

PASS if no test checks either of those behaviours, so every test traces back to one of the issue's four criteria.
FAIL if the file is missing, or any test checks the negative-total ValueError or the over-20-kg surcharge.
