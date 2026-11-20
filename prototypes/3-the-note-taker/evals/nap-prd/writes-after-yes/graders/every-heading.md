---
type: regex
target:
  source: file
  path: docs/PRD.md
pattern: '^(?=[\s\S]*^## Versions)(?=[\s\S]*^### v1\.0)(?=[\s\S]*Done when)(?=[\s\S]*^## Out of scope)(?=[\s\S]*^## Open questions)'
flags: m
---
