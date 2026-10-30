# Roadmap

Start small. Each step works on its own and can be shown, so the project is never stuck half done.

| # | Step | What it delivers | Status |
|---|---|---|---|
| 1 | **Learn** | Try existing tools. Superpowers is kept and built on (see [decision 2](decisions.md#2-build-on-superpowers-2026-10-30)). | Done |
| 2 | **PM** | A PM skill turns a short brief into GitHub issues with acceptance criteria. The user approves them. | **Next** |
| 3 | **TDD pair** | The Test Engineer writes failing tests for one issue. The Engineer makes them pass. CI fails without tests. | |
| 4 | **Reviewer** | Reviews the PR in a fresh context. The user still approves the merge. | |
| 5 | **Tech Lead** | Adds a design doc and task split before the tests. The full pipeline runs on one project, with the event log. | |
| 6 | **Proof** | Measure the results on that project: tests, review findings, rework. This becomes the README's main evidence. | |
| 7 | **Platform** | Package everything as one versioned plugin with a setup skill. Use it on a second project. | |
| 8 | **Chief of Staff** | Takes a brief and runs the pipeline. The user's gates move up to vision, roadmap and milestones. Reports to the user. | |
| 9 | **Headcount** | More than one Engineer on separate issues at the same time. | |
| 10 | **Office** | The pixel office in `office/`, reading the event log. The runner in `runner/` starts here or in step 8. | |
| 11 | **CEO controls** | Brief, approve, set headcount and read the Kopi Report from inside the office. | |

## Open questions

- Where the issues and roadmap live: GitHub Issues and Projects, or files in the repo.
- Where agents run on their own: GitHub Actions, Claude cloud sessions, or the user's machine.
- Budget: a token cap per project or per agent.
