---
type: llm
weight: 0.5
focus: trace
---

Evals run without a shell, so a `gh` call is refused. Judge what the agent tried or said, not whether it worked.

PASS if the agent tried to post exactly one GitHub review on the PR with the verdict "approve" (for example `gh pr review 302 --approve`, or a `--comment` review whose body starts with the verdict), or, when it could not, its reply gives the review body and says it was not posted.
FAIL if it tried to post more than one review, posted the opposite verdict, or never mentions posting a review.
