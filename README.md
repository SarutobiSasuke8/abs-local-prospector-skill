# ABS Local Prospector Skill

Codex skill for finding and qualifying local business prospects for Astraeus Business Solutions.

It helps Codex research local businesses, identify weak digital presence, score lead quality, and return an outreach-ready lead sheet.

## What It Qualifies

- No standalone website
- Social-only or marketplace-only presence
- Weak website or poor mobile/conversion flow
- Booking, enquiry, CRM, or follow-up gaps
- Google Business Profile cleanup opportunities
- AI-assisted FAQ, intake, or admin-reduction opportunities

## Install

From this folder (the package has no dependencies, so `npm install` is not needed):

```powershell
node bin/install.js
```

This copies `SKILL.md`, `agents/` and `references/` to:

```text
%USERPROFILE%\.codex\skills\abs-local-prospector
```

On macOS or Linux the default is `~/.codex/skills/abs-local-prospector`.

If `CODEX_HOME` is set, it installs to:

```text
%CODEX_HOME%\skills\abs-local-prospector
```

Running the installer again when the skill is already installed is safe: it stops with "Skill already exists" and leaves the installed copy untouched. To replace an existing installed copy:

```powershell
node bin/install.js --force
```

`--force` deletes the installed `abs-local-prospector` folder (including any local edits in it) and copies a fresh one. Other skills in the same folder are not touched.

Restart Codex or start a new session after installing.

## Usage

```text
Use $abs-local-prospector to find 15 local businesses within 20 km of Casoria that may need help from Astraeus Business Solutions. Focus on websites, booking flows, CRM-lite follow-up, and Google Business cleanup. Return a chat table and the best first outreach targets.
```

Spreadsheet workflow:

```text
Use $abs-local-prospector and $spreadsheets to find 30 local businesses within 20 km of Casoria that may need websites, booking flows, CRM-lite follow-up, Google Business cleanup, or AI intake help. Create an XLSX lead sheet with filters, lead score, contact info, website/social status, ABS angle, confidence, and next action.
```

## Validation

Check the installer syntax:

```powershell
npm run check
```

Run the installer tests (Node's built-in test runner, no extra dependencies; each test installs into a temporary folder, never your real Codex home):

```powershell
npm test
```

Preview the package contents without publishing:

```powershell
npm run pack:dry-run
```

CI runs all three on Node 18 and 22 (Ubuntu and Windows) for every pull request.

Validate the skill with Codex's skill validator:

```powershell
python %USERPROFILE%\.codex\skills\.system\skill-creator\scripts\quick_validate.py .
```

## Compliance

This is an assisted research skill, not a bulk scraper. It instructs Codex to use public sources responsibly, avoid bypassing access controls, and cross-check claims before scoring a lead.

## Acknowledgements

Inspired by the open-source `local-client-prospector-skill` concept by Kappaemme-git, then adapted for Astraeus Business Solutions' sales workflow, offer rubric, safer install behavior, and Codex skill packaging.
