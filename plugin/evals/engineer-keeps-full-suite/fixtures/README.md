# Fixtures: engineer-keeps-full-suite

Generated tests for issue #202, Discount codes.

- **Generated:** 2026-11-01, by `/nap:failing-tests` (the `nap:test-engineer` agent), from the issue text below. Nothing was edited by hand.
- **Output:** `tests/test_discounts.py`, four tests, all failing with "Not implemented yet: shop.discounts".
- **Rounding:** C2 expects 17.99, so the discounted total is rounded to the nearest cent. The issue states this rule. The Test Engineer's report listed rounding under Assumptions, but did not raise it as a question.
- **Regenerate** when the issue text changes or the Test Engineer changes. Run `/nap:failing-tests` again with the same issue text and copy its output here.

## Issue text (word for word)

Issue #202: Discount codes

- Given an order total of 50.00 and code SAVE10, when the code is applied, then the total is 45.00.
- Given an order total of 19.99 and code SAVE10, when the code is applied, then the total is 17.99, rounded to the nearest cent.
- Given an unknown code, when the code is applied, then the total is unchanged.
- Edge case: given an order total of 0.00 and code SAVE10, when the code is applied, then the total is 0.00.

Design: apply_code(total, code) in shop/discounts.py, returning a float.
