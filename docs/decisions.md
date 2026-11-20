# Decisions

The decisions that hold today, and why. Add a new entry for a new decision. When one stops being true, remove or rewrite it, so this file only says what is current.

Earlier decisions are in git history: the first 30 at tag `nap--v0.1.0`, and the team version's 14 at commit `b18d3e3`.

## 1. NAP writes the documents before code (2026-11-20)

**Decision.** NAP's job is the documents a project needs before code: a brief, a PRD, a tech plan and a backlog, sized to the project. Each skill writes local files after the user approves, and the user commits them. NAP doesn't build, review, merge or post to GitHub. Building is up to the user and any tool they like. The team version is parked in git history at commit `b18d3e3`: the Personal Assistant, the Engineer and Reviewer subagents, the fix loop, GitHub issues and milestones, and the finish line check. Its planning skills come back one at a time, rewritten without the GitHub parts.

**Why.** The planning half passed every run. The build half did not: in the last full run, 8 of 9 blockers were environment and enforcement problems, such as commit trailers, self-approval on GitHub, Windows paths and a second session in the same checkout. Every step that acted on GitHub met a permission prompt, an allow list or a refusal, and every test was a full run that took hours of a limited plan. Skills that only write files are useful on their own, flow without interruptions, and are cheap to test.

**What we give up.** One agent that takes an idea all the way to merged PRs. Issues and milestones on GitHub, until a script pushes the backlog there. The enforced finish line: "done when" for each version in the PRD replaces it in plain words.

## 2. Types set the documents, traits add to them (2026-11-20)

**Decision.** Five types, by size and by who uses the project: Script, Personal tool, App, Product and System. System replaces Platform, since it means several apps or services working together. Version 1 builds Script, Personal tool and App. Traits (screens, stored data, AI, other people's data, running online) add a section to the PRD or the tech plan, and later their own documents for an App and up. A document that describes something not yet known waits, such as an API spec until the version that builds the API. The types, traits and documents are in [design.md](design.md#types).

**Why.** Whether a project has screens or uses AI changes which documents it needs, not how many. Keeping the types to five keeps the first question easy. Personal tool and App are where the team version's planning was proven. Script is the simplest check that NAP doesn't write too much.

**What we give up.** Product and System, until a real project needs them.

## 3. One skill per document, and /nap-start routes (2026-11-20)

**Decision.** `/nap-start` takes the idea, works out the type and traits, and writes the brief with a docs plan. Then one skill per document, named after what it writes: `/nap-prd`, `/nap-architecture` and `/nap-backlog`. Each skill reads what exists and works on its own. The PRD says what and why, never how. The tech plan owns how.

**Why.** Small skills can be tested one at a time, and each is useful without the rest. The team version's roles only helped when the whole chain worked. Keeping the PRD and the tech plan apart keeps the product plan free of the solution, as the team version's PM and Architect did.

**What we give up.** One conversation that covers everything. The user runs each skill in turn, as the brief suggests.

## 4. Tests before skills (2026-11-20)

**Decision.** Each skill gets its eval cases before it is written, in `evals/`, run with `claude plugin eval` against plain Claude ([evals/README.md](../evals/README.md)). A few cases run without the skill first, and the skill says only what fixes what went wrong. A skill is done when its cases pass at 3 runs, it beats plain Claude, and one real use writes a document the user keeps. A small plugin manifest exists only so the evals can load the skills. NAP is still installed by copying files.

**Why.** A full run found 5 to 9 problems at once, the fixes landed together, and no one could tell which fix worked, so rules piled up. The October evals showed which rules added nothing: 4 of 11 cases tied with plain Claude. Adapted from Superpowers' `writing-skills`: "If you didn't watch an agent fail without the skill, you don't know if the skill teaches the right thing."

**What we give up.** Plan usage for eval runs. One run per case while writing (`--runs 1 --ablation none`) keeps it low.

## 5. MIT license, and other projects are sources (2026-11-14)

**Decision.** NAP is MIT licensed. It does not install or depend on other skill collections such as [Superpowers](https://github.com/obra/superpowers). It adapts their best parts into its own words, with credit in `THIRD_PARTY_NOTICES.md`. Apache-2.0 sources can be adapted if their notices are kept there.

**Why.** The repo is public and meant to be copied, and most of the work worth adapting is MIT already ([skill-research.md](skill-research.md)). Superpowers triggers on its own and overrides NAP's routing when installed beside it. Its `brainstorming` skill fires on the same requests as `/nap-start`, so with both installed, run `/nap-start` by name.
