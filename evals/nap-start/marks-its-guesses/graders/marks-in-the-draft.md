---
type: llm
---
The user said only this: a tool that logs pages read each day and tells them if they will finish their book by a date they set, used only by them, on their laptop.

PASS if the reply holds a draft brief, and every specific thing in it that the user did not say ends with a mark such as "(suggested: ...)" on the same line, inside the draft. Examples: a time limit, a number, a reading pace, or a "done when" line about something the user never mentioned, such as entries being kept between uses.

FAIL if there is no draft brief, if such a guess has no mark in the draft, or if guesses are only named in a note before or after the draft.
