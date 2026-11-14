# Docs plan

Which documents a project needs, by scope, who writes them, and when. **M** is must, **G** is good to have, blank is leave out. User stories are GitHub issues, not a document.

| Doc | Written by | Script | Personal tool | App | Product | Platform | Usually written |
|---|---|---|---|---|---|---|---|
| README: what it does, how to run it | Engineer | M | M | M | M | M | With the project skeleton, then kept current |
| PRD (`docs/PRD.md`) | PM | | M (short) | M | M | M | Now |
| User stories (GitHub issues) | PM | | M | M | M | M | One version at a time |
| Project rules (`CLAUDE.md`) | Architect | G | M | M | M | M | Now |
| Architecture (`docs/ARCHITECTURE.md`) | Architect | | G (half a page) | M | M | M | Now |
| ADRs (`docs/ADR.md`) | Architect | | G | M | M | M | Now, then with each big decision |
| Data model | Architect | | | G | M | M | Before the first version that stores data |
| API spec | Architect | | | G (if it has an API) | M | M | Before the version that first builds or changes the API, once its shape is known |
| Test strategy | Architect | | | G | M | M | Now, short, then before the first release |
| CI and deploy docs | Architect | | | G | M | M | With the CI and deploy tasks |
| Changelog or release notes | Engineer | | G | M | M | M | Every PR adds a line, from the first version |
| User research and success metrics | PM | | | G | M | M | Now, then reviewed at the end of each version |
| User docs and help | Engineer | | | G | M | M | Before the MVP ships |
| Threat model, privacy review | Architect | | | G (if it stores personal data) | M | M | Before the first version with sign-in or personal data |
| UX mock-ups | Architect, until there is a UX role | | | G | G | M | Before the version that builds those screens |
| Runbooks, monitoring, SLOs, incidents | Architect, until there is a Platform role | | | | G | M | Before the first deploy that real users depend on |
| CONTRIBUTING, onboarding, glossary | Engineer | | | | G | M | Before others join the work |

## Choosing "when"

- **Now** when the next role needs it to start: the PRD, the architecture, the rules.
- **Before a version** when it shapes that version's work but can't be known yet, like an API spec for v1.0 when v0.1 has no API.
- **With a feature** when it describes something only that feature makes real, like CI docs with the CI task.
- Never earlier than the thing it describes is known. A doc written on guesses has to be rewritten.

Each doc due in a version becomes a task issue in that version's milestone, labelled `type: docs`, with "Written by" in its body, ordered before the issues that need it.
