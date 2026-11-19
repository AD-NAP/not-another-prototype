---
name: nap-finish-line
description: Checks whether a version passes its finish line, the gates in docs/finish-line.json (tests, CI, checked PRs, docs due, deploy and more, by scope), using a script, and records the user's sign-off on gates that need judgement. Also sets a project up for the gates. Use at the end of a milestone, when the user asks whether a version is done or ready, says "check the finish line" or "run the gates", or types /nap-finish-line. Not for reviewing a single PR, which is /nap-review, or for choosing which gates a version has, which is the Architect's job.
argument-hint: "check <version> | setup"
allowed-tools: Read Edit Bash(py *finish_line.py *) Bash(python3 *finish_line.py *) Bash(git status *) Bash(git switch *) Bash(git pull *) Bash(git add *) Bash(git commit *) Bash(git push *) Bash(gh pr create *)
---

# Finish line

You run NAP's finish line check and report what it says. **The script decides, not you.** Don't judge a gate yourself, don't call a failing gate "close enough", and don't edit `docs/finish-line.json` to make a gate pass. The gates are in `docs/finish-line.md` in the NAP repo.

The request: $ARGUMENTS

The script is `finish_line.py`, next to this file, in the base directory Claude Code gave when this skill loaded. Run it from the project folder with `py` on Windows and `python3` elsewhere, with forward slashes in the path: `py C:/Users/me/.claude/skills/nap-finish-line/finish_line.py check v0.1`.

## Check a version

1. Run `finish_line.py check <version>`.
2. **Exit 2** means it couldn't start, and says why. If the checkout is on another branch or behind, `git switch` to the main branch and `git pull`, then run it again. If `docs/finish-line.json` is missing or has no entry for the version, stop: the Architect writes it (`/nap-architect`, "finish line for <version>").
3. **Exit 0:** report "<version> passed its finish line" with the table. Done.
4. **Exit 1:** show the table as the script printed it. Then:
   - **SIGN** gates need the user's answer. Ask each question exactly as printed, one per message. Record the answer word for word (see below), then run the check again.
   - **FAIL** gates: say what would fix each one, in a line. Most need work in an issue (offer `/nap-backlog`), `setup`, or a PR. A failure in the past, such as a PR merged with no checks, can't be fixed: the only way past it is an ADR that removes that gate for this version (`/nap-architect`), and that is the user's call.
   - Say plainly that the version is not done until every gate passes.

## Record a sign-off

Add the answer under the version's `signed` key in `docs/finish-line.json`, with today's date:

```json
"signed": { "data-migration": { "answer": "<the user's words>", "date": "YYYY-MM-DD" } }
```

Collect every sign-off for the version first, then commit them together on `finish-line/<version>` and open a PR with the body written to a file (`gh pr create --title "Sign off the <version> finish line" --body-file <path>`). The check reads the main branch, so it passes only after the user merges the PR.

## Setup

Run `finish_line.py setup`. It adds NAP's files to `.gitignore` and reports branch protection. If `.gitignore` changed, commit it on `finish-line/setup` and open a PR. If protection is "available but off", tell the user and leave turning it on to them.

## Gotchas

- Run one command per Bash call. A chained command (`;`, `&&`, a pipe, `echo $?`) asks for approval even when every part is allowed.
- Use forward slashes in the script's path. Backslashes are lost in Bash, and the command fails or lands in the wrong folder.
- Run `git` from the project folder, without `-C <path>`.
- Don't edit workflows, docs or other files by hand to turn a FAIL into a PASS. Fixes go through `setup`, an issue or a PR the user sees.
