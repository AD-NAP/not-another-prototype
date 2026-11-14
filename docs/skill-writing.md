# How we write skills and agents

How NAP's skills and agents get created and refined. Researched 2026-11-14 from Anthropic's docs, the `skill-creator` skill, Superpowers' `writing-skills` and practitioner write-ups. Sources are at the bottom.

## The approach

Refine the four skills we have, by hand with Claude, driven by failures from real runs. Not from a blank page, and not through a full eval loop.

1. **Start from what exists.** The four skills and the open issues are our observed failures.
2. **Edit by hand** against the checklist below.
3. **Test by running a real project.** Each failure becomes a Gotchas line or an edit.
4. **Tune descriptions last.**

Anthropic's docs describe the same loop as "Claude A" and "Claude B": one session helps write the skill, a fresh session uses it on real work, and what the second got wrong goes back to the first.

## Why not generate from scratch

A benchmark reported by Arize (SkillsBench, 87 tasks) found skills a model wrote from nothing scored 8 to 11 points below having no skill, while skills curated from human expertise added 18 to 25. Compact skills gained about 20 points and comprehensive ones about 1. Even good skills made 13 of 87 tasks worse. These numbers are from Arize's summary, not the benchmark itself.

A skill's value comes from real knowledge and real failures, not from the tool that formats it.

## Why not skill-creator's full loop

`skill-creator` writes 2 to 3 test prompts, runs each with and without the skill, grades them and shows a viewer. That doubles every run, and it suits skills with checkable output such as file transforms. Ours ask questions, wait for approval and post to GitHub, which scripted prompts can't exercise. It is also the shape of the eval system NAP removed.

Two parts are worth using:
- **Its writing advice**, which is folded into the checklist below.
- **Its description optimizer.** It tests about 20 should-trigger and should-not-trigger queries and keeps the best description. Triggering is cheap to test and matters most. Check the script works before relying on it.

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

## Checklist for an agent

- The description says when to delegate, briefly. "Use proactively" encourages delegation.
- The detail lives in the body, which only loads when the agent runs.
- `tools` is the minimum the role needs.
- `skills` can preload a skill into the agent at startup.

## When to remove a rule or a skill

If the role does the right thing without it, remove it. Models improve, and a rule that once helped can later hold a better default back.

## How strong the evidence is

The official docs and the `skill-creator` source are first-hand. The practitioner posts are personal experience, and one sells a product. Activation-rate percentages quoted around the web could not be verified and are left out.

## Sources

- [Skill authoring best practices (Anthropic)](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Skills in Claude Code (Anthropic)](https://code.claude.com/docs/en/skills)
- [Subagents in Claude Code (Anthropic)](https://code.claude.com/docs/en/sub-agents)
- [skill-creator (anthropics/skills)](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
- [writing-skills (obra/superpowers)](https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md)
- [Lessons from Building Claude Code: How We Use Skills (Thariq, reposted gist)](https://gist.github.com/Danm72/467f6d6cd193d19c0042371866d53b75)
- [How to write effective AI agent skills (Arize)](https://arize.com/blog/how-to-write-effective-ai-agent-skills/)
- [8 Tips for Writing Agent Skills (Phil Schmid)](https://www.philschmid.de/agent-skills-tips)
- [Six lessons from designing Claude Code skills (DEV)](https://dev.to/agentstackteam/six-lessons-from-designing-claude-code-skills-1df3)
