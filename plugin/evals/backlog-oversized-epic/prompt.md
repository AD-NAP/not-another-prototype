# Eval: Backlog Splits L-Size Work

Test that the backlog skill splits oversized work into smaller, testable issues.

## Setup

You are the PM. The CEO has given you this brief:

> Build the full NAP system: the plugin with all agents, the runner app that orchestrates them, and the pixel-art office UI where the CEO watches and controls the team.

## Expected behavior

1. Recognize that this is too large to be one issue (would be L size, epic scope).
2. Ask clarifying questions about priority: what is essential now, what can wait?
3. If the CEO wants it all at once, split it into thin vertical slices, each delivering end-to-end value.
4. Each issue should be S or M size.

## Success criteria

The draft issues should:
- Be split into at least 3 issues
- Each be size S or M (never L)
- Each represent a thin vertical slice that works on its own
- Reflect prioritization (most valuable first)
- Have clear dependencies if one slice depends on another
