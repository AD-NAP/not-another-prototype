#!/usr/bin/env node
// NAP event log. Adds one line to the project's event log when a NAP role starts,
// finishes or fails work on an issue or PR. The office and the Kopi Report read it.
//
// Log: <project>/.nap/events.jsonl, one JSON object per line, oldest first.
// NAP_EVENT_LOG sets another path. Each line has:
//   time    ISO 8601 time, UTC
//   role    the role, such as "pm", "tech-lead", "test-engineer", "engineer", "reviewer"
//   event   "started", "finished" or "failed"
//   issue   the issue number, or null
//   pr      the PR number, or null
//   detail  what happened, in one short line (for "failed", the reason)
//   session the Claude Code session id
//
// Which role is working:
// - Subagent roles (any nap:<name> agent): started when the Agent tool is called,
//   finished when the subagent stops, failed when the Agent tool or the subagent fails.
// - Skill roles in the main session (any nap:<name> skill, except entry skills that
//   hand the work to an agent): started when the skill runs, finished when the turn
//   ends, failed when the turn stops with an error.
//
// Best effort: this hook never blocks and always exits 0, even when the log can't be written.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PREFIX = "nap:";
const AGENT_TOOLS = new Set(["Agent", "Task"]);

// Skills whose role name differs from the skill name.
const SKILL_ROLES = { backlog: "pm", design: "tech-lead" };
// Entry skills only start a subagent role, which logs itself (decision 10).
const ENTRY_SKILLS = new Set(["failing-tests", "make-tests-pass", "review"]);
// Roles whose bare number ("12", "#12") means a PR, not an issue.
const PR_ROLES = new Set(["reviewer"]);

const DETAIL_MAX = 200;
const KEEP_CLOSED = 50;

function napName(name) {
  const n = String(name || "").trim().replace(/^\//, "");
  return n.startsWith(PREFIX) ? n.slice(PREFIX.length) : "";
}

export function agentRole(agentType) {
  return napName(agentType) || null;
}

export function skillRole(skill) {
  const name = napName(skill);
  if (!name || ENTRY_SKILLS.has(name)) return null;
  return SKILL_ROLES[name] || name;
}

// Finds the issue and PR numbers in a prompt or skill arguments.
export function refs(text, role) {
  const t = String(text || "");
  const num = (re) => {
    const m = t.match(re);
    return m ? Number(m[1]) : null;
  };
  let pr = num(/\/pull\/(\d+)/) ?? num(/\b(?:PR|pull request)\s*#?(\d+)/i);
  let issue = num(/\/issues\/(\d+)/) ?? num(/\bissue\s*#?(\d+)/i);
  const hashes = [...t.matchAll(/(?:^|[^\w/#])#(\d+)\b/g)].map((m) => Number(m[1]));
  const bare = hashes.find((n) => n !== pr && n !== issue) ?? num(/^\s*(\d+)\s*$/);
  if (bare != null && bare !== pr && bare !== issue) {
    if (PR_ROLES.has(role) && pr == null) pr = bare;
    else if (issue == null) issue = bare;
    else if (pr == null) pr = bare;
  }
  return { issue, pr };
}

function oneLine(text) {
  const line = String(text ?? "")
    .split("\n")
    .map((l) => l.replace(/^[#>*\-\s]+/, "").trim())
    .find(Boolean);
  if (!line) return "";
  return line.length > DETAIL_MAX ? line.slice(0, DETAIL_MAX - 3) + "..." : line;
}

export function logPath(input = {}, env = process.env) {
  if (env.NAP_EVENT_LOG) return env.NAP_EVENT_LOG;
  const root = env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  return path.join(root, ".nap", "events.jsonl");
}

function statePath(log) {
  return path.join(path.dirname(log), "events-state.json");
}

function readState(log) {
  try {
    const s = JSON.parse(fs.readFileSync(statePath(log), "utf8"));
    return { pending: [], agents: {}, skills: {}, closed: [], ...s };
  } catch {
    return { pending: [], agents: {}, skills: {}, closed: [] };
  }
}

function writeState(log, state) {
  state.closed = state.closed.slice(-KEEP_CLOSED);
  fs.writeFileSync(statePath(log), JSON.stringify(state));
}

function ensureDir(log, env) {
  const dir = path.dirname(log);
  if (fs.existsSync(dir)) return;
  fs.mkdirSync(dir, { recursive: true });
  // The default .nap folder is local working data: keep it out of commits.
  if (!env.NAP_EVENT_LOG) fs.writeFileSync(path.join(dir, ".gitignore"), "*\n");
}

// A role's work is closed once it has a "finished" or "failed" entry, so it never gets both.
// Keyed by the Agent tool call and by the subagent id, since each hook knows only one of them.
function close(state, who, agentId) {
  for (const key of [who.tool_use_id, agentId && `agent:${agentId}`]) {
    if (key && !state.closed.includes(key)) state.closed.push(key);
  }
}

function isClosed(state, who, agentId) {
  return [who.tool_use_id, agentId && `agent:${agentId}`].some((k) => k && state.closed.includes(k));
}

// Works out the entries for one hook call and updates the state. Pure apart from the clock.
export function entriesFor(input, state, now = new Date()) {
  const ev = input.hook_event_name || "";
  const tool = input.tool_name || "";
  const toolInput = input.tool_input || {};
  const session = input.session_id || null;
  const inSubagent = Boolean(input.agent_id);
  const out = [];
  const entry = (who, event, detail) =>
    out.push({
      time: now.toISOString(),
      role: who.role,
      event,
      issue: who.issue ?? null,
      pr: who.pr ?? null,
      detail: oneLine(detail),
      session,
    });

  const closeSkill = (event, detail) => {
    const open = state.skills[session];
    if (!open) return;
    delete state.skills[session];
    entry(open, event, detail);
  };
  const startSkill = (skill, args) => {
    const role = skillRole(skill);
    if (!role || inSubagent) return;
    const who = { role, ...refs(args, role) };
    const open = state.skills[session];
    if (open && open.role === who.role && open.issue === who.issue && open.pr === who.pr) return;
    closeSkill("finished", "another role started");
    state.skills[session] = who;
    const name = String(skill).replace(/^\//, "");
    entry(who, "started", args ? `/${name} ${args}` : `/${name}`);
  };

  if (ev === "PreToolUse" && AGENT_TOOLS.has(tool)) {
    const role = agentRole(toolInput.subagent_type);
    if (!role) return out;
    const who = { role, ...refs(toolInput.prompt, role) };
    state.pending.push({ ...who, tool_use_id: input.tool_use_id || null, session });
    entry(who, "started", toolInput.description || toolInput.prompt);
  } else if (ev === "PreToolUse" && tool === "Skill") {
    startSkill(toolInput.skill, toolInput.args);
  } else if (ev === "UserPromptExpansion") {
    startSkill(input.command_name, input.command_args);
  } else if (ev === "SubagentStart") {
    const role = agentRole(input.agent_type);
    if (!role) return out;
    const i = state.pending.findIndex((p) => p.role === role && p.session === session);
    const at = i >= 0 ? i : state.pending.findIndex((p) => p.role === role);
    const who = at >= 0 ? state.pending.splice(at, 1)[0] : { role, issue: null, pr: null, tool_use_id: null };
    state.agents[input.agent_id] = who;
  } else if (ev === "SubagentStop") {
    const role = agentRole(input.agent_type);
    if (!role) return out;
    const who = state.agents[input.agent_id] || { role };
    delete state.agents[input.agent_id];
    if (isClosed(state, who, input.agent_id)) return out;
    close(state, who, input.agent_id);
    entry(who, "finished", input.last_assistant_message || "done");
  } else if (ev === "PostToolUseFailure" && AGENT_TOOLS.has(tool)) {
    const role = agentRole(toolInput.subagent_type);
    if (!role) return out;
    const id = input.tool_use_id || null;
    if (id && state.closed.includes(id)) return out;
    if (id) state.closed.push(id);
    const pend = state.pending.findIndex((p) => id && p.tool_use_id === id);
    if (pend >= 0) state.pending.splice(pend, 1);
    for (const [agentId, a] of Object.entries(state.agents)) {
      if (id && a.tool_use_id === id) {
        delete state.agents[agentId];
        close(state, a, agentId);
      }
    }
    const reason = input.is_interrupt ? "interrupted by the user" : input.error || "unknown error";
    entry({ role, ...refs(toolInput.prompt, role) }, "failed", reason);
  } else if (ev === "StopFailure") {
    const details = input.error_details;
    const reason =
      [input.error, typeof details === "string" ? details : details && JSON.stringify(details)]
        .filter(Boolean)
        .join(": ") || "unknown error";
    if (inSubagent) {
      const role = agentRole(input.agent_type);
      if (!role) return out;
      const who = state.agents[input.agent_id] || { role };
      delete state.agents[input.agent_id];
      if (isClosed(state, who, input.agent_id)) return out;
      close(state, who, input.agent_id);
      entry(who, "failed", reason);
    } else {
      closeSkill("failed", reason);
    }
  } else if (ev === "Stop" && !inSubagent) {
    closeSkill("finished", input.last_assistant_message || "turn ended");
  }
  return out;
}

// Handles one hook call: reads the state, appends the entries, saves the state.
// Never throws. Returns the entries written.
export function handle(input, env = process.env, now = new Date()) {
  try {
    const log = logPath(input, env);
    const state = readState(log);
    const before = JSON.stringify(state);
    const entries = entriesFor(input, state, now);
    // Nothing to log and nothing to remember: don't touch the disk (most sessions aren't NAP's).
    if (!entries.length && JSON.stringify(state) === before) return [];
    ensureDir(log, env);
    if (entries.length) fs.appendFileSync(log, entries.map((e) => JSON.stringify(e) + "\n").join(""));
    writeState(log, state);
    return entries;
  } catch {
    return [];
  }
}

// Reads the log as a list of entries, skipping lines that aren't JSON.
export function readLog(file) {
  let text = "";
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    return [];
  }
  return text
    .split("\n")
    .filter(Boolean)
    .flatMap((l) => {
      try {
        return [JSON.parse(l)];
      } catch {
        return [];
      }
    });
}

function main() {
  let raw = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (c) => (raw += c));
  process.stdin.on("end", () => {
    try {
      handle(JSON.parse(raw || "{}"));
    } catch {}
    process.exit(0);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
