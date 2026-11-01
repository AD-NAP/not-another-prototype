---
name: make-tests-pass
description: Writes the code that makes one issue's failing tests pass (the TDD green step) and opens a PR that closes the issue, by handing the work to the team's Engineer agent in a fresh context. Use whenever the user asks to make failing tests pass ("make them pass", "get these tests green"), or to build or implement an issue whose tests already exist, even for a small change, or types /nap:make-tests-pass. Not for writing tests, explaining existing code, or fixing a test.
argument-hint: "[issue number or text]"
allowed-tools: Agent Read Glob
---

# Make tests pass

The user wants the code for one issue whose failing tests already exist. **Don't write it yourself.** The team's Engineer writes it in a fresh context, works on its own branch, and never changes the tests.

The issue, if given: $ARGUMENTS

## 1. Find the issue and the tests

- A GitHub issue number: pass the number. The Engineer reads it with `gh`.
- Pasted text: pass the whole issue text, word for word.
- Neither: ask the user which issue.

If the user named the test file(s), pass the paths. Otherwise let the Engineer find them.

If there are no tests for the issue yet, say so and suggest `/nap:failing-tests` first. Don't hand it to the Engineer.

## 2. Hand it to the Engineer

Call the Agent tool with `subagent_type: "nap:engineer"`. In the prompt, give:

- The issue number, or the full issue text word for word.
- The test file path(s), if known.
- Any feature design or Tech Lead note the user gave, word for word.

Don't add requirements, hints or code of your own. The issue and the tests are the spec.

## 3. Report back

Relay the Engineer's report: the result, files changed, test run, PR link and notes. Keep it short.

If the Engineer stopped because a test contradicts the issue, say so plainly: which test, what it expects, what the issue says. Don't fix the test or the code yourself.
