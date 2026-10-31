---
description: An issue with a plain checklist instead of Given/When/Then still gets failing tests for every item, including the boundaries.
max_turns: 25
timeout_seconds: 600
tags: [tdd]
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---

Can you write the failing tests for this issue first? Test-first, no code yet. They go in `test/usernames.test.js`.

> **#22 Validate usernames at sign-up**
>
> - [ ] A username of 3 to 20 characters is accepted
> - [ ] Only letters, digits and underscores are allowed; anything else is rejected
> - [ ] A username shorter than 3 characters is rejected
> - [ ] A username longer than 20 characters is rejected
> - [ ] A username that is already taken is rejected, ignoring case ("Sam" is taken if "sam" exists)
>
> Design: `src/usernames.js` will export `validateUsername(name, takenNames)` returning `{ ok: true }` or `{ ok: false, reason }`. We use `node:test` with ES modules. `src/usernames.js` doesn't exist yet.
