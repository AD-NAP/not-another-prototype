# Doc templates

Templates for the Architect's files. Keep each one short: a reader should get the whole picture in a few minutes.

## docs/ARCHITECTURE.md

```markdown
# Architecture

## Goal
<Who it is for and what problem it solves, in one or two sentences. The PM builds the backlog from this.>

## Users
<Who signs in, and how: one person, many users, teams. "Nobody signs in" is fine.>

## Parts
| Part | What it is | Built with |
|---|---|---|
| <app> | <one line> | <framework> |

## How they connect
<A short list or a small text diagram: what calls what, and in which direction.>

## Data
<What is stored, where, and what comes from or goes to other services.>

## CI and deploy
<What runs on every PR, and where the project runs when it is live. Or "None for now", with why.>

## Decisions
See [ADR.md](ADR.md).
```

## docs/ADR.md

All decisions live in one file, numbered from 0001. Add new ones at the end. When a decision is replaced, mark it "Replaced by <number>" instead of deleting it.

```markdown
# Decisions

## 0001. <Decision, as a short title> (<YYYY-MM-DD>)

**Status:** Accepted

**Context.** <What needed deciding, and the answers from the user that matter.>

**Decision.** <What we chose.>

**Why.** <The reason, in one to three sentences.>

**Alternative.** <The best option we didn't pick, and when it would be the better choice.>
```

## Project rules in CLAUDE.md

```markdown
## Project rules
- Stack: <language, framework, data store>. See `docs/ADR.md`.
- Run the tests with `<command>`.
- Code lives in `<folder>`, tests in `<folder>`, named `<pattern>`.
- <One line per rule the stack needs, such as "All data access goes through the API, never straight to the database.">
- A change that needs a new language, framework, service, major library or data store needs an ADR first: run `/nap-architect`.
```

Every rule is something a reviewer can check by reading the code. "Write clean code" is not a rule.

## Example: an ADR

```markdown
## 0002. Store data in DynamoDB (2026-11-20)

**Status:** Accepted

**Context.** Creators log products, posts and sales. The user wants AWS and already uses DynamoDB. One creator per account, a few thousand records each.

**Decision.** One DynamoDB table, keyed by creator.

**Why.** It fits the user's AWS stack, costs nothing at this size, and every query is "this creator's items".

**Alternative.** PostgreSQL on RDS, if reports start to need joins across creators, such as an agency view.
```
