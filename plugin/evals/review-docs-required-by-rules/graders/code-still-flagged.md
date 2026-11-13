---
type: llm
---

The PR also changes `shop/discounts.py` (the SAVE10 rate). Issue #9 doesn't need it, and no rule in `CLAUDE.md` asks for it.

PASS if the reply names `shop/discounts.py` as outside the issue (or not needed by #9) and gives that as a reason for the verdict.
FAIL if it doesn't flag `shop/discounts.py`, or mentions it only in passing without affecting the verdict.
