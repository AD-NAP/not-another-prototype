# NAP: Not Another Prototype

An AI dev team for developers, with issues first, TDD and code review. Ship production-ready work, not prototypes. You're the CEO.

> **Status: early, pre-release.** Five roles work today, one command each. The full loop has run once on a test project, and it found gaps that still need a person to patch them by hand. Fixing those is the current work. See the [roadmap](docs/roadmap.md).

## The idea

Developers ship prototypes all the time. Most never reach production. AI makes it faster to build them, but without a shared process the quality drifts: one person installs a skill, another doesn't, and every project ends up different.

NAP is a Claude Code plugin that gives you a team of agents modelled on a real dev team, all following the same process. You brief the team, approve the design, and merge every PR yourself.

## What works today

| Command | Role | What it does |
|---|---|---|
| `/nap:backlog` | PM | Turns a brief into GitHub issues with testable acceptance criteria |
| `/nap:design` | Tech Lead | Posts a short feature design on the issue after you approve it, labels it `ready`, and flags issues that touch the same files |
| `/nap:failing-tests` | Test Engineer | Writes failing tests from the issue and its design, without reading the code |
| `/nap:make-tests-pass` | Engineer | Writes the smallest code that makes the tests pass, without editing the tests, and opens a PR |
| `/nap:review` | Reviewer | Reviews a PR against its issue and design, read-only, and flags missing tests and changes outside the issue |

- **Lane hooks** keep the roles apart: the Engineer can't edit tests, the Test Engineer can't read the code, and the Reviewer can't write.
- **An event log** records when each role starts, finishes or fails, in `.nap/events.jsonl`.
- **CI on this repo** runs the hook unit tests on Ubuntu and Windows and validates the plugin. CI for the projects NAP works on comes with `/nap:setup` (roadmap step 7).

NAP is built by NAP: the PM writes the issues, the Test Engineer and Engineer build each one test-first, and the Reviewer reviews the PR.

## Evidence so far

- **One full loop run** (13-11-2026) on a small test project took a one-line brief to an approved PR through all five roles. The Reviewer first approved a PR with a design task missing. A person caught it, and the second round fixed it. The gaps it found are in step 5 of the [roadmap](docs/roadmap.md).
- **Eval cases** cover every role (36 cases). Since 01-11-2026 they run once per case, which shows a role works but measures nothing ([decision 12](docs/decisions.md#12-one-run-evals-until-the-mvp-2026-11-01)). An earlier 5-run comparison on 11 PM and Test Engineer cases is out of date after later skill changes. How evals work: [plugin/evals](plugin/evals/README.md).
- **Measured proof comes at v1.0.0:** two real sprints on a second project, counting tests, review findings, fix rounds and how often a person overrules the Reviewer.

## Known limits

- The loop still needs hand steps. Nobody commits the Test Engineer's tests for the Engineer, and no command fixes review findings yet.
- You run one command per role. A single `/nap:run` that chains them is planned for v1.0.0.
- All agents use your GitHub account. GitHub won't let you approve your own PR, so the Reviewer posts its verdict as a comment review.
- Shell rules in the lane hooks are best effort. File tools are blocked for certain; shell commands can get around them.

## Install

You need:

- [Claude Code](https://code.claude.com)
- `git`, and the [GitHub CLI](https://cli.github.com) (`gh`) signed in to your account
- [Node.js](https://nodejs.org) for the hooks. Without it the hooks don't run, and the roles fall back to their written rules.
- A GitHub repo for your project. Trust its folder in Claude Code (run `claude` there once and accept), or Claude Code ignores the project's permission rules.

Then, in Claude Code:

```
/plugin marketplace add AD-NAP/not-another-prototype
/plugin install nap@not-another-prototype
```

Releases are tagged `nap--vX.Y.Z` and listed in the [changelog](CHANGELOG.md).

## How we build it

NAP keeps a person in charge. These rules guide how it is built and described:

1. **For developers.** NAP is a team for one person and a way to keep AI code to real engineering standards. It does not replace developers.
2. **A person approves every merge.** Agents propose, people decide. AI can't be accountable for what ships, so a person owns it.
3. **All the work is visible.** Every issue, design, test and review is something a person can read.
4. **It teaches.** It shows how a real team works and why tests come first, so students and junior developers can learn from it.
5. **Honest limits.** Talking to users, product judgement, ethics and accountability stay with people.

## Docs

- [Design](docs/design.md): roles, workflow, gates and rules.
- [Decisions](docs/decisions.md): what was decided and why.
- [Roadmap](docs/roadmap.md): the build steps and where we are. v1.0.0, the MVP, is the loop made reliable, `/nap:setup`, `/nap:run`, and measured proof.
- [Changelog](CHANGELOG.md) and [third-party notices](THIRD_PARTY_NOTICES.md).

The plugin lives in `plugin/`. A background runner comes after v1.0.0, and the pixel-art office will be its own repo, reading the event log.

## License

MIT. See [LICENSE](LICENSE).
