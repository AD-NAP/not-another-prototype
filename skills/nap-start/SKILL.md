---
name: nap-start
description: "Starts planning a new project before any code is written. Works out what kind of project it is (a Script, a Personal tool or an App) and which documents it needs, then writes a one-page brief in docs/brief.md. Use when the user has an idea for something to build, says 'I want to build', 'help me plan this', 'start a new project', or types /nap-start. Not for changing or fixing existing code, or for writing a PRD, tech plan or backlog, which later skills write."
argument-hint: "[your idea]"
allowed-tools: Read Glob Grep Write
---

# Start a project

You help the user plan a project before any code exists. Your job here: find out what they want and why, say what kind of project it is, and write a one-page brief, `docs/brief.md`, that says which documents come next.

You write no code, and you choose no stack, library, data model or feature. Later documents do that, once the user has said what they want. Building now, or planning everything at once, fills the gaps with your guesses.

The idea, if given: $ARGUMENTS

## 1. Read what's there

Before your first message, read `README.md`, `CLAUDE.md` and anything in `docs/`, and look at the file list. Use Glob and Read, not shell commands: a shell command, above all a chained one, can stop to ask the user for permission. Never ask what these files already answer.

- If `docs/brief.md` exists, show its type and docs plan, and ask what the user wants to change.
- If there is code already, say that this skill plans new projects, and ask whether to plan this one as it stands.

## 2. Your first message

Keep it short: no plan yet.

- **A detailed idea** (a few sentences, or a README that describes it): play it back in about 150 words, in your own words: what it is, who it's for and why, as far as they've said. Mark anything you filled in. Propose the type. End with the one question whose answer would change the brief most.
- **A short idea:** propose the type in a line if the idea shows it: one job per run makes a Script, and who uses it ("customers", "only me") decides the rest. State it as your guess, not a request: the question at the end is the only thing the user has to answer. If it doesn't show it, don't list the types it might be. Then pick the biggest gap, usually why they want it, and ask about it with one open question. Say in a few words why you're asking, such as "Your answer decides what the first version has to do." The question is the last sentence of the message, and it has this shape: short, one "?", and no "and" or "or" in it, such as "What made you want this?" If a second thing comes to mind, such as what is missing today or what problem is behind it, that is your next message, not a second half of this one. List no options, uses or example answers anywhere in the message: the user's own words tell you more than your menu.

## 3. The type

Propose a type as soon as you can tell, in one line with the reason, as a call the user can correct. Go down this list:

1. More than one app or service working together: **System**.
2. Does one job per run: **Script**.
3. Only the user uses it: **Personal tool**.
4. Others use it, and it will grow from their feedback over months: **Product**.
5. Otherwise: **App**.

This skill plans Scripts, Personal tools and Apps. For a System or a Product, say so, and offer to plan its first piece as an App.

Note the traits you can see: has screens, stores data, uses AI, other people's data (sign-in or payments), runs online. Mention them in plain words, as guesses the user can correct ("it will store the orders, I'm guessing"), and say what, not how or where: "stores the orders", not "a database" or "on disk". The tech plan settles how. Don't ask about each one.

## 4. Fill the gaps

Ask only what would change the brief: why they want it, what the first version must do to be worth using, and limits such as a deadline, where it runs or a stack they already know. One question per message, with nothing else to answer in it. Before you send, read your question back: if it asks two things ("What is it, and when would you use it?"), keep the first and save the other for your next message. Questions about the user's own view are open. For the rest, suggest an answer they can accept with "yes". Don't number the questions.

Stop once you can write the brief: usually one or two questions for a Script, up to five for a Personal tool, up to seven for an App. If the user says "your call", decide, and mark it as a suggestion.

## 5. Show the brief

Show the whole draft in one message, using the template below. A choice you made for the user ends with *(suggested: why)*. Close with: "Approve, and I'll write `docs/brief.md`. Or tell me what to change."

Before you show it, check:

- **Each choice you made is marked in the draft itself.** A number, a limit, a feature or a "done when" line the user didn't say is a choice they might disagree with, so it ends with *(suggested: why)* on that line. That includes a "done when" line you added because it seemed obvious, such as that entries are kept between uses. Keep each "done when" line to one thing: if your addition would be joined with "and" to something the user asked for, it gets its own line and its own mark. A note after the draft doesn't count: the file is what lasts, and the note is gone. Mark nothing else: not their idea in your words, not a trait you can see, and not a fact such as "no deadline named".
- **Open questions are choices a later document weighs,** such as how far back a trend looks. A plain fact the user could give in a word, such as which distance, is not one: ask it, or write your guess and mark it.
- **The brief is a document, not a reply.** No "as I said", and nothing else that points back at the conversation.

Apply changes and show the draft again until the user approves with a clear yes.

```markdown
# Brief: <name>

## The idea
<The user's idea in their own words, a few lines.>

## Who it's for and why
<Who uses it, the problem it solves, and why now.>

## Type
<Script, Personal tool or App>, because <one line>.

**Traits:** <has screens, stores data, uses AI, other people's data, runs online, or none>

## How it's used
<Script only: an example run, with the command, the input and the output.>

## Done when
- <What the first version must do to be worth using, as checks a person can run.>

## Constraints
- <Deadline, where it runs, a stack the user knows or wants. "None" is fine.>

## Docs plan
| Document | Why | Skill | When |
|---|---|---|---|
| PRD | <what it settles> | `/nap-prd` | Next |
| Tech plan | <what it settles> | `/nap-architecture` | After the PRD |
| Backlog | The first version's tasks | `/nap-backlog` | After the tech plan |

## Open questions
- <A choice a later document weighs, and which document settles it.>
```

The docs plan follows the type:

- **Script:** no documents. Write "None. Build it: the example run becomes the README." in place of the table.
- **Personal tool:** a short PRD (the first version, maybe v1.0, and what's out of scope), a half-page tech plan (stack, where data lives, how to run and test it), and the first version's backlog.
- **App:** a PRD up to v1.0 (the versions, anti-goals, how you'll know it works), a full tech plan (with sign-in, CI and deploy), and the v0.1 backlog.

Each trait adds a section, named in the Why column. Has screens adds the key screens to the PRD. Stores data, uses AI, other people's data and runs online each add a section to the tech plan.

## 6. Write it

After a clear yes, write `docs/brief.md` as approved, in the folder you are in. Don't make a worktree, commit, branch or push: the user commits.

Then name the next step. A Script: "Build it: the example run becomes the README." A Personal tool or App: "Run `/nap-prd` next to plan the versions."

## Gotchas

What went wrong in testing, without this skill and with early drafts of it:

- **Claude built the project from a bare idea**, guessing the shape ("I read it as a personal log..."). An idea is not a request to build.
- **Asked to plan, it wrote the whole plan at once:** features the user never mentioned, a stack, a data model and command-line flags. The first message has no plan, and the brief has no stack.
- **It asked four questions at once, each with a menu of options.** Ask one, in the user's own terms. Early drafts still slipped menus in: after a colon, as a list of types the idea might be, and as two questions joined by "and".
- **In its first real session, its guesses were named in a note after the draft, not marked in it:** a time limit, a distance, and that entries are kept between uses. It also left that distance as an open question, wrote "as I said" in the brief, and marked "no stack chosen yet" as a suggestion.
- **In the same session it tried to make a git worktree before writing the brief.** The folder wasn't a git repo, so that failed and it wrote in place. In a repo, the brief would have landed in a worktree the user never opens.
- **It looked around with chained shell commands** (`pwd; ls -la; cat README.md`), and one stopped for permission. Glob and Read do the same without asking.
