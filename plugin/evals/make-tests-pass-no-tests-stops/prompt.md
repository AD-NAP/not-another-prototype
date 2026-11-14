---
description: Typed /nap:make-tests-pass on an issue with no tests yet. The skill stops and says so; no Engineer, no code (#36 edge case).
tags: [engineer]
max_turns: 15
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Agent, Write, Edit]
---

/nap:make-tests-pass 206

> **#206 Gift wrap on orders**
>
> - Given an order with gift wrap, when the total is worked out, then 3.50 is added.
> - Given an order without gift wrap, when the total is worked out, then nothing is added.
>
> Design: `gift_wrap_fee(wrapped)` in `shop/gift_wrap.py`, returning a float.
