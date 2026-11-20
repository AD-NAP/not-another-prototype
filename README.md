# NAP: Not Another Prototype

AI makes code fast, but projects still start without a plan. The AI builds what is written and guesses the rest, and the result is another prototype.

NAP writes the documents a project needs before code, sized to the project, so that an AI can build from them and a person can review them.

> **Status: restarted on 20-11-2026.** The document plan is approved. No skill has been built against it yet, so there is nothing to install. The three earlier attempts are in [`prototypes/`](prototypes/README.md).

## The plan

The type of project sets the documents. Traits, such as screens, AI or an interface others depend on, add to them.

| Type | What it is | Documents |
|---|---|---|
| Script | Does one job per run | A brief |
| Personal tool | A few features you use yourself | A brief, a short PRD, a half-page tech plan, a backlog and a rules file for the AI |
| App | A complete app other people use | A brief, a full PRD with a roadmap, glossary, quality targets and risks, an architecture, decision records, a backlog and a rules file |
| Product | An app that grows with its users | The App's set, with most sections as their own documents, and an operations plan |
| System | Several apps or services working together | Every document as its own file, with interface contracts between the parts |

The full plan is in the [design](docs/design.md).

## Principles

1. **For developers.** NAP is a planning partner for one person, and a way to keep AI-built projects to real engineering standards. It does not replace developers.
2. **You decide.** NAP proposes, and marks what it proposed. Nothing is written until you approve it.
3. **All the work is visible.** Every decision ends up in a document a person can read. So do the failed attempts.
4. **Honest limits.** Talking to users, product judgement, ethics and accountability stay with people.

## Docs

- [Design](docs/design.md): the types, the documents and the traits.
- [Decisions](docs/decisions.md): what was decided and why.
- [Lessons](docs/lessons.md): what three earlier attempts taught.
- [Prototypes](prototypes/README.md): the earlier attempts. Not Another Prototype had a few.
- [Third-party notices](THIRD_PARTY_NOTICES.md).

## License

MIT. See [LICENSE](LICENSE).
