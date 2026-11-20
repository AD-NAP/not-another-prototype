# NAP: Not Another Prototype

Plan a project the way a team with good practice would, before the first line of code. Tell NAP your idea. It works out what kind of project it is, asks only what's missing, and writes the documents that project needs: a brief, a PRD with versions, a tech plan and the first version's backlog. Then build it however you like.

> **Status: being rebuilt.** On 20-11-2026 NAP narrowed to the documents before code ([decision 1](docs/decisions.md#1-nap-writes-the-documents-before-code-2026-11-20)). The skills come back one at a time, each with its tests written first ([roadmap](docs/roadmap.md)). Phase 1 is built: `/nap-start` passes all its tests and beats plain Claude. Its first real use is next. The team version, with a Personal Assistant, an Engineer, a Reviewer and a finish line check, is in git history at commit [`b18d3e3`](https://github.com/AD-NAP/not-another-prototype/tree/b18d3e387d11bd11d90fe8032c339003b7479b35).

## The idea

AI makes code fast, but projects still start without a plan: who it's for, what the first version must do, how it's built. The AI fills the gaps with guesses, and the result is another prototype.

Teams with good practice write a few documents before code. Which ones depends on the project. A script needs a few lines. An app needs a PRD and an architecture. NAP sizes the documents to the project, so you write what helps and skip what doesn't.

## How it works

Start with `/nap-start` and your idea. It reads what's already in the repo, asks one question at a time, and proposes the project's type. It writes `docs/brief.md` with a docs plan: the documents this project needs, and the skill that writes each one.

| Type | What it is | Documents before code |
|---|---|---|
| Script | Does one job per run. A sitting or two. | Brief, with an example run |
| Personal tool | A few features you use yourself, again and again | Brief, short PRD, half-page tech plan, first version's backlog |
| App | A complete app other people use, online | Brief, PRD up to v1.0, full tech plan, v0.1 backlog |

Product and System types come later. Traits, like screens, stored data or AI, add sections to these documents. See the [design](docs/design.md).

| Skill | Writes | Status |
|---|---|---|
| `/nap-start` | `docs/brief.md`: the idea, type, traits and docs plan | Built in phase 1 |
| `/nap-prd` | `docs/PRD.md`: the versions, and "done when" for each | Phase 2 |
| `/nap-architecture` | `docs/ARCHITECTURE.md`, `docs/ADR.md` and project rules in `CLAUDE.md` | Phase 3 |
| `/nap-backlog` | `docs/backlog/v0.1.md`: the first version's tasks, with acceptance criteria | Phase 4 |

Each skill writes local files only, after you approve. You commit them. Nothing is posted to GitHub.

## Install

Copy `skills/` into `~/.claude/` to use NAP in every project, or into one project's `.claude/` folder. Then type `/nap-start` and your idea.

If Superpowers is installed too, run `/nap-start` by name: its `brainstorming` skill answers the same requests.

To use the team version meanwhile, check out commit `b18d3e3` and follow its README.

## Principles

1. **For developers.** NAP is a planning partner for one person, and a way to keep AI-built projects to real engineering standards. It does not replace developers.
2. **You decide.** NAP suggests. Nothing is written until you approve it.
3. **All the work is visible.** Every decision ends up in a document a person can read.
4. **Honest limits.** Talking to users, product judgement, ethics and accountability stay with people.

## Docs

- [Design](docs/design.md): the types, traits, documents and skills.
- [Decisions](docs/decisions.md): what was decided and why.
- [Roadmap](docs/roadmap.md): the phases, and what is next.
- [Skill writing](docs/skill-writing.md): how the skills are written and tested.
- [Skill research](docs/skill-research.md): other people's skills worth learning from.
- [Evals](evals/README.md): how to run a skill's tests.
- [Third-party notices](THIRD_PARTY_NOTICES.md).

## License

MIT. See [LICENSE](LICENSE).
