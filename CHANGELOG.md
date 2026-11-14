# Changelog

Each release of the `nap` plugin gets an entry here and a `nap--vX.Y.Z` tag ([decision 24](docs/decisions.md#24-releases-semver-nap--vxyz-tags-and-a-changelog-2026-11-14)). Versions follow semver. v1.0.0 is the MVP.

## 0.1.0 (not released yet)

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
