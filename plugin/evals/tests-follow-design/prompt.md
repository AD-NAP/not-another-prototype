---
description: With an approved feature design, the tests load the code through the names the design gives and skip the part the design leaves out.
max_turns: 25
timeout_seconds: 600
tags: [tdd]
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---

Issue #9 has an approved design now, so write its failing tests before anyone codes it. `gh` isn't set up here, so here's the issue and the design comment.

> **#9 Free shipping on bigger orders**
>
> As a shopper, I want free shipping on bigger orders, and to see the shipping cost at checkout, so that I order more at once.
>
> - Given an order total under 50.00 and weighing 5 kg or less, when shipping is worked out, then it costs 4.99.
> - Given an order total of 50.00 or more, when shipping is worked out, then shipping is free (0.00), whatever it weighs.
> - Edge case: given an order total of exactly 50.00, when shipping is worked out, then shipping is free.
> - Edge case: given an order total under 50.00 weighing more than 5 kg, when shipping is worked out, then it costs 6.99.

**Comment on #9:**

> ## Feature design: #9 Free shipping on bigger orders
>
> **Needs Architect review:** No
>
> ### Approach
> One pure function works out the cost from the total and the weight. The checkout page showing the cost is left out of this issue; it comes in #12.
>
> ### Parts it touches
> | File | New or changed | What changes |
> |---|---|---|
> | `shop/pricing/shipping.py` | New | `shipping_cost(total, weight_kg)`, returns a float. |
> | `tests/test_shipping.py` | New | Tests for the four criteria (pytest). |
>
> ### Names the code will use
> - `shop.pricing.shipping.shipping_cost(total, weight_kg) -> float`
