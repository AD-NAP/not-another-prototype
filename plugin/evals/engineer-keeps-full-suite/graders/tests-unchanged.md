---
type: regex
weight: 0.5
target: { source: file, path: tests/test_discounts.py }
pattern: 'apply_code\(50\.00, "SAVE10"\) == 45\.00[\s\S]*apply_code\(19\.99, "SAVE10"\) == 17\.99[\s\S]*apply_code\(50\.00, "NOPE"\) == 50\.00[\s\S]*apply_code\(0\.00, "SAVE10"\) == 0\.00'
---
