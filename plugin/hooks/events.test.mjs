// Unit tests for the event log hook. Run: node --test plugin/hooks/events.test.mjs
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { handle, readLog, refs, skillRole, agentRole } from "./events.mjs";

const HOOK = path.join(path.dirname(fileURLToPath(import.meta.url)), "events.mjs");
const S = "session-1";
let cwd;
let env;
let log;
let clock;

beforeEach(() => {
  cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nap-events-"));
  env = {};
  log = path.join(cwd, ".nap", "events.jsonl");
  clock = Date.parse("2026-11-08T09:00:00Z");
});
afterEach(() => fs.rmSync(cwd, { recursive: true, force: true }));

// Each call is one second after the last, like real hook calls.
const run = (input) => handle({ session_id: S, cwd, ...input }, env, new Date((clock += 1000)));

const callAgent = (role, prompt, id = "tu-1", description = "") =>
  run({
    hook_event_name: "PreToolUse",
    tool_name: "Agent",
    tool_use_id: id,
    tool_input: { subagent_type: `nap:${role}`, prompt, description },
  });
const startAgent = (role, agentId) =>
  run({ hook_event_name: "SubagentStart", agent_id: agentId, agent_type: `nap:${role}` });
const stopAgent = (role, agentId, message) =>
  run({
    hook_event_name: "SubagentStop",
    agent_id: agentId,
    agent_type: `nap:${role}`,
    last_assistant_message: message,
  });
const agentFails = (role, prompt, id, error, isInterrupt = false) =>
  run({
    hook_event_name: "PostToolUseFailure",
    tool_name: "Agent",
    tool_use_id: id,
    tool_input: { subagent_type: `nap:${role}`, prompt },
    error,
    is_interrupt: isInterrupt,
  });
const useSkill = (skill, args) =>
  run({ hook_event_name: "PreToolUse", tool_name: "Skill", tool_input: { skill, args } });
const turnEnds = (message) => run({ hook_event_name: "Stop", last_assistant_message: message });

const KEYS = ["time", "role", "event", "issue", "pr", "detail", "session"];

// C1: any role's start and finish is one entry each, with the time, role, number and what happened.
test("C1 a subagent role logs started and finished with time, role, issue and what happened", () => {
  callAgent("test-engineer", "Write failing tests for issue #21.", "tu-1", "Failing tests for #21");
  startAgent("test-engineer", "ag-1");
  stopAgent("test-engineer", "ag-1", "Wrote 6 failing tests in tests/test_log.py.\nAll fail as expected.");
  const [a, b, ...rest] = readLog(log);
  assert.equal(rest.length, 0);
  assert.deepEqual(Object.keys(a), KEYS);
  assert.deepEqual(
    { role: a.role, event: a.event, issue: a.issue, pr: a.pr, detail: a.detail, session: a.session },
    { role: "test-engineer", event: "started", issue: 21, pr: null, detail: "Failing tests for #21", session: S },
  );
  assert.equal(a.time, "2026-11-08T09:00:01.000Z");
  assert.deepEqual(
    { role: b.role, event: b.event, issue: b.issue, detail: b.detail },
    { role: "test-engineer", event: "finished", issue: 21, detail: "Wrote 6 failing tests in tests/test_log.py." },
  );
});

test("C1 the Reviewer's number is a PR, and both numbers are kept when given", () => {
  callAgent("reviewer", "Review PR #26. Its issue is #22.", "tu-1");
  callAgent("reviewer", "Review #27", "tu-2");
  const [a, b] = readLog(log);
  assert.equal(a.pr, 27);
  assert.equal(a.issue, 22);
  assert.equal(b.pr, 27);
  assert.equal(b.issue, null);
});

test("C1 a skill role in the main session logs started, then finished when the turn ends", () => {
  useSkill("nap:backlog", "issue 21");
  turnEnds("## Drafted 3 issues\nApprove them?");
  const entries = readLog(log);
  assert.deepEqual(
    entries.map((e) => [e.role, e.event, e.issue, e.detail]),
    [
      ["pm", "started", 21, "/nap:backlog issue 21"],
      ["pm", "finished", 21, "Drafted 3 issues"],
    ],
  );
});

test("C1 a typed slash command starts a skill role too, and runs once if the Skill tool also fires", () => {
  run({ hook_event_name: "UserPromptExpansion", expansion_type: "slash_command", command_name: "nap:design", command_args: "21" });
  useSkill("nap:design", "21");
  turnEnds("Design posted on #21.");
  assert.deepEqual(
    readLog(log).map((e) => [e.role, e.event, e.issue]),
    [
      ["tech-lead", "started", 21],
      ["tech-lead", "finished", 21],
    ],
  );
});

test("C1 any nap role is logged without being listed, but entry skills, other plugins and plain turns are not", () => {
  callAgent("security", "Scan PR 30", "tu-1");
  useSkill("nap:failing-tests", "21");
  useSkill("nap:make-tests-pass", "21");
  useSkill("nap:review", "26");
  useSkill("superpowers:brainstorming", "21");
  for (const subagent_type of ["general-purpose", "engineer"]) {
    // Not a NAP agent: no nap: prefix.
    run({ hook_event_name: "PreToolUse", tool_name: "Agent", tool_use_id: "tu-x", tool_input: { subagent_type, prompt: "issue 21" } });
  }
  assert.deepEqual(readLog(log).map((e) => [e.role, e.pr]), [["security", 30]]);
  assert.equal(agentRole("nap:engineer"), "engineer");
  assert.equal(skillRole("nap:backlog"), "pm");
  assert.equal(skillRole("nap:sprint-plan"), "sprint-plan");
});

test("C1 a turn with no NAP role writes nothing and creates no folder", () => {
  turnEnds("Hello");
  run({ hook_event_name: "PreToolUse", tool_name: "Read", tool_input: { file_path: "x" } });
  assert.equal(fs.existsSync(path.join(cwd, ".nap")), false);
});

// C2: two roles in a row on one issue are read back in the order they happened.
test("C2 two roles in a row on the same issue are read in order", () => {
  callAgent("test-engineer", "Issue #21", "tu-1");
  startAgent("test-engineer", "ag-1");
  stopAgent("test-engineer", "ag-1", "Red: 4 failing tests.");
  callAgent("engineer", "Make the tests for issue #21 pass.", "tu-2");
  startAgent("engineer", "ag-2");
  stopAgent("engineer", "ag-2", "Green. PR #30 opened.");
  const entries = readLog(log);
  assert.deepEqual(
    entries.map((e) => `${e.role} ${e.event} #${e.issue}`),
    [
      "test-engineer started #21",
      "test-engineer finished #21",
      "engineer started #21",
      "engineer finished #21",
    ],
  );
  const times = entries.map((e) => Date.parse(e.time));
  assert.deepEqual(times, [...times].sort((x, y) => x - y));
});

test("C2 two agents of one role at once are each matched to their own issue", () => {
  callAgent("engineer", "Issue #21", "tu-1");
  callAgent("engineer", "Issue #22", "tu-2");
  startAgent("engineer", "ag-1");
  startAgent("engineer", "ag-2");
  stopAgent("engineer", "ag-2", "Done 22");
  stopAgent("engineer", "ag-1", "Done 21");
  assert.deepEqual(
    readLog(log).map((e) => `${e.event} #${e.issue} ${e.detail}`).slice(2),
    ["finished #22 Done 22", "finished #21 Done 21"],
  );
});

// C3: with no log yet, the first role creates it.
test("C3 the first role creates the folder and the log, and the folder is kept out of git", () => {
  assert.equal(fs.existsSync(log), false);
  useSkill("nap:backlog", "");
  assert.equal(readLog(log).length, 1);
  assert.equal(fs.readFileSync(path.join(cwd, ".nap", ".gitignore"), "utf8"), "*\n");
});

test("C3 NAP_EVENT_LOG and CLAUDE_PROJECT_DIR set where the log goes", () => {
  env = { NAP_EVENT_LOG: path.join(cwd, "deep", "dir", "log.jsonl") };
  useSkill("nap:backlog", "");
  assert.equal(readLog(env.NAP_EVENT_LOG).length, 1);
  assert.equal(fs.existsSync(path.join(cwd, "deep", "dir", ".gitignore")), false);

  const project = path.join(cwd, "project");
  env = { CLAUDE_PROJECT_DIR: project };
  callAgent("engineer", "Issue 3", "tu-9");
  assert.equal(readLog(path.join(project, ".nap", "events.jsonl"))[0].issue, 3);
});

// C4: a role that stops with an error gets a "failed" entry with the reason.
test("C4 a subagent that fails gets one failed entry with the reason", () => {
  callAgent("engineer", "Issue #21", "tu-1");
  startAgent("engineer", "ag-1");
  run({ hook_event_name: "StopFailure", agent_id: "ag-1", agent_type: "nap:engineer", error: "rate_limit", error_details: "Usage limit reached" });
  agentFails("engineer", "Issue #21", "tu-1", "Agent stopped: rate_limit");
  stopAgent("engineer", "ag-1", "should not log after the failure");
  assert.deepEqual(
    readLog(log).map((e) => [e.role, e.event, e.issue, e.detail]),
    [
      ["engineer", "started", 21, "Issue #21"],
      ["engineer", "failed", 21, "rate_limit: Usage limit reached"],
    ],
  );
});

test("C4 a failed Agent tool call logs failed with its error, and an interrupt says so", () => {
  callAgent("test-engineer", "Issue #21", "tu-1");
  agentFails("test-engineer", "Issue #21", "tu-1", "Error: could not start agent");
  callAgent("reviewer", "PR #26", "tu-2");
  agentFails("reviewer", "PR #26", "tu-2", "", true);
  const failed = readLog(log).filter((e) => e.event === "failed");
  assert.deepEqual(
    failed.map((e) => [e.role, e.issue, e.pr, e.detail]),
    [
      ["test-engineer", 21, null, "Error: could not start agent"],
      ["reviewer", null, 26, "interrupted by the user"],
    ],
  );
});

test("C4 a skill role whose turn stops with an error gets a failed entry", () => {
  useSkill("nap:backlog", "#21");
  run({ hook_event_name: "StopFailure", error: "server_error" });
  turnEnds("later turn"); // the role is closed, so nothing more
  assert.deepEqual(
    readLog(log).map((e) => [e.role, e.event, e.detail]),
    [
      ["pm", "started", "/nap:backlog #21"],
      ["pm", "failed", "server_error"],
    ],
  );
});

// Constraint: best effort. A failed write never stops the role.
test("best effort: an unwritable log never throws and the script exits 0", () => {
  const file = path.join(cwd, "a-file");
  fs.writeFileSync(file, "");
  env = { NAP_EVENT_LOG: path.join(file, "cannot", "log.jsonl") };
  assert.deepEqual(useSkill("nap:backlog", ""), []);
  const input = { hook_event_name: "PreToolUse", tool_name: "Skill", tool_input: { skill: "nap:backlog" }, cwd };
  const r = spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify(input),
    encoding: "utf8",
    env: { ...process.env, NAP_EVENT_LOG: env.NAP_EVENT_LOG },
  });
  assert.equal(r.status, 0);
  assert.equal(r.stdout, "");
});

test("best effort: a broken state file or bad input is ignored", () => {
  fs.mkdirSync(path.join(cwd, ".nap"));
  fs.writeFileSync(path.join(cwd, ".nap", "events-state.json"), "{not json");
  callAgent("engineer", "Issue #5", "tu-1");
  assert.equal(readLog(log)[0].issue, 5);
  assert.equal(spawnSync(process.execPath, [HOOK], { input: "not json", encoding: "utf8" }).status, 0);
});

test("the script writes the log from stdin, readable as one JSON object per line", () => {
  const input = { hook_event_name: "PreToolUse", tool_name: "Agent", session_id: S, cwd, tool_input: { subagent_type: "nap:engineer", prompt: "Issue #8" } };
  const r = spawnSync(process.execPath, [HOOK], { input: JSON.stringify(input), encoding: "utf8", env: { ...process.env, CLAUDE_PROJECT_DIR: cwd, NAP_EVENT_LOG: "" } });
  assert.equal(r.status, 0);
  const lines = fs.readFileSync(log, "utf8").trim().split("\n");
  assert.equal(lines.length, 1);
  assert.equal(JSON.parse(lines[0]).issue, 8);
});

test("refs finds issue and PR numbers in common forms", () => {
  assert.deepEqual(refs("Issue #21"), { issue: 21, pr: null });
  assert.deepEqual(refs("21"), { issue: 21, pr: null });
  assert.deepEqual(refs("https://github.com/o/r/issues/21"), { issue: 21, pr: null });
  assert.deepEqual(refs("https://github.com/o/r/pull/26"), { issue: null, pr: 26 });
  assert.deepEqual(refs("pull request 26 for issue 21"), { issue: 21, pr: 26 });
  assert.deepEqual(refs("#21 then #26"), { issue: 21, pr: null });
  assert.deepEqual(refs("26", "reviewer"), { issue: null, pr: 26 });
  assert.deepEqual(refs("no number here"), { issue: null, pr: null });
});
