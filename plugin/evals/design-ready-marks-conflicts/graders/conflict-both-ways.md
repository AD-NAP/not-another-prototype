---
type: llm
---

#301 and #290 both touch `shop/cart.py`, so they conflict.

PASS if the reply marks #301 and #290 as conflicting with each other, by number, on both issues (for example a `conflicts: #290` label on #301 and a `conflicts: #301` label on #290, or plain words saying each is marked with the other), and names `shop/cart.py` as the shared file.
FAIL if it doesn't call #301 and #290 a conflict, marks only one of the two issues, or doesn't name `shop/cart.py`.
