# Third-party notices

NAP is MIT licensed (see [LICENSE](LICENSE)). When NAP adapts text or code from another project, that project is listed here with its license notice, as [decision 8](docs/decisions.md#8-mit-license-and-other-projects-are-sources-2026-11-14) requires.

## Adapted material

Planned sources and their licenses are in [docs/skill-research.md](docs/skill-research.md).

Each entry uses this format:

```
### <project name>

- Source: <repo URL>
- License: <SPDX id>
- What NAP adapted: <files in NAP, and what they were adapted from>

<the project's full license notice>
```

### Superpowers

- Source: https://github.com/obra/superpowers
- License: MIT
- What NAP adapted: ideas, rewritten in NAP's own words, no text copied.
  - `agents/nap-reviewer.md` (approval needs a fresh test run) from `skills/verification-before-completion/SKILL.md`.
  - `skills/nap-fix/SKILL.md` and the "Fixing review findings" section of `agents/nap-engineer.md` (findings passed word for word, a cap on rounds, a per-finding result, checking a finding before acting on it) from `skills/subagent-driven-development/references/fix-loop.md` and `skills/receiving-code-review/SKILL.md`.
  - `skills/nap-vision/SKILL.md` and `skills/nap-vision/reader-check.md` (open questions before suggestions, playing a detailed idea back, marking what the user didn't say, anti-goals, asking what the user has used or tried, and a fresh reader listing the gaps it would have to guess) from `skills/brainstorming/SKILL.md` and `skills/brainstorming/builder-check-prompt.md`.

```
MIT License

Copyright (c) 2025 Jesse Vincent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Influences

These shaped how NAP works, but no text or code was copied from them:

- [anthropics/claude-plugins-official `pr-test-analyzer`](https://github.com/anthropics/claude-plugins-official/tree/HEAD/plugins/pr-review-toolkit/agents) (Apache-2.0): judging tests by the behaviour they cover, not by whether test files exist.
- [obra/superpowers](https://github.com/obra/superpowers) (MIT): strict TDD and review in a fresh subagent. NAP treats it as a source, not a dependency ([decision 8](docs/decisions.md#8-mit-license-and-other-projects-are-sources-2026-11-14)).
