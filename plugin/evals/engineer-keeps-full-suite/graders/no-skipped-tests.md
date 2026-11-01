---
type: regex
weight: 0.5
target: { source: file, path: tests/test_discounts.py }
pattern: 'pytest\.mark\.(skip|xfail)|pytest\.(skip|xfail)\('
match: not_contains
---
