---
type: llm
---
PASS if the draft PRD says what the product must do and why, never how. It names no programming language, framework, library, database, hosting service or payment provider, says nothing about how data is stored, and designs no data model (tables, fields or a schema). Saying that data is kept between uses, or stays on the user's machine, is what the product does, not how, and is fine. So is saying that the tech plan settles the stack. This brief names Python and SQLite: the draft PRD must name neither, even as a constraint. Words outside the draft, such as a note that it leaves them out, don't count.

FAIL if it names any language, framework, library, database, hosting service or payment provider, says how data is stored, or designs a data model.
