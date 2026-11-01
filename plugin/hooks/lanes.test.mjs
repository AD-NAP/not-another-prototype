// Unit tests for the lane hook. Run: node --test plugin/hooks/lanes.test.mjs
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { decide } from "./lanes.mjs";

const HOOK = path.join(path.dirname(fileURLToPath(import.meta.url)), "lanes.mjs");
let cwd;

before(() => {
  cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nap-lanes-"));
  for (const f of ["shop/cart.py", "shop/__init__.py", "tests/test_cart.py", "src/app.test.ts", "docs/notes.md", "README.md", "pyproject.toml"]) {
    fs.mkdirSync(path.join(cwd, path.dirname(f)), { recursive: true });
    fs.writeFileSync(path.join(cwd, f), "");
  }
});
after(() => fs.rmSync(cwd, { recursive: true, force: true }));

const abs = (f) => path.join(cwd, f);
const call = (agent, tool, toolInput) =>
  decide({ agent_type: agent, tool_name: tool, tool_input: toolInput, cwd });
const blocked = (r) => assert.equal(r.block, true, "expected a block");
const allowed = (r) => assert.equal(r.block, false, `expected no block, got: ${r.message}`);

const ENG = "nap:engineer";
const TE = "nap:test-engineer";

// C1: the Engineer can't edit a test file.
test("C1 Engineer Edit on a test file is blocked with the rule", () => {
  const r = call(ENG, "Edit", { file_path: abs("tests/test_cart.py") });
  blocked(r);
  assert.match(r.message, /Engineer never edits tests/);
  assert.match(r.message, /tests\/test_cart\.py/);
});

test("C1 Engineer Write on a JS test file is blocked", () => {
  blocked(call(ENG, "Write", { file_path: abs("src/app.test.ts") }));
});

test("C1 Engineer shell edits to a test file are blocked", () => {
  blocked(call(ENG, "Bash", { command: "sed -i 's/11/10/' tests/test_cart.py" }));
  blocked(call(ENG, "Bash", { command: "echo x > tests/test_cart.py" }));
  blocked(call(ENG, "Bash", { command: "git checkout -- tests/test_cart.py" }));
  blocked(call(ENG, "PowerShell", { command: "Set-Content tests/test_cart.py 'x'" }));
});

test("C1 Engineer may edit code, read tests and run them", () => {
  allowed(call(ENG, "Edit", { file_path: abs("shop/cart.py") }));
  allowed(call(ENG, "Read", { file_path: abs("tests/test_cart.py") }));
  allowed(call(ENG, "Bash", { command: "python -m pytest tests/test_cart.py 2>/dev/null" }));
  allowed(call(ENG, "Bash", { command: "cat tests/test_cart.py" }));
});

// C2: the Test Engineer can't edit a non-test file.
test("C2 Test Engineer Edit on a source file is blocked with the rule", () => {
  const r = call(TE, "Edit", { file_path: abs("shop/cart.py") });
  blocked(r);
  assert.match(r.message, /Test Engineer writes test files only/);
});

test("C2 Test Engineer Write on a doc is blocked too", () => {
  blocked(call(TE, "Write", { file_path: abs("docs/notes.md") }));
});

test("C2 Test Engineer may write test files", () => {
  allowed(call(TE, "Write", { file_path: abs("tests/test_shipping.py") }));
  allowed(call(TE, "Edit", { file_path: abs("src/app.test.ts") }));
});

// C3: the Test Engineer can't read a source file.
test("C3 Test Engineer Read on a source file is blocked with the rule", () => {
  const r = call(TE, "Read", { file_path: abs("shop/cart.py") });
  blocked(r);
  assert.match(r.message, /never reads implementation code/);
});

test("C3 Test Engineer Grep on source is blocked", () => {
  blocked(call(TE, "Grep", { pattern: "def", path: abs("shop/cart.py") }));
  blocked(call(TE, "Grep", { pattern: "def", path: abs("shop") }));
  blocked(call(TE, "Grep", { pattern: "def" }));
  blocked(call(TE, "Grep", { pattern: "def", glob: "**/*.py" }));
});

test("C3 Test Engineer may read tests, docs and config, and search tests", () => {
  allowed(call(TE, "Read", { file_path: abs("tests/test_cart.py") }));
  allowed(call(TE, "Read", { file_path: abs("README.md") }));
  allowed(call(TE, "Read", { file_path: abs("pyproject.toml") }));
  allowed(call(TE, "Grep", { pattern: "def", path: abs("tests") }));
  allowed(call(TE, "Grep", { pattern: "pytest", glob: "*.toml" }));
  allowed(call(TE, "Grep", { pattern: "def", glob: "tests/**" }));
  allowed(call(TE, "Glob", { pattern: "**/*.py" }));
});

// C4 edge: shell commands that print source files.
test("C4 Test Engineer shell reads of source are blocked with the same rule", () => {
  for (const command of [
    "cat shop/cart.py",
    "head -n 5 shop/cart.py",
    "grep -n round shop/cart.py",
    "grep -rn round shop",
    "grep -rn round .",
    "rg round",
  ]) {
    const r = call(TE, "Bash", { command });
    blocked(r);
    assert.match(r.message, /never reads implementation code/, command);
  }
  blocked(call(TE, "PowerShell", { command: "Get-Content shop/cart.py" }));
});

test("C4 Test Engineer may run tests and read tests from the shell", () => {
  allowed(call(TE, "Bash", { command: "python -m pytest tests/test_cart.py" }));
  allowed(call(TE, "Bash", { command: "cat tests/test_cart.py" }));
  allowed(call(TE, "Bash", { command: "grep -rn def tests" }));
  allowed(call(TE, "Bash", { command: "gh issue view 3" }));
});

// C5 edge: the main session and other agents are never blocked.
test("C5 main session is never blocked", () => {
  for (const agent of [undefined, ""]) {
    allowed(call(agent, "Edit", { file_path: abs("tests/test_cart.py") }));
    allowed(call(agent, "Read", { file_path: abs("shop/cart.py") }));
    allowed(call(agent, "Bash", { command: "cat shop/cart.py" }));
  }
});

test("C5 other agents, including a user's own 'engineer', are never blocked", () => {
  allowed(call("Explore", "Read", { file_path: abs("shop/cart.py") }));
  allowed(call("engineer", "Edit", { file_path: abs("tests/test_cart.py") }));
  allowed(call("test-engineer", "Read", { file_path: abs("shop/cart.py") }));
  allowed(call("reviewer", "Edit", { file_path: abs("shop/cart.py") }));
});

// Reviewer (#16): read-only. The PR has no new commits and is not merged.
const REV = "nap:reviewer";

test("R1 Reviewer file edits are blocked with the rule", () => {
  for (const tool of ["Edit", "Write"]) {
    const r = call(REV, tool, { file_path: abs("shop/cart.py") });
    blocked(r);
    assert.match(r.message, /Reviewer is read-only/);
  }
  blocked(call(REV, "Write", { file_path: abs("tests/test_cart.py") }));
});

test("R2 Reviewer commits, pushes, merges and closes are blocked", () => {
  for (const command of [
    "git commit -am fix",
    "git push origin HEAD",
    "git checkout feature && git merge main",
    "git reset --hard HEAD~1",
  ]) {
    const r = call(REV, "Bash", { command });
    blocked(r);
    assert.match(r.message, /never commits, pushes, merges or closes/, command);
  }
});

test("R5 Reviewer gh commands outside the allowlist are blocked", () => {
  for (const command of [
    "gh pr merge 5 --squash",
    "gh pr close 5",
    "gh pr edit 5 --title x",
    "gh pr ready 5",
    "gh issue close 3",
    "gh issue comment 3 --body x",
    "gh repo delete AD-NAP/x --yes",
    "gh workflow run ci.yml",
    "gh release create v1",
    "GH_TOKEN=abc gh pr merge 5",
    "gh pr view 5 && gh pr merge 5",
    "/usr/bin/gh pr merge 5",
  ]) {
    const r = call(REV, "Bash", { command });
    blocked(r);
    assert.match(r.message, /may use gh only to read PRs and issues/, command);
  }
});

test("R6 Reviewer gh api calls that change things are blocked (the gap the Reviewer found)", () => {
  for (const command of [
    "gh api -X PUT repos/AD-NAP/x/pulls/5/merge",
    "gh api --method=PUT repos/AD-NAP/x/pulls/5/merge",
    "gh api --method DELETE repos/AD-NAP/x/git/refs/heads/main",
    "gh api repos/AD-NAP/x/pulls/5/merge -f merge_method=squash",
    "gh api repos/AD-NAP/x/issues/3/comments --input body.json",
    "gh api graphql -f query='mutation { mergePullRequest(input: {pullRequestId: \"x\"}) { clientMutationId } }'",
  ]) {
    const r = call(REV, "Bash", { command });
    blocked(r);
    assert.match(r.message, /gh api` only to read/, command);
  }
});

test("R7 Reviewer gh api reads are allowed", () => {
  allowed(call(REV, "Bash", { command: "gh api repos/AD-NAP/x/pulls/5/reviews --jq '.[].state'" }));
  allowed(call(REV, "Bash", { command: "gh api -X GET repos/AD-NAP/x/pulls -f state=open" }));
  allowed(call(REV, "Bash", { command: "gh api graphql -f query='query { viewer { login } }'" }));
  allowed(call(REV, "Bash", { command: "gh pr checks 5" }));
  allowed(call(REV, "Bash", { command: "gh issue view 3 --json body" }));
});

test("R3 Reviewer shell writes into the project are blocked", () => {
  blocked(call(REV, "Bash", { command: "echo x > shop/cart.py" }));
  blocked(call(REV, "Bash", { command: "sed -i 's/a/b/' shop/cart.py" }));
  blocked(call(REV, "PowerShell", { command: "Set-Content shop/cart.py 'x'" }));
});

test("R4 Reviewer may read, view the PR and post its review", () => {
  allowed(call(REV, "Read", { file_path: abs("shop/cart.py") }));
  allowed(call(REV, "Grep", { pattern: "def", path: abs("shop") }));
  allowed(call(REV, "Bash", { command: "gh pr view 5 --json title,body,files" }));
  allowed(call(REV, "Bash", { command: "gh pr diff 5" }));
  allowed(call(REV, "Bash", { command: "gh issue view 3" }));
  allowed(call(REV, "Bash", { command: "git log --oneline -5 && git diff main...HEAD" }));
  allowed(call(REV, "Bash", { command: 'gh pr review 5 --request-changes --body "> quote\n| 1 | C1 | Not met | shop/cart.py:3 |"' }));
  allowed(call(REV, "Bash", { command: "gh pr review 5 --comment --body 'Review: approve'" }));
  allowed(call(REV, "Bash", { command: "gh pr diff 5 > /tmp/pr.diff 2>&1" }));
});

test("quoted '>' is not a redirect for the Engineer either", () => {
  allowed(call(ENG, "Bash", { command: 'gh pr create --body "Closes #3 > tests/test_cart.py stays as is"' }));
});

// The script itself: exit 2 with the message on stderr when blocking, exit 0 otherwise.
test("script blocks with exit 2 and the message on stderr", () => {
  const input = { agent_type: ENG, tool_name: "Edit", tool_input: { file_path: abs("tests/test_cart.py") }, cwd };
  const r = spawnSync(process.execPath, [HOOK], { input: JSON.stringify(input), encoding: "utf8" });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /NAP lane rule: the Engineer never edits tests/);
});

test("script allows with exit 0, and never blocks on bad input", () => {
  const ok = { tool_name: "Read", tool_input: { file_path: abs("shop/cart.py") }, cwd };
  assert.equal(spawnSync(process.execPath, [HOOK], { input: JSON.stringify(ok), encoding: "utf8" }).status, 0);
  assert.equal(spawnSync(process.execPath, [HOOK], { input: "not json", encoding: "utf8" }).status, 0);
});
