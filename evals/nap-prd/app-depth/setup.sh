#!/usr/bin/env bash
set -euo pipefail
mkdir -p docs
cat > docs/brief.md <<'BRIEF'
# Brief: Crumb

## The idea
An order page for my friend Mei's bakery, so customers can order cakes online instead of messaging her. She takes orders over WhatsApp now and loses track of them.

## Who it's for and why
Mei's customers, who want to order a cake for a date and know it's confirmed. And Mei, who wants every order in one place with the pickup date, so none are missed. She loses about one order a week to messages she scrolled past.

## Type
App, because Mei's customers use it, online.

**Traits:** has screens, stores data, other people's data (customers' names and phone numbers, and payments), runs online

## Done when
- A customer can pick a cake, choose a pickup date and place an order.
- Mei sees every order for the coming week in one list.
- A customer gets a confirmation once Mei accepts the order.

## Constraints
- Mei wants it before the Christmas orders, in about six weeks.
- She has no budget for paid tools beyond a small monthly fee.

## Docs plan
| Document | Why | Skill | When |
|---|---|---|---|
| PRD | The versions up to v1.0, anti-goals, how we'll know it works, and the key screens | `/nap-prd` | Next |
| Tech plan | Stack, stored orders, customer data and payments, sign-in for Mei, hosting, CI and deploy | `/nap-architecture` | After the PRD |
| Backlog | The v0.1 tasks | `/nap-backlog` | After the tech plan |

## Open questions
- Whether customers pay online or at pickup. Settled by the PRD.
- Whether Mei can mark a day as full. Settled by the PRD.
BRIEF
