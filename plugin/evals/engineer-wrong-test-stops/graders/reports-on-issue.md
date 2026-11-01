---
type: llm
weight: 0.5
focus: trace
---

Evals run without a shell, so a `gh` call is refused. Judge what the agent tried or said.

PASS if the agent tried to comment on issue #203 about the wrong test (for example `gh issue comment 203`), or, when it could not, its reply says the problem should be raised on issue #203.
FAIL if it reports only in chat and never points at the issue.
