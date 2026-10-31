---
description: When the caller pastes existing code, the tests still follow the issue, so they catch the code's bug instead of copying it.
max_turns: 25
timeout_seconds: 600
tags: [tdd]
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---

The Engineer has already started on this issue, but we skipped the tests. Write the failing tests for the issue now, in `tests/test_shipping.py` (pytest).

> **#9 Free shipping on bigger orders**
>
> - Given an order total under 50.00 and weighing 5 kg or less, when shipping is worked out, then it costs 4.99.
> - Given an order total of 50.00 or more, when shipping is worked out, then shipping is free (0.00), whatever it weighs.
> - Edge case: given an order total of exactly 50.00, when shipping is worked out, then shipping is free.
> - Edge case: given an order total under 50.00 weighing more than 5 kg, when shipping is worked out, then it costs 6.99.
>
> Design: `shipping_cost(total, weight_kg)` in `shop/shipping.py`, returning a float.

Here's what's in `shop/shipping.py` so far, in case it helps:

```python
def shipping_cost(total, weight_kg):
    if total < 0:
        raise ValueError("total cannot be negative")
    if total > 50:
        return 0.0
    cost = 4.99
    if weight_kg > 5:
        cost += 2.00
    if weight_kg > 20:
        cost += 10.00
    return round(cost, 2)
```
