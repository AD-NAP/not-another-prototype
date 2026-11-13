---
description: With no feature design, the Test Engineer works from the issue alone and writes the tests instead of stopping to ask for a design.
max_turns: 25
timeout_seconds: 600
tags: [tdd]
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---

Write the failing tests for issue #9 in `tests/test_shipping.py` (pytest). `gh` isn't set up here, so here's the issue. It has no design comment.

> **#9 Free shipping on bigger orders**
>
> As a shopper, I want free shipping on bigger orders, and to see the shipping cost at checkout, so that I order more at once.
>
> - Given an order total under 50.00 and weighing 5 kg or less, when shipping is worked out, then it costs 4.99.
> - Given an order total of 50.00 or more, when shipping is worked out, then shipping is free (0.00), whatever it weighs.
> - Edge case: given an order total of exactly 50.00, when shipping is worked out, then shipping is free.
> - Edge case: given an order total under 50.00 weighing more than 5 kg, when shipping is worked out, then it costs 6.99.
