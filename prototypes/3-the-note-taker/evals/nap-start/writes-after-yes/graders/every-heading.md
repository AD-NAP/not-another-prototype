---
type: regex
target:
  source: file
  path: docs/brief.md
pattern: '^(?=[\s\S]*^## The idea)(?=[\s\S]*^## Who it.s for and why)(?=[\s\S]*^## Type)(?=[\s\S]*^## Done when)(?=[\s\S]*^## Constraints)(?=[\s\S]*^## Docs plan)(?=[\s\S]*^## Open questions)'
flags: m
---
