---
name: build
description: Builds one GitHub issue test-first and opens a PR that closes it, by handing the work to the team's Engineer agent in a fresh context. Use whenever the user asks to build or implement an issue, even for a small change, or types /nap:build. Not for writing issues or designs, explaining existing code, or reviewing a PR.
argument-hint: "[issue number or text]"
allowed-tools: Agent Read Glob
---

# Build

The user wants one issue built. **Don't build it yourself.** The team's Engineer builds it in a fresh context, on its own branch, with failing tests first.

The issue, if given: $ARGUMENTS

## 1. Find the issue

- A GitHub issue number: pass the number. The Engineer reads it with `gh`.
- Pasted text: pass the whole issue text, word for word.
- Neither: ask the user which issue.

## 2. Hand it to the Engineer

Call the Agent tool with `subagent_type: "nap:engineer"`. In the prompt, give:

- The issue number, or the full issue text word for word.
- Any feature design or Tech Lead note the user gave, word for word.

Don't add requirements, hints or code of your own. The issue is the spec.

## 3. Report back

Relay the Engineer's report: the result, criteria and tests, files changed, test run, PR link and notes. Keep it short.

If the Engineer stopped because the issue isn't ready, say plainly what is missing. Don't build it anyway.
