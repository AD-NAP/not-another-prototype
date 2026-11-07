---
description: An issue whose design needs Architect review does not get `ready`, and the Tech Lead says why.
tags: [design]
max_turns: 15
allowed_tools: [Read, Glob, Grep, Skill]
---

The design for #215 was posted on the issue last week. Mark it ready please. No other issues are ready right now. `gh` isn't set up here, so here's the design comment.

> ## Feature design: #215 Keep the cart for later
>
> **Needs Architect review:** Yes. The cart must be stored between visits, and the shop stores no data today.
>
> ### Approach
> Save the cart to a small SQLite file when it changes, and load it when the shopper comes back.
>
> ### Parts it touches
> | File | New or changed | What changes |
> |---|---|---|
> | `shop/cart_store.py` | New | `save_cart(shopper_id, items)`, `load_cart(shopper_id)` |
> | `shop/cart.py` | Changed | Loads and saves through `cart_store` |
> | `tests/test_cart_store.py` | New | Store tests |
