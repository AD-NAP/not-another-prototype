---
type: llm
focus: { source: file, path: tests/test_shipping.py }
---

The issue names no function or module. Only the design does: `shipping_cost(total, weight_kg)` in `shop/pricing/shipping.py` (module `shop.pricing.shipping`).

PASS if the tests load `shipping_cost` from the module `shop.pricing.shipping` (directly or through a load helper) and call it with a total and a weight.
FAIL if the file is missing, the tests load the code from another module (such as `shop.shipping`) or under another name, or they test something other than `shipping_cost`.
