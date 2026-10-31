---
type: regex
target: { source: file, path: tests/test_fees.py }
pattern: 'except ModuleNotFoundError as \w+:[\s\S]{0,400}\.name'
arm: with-only
---
