# Skill research

Other people's skills worth learning from, for the documents NAP writes. Researched 2026-11-14 for the team version's four roles, and cut down on 20-11-2026 to the sources the document skills use ([decision 1](decisions.md#1-nap-writes-the-documents-before-code-2026-11-20)).

Earlier versions are in git history: the Engineer, Reviewer and per-issue design sources, with the comparisons against the team version's skills, in this file at commit `b18d3e3`, and the full survey of 15 roles at tag `nap--v0.1.0`.

## How this was checked

- **Sources.** obra/superpowers, mattpocock/skills, github/spec-kit and bmad-code-org/BMAD-METHOD (read from local clones), plus Anthropic's `claude-plugins-official`, read through the GitHub API.
- **Licenses.** Read from each repo's LICENSE file or the GitHub license endpoint.
- **Contents.** "Read" means the file was opened. "Survey" means the claim comes from an earlier pass and the file was not re-opened. Read every "Survey" file in full before adapting it.
- **Safety.** Nothing was installed or run. No instructions in third-party files were followed.

All of these are sources, not dependencies ([decision 5](decisions.md#5-mit-license-and-other-projects-are-sources-2026-11-14)). Adapt the ideas into NAP's own words and credit them in `THIRD_PARTY_NOTICES.md`.

---

## The PRD and the backlog (`/nap-prd`, `/nap-backlog`)

| Candidate | What it does | License |
|---|---|---|
| [mattpocock `to-tickets`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/to-tickets) | Breaks a plan into tracer-bullet vertical slices. Each ticket lists the tickets that block it and is sized to fit one fresh context window. The user approves the breakdown. Read. | MIT |
| [mattpocock `triage/AGENT-BRIEF.md`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/triage) | Durable agent brief: behaviour and contracts, no file paths or line numbers. Survey. | MIT |
| [spec-kit `clarify.md`](https://github.com/github/spec-kit/tree/HEAD/templates/commands) | Bounded clarification: at most 5 targeted questions, answers written back into the spec. Survey. | MIT |

---

## The tech plan (`/nap-architecture`)

| Candidate | What it does | License |
|---|---|---|
| [mattpocock `ADR-FORMAT.md`](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering) | Very short ADRs, 1 to 3 sentences. Survey. | MIT |
| [adr/madr `template/`](https://github.com/adr/madr/tree/HEAD/template) | Minimal and full ADR templates. | MIT OR CC0-1.0 |

---

## Rules for adapting

- Read the LICENSE in the plugin or skill folder, not only the one at the repo root. In `claude-plugins-official`, `code-review` and `pr-review-toolkit` are Apache-2.0, but `claude-security` is all rights reserved.
- Apache-2.0 sources need their notice kept and changed files marked.
- Never use the BMad name. BMAD's code is MIT but the name is a trademark.
- Superpowers beside NAP: its session-start hook injects text into every session, and its `brainstorming` skill fires on the same requests as `/nap-start`. Run NAP's skills by name. The evals load NAP alone, so they don't see the clash.
- Do not copy from share-alike or non-commercial sources.

## Where to start

One source per phase of the [roadmap](roadmap.md), on top of the team version's own skill.

1. **`/nap-start`:** [superpowers `brainstorming`](https://github.com/obra/superpowers/tree/HEAD/skills/brainstorming) (MIT). Look before you ask, one open question about the biggest gap, play the idea back, mark your own proposals, and a fresh builder check. Read in full 2026-11-20.
2. **`/nap-prd`:** spec-kit `clarify` for a cap on questions, with the answers written back into the document.
3. **`/nap-architecture`:** mattpocock `ADR-FORMAT.md` and the adr/madr templates, for short ADRs.
4. **`/nap-backlog`:** mattpocock `to-tickets`, for blocking edges and slices that fit one fresh context.
