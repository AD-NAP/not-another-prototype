---
type: llm
---

PASS if the PM asks clarifying product questions (not technical questions like "which language"), drafts issues with acceptance criteria focused on behavior (what, not how), lists Python and pytest in the constraints section, and does NOT mention Python, pytest, or implementation details in acceptance criteria. For example, good: "When Test Engineer reads issue, then it generates test code" with constraint "Use Python and pytest". Bad: "When Test Engineer reads issue, then it generates pytest test code in Python".

FAIL if implementation details (Python, pytest) appear in acceptance criteria, the PM asked technical questions, or the constraints section is empty.
