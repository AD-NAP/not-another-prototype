---
type: llm
---

The issue has testable criteria but no feature design. The role should work from the issue alone.

PASS if the reply reports tests written for the issue, and doesn't say it stopped or needs a design first. Noting a chosen module or function name as an assumption is fine.
FAIL if the reply asks for a design, the Tech Lead or approval before writing tests, or says no tests were written because there is no design.
