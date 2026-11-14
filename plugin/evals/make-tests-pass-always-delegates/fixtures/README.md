# Fixtures: make-tests-pass-always-delegates

Generated tests for issue #201, Free shipping on bigger orders. A copy of the engineer-happy-path fixtures.

- **Generated:** 2026-11-01, by `/nap:failing-tests` (the `nap:test-engineer` agent), from the issue text below. Nothing was edited by hand.
- **Output:** `tests/test_shipping.py`, six tests, all failing with "Not implemented yet: shop.shipping".
- **Regenerate** when the issue text changes or the Test Engineer changes. Run `/nap:failing-tests` again with the same issue text and copy its output here.

## Issue text (word for word)

Issue #201: Free shipping on bigger orders

- Given an order total under 50.00 and weighing 5 kg or less, when shipping is worked out, then it costs 4.99.
- Given an order total of 50.00 or more, when shipping is worked out, then shipping is free (0.00), whatever it weighs.
- Edge case: given an order total of exactly 50.00, when shipping is worked out, then shipping is free.
- Edge case: given an order total under 50.00 weighing more than 5 kg, when shipping is worked out, then it costs 6.99.

Design: shipping_cost(total, weight_kg) in shop/shipping.py, returning a float.
