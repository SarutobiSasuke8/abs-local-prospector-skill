#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const skillName = "abs-local-prospector";
const root = path.resolve(__dirname, "..");
const skillEntries = ["SKILL.md", "agents", "references"];
const targetRoot = process.env.CODEX_HOME
  ? path.join(process.env.CODEX_HOME, "skills")
  : path.join(os.homedir(), ".codex", "skills");
const target = path.join(targetRoot, skillName);
const force = process.argv.includes("--force");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function assertSkillSource() {
  const skillFile = path.join(root, "SKILL.md");
  if (!fs.existsSync(skillFile)) {
    console.error(`SKILL.md not found at package root: ${skillFile}`);
    process.exit(1);
  }

  for (const entry of skillEntries) {
    const entryPath = path.join(root, entry);
    if (!fs.existsSync(entryPath)) {
      console.error(`Required skill entry not found: ${entryPath}`);
      process.exit(1);
    }
  }
}

assertSkillSource();

if (fs.existsSync(target) && !force) {
  console.error(`Skill already exists: ${target}`);
  console.error("Run again with --force to replace it.");
  process.exit(1);
}

fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });

for (const entry of skillEntries) {
  const srcPath = path.join(root, entry);
  const destPath = path.join(target, entry);
  const stats = fs.statSync(srcPath);

  if (stats.isDirectory()) {
    copyDir(srcPath, destPath);
  } else if (stats.isFile()) {
    fs.copyFileSync(srcPath, destPath);
  }
}

console.log(`Installed Codex skill: ${target}`);
console.log("Restart Codex or start a new session if the skill does not appear immediately.");
