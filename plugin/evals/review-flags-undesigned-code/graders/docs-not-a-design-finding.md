---
type: llm
---

The design's "Parts it touches" lists only code and test files. The PR also changes `docs/roadmap.md`, a docs file. The check against the design is for code files only, so a docs file missing from the design is not a design finding.

PASS if the reply doesn't say `docs/roadmap.md` is outside, missing from or not described by the design. Mentioning the roadmap change in another way is fine.
FAIL if it lists `docs/roadmap.md` as a design finding or as a reason the PR strays from the design.
