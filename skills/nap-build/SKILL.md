---
name: nap-build
description: Builds one GitHub issue, or a few related ones together, test-first and opens one PR that closes them, by handing the work to the team's Engineer agent in a fresh context. Use whenever the user asks to build or implement an issue, even for a small change, or types /nap-build. Not for writing issues or architecture docs, explaining existing code, or reviewing a PR.
argument-hint: "[issue numbers or text]"
allowed-tools: Agent Read Glob
---

# Build

The user wants one issue built, or a few related ones in one PR. **Don't build it yourself.** The team's Engineer builds it in a fresh context, on its own branch, with failing tests first.

The issue, if given: $ARGUMENTS

## 1. Find the issue

- GitHub issue numbers: pass them all. The Engineer reads each with `gh` and checks they belong together.
- Pasted text: pass the whole issue text, word for word.
- Neither: ask the user which issue.

## 2. Hand it to the Engineer

Call the Agent tool with `subagent_type: "nap-engineer"`. In the prompt, give:

- The issue numbers, or the full issue texts word for word.

Don't add requirements, hints or code of your own. The issue is the spec.

## 3. Report back

Relay the Engineer's report: the result, criteria and tests, files changed, test run, PR link and notes. Keep it short.

If the Engineer left an issue out as unrelated, say which and suggest building it on its own.

If the Engineer stopped because the issue isn't ready, say plainly what is missing. Don't build it anyway.

If it stopped for a big decision, name the decision and suggest `/nap-architect <the decision>`. Don't decide it yourself.
