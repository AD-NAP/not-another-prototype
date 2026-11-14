---
name: nap-fix
description: Fixes the findings from a pull request's latest review on the same PR, by handing them to the team's Engineer agent in a fresh context. Use whenever the user asks to fix, address or respond to review findings or requested changes on a PR, or types /nap-fix. Not for reviewing a PR, building a new issue, or fixing a bug that has no review.
argument-hint: "[PR number or URL]"
allowed-tools: Agent Read Glob Bash(gh pr view *)
---

# Fix

The user wants the findings from a PR's review fixed. **Don't fix them yourself.** The team's Engineer fixes them on the PR's own branch, so the fix gets reviewed like any other change.

The PR, if given: $ARGUMENTS

## 1. Find the review

Read the PR: `gh pr view <number> --json number,headRefName,closingIssuesReferences,reviews`. If no PR was given, ask which one.

The team's reviews start with `**Review: approve**` or `**Review: request changes**`. Take the latest one.

- Latest is **approve**, or there is no review: say there is nothing to fix, and stop.
- Latest is **request changes**: carry on.

## 2. Check the round

Count the reviews that start with `**Review: request changes**`. That is the round number.

At round 4 or more, stop. Three rounds without an approval usually means the Engineer and the Reviewer disagree, or the issue itself is unclear, and another round won't settle it. Show the user the findings still open and ask them to rule on each: fix it, leave it, or change the issue.

## 3. Hand it to the Engineer

Call the Agent tool with `subagent_type: "nap-engineer"`. In the prompt, give:

- That this is a **fix round**, with its number, on PR #<number> and branch `<headRefName>`.
- The issue number the PR closes.
- The latest review's body, word for word.
- What to send back: for each finding, fixed or not fixed with the reason, plus the test run.
- The boundary: only what the findings need. No new PR, no other changes.

Don't add findings, opinions or fixes of your own.

## 4. Report back

Relay the Engineer's report: each finding and what happened to it, the test run, and the commits pushed. Keep it short.

Then say the next step: `/nap-review <number>` for a fresh review.

If the Engineer says a finding is wrong, pass on its reason plainly. Don't take a side. The next review, or the user, decides.
