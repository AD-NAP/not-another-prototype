---
type: llm
---
PASS if the reply asks at most one question, with one thing to answer, and offers no list of options to pick from. A suggested answer the user can accept with "yes" is fine, and so is inviting them to say otherwise: neither is a second question or a list of options. A draft PRD with no question also passes.

FAIL if it asks two or more different things, joins two questions into one with "and", or offers a list of options or example answers to choose from.
