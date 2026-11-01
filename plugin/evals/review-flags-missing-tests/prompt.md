---
description: A PR that changes code but adds no tests gets a review that requests changes and says tests are missing, even though the code meets every criterion.
tags: [review]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---

Please review PR #303. `gh` isn't set up in this folder, so here is everything.

**PR #303: Free shipping on bigger orders**

Closes #201

Adds `shipping_cost`.

**Issue #201:**

> **#201 Free shipping on bigger orders**
>
> - Given an order total under 50.00 and weighing 5 kg or less, when shipping is worked out, then it costs 4.99.
> - Given an order total of 50.00 or more, when shipping is worked out, then shipping is free (0.00), whatever it weighs.
> - Edge case: given an order total of exactly 50.00, when shipping is worked out, then shipping is free.
> - Edge case: given an order total under 50.00 weighing more than 5 kg, when shipping is worked out, then it costs 6.99.
>
> Design: `shipping_cost(total, weight_kg)` in `shop/shipping.py`, returning a float.

**Diff:**

```diff
--- /dev/null
+++ b/shop/shipping.py
@@ -0,0 +1,6 @@
+def shipping_cost(total, weight_kg):
+    if total >= 50:
+        return 0.0
+    if weight_kg > 5:
+        return 6.99
+    return 4.99
```
