# How we write skills

How NAP's skills get created, tested and refined. Researched 2026-11-14 from Anthropic's docs and engineering posts, the `skill-creator` skill, Superpowers' `writing-skills` and practitioner write-ups. The testing parts were updated 2026-11-20, when tests came before skills ([decision 4](decisions.md#4-tests-before-skills-2026-11-20)). Sources are at the bottom.

## The approach

Tests first, then the skill, then real use. Start from the team version's skill when there is one, not from a blank page.

1. **Write the cases.** A few prompts that should and shouldn't start the skill, and 5 to 8 cases for what it must do. See [evals/README.md](../evals/README.md).
2. **Watch plain Claude fail.** Run a few cases without the skill, and note what goes wrong, in its own words.
3. **Write only what fixes that.** Check each line against the checklist below.
4. **Run the cases** while editing, then at 3 runs against plain Claude.
5. **Use it on a real project.** Each rescue becomes a case or a Gotchas line.
6. **Tune the description last.**

Anthropic's docs describe the same loop as "Claude A" and "Claude B": one session helps write the skill, a fresh session uses it on real work, and what the second got wrong goes back to the first. Superpowers' `writing-skills` calls it TDD for skills: "If you didn't watch an agent fail without the skill, you don't know if the skill teaches the right thing."

## Why not generate from scratch

A benchmark reported by Arize (SkillsBench, 87 tasks) found skills a model wrote from nothing scored 8 to 11 points below having no skill, while skills curated from human expertise added 18 to 25. Compact skills gained about 20 points and comprehensive ones about 1. Even good skills made 13 of 87 tasks worse. These numbers are from Arize's summary, not the benchmark itself.

A skill's value comes from real knowledge and real failures, not from the tool that formats it.

## How we test

Cheapest first:

1. **Does it start?** Prompts that should and shouldn't start the skill, checked by a `tool_used` grader on `Skill`. `skill-creator`'s description optimizer tunes the description against about 20 of them. Check its script works before relying on it.
2. **Does it behave?** Cases in `evals/`, run with `claude plugin eval`. Each case runs with NAP and without it, and the difference (Δ) is what the skill adds. Graders that look at files and text (`file_exists`, `regex`, `tool_used`) cost nothing extra. A case can start from a saved conversation (`context.history_file`), so the step after "Approve" is tested without replaying every question.
3. **Does it help?** One real project. Count the rescues: retries, stalls and corrections, not the approvals you want to keep.

What the results mean:
- **A case that passes without the skill tests Claude, not NAP.** Drop the rule it checks, or the case. The October evals had 4 of 11 cases like this.
- **Read the transcripts, not just the scores.** Evals can pass for the wrong reason, such as a prompt that gives the answer away.
- **Check the grader before changing the skill.** In phase 1, two failing cases were the grader's fault: one wanted exactly one "?", and one failed traits the skill is told to guess. In phase 2 most failures were: the Haiku judge misread criteria written as "PASS if it has no...". Ask the judge for its reasons with the same text, and grade with a stronger model than the one under test.
- **The evals grant no Bash, so they can't show permission prompts.** Phase 1 found a chained shell command stopping for permission in a real session. Check one real session before calling a skill done.
- **A skill that can't be tested cheaply needs a different design.** The team version's skills posted to GitHub and waited for approval, which only a full run could exercise. So every fix waited hours for its test.

Skills that only read and write files need no Bash, so their evals need no sandbox, and run on Windows without WSL.

## Checklist for a skill

**Description**
- Third person. What it does and when to use it, key use first. Claude Code cuts it off at 1,536 characters.
- Names the phrases a user would type.
- Has "Not for ..." where a neighbour overlaps, so it doesn't hijack nearby requests.
- No step-by-step workflow. An agent that reads a workflow summary follows it and skips the body.

**Body**
- Only what Claude doesn't already know. Ask of each paragraph: does it earn its tokens?
- Short. The official limit is 500 lines, but shorter usually works better. One practitioner's 350-word skill beat its 1,200-word draft.
- Strictness matches fragility: loose guidance where many approaches work, exact commands where one wrong step breaks things.
- Explains why. ALWAYS and NEVER in caps are a warning sign. A reason lets the model handle cases the rule didn't foresee.
- A **Gotchas** section built from real failures. This is the highest-value content, so keep adding to it.
- One term per idea, used the same way throughout.
- A default, not a menu of options.

**Files**
- Rarely-used detail goes in a reference file, linked from `SKILL.md`, one level deep.
- Forward slashes in paths.
- Nothing that goes out of date.

## When to remove a rule or a skill

If the skill does the right thing without it, remove it. The baseline in the evals shows this. Models improve, and a rule that once helped can later hold a better default back.

## How strong the evidence is

The official docs, the `claude plugin eval` docs and the `skill-creator` source are first-hand. The practitioner posts are personal experience, and one sells a product. Activation-rate percentages quoted around the web could not be verified and are left out.

## Sources

- [Skill authoring best practices (Anthropic)](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Skills in Claude Code (Anthropic)](https://code.claude.com/docs/en/skills)
- [skill-creator (anthropics/skills)](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
- [Test plugins with evals (Claude Code docs)](https://code.claude.com/docs/en/plugin-evals)
- [writing-skills (obra/superpowers)](https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md) and its [testing with subagents](https://github.com/obra/superpowers/blob/main/skills/writing-skills/references/testing-skills-with-subagents.md)
- [Measuring what a Claude Code skill actually adds (Very Good Ventures)](https://verygood.ventures/blog/evaluating-claude-code-skills-with-ablation)
- [Lessons from Building Claude Code: How We Use Skills (Thariq, reposted gist)](https://gist.github.com/Danm72/467f6d6cd193d19c0042371866d53b75)
- [How to write effective AI agent skills (Arize)](https://arize.com/blog/how-to-write-effective-ai-agent-skills/)
- [8 Tips for Writing Agent Skills (Phil Schmid)](https://www.philschmid.de/agent-skills-tips)
- [Six lessons from designing Claude Code skills (DEV)](https://dev.to/agentstackteam/six-lessons-from-designing-claude-code-skills-1df3)
