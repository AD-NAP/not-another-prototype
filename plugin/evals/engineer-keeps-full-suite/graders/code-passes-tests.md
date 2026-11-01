---
type: llm
focus: { source: file, path: shop/discounts.py }
---

The tests expect:
- apply_code(50.00, "SAVE10") == 45.00
- apply_code(19.99, "SAVE10") == 17.99 (19.99 * 0.9 is 17.991, so the result must be rounded to cents, and is compared with ==)
- apply_code(50.00, "NOPE") == 50.00
- apply_code(0.00, "SAVE10") == 0.00

PASS if `apply_code(total, code)` exists and returns every value above exactly, including the rounding.
FAIL if the file is missing, the function differs, or any value would be wrong (for example 17.991 with no rounding).
