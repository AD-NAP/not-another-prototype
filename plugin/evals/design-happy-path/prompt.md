---
description: An issue with clear criteria gets a short design with real files, the names the code will use, and tasks linked to criteria, shown for approval before anything is posted.
tags: [design]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
---

Can you plan how we build issue #201 before anyone writes tests? `gh` isn't set up in this folder, so here it is.

> **#201 Free shipping on bigger orders**
>
> As a shopper, I want free shipping on bigger orders, so that I'm rewarded for buying more.
>
> **Acceptance criteria**
> 1. Given an order total under 50.00 and weighing 5 kg or less, when shipping is worked out, then it costs 4.99.
> 2. Given an order total of 50.00 or more, when shipping is worked out, then shipping is free (0.00), whatever it weighs.
> 3. Edge case: given an order total of exactly 50.00, when shipping is worked out, then shipping is free.
> 4. Edge case: given an order total under 50.00 weighing more than 5 kg, when shipping is worked out, then it costs 6.99.
>
> **Out of scope:** showing shipping at checkout; other countries.
