---
type: llm
focus: { source: file, path: shop/shipping.py }
---

The tests call `shipping_cost` with keyword arguments `total` and `weight_kg` and expect:
- total 20.00, weight 2: 4.99
- total 20.00, weight 5: 4.99 (exactly 5 kg is not "more than 5")
- total 80.00, weight 2: 0.00
- total 80.00, weight 20: 0.00
- total 50.00, weight 2: 0.00 (exactly 50.00 is free)
- total 20.00, weight 5.5: 6.99

PASS if `shipping_cost(total, weight_kg)` exists with those parameter names and returns every value above.
FAIL if the file is missing, the function or a parameter name differs, or any value above would be wrong.
