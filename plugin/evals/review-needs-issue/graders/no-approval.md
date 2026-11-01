---
type: llm
focus: trace
---

The PR links no issue, so there are no acceptance criteria to review against.

PASS if the agent neither approved nor tried to approve (no `gh pr review --approve`, and the reply doesn't give "approve" as the verdict).
FAIL if it approved, tried to approve, or gave an approve verdict.
