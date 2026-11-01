---
description: The Engineer writes the code that makes the issue 201 tests pass, without touching the tests, and opens a PR that closes the issue.
tags: [engineer]
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Agent, Write, Edit]
---

The failing tests for issue #201 are in `tests/test_shipping.py`. Make them pass.

> **#201 Free shipping on bigger orders**
>
> - Given an order total under 50.00 and weighing 5 kg or less, when shipping is worked out, then it costs 4.99.
> - Given an order total of 50.00 or more, when shipping is worked out, then shipping is free (0.00), whatever it weighs.
> - Edge case: given an order total of exactly 50.00, when shipping is worked out, then shipping is free.
> - Edge case: given an order total under 50.00 weighing more than 5 kg, when shipping is worked out, then it costs 6.99.
>
> Design: `shipping_cost(total, weight_kg)` in `shop/shipping.py`, returning a float.
