"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const installer = path.join(repoRoot, "bin", "install.js");
const skillName = "abs-local-prospector";

function makeTempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "abs-prospector-test-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function runInstaller(env, args = []) {
  const cleanEnv = { ...process.env };
  delete cleanEnv.CODEX_HOME;
  return spawnSync(process.execPath, [installer, ...args], {
    env: { ...cleanEnv, ...env },
    encoding: "utf8",
  });
}

function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      for (const child of listFiles(full)) out.push(path.join(entry.name, child));
    } else {
      out.push(entry.name);
    }
  }
  return out.sort();
}

function assertInstalledCopy(target) {
  assert.ok(fs.existsSync(path.join(target, "SKILL.md")), "SKILL.md installed");
  assert.ok(fs.statSync(path.join(target, "agents")).isDirectory(), "agents/ installed");
  assert.ok(fs.statSync(path.join(target, "references")).isDirectory(), "references/ installed");

  for (const dir of ["agents", "references"]) {
    assert.deepEqual(listFiles(path.join(target, dir)), listFiles(path.join(repoRoot, dir)));
  }
  assert.equal(
    fs.readFileSync(path.join(target, "SKILL.md"), "utf8"),
    fs.readFileSync(path.join(repoRoot, "SKILL.md"), "utf8"),
  );

  // Only the skill entries are installed, not package files.
  assert.deepEqual(fs.readdirSync(target).sort(), ["SKILL.md", "agents", "references"]);
}

test("installs into CODEX_HOME/skills/abs-local-prospector when CODEX_HOME is set", (t) => {
  const codexHome = makeTempDir(t);
  const result = runInstaller({ CODEX_HOME: codexHome });

  assert.equal(result.status, 0, result.stderr);
  const target = path.join(codexHome, "skills", skillName);
  assertInstalledCopy(target);
  assert.match(result.stdout, /Installed Codex skill:/);
});

test("installs into ~/.codex/skills/abs-local-prospector when CODEX_HOME is not set", (t) => {
  const home = makeTempDir(t);
  // os.homedir() reads USERPROFILE on Windows and HOME elsewhere.
  const result = runInstaller({ HOME: home, USERPROFILE: home });

  assert.equal(result.status, 0, result.stderr);
  assertInstalledCopy(path.join(home, ".codex", "skills", skillName));
});

test("a second run without --force refuses and leaves the existing copy untouched", (t) => {
  const codexHome = makeTempDir(t);
  const target = path.join(codexHome, "skills", skillName);

  assert.equal(runInstaller({ CODEX_HOME: codexHome }).status, 0);
  const marker = path.join(target, "local-note.txt");
  fs.writeFileSync(marker, "keep me");

  const second = runInstaller({ CODEX_HOME: codexHome });
  assert.equal(second.status, 1);
  assert.match(second.stderr, /Skill already exists/);
  assert.match(second.stderr, /--force/);
  assert.equal(fs.readFileSync(marker, "utf8"), "keep me", "existing install not modified");
  assert.ok(fs.existsSync(path.join(target, "SKILL.md")));
});

test("--force replaces an existing copy cleanly and is repeatable", (t) => {
  const codexHome = makeTempDir(t);
  const target = path.join(codexHome, "skills", skillName);

  assert.equal(runInstaller({ CODEX_HOME: codexHome }).status, 0);
  fs.writeFileSync(path.join(target, "stale.txt"), "old");
  fs.writeFileSync(path.join(target, "SKILL.md"), "edited locally");

  for (let i = 0; i < 2; i += 1) {
    const result = runInstaller({ CODEX_HOME: codexHome }, ["--force"]);
    assert.equal(result.status, 0, result.stderr);
    assertInstalledCopy(target);
  }
  assert.ok(!fs.existsSync(path.join(target, "stale.txt")), "stale files removed");
});

test("does not touch sibling skills in the same skills folder", (t) => {
  const codexHome = makeTempDir(t);
  const sibling = path.join(codexHome, "skills", "other-skill");
  fs.mkdirSync(sibling, { recursive: true });
  fs.writeFileSync(path.join(sibling, "SKILL.md"), "other");

  assert.equal(runInstaller({ CODEX_HOME: codexHome }).status, 0);
  assert.equal(runInstaller({ CODEX_HOME: codexHome }, ["--force"]).status, 0);
  assert.equal(fs.readFileSync(path.join(sibling, "SKILL.md"), "utf8"), "other");
});
