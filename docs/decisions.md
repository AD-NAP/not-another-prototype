# Decisions

The decisions that hold today, and why. Add a new entry for a new decision. When one stops being true, remove or rewrite it, so this file only says what is current.

Earlier decisions are in git history and in [`prototypes/`](../prototypes/README.md): 30 from the plugin, 14 from the team, and 5 from the note-taker.

## 1. NAP writes the documents an AI builds from (2026-11-20)

**Decision.** NAP writes the documents a software project needs before code, sized to the project, so that an AI can build from them and a person can review them. Its skills contribute what a senior planner knows: users, risks, versions, requirements. Everything a skill adds is marked as its own, and nothing is written until the user approves it. NAP writes local files only. It doesn't build, review code, merge or post to GitHub.

**Why.** With an AI writing the code, a well-defined spec matters more than before: the AI builds what is written and guesses the rest. The third attempt wrote too little. On a real App its PRD recorded what the user said, with no versions between the first and the last, no quality targets and no risks, and the project's biggest risk left as an open question. Plain Claude wrote fuller plans, but filled them with guesses nobody had confirmed. The answer is depth with every addition marked and approved.

**What we give up.** Short interviews and one-page documents for anything larger than a Personal tool. A simple measure of success: "it stayed small" no longer counts.

## 2. Five types set the documents, and traits add to them (2026-11-20)

**Decision.** Five types, by size and by who uses the project: Script, Personal tool, App, Product and System. Each has a fixed set of documents, in [design.md](design.md#documents-for-each-type). A Script gets a brief. An App gets six documents, with the roadmap, glossary, quality targets and risks as sections of its PRD. A System gets every document as its own file. The agent rules file starts at Personal tool. The backlog covers only the next version, at every type. Six traits add documents: has screens, uses AI, other people's data, runs online, exposes an interface, and high stakes.

**Why.** The earlier attempts guessed the document set. This one follows the stages a team works through, from a one-line request to developers picking up stories. Size decides how many documents a project needs. What cuts across size, such as AI, safety or an interface others depend on, is a trait, so there is no sixth type.

**What we give up.** A design that has been proven. Only Script, Personal tool and App have had any skill work, and that was in an earlier attempt. The Product and System sets are on paper.

## 3. Earlier attempts stay in the open, and a fourth restart has a bar (2026-11-20)

**Decision.** The three earlier attempts are in [`prototypes/`](../prototypes/README.md). The first two are pages that link to their tag and commit in git history. The third is there as files. `main`'s history is not rewritten. A fourth restart needs three things: two real projects taken through to the last document, a note on what that use showed and why no fix can reach it, and a new direction approved before anything is moved. [lessons.md](lessons.md#when-a-restart-is-allowed) has the rule.

**Why.** Each attempt taught something the next one used, and each reset also threw away something that worked. Keeping them visible, with one note on what they taught, makes it harder to repeat either mistake.

**What we give up.** A clean repo. Old files sit in a folder that an AI session could read by mistake, so `CLAUDE.md` and the folder's README both say not to follow them.

## 4. MIT license, and other projects are sources (2026-11-14)

**Decision.** NAP is MIT licensed. It does not install or depend on other skill collections such as [Superpowers](https://github.com/obra/superpowers). It adapts their best parts into its own words, with credit in `THIRD_PARTY_NOTICES.md`. Apache-2.0 sources can be adapted if their notices are kept there.

**Why.** The repo is public and meant to be copied, and most of the work worth adapting is MIT already. Superpowers triggers on its own and overrides NAP's routing when installed beside it.
