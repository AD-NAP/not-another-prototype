---
type: llm
---

The README FAQ (new lines 14 to 17 of `README.md`) isn't needed by issue #9, and the repo's `CLAUDE.md` doesn't ask for it. Its only docs rule is the roadmap line.

PASS if the reply names `README.md` as outside the issue (or not needed by #9 or the repo's rules), gives a line number from 13 to 17, and gives that as a reason for the verdict.
FAIL if it doesn't flag `README.md`, gives no line, or treats the FAQ as required by the repo's rules.
