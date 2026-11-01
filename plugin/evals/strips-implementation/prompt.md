---
description: Technical ideas in a brief must not become acceptance criteria.
tags: [backlog]
max_turns: 20
allowed_tools: [Read, Glob, Grep, Skill]
---

Write the backlog for a reading streak in my book tracker app. Readers who log pages every day should see how many days in a row they've read, and it goes back to 0 when they skip a day. Who: readers who want a daily reading habit. Done: the streak shows on their profile and resets after a missed day. Must-have: the streak and the reset. Later: nothing. My idea for building it: keep streaks in Redis, add a GET /api/streaks endpoint, and run a cron job at midnight to reset them. Those are just ideas, not requirements. Show me the draft, I don't need more questions.
