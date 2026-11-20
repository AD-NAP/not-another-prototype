---
name: nap-prd
description: "Plans a project's versions from its brief and writes docs/PRD.md: what each version must do, when each counts as done, and what is out of scope. Use once docs/brief.md exists and the user wants to plan the versions, scope the first version or the MVP, write the PRD, or types /nap-prd. Not for a new idea with no brief yet, which /nap-start plans first, or for choosing a stack, which /nap-architecture does."
argument-hint: "[what to focus on]"
allowed-tools: Read Glob Grep Write
---

# Plan the versions

You turn the project's brief into a PRD: the versions, what each must do, "done when" for each, and what is out of scope. You decide what and why with the user, never how. The tech plan, from `/nap-architecture`, chooses the stack, the storage and the data model. A PRD that names them makes those choices before anyone has weighed them.

The user's request, if given: $ARGUMENTS

## 1. Read the brief

Before your first message, read `docs/brief.md`, `README.md`, `CLAUDE.md` and anything else in `docs/`. Look around with Glob and Read only, never Bash, not even `find` or `ls`: a shell command, above all a piped one, can stop to ask the user for permission. The brief already answers who it's for, why, the type, the traits, the first "done when" and the constraints. Never ask any of these again.

- **No brief:** say that `/nap-start` writes it first, and stop.
- **A Script:** say that a Script needs no PRD: its brief, with the example run, is the whole plan. Next step: build it, and the example run becomes the README. Draft nothing, write nothing, and stop.
- **`docs/PRD.md` exists:** show its versions, and ask what the user wants to change.

## 2. How much to plan

The type in the brief sets the depth:

- **Personal tool:** one version, the first one worth using, as v1.0 *(suggested: one user needs no beta)*. Its sections: Versions, Out of scope, Open questions, and Key screens if the brief's traits say it has screens.
- **App:** versions from v0.1 to v1.0. v0.1 is the least that is still worth using. v1.0 is what other people can rely on. Two or three versions in all. Its sections: Versions, Out of scope, Anti-goals, How we'll know it works, Key screens if it has screens, and Open questions.

Nothing past v1.0. Ideas for later go in Out of scope, marked "later".

## 3. Ask what the brief leaves open

If the user asks for the draft now, or says "your call", ask nothing: decide what the brief leaves open, mark each call as a suggestion, and go straight to the draft in step 4. They have chosen speed over questions.

Otherwise, open with one line on what you read: the project, its type, and the first version's "done when" from the brief. Then ask only what would change the PRD:

- The brief's open questions that it says the PRD settles.
- **Personal tool:** whether the brief's "done when" is the whole first version.
- **App:** what v1.0 needs that v0.1 doesn't. What would make it a failure even if it works (anti-goals). How you'll know it works, as something that can be checked or counted.

One question per message, with one thing to answer. Read the question back before you send it: if it asks two things, or offers a list of options, keep the first thing and save the rest for later. Questions about the user's own view, such as what would count as failure, are open, with no suggested answer. For the rest, suggest an answer they can accept with "yes". Don't number the questions.

Stop once you can draft: usually one or two questions for a Personal tool, up to five for an App. If the user says "your call" to a question, decide it, and mark it as a suggestion.

## 4. Show the draft

Show the whole draft in your reply, using the template below. Not in a file: nothing is written until the user approves. Close with: "Approve, and I'll write `docs/PRD.md`. Or tell me what to change."

Before you show it, check:

- **What, not how.** No language, framework, library, database, hosting or payment provider, file format, data model or interface form (a terminal, a web page, a window), even when the brief's constraints name them. The brief keeps the constraints, and the tech plan uses them.
- **Each must-do comes from the user or the brief.** Anything you added ends with *(suggested: why)*. Add little: the first version is the least that is worth using, and the rest goes to a later version or Out of scope.
- **Each "done when" is a check a person can run.**
- **Short.** One line per item, and a reason of a few words at most. A Personal tool's PRD fits in about 300 words.
- **Open questions are about the product.** How it's built, such as how data is stored or which channel sends a message, is the tech plan's question, and it asks it anyway. Leave those out.
- **Only the sections the type and traits need,** as step 2 lists them and the template's comments mark. A Personal tool has no Anti-goals or How we'll know it works. Leave a section out rather than writing "not applicable", and drop the comments.

```markdown
# PRD: <name>

Who it's for, why, the type and the constraints are in [the brief](brief.md).

## Versions

### v0.1: <one-line goal>
**Must do:**
- <what the user can do, one line>

**Done when:**
- <a check a person can run>

### v1.0: <one-line goal>
**Must do:**
- <only what is new since the last version>

**Done when:**
- <a check a person can run>

## Out of scope
- <what these versions don't do, and whether it's "later" or "never">

<!-- App only -->
## Anti-goals
- <what would count as failure even if it works>

<!-- App only -->
## How we'll know it works
- <something that can be checked or counted once people use it>

<!-- Only when the brief's traits say it has screens -->
## Key screens
- **<screen>:** <what the user sees and does there, in a line>

## Open questions
- <what is still unknown, and which document settles it>
```

Apply changes and show the draft again until the user approves with a clear yes.

## 5. Write it

After a clear yes, write `docs/PRD.md`, with that name, as approved. Don't commit, branch or push: the user commits.

Then name the next step: "Run `/nap-architecture` next for the tech plan."

## Gotchas

What went wrong in testing, without this skill and with early drafts of it:

- **Claude wrote the PRD straight to a file,** with no draft and no yes, and named it `docs/prd.md`.
- **A Script got a full PRD,** with numbered requirements and acceptance criteria.
- **It added features nobody asked for:** edit and delete, browsing past months, and a default list of categories.
- **It decided how it would be built:** a command-line interface, data in a local file, how amounts are stored, and which messaging service sends confirmations.
- **Asked to plan the versions of a Personal tool, it invented v2 and v3,** then asked four numbered questions with menus of answers.
- **Asked for the draft now, it asked a question first.** "Your call" means draft.
- **A Personal tool's draft ran to 450 words,** with tech plan questions in Open questions, such as how amounts are stored.
- **In a real session it listed the files with `find . | head`.** Glob, or Read by path where Glob is missing, does the same without a permission prompt.
