---
type: llm
---

#295 touches `shop/payments.py` and `tests/test_payments.py`. Neither #301 nor #290 touches those files. Being in the same `shop/` folder is not a conflict.

PASS if the reply does not mark #295 as conflicting with #301 or with #290.
FAIL if it marks #295 as conflicting with either, or proposes a conflict label involving #295.
