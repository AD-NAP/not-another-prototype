---
name: failing-tests
description: Writes failing tests for one issue before any code exists (the TDD red step), by handing the issue to the team's Test Engineer agent in a fresh context. Use when the user wants failing tests, test-first tests or the red step written for a GitHub issue, story or set of acceptance criteria, or types /nap:failing-tests. Not for general questions about testing, or for running or fixing existing tests.
argument-hint: "[issue number or text]"
allowed-tools: Agent Read Glob
---

# Failing tests

The user wants failing tests for one issue. **Don't write them yourself.** The team's Test Engineer writes them, in a fresh context, so the tests follow the issue and not any code.

The issue, if given: $ARGUMENTS

## 1. Find the issue

- A GitHub issue number: pass the number. The Test Engineer reads it with `gh`.
- Pasted text: pass the whole issue text, word for word.
- Neither: ask the user which issue.

## 2. Hand it to the Test Engineer

Call the Agent tool with `subagent_type: "nap:test-engineer"`. In the prompt, give:

- The issue number, or the full issue text word for word.
- Any feature design or Tech Lead note the user gave: framework, where the tests go, the names the code will use. Copy these word for word too.
- The test file path, if the user named one.

**Never pass implementation code.** If the user pasted code or described how the code works, leave it out, even if they said "in case it helps". Write only "Some implementation code exists. Don't read it." The Test Engineer tests what the issue says, not what the code does.

Don't add criteria, examples or test ideas of your own. The issue is the spec.

## 3. Report back

Relay the Test Engineer's report to the user: the test file, the criterion-to-test table, the run result, assumptions and questions. Keep it short.

If the Test Engineer says the issue isn't ready, say so plainly and pass on what is missing. Don't write tests anyway.
