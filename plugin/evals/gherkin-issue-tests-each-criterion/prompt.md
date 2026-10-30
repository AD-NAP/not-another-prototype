---
description: A Given/When/Then issue gets one failing test per criterion, edge cases included, that fail because the code is missing.
max_turns: 25
timeout_seconds: 600
tags: [tdd]
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---

We're doing TDD on my library app. Write the failing tests for this issue before anyone writes the code. Put them in `tests/test_fees.py`.

> **#14 Charge late fees on overdue books**
>
> As a librarian, I want overdue returns to get a late fee, so that books come back on time.
>
> Acceptance criteria
> - Given a book returned on or before its due date, when the fee is worked out, then the fee is 0.00.
> - Given a book returned 3 days after its due date, when the fee is worked out, then the fee is 0.75 (0.25 per day).
> - Edge case: given a book returned 60 days late, when the fee is worked out, then the fee is capped at 10.00.
> - Edge case: given no return date (the book is still out), when the fee is worked out, then it is rejected with a ValueError.
>
> Tech Lead's note: the code will be `late_fee(due, returned)` in `library/fees.py`, taking `datetime.date` values (or `None` for `returned`) and returning a float. We use pytest. `library/fees.py` doesn't exist yet.
