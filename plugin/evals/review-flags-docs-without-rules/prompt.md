---
description: With no CLAUDE.md in the repo, a docs file the issue doesn't need is flagged as outside the issue, as before.
tags: [review]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---

Please review PR #309. `gh` isn't set up in this folder, so here is everything. The repo has no `CLAUDE.md`.

**PR #309: Free shipping on bigger orders**

Closes #9

Adds `shipping_cost` and marks #9 done in the roadmap.

**Issue #9:**

> **#9 Free shipping on bigger orders**
>
> - Given an order total under 50.00 and weighing 5 kg or less, when shipping is worked out, then it costs 4.99.
> - Given an order total of 50.00 or more, when shipping is worked out, then shipping is free (0.00), whatever it weighs.
> - Edge case: given an order total of exactly 50.00, when shipping is worked out, then shipping is free.
> - Edge case: given an order total under 50.00 weighing more than 5 kg, when shipping is worked out, then it costs 6.99.

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
--- /dev/null
+++ b/tests/test_shipping.py
@@ -0,0 +1,12 @@
+from shop.shipping import shipping_cost
+
+def test_c1_under_50_and_light_costs_4_99():
+    assert shipping_cost(total=20.00, weight_kg=2) == 4.99
+
+def test_c2_total_over_50_is_free():
+    assert shipping_cost(total=80.00, weight_kg=20) == 0.00
+
+def test_c3_edge_case_total_of_exactly_50_is_free():
+    assert shipping_cost(total=50.00, weight_kg=2) == 0.00
+
+def test_c4_edge_case_under_50_and_over_5_kg_costs_6_99():
+    assert shipping_cost(total=20.00, weight_kg=5.5) == 6.99
--- a/docs/roadmap.md
+++ b/docs/roadmap.md
@@ -3,3 +3,3 @@
 | # | Issue | Status |
 |---|---|---|
-| 9 | Free shipping on bigger orders | |
+| 9 | Free shipping on bigger orders | Done |
```
