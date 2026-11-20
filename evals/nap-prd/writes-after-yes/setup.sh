#!/usr/bin/env bash
set -euo pipefail
mkdir -p docs
cat > docs/brief.md <<'BRIEF'
# Brief: Houseplant Watering Tracker

## The idea
A tool that keeps track of my houseplants and tells me which ones need water today. I forget when I last watered each plant, and two plants died this year. Each plant has a watering interval in days and a last-watered date.

## Who it's for and why
Me, alone, on my laptop. The problem is that I forget to water plants on time. *(suggested: that's the cause of the two losses, so the tool should prevent a repeat)*

## Type
Personal tool, because only I use it and it keeps records over time.

**Traits:** stores data

## Done when
- I can add a plant with its watering interval in days.
- I can mark a plant as watered, which sets its last-watered date to today.
- I can see a list of the plants due for water today.

## Constraints
- Runs on my laptop. *(suggested: that's the only place I'll use it, so no online service)*
- No deadline or stack named. *(suggested: the tech plan picks the stack and where data is kept)*

## Docs plan
| Document | Why | Skill | When |
|---|---|---|---|
| PRD | The first version's features and what's out of scope | `/nap-prd` | Next |
| Tech plan | Stack, where data lives, how to run and test it | `/nap-architecture` | After the PRD |
| Backlog | The first version's tasks | `/nap-backlog` | After the tech plan |

## Open questions
- How the list is shown (a window, or text in the terminal). Settled by the tech plan. *(suggested: decide when the stack is chosen)*
- Whether a plant can have a watering note or a location. Not in the first version unless you say so. Settled by the PRD.
BRIEF
