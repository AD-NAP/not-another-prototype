# Changelog

Each release of the `nap` plugin gets an entry here and a `nap--vX.Y.Z` tag ([decision 24](docs/decisions.md#24-releases-semver-nap--vxyz-tags-and-a-changelog-2026-11-14)). Versions follow semver. v1.0.0 is the MVP.

## 0.1.0 (2026-11-14)

The first versioned release: everything built in roadmap steps 1 to 5, plus the phase 0 baseline.

### Roles

- PM, `/nap:backlog`: a brief in, GitHub issues out, with testable criteria.
- Tech Lead, `/nap:design`: a feature design posted on the issue after approval. Marks the issue `ready` and labels conflicts.
- Test Engineer, `/nap:failing-tests`: failing tests for an issue, from its criteria and design.
- Engineer, `/nap:make-tests-pass`: the smallest code that makes the tests pass, then a PR.
- Reviewer, `/nap:review`: one review per PR against its issue and design.

### Rules

- Lane hooks keep the Test Engineer and Engineer apart and the Reviewer read-only.
- Event log: every role's start, finish and failure in `.nap/events.jsonl`.
- Eval cases for each role, run with `claude plugin eval`.

### Baseline

- MIT license, third-party notices and this changelog.
- CI runs the hook unit tests on Ubuntu and Windows and validates the plugin. `main` is protected: a PR and green CI are required.
- Agents can't run `gh pr merge` in this repo (a committed deny rule).

### Known gaps

The loop still needs hand steps. They are tracked as open issues for 0.2.0 (the loop runs without hand patches) and 0.3.0 (the loop is complete). See phases 1 and 2 in [docs/todo.md](docs/todo.md).
