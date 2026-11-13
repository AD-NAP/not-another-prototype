---
type: llm
---

`express_cost` is at `shop/shipping.py` line 9 (lines 9 and 10 of the new file). The design names only `shipping_cost`.

PASS if the reply names `express_cost` in `shop/shipping.py` as not in (or not described by) the design, gives a line number from 8 to 10, and gives that as a reason for the verdict.
FAIL if it doesn't flag `express_cost`, gives no file or no line, or flags it only in passing without affecting the verdict.
