# Design

What NAP writes, and for which kind of project. Approved 20-11-2026. The reasons are in [decisions.md](decisions.md), and what the earlier attempts taught is in [lessons.md](lessons.md).

This is a plan on paper. No skill at the repo's root writes any of these documents yet, and the Product and System columns have never been tried.

## The idea

When an AI writes most of the code, the documents stop being descriptions and become the controls. An AI builds what is written and guesses the rest. A person's time goes to reviewing documents and code, not to typing.

So NAP writes the documents that pin down what an AI can't infer, and that make a person's review fast. It sizes them to the project: a script gets one page, and a system gets the full set.

NAP's skills contribute what a senior planner knows. They propose users, risks, versions and requirements. They don't only write down what the user said. Everything a skill adds is marked as its own, and nothing is written until the user approves it.

## Three rules for every document

1. **Every statement can be checked,** by a test, a tool, or a person with a yes or no.
2. **Each fact lives in one document.** Other documents link to it. Two copies will disagree, and the AI will follow the wrong one.
3. **Only the next version gets full detail.** The rest stays a line in the roadmap until its turn.

A document a person can't review in about ten minutes gets approved unread. How NAP guards against that is not decided yet.

## Types

The type says how big the project is and who uses it. It sets the documents.

| Type | What it is | Example |
|---|---|---|
| **Script** | Does one job per run and keeps nothing between runs. A sitting or two. | Convert a folder of images to WebP |
| **Personal tool** | A few features you use yourself, again and again. Runs on your machine. | A log of your weight and training, with a trend |
| **App** | A complete app other people use. Weeks of work. | A tool that turns a building's point list into a Brick model |
| **Product** | An app that grows with its users over months. Maybe paid. | A daily planner sold to the public |
| **System** | Several apps or services that work together. | Cloud monitoring for a train network: status, faults and fault prediction |

To choose a type, go down this list:

1. More than one app or service working together: System.
2. One job per run, with nothing kept between runs: Script.
3. Only you use it: Personal tool.
4. Others use it, and it will grow from their feedback over months: Product.
5. Otherwise: App.

A project can change type. A Personal tool that others start to use becomes an App, and gets an App's documents from then on.

## The documents

| Document | What it pins down |
|---|---|
| **Brief** | The problem, who has it, why now, and how we'd know it is solved. |
| **PRD** | Goals, users and use cases, scope and non-goals, and success measures. |
| **Roadmap** | The versions in order, riskiest first, each one a usable slice. |
| **Glossary and domain model** | One meaning for each term, and how the things in the domain relate. |
| **Quality targets** | Numbers: speed, uptime, data volume, retention, recovery. |
| **Risks** | What could sink the project, and which version retires each risk. |
| **Architecture** | The parts, the data flows between them, and how to run and test it. |
| **Decision records** | Each hard-to-undo choice, with the alternative that was rejected. |
| **Backlog** | Stories for the next version, each with acceptance tests that can run. |
| **Agent rules file** | Conventions, commands, and what an AI must never touch. Read at the start of every session. |
| **Operations plan** | How it is released, watched and supported once people rely on it. |

## Documents for each type

| Document | Script | Personal tool | App | Product | System |
|---|---|---|---|---|---|
| Brief | Own doc | Own doc | Own doc | Own doc | Own doc |
| PRD | None | Short | Full | Full | Full |
| Roadmap | None | None, one version | Section in PRD | Own doc | Own doc |
| Glossary and domain model | None | None | Section in PRD | Own doc | Own doc |
| Quality targets | None | A line or two in PRD | Section in PRD | Own doc | Own doc |
| Risks | None | The biggest risk, one line in PRD | Section in PRD | Own doc | Own doc, with hazard analysis |
| Architecture | None | Half page | Own doc | Own doc | Own doc, with a system map |
| Decision records | None | Inside the half page | Own doc | Own doc | Own doc |
| Backlog | None | First version | Next version only | Next version only | Next version, per part |
| Agent rules file | None | Short | Yes | Yes | Yes |
| Operations plan | None | None | None, the README covers it | Own doc | Own doc, with runbooks |

That is one document for a Script, four short ones and a rules file for a Personal tool, six for an App, and ten or more for a Product or a System. A System gets every document as its own file.

## Traits

A trait is something about the project that cuts across its size. Each trait adds a document.

| Trait | Adds | From which type |
|---|---|---|
| Has screens | UX flows: a section in the PRD, then its own document for a Product and up | Personal tool |
| Uses AI | A model spec: what is predicted or generated, the data, the baseline to beat, and the acceptable error. A section for a Personal tool, its own document from an App up | Personal tool |
| Other people's data | Security and privacy: a section for an App, a threat model for a Product and up | App |
| Runs online | A deploy and monitoring section in the architecture | App |
| Exposes an interface | Interface contracts, as their own documents, in a form a tool can check. Always needed between the parts of a System | App |
| High stakes: safety, money or regulation | A hazard analysis as its own document, and a check for standards that apply | App |

A Script ignores traits.

**An example.** A tool that turns a building's point list into a Brick model is an App: other people will install and run it. It has screens, it uses AI, and it exposes an interface, since others depend on the file formats it reads and writes. So it gets an App's six documents, plus UX flows in the PRD, a model spec, and a contract for its input and output files.

## Where the documents come from

They follow the stages a team works through, from a one-line request to developers picking up stories.

| Stage | Who leads in a team | Document |
|---|---|---|
| Intake | Product manager | Brief |
| Discovery | Product manager, tech lead, designer | Risks, and a test of the riskiest unknown |
| Product definition | Product manager | PRD, glossary, quality targets |
| Design | Designer and tech lead | UX flows, architecture, decision records, interface contracts, model spec |
| Roadmap | Product manager and tech lead | Roadmap |
| Backlog | Product manager, refined by the team | Backlog |
| Building | The team, or an AI | Agent rules file |
| Running it | The team | Operations plan |

Discovery comes before the PRD. Requirements for something not yet shown to be possible are guesses.

## Not decided yet

- Which skill writes which document.
- The guards: how long a document may be, and how a person approves it part by part.
- How the skills interview: in stages with approval for each part, or one draft that the user then edits.
- The order to build in. Proposed, not agreed: the App type first, one document at a time, with the Brick tool as the real project.
- How a document is judged good, before the skill for it is written. Proposed, not agreed: write the target document by hand first, and test against it.

## What NAP doesn't do

It doesn't build, review code, merge or post to GitHub. It writes local files, after the user approves, and the user commits them.
