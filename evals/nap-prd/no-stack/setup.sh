#!/usr/bin/env bash
set -euo pipefail
mkdir -p docs
cat > docs/brief.md <<'BRIEF'
# Brief: Spend

## The idea
A tool to log what I spend, so I can see where my money goes each month. I keep meaning to budget, but I never know what I spent until the bank statement arrives, and by then it's too late to change anything.

## Who it's for and why
Me, on my laptop. I want to see each month's spending by category while the month is still going, so I can cut back where it adds up.

## Type
Personal tool, because only I use it and it keeps my spending over time.

**Traits:** stores data

## Done when
- I can log a purchase with its amount, category and date in under 10 seconds.
- I can see this month's total, split by category.

## Constraints
- Runs on my laptop, offline.
- No deadline.
- I want to use Python and SQLite, since I know them.

## Docs plan
| Document | Why | Skill | When |
|---|---|---|---|
| PRD | The first version's features and what's out of scope | `/nap-prd` | Next |
| Tech plan | Stack, where data lives, how to run and test it | `/nap-architecture` | After the PRD |
| Backlog | The first version's tasks | `/nap-backlog` | After the tech plan |

## Open questions
- Whether to set a budget per category and warn when it's over. Settled by the PRD.
- Whether to import bank statements. Settled by the PRD.
BRIEF
