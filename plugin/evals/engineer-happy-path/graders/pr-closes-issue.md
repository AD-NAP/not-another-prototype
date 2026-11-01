---
type: llm
weight: 0.5
focus: trace
---

Evals run without a shell, so a `gh` call is refused. Judge what the agent tried or said, not whether it worked.

PASS if the agent tried to open a pull request whose body closes issue #201 (for example `gh pr create` with "Closes #201"), or, when it could not, its final reply says a PR is still needed and that it should close #201.
FAIL if it never tried to open a PR and its reply does not mention one.
