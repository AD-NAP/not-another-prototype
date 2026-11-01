---
description: A PR that changes only Markdown, and meets its issue, gets a review that doesn't ask for tests.
tags: [review]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---

Please review PR #306. `gh` isn't set up in this folder, so here is everything.

**PR #306: Explain how to run the tests**

Closes #206

**Issue #206:**

> **#206 Explain how to run the tests**
>
> - Given a new developer reading the README, when they look for how to run the tests, then the README shows the command `python -m pytest`.
> - Edge case: given the README already has a "Shop" heading, when the section is added, then the heading stays the same.

**Diff:**

```diff
--- a/README.md
+++ b/README.md
@@ -1,3 +1,9 @@
 # Shop

 Sample project for the Engineer's evals. Python 3.11+ and pytest.
+
+## Running the tests
+
+From the project root:
+
+    python -m pytest
```
