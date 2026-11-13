---
type: llm
focus: { source: file, path: tests/test_shipping.py }
---

The issue's story mentions seeing the shipping cost at checkout, but the design leaves the checkout page out of this issue (it comes in #12).

PASS if no test checks the checkout page, a checkout display, a formatted price string, or any name the design doesn't give.
FAIL if the file is missing, or any test checks checkout, display or formatting, or calls a function the design doesn't name.
