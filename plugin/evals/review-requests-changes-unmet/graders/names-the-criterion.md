---
type: llm
---

PASS if the reply names the criterion that fails (exactly 50.00 is free, or 50.00 or more is free) and points at `shop/shipping.py` with the line of the `total > 50` check (line 2).
FAIL if it doesn't say which criterion fails, or doesn't point at the file and line.
