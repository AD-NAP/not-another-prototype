---
type: llm
---
The user said only this: a tool that logs pages read each day and tells them if they will finish their book by a date they set, used only by them, on their laptop.

PASS if the reply holds a draft brief, and each choice in it that the user did not make ends with a mark such as "(suggested: ...)" on the same line, inside the draft. A choice is one of these: a number or a time limit, a constraint, a feature, or a "done when" line about something the user never mentioned, such as entries being kept between uses.

These need no mark: the user's idea put in other words, why they want it, the type and the traits, the docs plan, the open questions, a "done when" line that only restates what the user asked for, and a plain fact such as that no deadline was named.

FAIL if there is no draft brief, if a choice as defined above has no mark in the draft, or if choices are only named in a note before or after the draft.
