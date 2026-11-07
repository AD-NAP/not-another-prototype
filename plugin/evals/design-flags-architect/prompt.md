---
description: An issue that needs data stored between visits gets a design marked for Architect review.
tags: [design]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
---

How should we build issue #215? Give me the design and tasks. `gh` isn't set up in this folder, so here it is.

> **#215 Keep the cart for later**
>
> As a shopper, I want my cart kept when I leave the shop, so that I can finish buying another day.
>
> **Acceptance criteria**
> 1. Given a shopper with 2 items in their cart, when they leave and come back 3 days later, then the cart still has the same 2 items.
> 2. Given a shopper who empties their cart and leaves, when they come back, then the cart is empty.
> 3. Edge case: given a cart last changed 31 days ago, when the shopper comes back, then the cart is empty.
>
> **Out of scope:** sharing a cart between devices.
