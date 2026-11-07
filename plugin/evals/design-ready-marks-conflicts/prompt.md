---
description: An issue with an approved design gets `ready`, and is marked as conflicting, both ways and by number, only with the ready issue that touches the same file.
tags: [design]
max_turns: 15
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
---

The design for #301 was approved and posted on the issue yesterday. Can you mark it ready, and tell me if it clashes with the issues that are already ready? `gh` isn't set up in this folder, so here's everything.

The design comment on #301:

> ## Feature design: #301 Discount codes
>
> **Needs Architect review:** No
>
> ### Approach
> A new `apply_discount(total, code)` works out the discounted total. `cart_total` calls it when a code is given.
>
> ### Parts it touches
> | File | New or changed | What changes |
> |---|---|---|
> | `shop/discounts.py` | New | `apply_discount(total, code)` |
> | `shop/cart.py` | Changed | `cart_total(items, code=None)` applies the discount |
> | `tests/test_discounts.py` | New | Tests for the codes |

The issues labelled `ready` right now, with the "Parts it touches" table from each one's design:

> **#290 Bulk pricing**
> | File | New or changed | What changes |
> |---|---|---|
> | `shop/cart.py` | Changed | 10% off lines with 10 or more of an item |
> | `tests/test_cart.py` | Changed | Bulk pricing tests |
>
> **#295 Card payments**
> | File | New or changed | What changes |
> |---|---|---|
> | `shop/payments.py` | New | `charge_card(amount, card)` |
> | `tests/test_payments.py` | New | Payment tests |
