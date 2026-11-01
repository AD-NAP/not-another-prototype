#!/usr/bin/env node
// NAP lane rules, run before every file and shell tool call (PreToolUse).
// - The Engineer never edits tests.
// - The Test Engineer never reads implementation code, and writes test files only.
// Any other agent, and the main session, is never blocked.
// Shell checks are best effort: they catch common commands, not every trick.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ENGINEER = "nap:engineer";
const TEST_ENGINEER = "nap:test-engineer";

const TEST_DIRS = new Set(["test", "tests", "__tests__", "spec", "specs"]);
const TEST_NAMES = [
  /^test_.*\.py$/,
  /_test\.(py|go|rb)$/,
  /\.(test|spec)\.[cm]?[jt]sx?$/,
  /^conftest\.py$/,
  /Tests?\.(java|kt|cs)$/,
  /_spec\.rb$/,
];
const CODE_EXT = new Set([
  "py", "js", "mjs", "cjs", "jsx", "ts", "tsx", "svelte", "vue", "go", "rb", "java", "kt",
  "cs", "rs", "php", "swift", "c", "cc", "cpp", "h", "hpp", "scala", "sh", "ps1", "sql",
]);
const CONFIG_NAMES = [/\.config\.[cm]?[jt]s$/, /^setup\.py$/];

const EDIT_TOOLS = new Set(["Edit", "Write", "MultiEdit", "NotebookEdit"]);
const SHELL_TOOLS = new Set(["Bash", "PowerShell"]);

const READERS =
  /(^|[\s;&|(])(cat|head|tail|less|more|bat|nl|grep|egrep|fgrep|rg|ag|ack|sed|awk|strings|xxd|od|type|Get-Content|gc|Select-String|sls|findstr)(?=\s|$)/i;
const RECURSIVE_SEARCH = /(^|[\s;&|(])(rg|ag|ack)(?=\s|$)|(^|[\s;&|(])grep\s+(-\S*[rR]\S*\s+)/;
const WRITERS =
  /(^|[\s;&|(])(rm|mv|cp|tee|truncate|sed\s+(-\S+\s+)*-i\S*|perl\s+-\S*i\S*|git\s+(checkout|restore|rm|mv)|Set-Content|Add-Content|Out-File|Remove-Item|Move-Item|Copy-Item|New-Item|Clear-Content)(?=\s|$)/i;
const REDIRECT_TARGET = /\d?>{1,2}\s*("[^"]+"|'[^']+'|[^\s;&|]+)/g;

function rel(p, cwd) {
  if (!p) return "";
  const abs = path.resolve(cwd || ".", p);
  const r = cwd ? path.relative(cwd, abs) : abs;
  const inside = cwd && r && !r.startsWith("..") && !path.isAbsolute(r);
  return (inside ? r : abs).split(path.sep).join("/").replace(/\\/g, "/");
}

export function isTestPath(p, cwd) {
  const r = rel(p, cwd);
  if (!r) return false;
  const parts = r.split("/");
  const name = parts[parts.length - 1];
  if (parts.slice(0, -1).some((d) => TEST_DIRS.has(d.toLowerCase()))) return true;
  if (TEST_DIRS.has(name.toLowerCase())) return true; // the folder itself
  return TEST_NAMES.some((re) => re.test(name));
}

export function isSource(p, cwd) {
  const r = rel(p, cwd);
  const name = r.split("/").pop() || "";
  const ext = name.includes(".") ? name.split(".").pop().toLowerCase() : "";
  if (!CODE_EXT.has(ext)) return false;
  if (isTestPath(p, cwd)) return false;
  return !CONFIG_NAMES.some((re) => re.test(name));
}

function isDir(p, cwd) {
  try {
    return fs.statSync(path.resolve(cwd || ".", p)).isDirectory();
  } catch {
    return false;
  }
}

function tokens(command) {
  return (command.match(/"[^"]*"|'[^']*'|[^\s;&|()<>]+/g) || [])
    .map((t) => t.replace(/^["']|["']$/g, ""))
    .filter((t) => t && !t.startsWith("-"));
}

function block(message) {
  return { block: true, message: `NAP lane rule: ${message}` };
}

const ALLOW = { block: false };

function engineer(tool, input, cwd) {
  if (EDIT_TOOLS.has(tool)) {
    const file = input.file_path || input.notebook_path;
    if (isTestPath(file, cwd)) {
      return block(
        `the Engineer never edits tests. ${rel(file, cwd)} is a test file. If a test looks wrong, leave it and report it on the issue.`,
      );
    }
  }
  if (SHELL_TOOLS.has(tool)) {
    const cmd = input.command || "";
    const redirected = [...cmd.matchAll(REDIRECT_TARGET)].map((m) => m[1].replace(/^["']|["']$/g, ""));
    const hit =
      redirected.find((t) => isTestPath(t, cwd)) ||
      (WRITERS.test(cmd) && tokens(cmd).find((t) => isTestPath(t, cwd)));
    if (hit) {
      return block(
        `the Engineer never edits tests, including from the shell. This command changes ${rel(hit, cwd)}. If a test looks wrong, leave it and report it on the issue.`,
      );
    }
  }
  return ALLOW;
}

function testEngineer(tool, input, cwd) {
  const readMsg = (what) =>
    block(
      `the Test Engineer never reads implementation code. ${what} Test what the issue says. If you need a name the issue and design don't give, pick one and list it under Assumptions.`,
    );

  if (tool === "Read" && isSource(input.file_path, cwd)) {
    return readMsg(`${rel(input.file_path, cwd)} is source code.`);
  }

  if (tool === "Grep") {
    const target = input.path || cwd || ".";
    if (isSource(target, cwd)) return readMsg(`${rel(target, cwd)} is source code.`);
    const searchesFolder = isDir(target, cwd) || !path.extname(target);
    if (searchesFolder && !isTestPath(target, cwd)) {
      const glob = input.glob || "";
      const safeGlob = glob && (isTestPath(glob, cwd) || !isSource(glob.replace(/[*{}]/g, "x"), cwd));
      if (!safeGlob) {
        return readMsg(
          "This search covers source code. Search a test folder, or set glob to test files, docs or config.",
        );
      }
    }
  }

  if (EDIT_TOOLS.has(tool)) {
    const file = input.file_path || input.notebook_path;
    if (!isTestPath(file, cwd)) {
      return block(
        `the Test Engineer writes test files only. ${rel(file, cwd)} is not a test file. The Engineer writes the code.`,
      );
    }
  }

  if (SHELL_TOOLS.has(tool)) {
    const cmd = input.command || "";
    if (READERS.test(cmd)) {
      const args = tokens(cmd);
      const hit = args.find(
        (t) => isSource(t, cwd) || (isDir(t, cwd) && !isTestPath(t, cwd)),
      );
      if (hit) return readMsg(`This command reads ${rel(hit, cwd) || "."}, which holds source code.`);
      const hasPath = args.some(
        (t) => isDir(t, cwd) || t.includes("/") || t.includes("\\") || t.includes("."),
      );
      if (RECURSIVE_SEARCH.test(cmd) && !hasPath) {
        return readMsg("This search runs over the whole project, which holds source code.");
      }
    }
  }

  return ALLOW;
}

// Decide one tool call. Returns { block, message }.
export function decide(input) {
  const agent = input.agent_type || "";
  const tool = input.tool_name || "";
  const toolInput = input.tool_input || {};
  const cwd = input.cwd || process.cwd();
  if (agent === ENGINEER) return engineer(tool, toolInput, cwd);
  if (agent === TEST_ENGINEER) return testEngineer(tool, toolInput, cwd);
  return ALLOW;
}

function main() {
  let raw = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (c) => (raw += c));
  process.stdin.on("end", () => {
    let input = {};
    try {
      input = JSON.parse(raw || "{}");
    } catch {
      process.exit(0); // Unreadable input: don't block.
    }
    const result = decide(input);
    if (process.env.NAP_HOOK_LOG) {
      try {
        fs.appendFileSync(
          process.env.NAP_HOOK_LOG,
          JSON.stringify({ agent_type: input.agent_type ?? null, tool: input.tool_name, block: result.block }) + "\n",
        );
      } catch {}
    }
    if (result.block) {
      process.stderr.write(result.message + "\n");
      process.exit(2);
    }
    process.exit(0);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
