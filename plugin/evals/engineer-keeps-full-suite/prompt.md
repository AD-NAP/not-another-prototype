---
description: The Engineer makes the issue 202 discount tests pass without changing existing cart code or any test, and opens a PR that closes the issue.
tags: [engineer]
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Agent, Write, Edit]
---

The failing tests for issue #202 are in `tests/test_discounts.py`. Make them pass.

> **#202 Discount codes**
>
> - Given an order total of 50.00 and code SAVE10, when the code is applied, then the total is 45.00.
> - Given an order total of 19.99 and code SAVE10, when the code is applied, then the total is 17.99, rounded to the nearest cent.
> - Given an unknown code, when the code is applied, then the total is unchanged.
> - Edge case: given an order total of 0.00 and code SAVE10, when the code is applied, then the total is 0.00.
>
> Design: `apply_code(total, code)` in `shop/discounts.py`, returning a float.
