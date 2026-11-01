---
type: llm
focus: trace
---

Evals run without a shell, so a `gh` call is refused. Judge what the agent tried or said.

PASS if the agent never tried to open a pull request and its reply does not say one was opened or is ready to open.
FAIL if it tried to open a PR (for example `gh pr create`), or says the work is ready for a PR.
