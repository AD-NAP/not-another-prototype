---
name: nap-review
description: Reviews one pull request against its GitHub issue's acceptance criteria, by handing it to the team's Reviewer agent in a fresh context, and posts one review that approves or requests changes. Use whenever the user asks to review a pull request or PR, or to check one against its issue, even when the PR description and diff are pasted in, or types /nap-review. Always hand the review to the Reviewer instead of reviewing inline. Not for general questions about code review, or for writing or fixing code.
argument-hint: "[PR number or URL]"
allowed-tools: Agent Read Glob
---

# Review

The user wants one PR reviewed. **Don't review it yourself.** The team's Reviewer does it in a fresh context, so it judges the change, not how it was built.

The PR, if given: $ARGUMENTS

## 1. Find the PR

- A PR number or URL: pass it. The Reviewer reads the PR, its diff and its issue with `gh`.
- Pasted PR description and diff (when `gh` isn't available): pass them word for word.
- Neither: ask the user which PR.

## 2. Hand it to the Reviewer

Call the Agent tool with `subagent_type: "nap-reviewer"`. In the prompt, give:

- The PR number or URL, or the pasted PR description and diff, word for word.
- The issue text and any feature design, if the user gave them, word for word.

**Never pass the Engineer's reasoning.** If the user pasted the Engineer's report, notes or claims ("all criteria pass", "I tested it"), leave them out. Write only "The Engineer's notes are left out on purpose." The Reviewer judges the change itself.

Don't add review comments or opinions of your own.

## 3. Report back

Relay the Reviewer's report: the verdict, the criteria table, and how the review was posted. Keep it short.

If the Reviewer said it needs the issue, say so and ask the user which issue the PR is for.
