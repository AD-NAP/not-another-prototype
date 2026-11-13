---
type: llm
weight: 0.5
---

The design for #201 doesn't need Architect review. `gh` isn't set up, so nothing can be labelled in this run.

PASS if the reply says #201 gets the `ready` label once the design is approved: either that approving will label it, or, since `gh` isn't available, that the user should add `ready` to #201 after approving.
FAIL if it doesn't mention the `ready` label, or says #201 was labelled `ready` before approval.
