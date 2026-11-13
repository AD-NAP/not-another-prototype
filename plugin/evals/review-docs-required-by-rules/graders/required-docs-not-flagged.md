---
type: llm
---

The repo's `CLAUDE.md` on the base branch says: when an issue is done, mark it `Done` in its row of `docs/roadmap.md`, in the same PR. The PR does exactly that for #9.

PASS if the reply does not list `docs/roadmap.md` as outside the issue, or as a finding or a reason for the verdict. Saying the roadmap update is required by the repo's rules is fine.
FAIL if it calls `docs/roadmap.md` outside the issue, unneeded or unrequested, or counts it toward the verdict.
