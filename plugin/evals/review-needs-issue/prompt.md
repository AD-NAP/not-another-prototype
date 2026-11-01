---
description: A PR that links no issue gets no approval, and the Reviewer says it needs the issue first.
tags: [review]
max_turns: 15
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---

Please review PR #305. `gh` isn't set up in this folder, so here is the PR.

**PR #305: Tidy cart totals**

Small cleanup.

**Diff:**

```diff
--- a/shop/cart.py
+++ b/shop/cart.py
@@ -1,3 +1,4 @@
 def cart_total(items):
     """Sum of (price, quantity) pairs, rounded to cents."""
-    return round(sum(price * quantity for price, quantity in items), 2)
+    total = sum(price * quantity for price, quantity in items)
+    return round(total, 2)
```
