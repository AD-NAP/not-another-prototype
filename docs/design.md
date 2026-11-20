# Design

How NAP works. Decisions and their reasons are in [decisions.md](decisions.md). What comes next is in [roadmap.md](roadmap.md).

Earlier designs are in git history: the first one (sprints, hooks, evals and a pixel office) at tag `nap--v0.1.0`, and the team version (a Personal Assistant running a PM, Architect, Engineer and Reviewer, with a finish line check) at tag `nap--v0.2.0`. [Decision 1](decisions.md#1-nap-writes-the-documents-before-code-2026-11-20) says why NAP narrowed.

## The idea

NAP writes the documents a project needs before code, sized to the project. Two things decide which documents:

- **The type** sets how many: how big the project is, and who uses it.
- **Traits** add the ones a kind of project needs: screens, stored data, AI and so on.

Building is up to the user: plan mode, Superpowers, another tool, or by hand.

## Types

| Type | What it is | Example | Documents before code | In v1 |
|---|---|---|---|---|
| **Script** | Does one job per run and keeps nothing between runs. A sitting or two. | Convert a folder of images to WebP | Brief, with an example run | Yes |
| **Personal tool** | A few features you use yourself, again and again. Runs on your machine. | Track what you lend to friends | Brief, short PRD, half-page tech plan, first version's backlog | Yes |
| **App** | A complete app other people use. Runs online. Weeks of work. | An order page for a bakery | Brief, PRD up to v1.0, full tech plan, v0.1 backlog | Yes |
| **Product** | An app that grows with its users over months. Maybe paid. | A daily planner sold to the public | App's documents, plus success metrics, user research, a roadmap past v1.0, and a release and support plan | Later |
| **System** | Several apps or services that work together | A dashboard, a mobile app and a backend that share one set of devices | Product's documents, plus a system map, contracts between the parts, who owns which data, scale and uptime targets, and a threat model | Later |

`/nap-start` proposes a type by going down this list, and the user can correct it:

1. More than one app or service working together: System.
2. One job per run: Script.
3. Only you use it: Personal tool.
4. Others use it, and it will grow from their feedback over months: Product.
5. Otherwise: App.

A project can change type. A Personal tool that others start to use becomes an App, and gets the documents an App needs from then on.

## Traits

| Trait | Adds | In v1 | Later, for App and up |
|---|---|---|---|
| Has screens | Key flows and a screen list, sketched in text | A section in the PRD | `docs/ux.md`, from `/nap-ux` |
| Stores data | What is stored, how it changes, backups | A section in the tech plan | Its own document for Product and up |
| Uses AI | What good output looks like, a first eval set, the baseline to beat | A section in the tech plan | `docs/evals.md`, from `/nap-evals` |
| Other people's data, sign-in or payments | What is stored, who can see it, secrets | A section in the tech plan | `docs/security.md`, from `/nap-security` |
| Runs online | Where it runs, how it ships, secrets | A section in the tech plan | Its own operations document for Product and up |

A Script ignores traits. Its "done when" covers them.

## The documents

- **Brief** (`docs/brief.md`), from `/nap-start`. The idea in the user's words, who it's for and why, the type and traits, "done when" for the first version, constraints, the docs plan and open questions. A Script's brief adds an example run: the command, the input and the output. It becomes the README once the script works.
- **PRD** (`docs/PRD.md`), from `/nap-prd`. The versions, what each must do, "done when" for each version, and what is out of scope. An App's PRD adds anti-goals, how you'll know it works, and the key screens.
- **Tech plan**, from `/nap-architecture`. `docs/ARCHITECTURE.md` (the parts, the data, how to run and test it), `docs/ADR.md` (each hard-to-undo choice, with one alternative) and project rules in `CLAUDE.md`. Half a page for a Personal tool. An App's adds sign-in, CI and deploy.
- **Backlog** (`docs/backlog/v0.1.md`), from `/nap-backlog`. The first version's tasks, each with Given/When/Then acceptance criteria and an edge case, setup first.

"Done when" is the finish line in plain words: what must be true before a version counts as done. It replaces the team version's gate check.

## Documents that wait

A document is written once what it describes is known. Written earlier, it rests on guesses and has to be redone.

- **API spec:** before the version that builds the API.
- **Changelog:** from the first PR, for an App and up.
- **User docs:** before launch.
- **Runbooks and monitoring:** before real users depend on it.
- **Contributing guide:** before others join.

## The skills

```
/nap-start  ->  docs/brief.md (type, traits, docs plan)
  |
  +-- Script ------------------> build. The brief's example becomes the README.
  |
  +-- Personal tool or App ----> /nap-prd -> /nap-architecture -> /nap-backlog -> build with any tool
```

The docs plan in the brief sets the order: each document the type and traits need, and the skill that writes it. Apart from `/nap-start`, each skill is named after the document it writes. Every skill follows the same rules:

1. **Read first.** Read what exists, and never ask what it already answers. So each skill also works on its own.
2. **One question at a time.** Questions about the user's own view are open, with no suggested answer. The rest come with a suggested answer the user can accept with "yes". Ask only what would change the document.
3. **Mark suggestions.** Anything the user didn't say ends with *(suggested: why)*.
4. **Write after a clear yes.** Local files only. No commits, branches or GitHub: the user commits.
5. **Each fact lives in one document.** Later documents link back instead of repeating it.
6. **Name the next step.** End with the next skill from the docs plan, or "build" once the plan is done.

## What NAP doesn't do

It doesn't build, review or merge, and it doesn't post to GitHub. The team version did, and it is parked at tag `nap--v0.2.0` ([decision 1](decisions.md#1-nap-writes-the-documents-before-code-2026-11-20)).
