# Decisions

Big decisions and why they were made. Newest at the bottom. Add a new entry instead of rewriting an old one. If a decision changes, add an entry that replaces it and say so in the old one.

## 1. Skill or subagent per role (2026-10-30)

**Decision.** The skill is the "how": the role's procedure, shared and versioned. The subagent is the "who": a fresh context, limited tools, a chosen model. Hooks and CI are the rules that can't be skipped. Every role gets a skill, so it can run in the main session now and as a subagent later.

Rule of thumb: roles that talk to the user run as skills in the main session. Roles that must not see each other's reasoning, or that run in parallel, run as subagents.

| Role | Runs as | Why | Tools and limits |
|---|---|---|---|
| PM | Skill, main session | Needs a back-and-forth with the user to turn a brief into issues | Read the repo, create GitHub issues |
| Tech Lead | Skill, main session (subagent later) | The user approves the design live at first. Becomes a subagent when the Chief of Staff runs the team. | Read the repo, write design docs |
| Test Engineer | Subagent | Fresh context: sees only the issue and the design, never the implementation | Writes and runs test files only |
| Engineer | Subagent, `isolation: worktree` | Own branch per issue. Running more of them in the background is how headcount works. | Edits code, not tests. Runs tests. |
| Reviewer | Subagent, read-only | Fresh context: sees only the diff, the issue and the design, never the Engineer's reasoning | Read, search, run tests. No edits. |
| Platform | Not an agent | It is the plugin itself | n/a |
| Chief of Staff (later) | Main-session agent | Runs the pipeline and dispatches the subagents | Everything |

**Facts from the Claude Code docs that shaped this:**
- Subagents can preload skills (`skills`), limit tools (`tools`, `disallowedTools`), pick a `model`, and run in their own git worktree (`isolation: worktree`). Up to 20 run at once by default. Nesting goes up to 3 levels.
- **Plugin subagents ignore `hooks`, `mcpServers` and `permissionMode` in their own file.** Rules like "the Engineer can't edit tests" go in the plugin's shared `hooks/hooks.json` and in CI.
- Plugins can declare `dependencies` on other plugins and pin a `version`.
- `claude plugin eval` runs test cases against a plugin.

## 2. Build on Superpowers (2026-10-30)

**Decision.** The plugin builds on [Superpowers](https://github.com/obra/superpowers) instead of rebuilding what it does well: brainstorming, writing plans, worktrees, debugging, verification before completion, and finishing a branch.

**What NAP adds:** the PM and GitHub issues, the split between Test Engineer and Engineer, a read-only Reviewer, CI gates, headcount, the Chief of Staff, the runner and the office.

**Risk to check in the TDD pair step:** Superpowers skills trigger on their own, and its TDD skill has one agent write both the test and the code. Its flow may fight the split. If it does, keep only the Superpowers skills that fit, or drop the dependency and credit it in the README.

## 3. Three layers, one repo (2026-10-30)

**Decision.** NAP has three layers (team, runner, office) in one repo, each in its own folder. See [design.md](design.md#three-layers).

**Why three layers.** A plugin only adds skills, agents and hooks to Claude Code. It can't draw an office or run agents in the background. The Claude Agent SDK can load the plugin directly, so the runner reuses the same team without rewriting it.

**Why the plugin first.** It is the hardest part to get right, it is useful on its own, and the office needs real work to show.

**Why one repo.** A change across layers (for example a new event the office must show) is one PR. All the attention goes to one repo. A root `.claude-plugin/marketplace.json` points to `plugin/`, so people can still install only the plugin.

**When to split.** Only for a real reason, such as making the plugin public while the office stays private, or the plugin needing its own release cycle. Git can keep the folder's history when splitting.
