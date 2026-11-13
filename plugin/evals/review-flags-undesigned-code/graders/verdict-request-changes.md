---
type: llm
---

`shipping_cost` meets every criterion and has tests, but `shop/shipping.py` also adds `express_cost`, which the design doesn't describe.

PASS if the reply gives one clear verdict: request changes.
FAIL if it approves, gives no verdict, or hedges.
