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
