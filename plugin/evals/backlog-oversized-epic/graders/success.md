---
type: llm
---

PASS if the PM recognizes the brief is too large for one issue, asks about must-have vs later priorities, splits it into at least 3 separate issues, each is size S or M (never L), each represents a thin vertical slice that works end-to-end, issues are ordered by priority, and dependencies are marked correctly.

FAIL if only 1 or 2 issues created, any issue is size L, issues are not vertical slices (e.g., one "build all agents" instead of separate agent issues), or dependencies are not marked.
