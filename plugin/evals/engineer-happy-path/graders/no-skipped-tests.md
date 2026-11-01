---
type: regex
weight: 0.5
target: { source: file, path: tests/test_shipping.py }
pattern: 'pytest\.mark\.(skip|xfail)|pytest\.(skip|xfail)\('
match: not_contains
---
