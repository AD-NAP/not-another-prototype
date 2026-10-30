---
type: llm
focus: { source: file, path: test/usernames.test.js }
---

The issue has five checklist items: (1) 3 to 20 characters accepted, (2) only letters, digits and underscores, (3) shorter than 3 rejected, (4) longer than 20 rejected, (5) a taken name is rejected ignoring case.

PASS if the file has at least one test for each of the five items, each asserting `ok` is true or false as the item states, and the length tests check the boundaries: a 3-character and a 20-character name are accepted, and a 2-character and a 21-character name are rejected.
FAIL if the file is missing, any item has no test, a boundary (3, 20, 2 or 21 characters) is not checked, or the taken-name test does not check a different letter case.
