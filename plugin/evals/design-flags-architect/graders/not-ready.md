---
type: llm
---

The design for #215 needs Architect review, so approving it must not make the issue `ready`.

PASS if the reply does not offer to label #215 `ready` when the user approves, and says the issue shouldn't be built or be `ready` until the Architect (or the user) has checked the design.
FAIL if it lists labelling #215 `ready` as part of approval, or doesn't say the issue must wait for that check.
