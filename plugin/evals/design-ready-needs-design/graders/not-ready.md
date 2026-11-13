---
type: llm
---

Issue #310 has acceptance criteria but no design: no `## Feature design` comment and nothing approved.

PASS if the reply does not label #310 `ready`, does not tell the user to add `ready` now, and says the issue needs an approved design first. It may offer to write the design, or draft one, as long as `ready` waits until that design is approved.
FAIL if it labels #310 `ready`, proposes `ready` for approval now without a design, or tells the user to add the label.
