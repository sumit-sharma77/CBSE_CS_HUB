# Quickstart: Dev-Only Admin Content Editor

**Feature**: 002-admin-editor
**Date**: 2026-04-29

---

## Prerequisites

Same environment as feature 001 (already set up):
- Node.js 24 LTS (v24.13.1 or later)
- Git
- Angular CLI 21 — **use the locally installed one** (`node node_modules/@angular/cli/bin/ng`); global `ng` is not required
- The `cbse-cs-hub` workspace cloned and `npm install` run

---

## Install Tesseract.js (dev dependency only)

```bash
cd cbse-cs-hub
npm install --save-dev tesseract.js
```

This installs Tesseract.js as a dev dependency. It will **not** appear in the production bundle — it is loaded only via dynamic `import()` inside `AdminOcrService` when the author triggers OCR.

---

## Start Development Servers

The admin panel requires **two servers** running simultaneously:

| Server | Port | Purpose |
|--------|------|---------|
| Angular dev server | 4200 | Serves the app and proxies API calls |
| Content write server | 3001 | Reads/writes content JSON files on disk |

Use the PowerShell helper script (repo root) which starts both automatically:

```powershell
# Recommended — starts both Angular dev server AND content-server.js
.\start.ps1

# Manual equivalent (two separate terminals)
cd cbse-cs-hub
node content-server.js        # Terminal 1 — content write server
node node_modules/@angular/cli/bin/ng serve --proxy-config proxy.conf.json  # Terminal 2
```

To stop all servers: `.\stop.ps1`

Navigate to [http://localhost:4200/admin](http://localhost:4200/admin).

---

## Access the Admin Panel

The `/admin` route is protected by a route guard that checks `Angular.isDevMode()`:

- **`ng serve`** → `isDevMode() = true` → admin panel loads ✓
- **`ng build --configuration production`** → `isDevMode() = false` → `/403` page shown ✓

---

## Authoring Workflow

Each editor has two screens: a **list view** (all existing questions with Edit/Delete) and a **form view**.

> **No file editing required.** All changes are saved directly to the JSON files by the content write server.

### Adding a Question

1. Open [http://localhost:4200/admin](http://localhost:4200/admin)
2. Select the **MCQ**, **SQL**, or **Python** tab
3. Choose the target file from the dropdown — existing questions load automatically in the list view
4. Click **+ Add Question** to open the form view
5. Click **Auto** next to the ID field — the next available ID is generated (e.g. `cl12-py-016`)
6. Fill in all required fields; for SQL/Python the `category`/`topic` is auto-filled from the file selection
7. Toggle **Previous Year Question** if applicable → fill in the year
8. Click **Add Question** (new) or **Save Changes** (edit) — the question is written to disk immediately and the list view refreshes

### Editing an Existing Question

1. From the list view, click **Edit** on any row
2. The form view pre-fills all fields
3. Make changes, then click **Save Changes**
4. The updated question is written to disk and the list refreshes

### Deleting a Question

1. From the list view, click **Delete** on any row
2. Confirm the dialog — the question is removed from the file immediately

### Optional: Screenshot OCR

1. Take a screenshot of the question from a CBSE board paper PDF
2. Press **Ctrl+V** anywhere on the admin panel (or drag the image onto the OCR zone)
3. Wait for OCR to complete (≤15s on a clear ≤2MB screenshot)
4. Review auto-populated fields — if a yellow border appears, OCR confidence was low; review carefully
5. Correct any OCR errors, then click **Add Question** to save

---

## Content File Locations

| Type | Files | Location |
|------|-------|----------|
| MCQ | `cl12-python.json`, `cl12-sql.json`, `cl12-networking.json`, `cl11-python.json`, `cl11-computer-fundamentals.json` | `src/assets/content/mcq/` |
| SQL | `aggregate.json`, `group-by.json`, `joins.json`, `keys-constraints.json`, `order-by.json`, `select.json`, `where.json` | `src/assets/content/sql-questions/` |
| Python | `conditions.json`, `dictionaries.json`, `functions.json`, `lists.json`, `loops.json`, `mixed.json`, `strings.json`, `variables.json` | `src/assets/content/python-exercises/` |

> These files are updated in place by `content-server.js` when you save from the admin panel.

---

## Verifying Bundle Isolation (Production)

```powershell
cd cbse-cs-hub
node node_modules/@angular/cli/bin/ng build --configuration production

# Check that no admin code appears in production chunks
grep -rl "AdminShell\|McqEditor\|SqlEditor\|PythonEditor\|tesseract" dist/cbse-cs-hub/
# Expected output: (empty — 0 matches)
```

---

## Deploying (no change to deploy workflow)

The admin panel is excluded from production builds automatically. Deploy as normal:

```bash
cd c:\POC\learning\CBSE_CS_HUB
./deploy.sh
```

`deploy.sh` must use `--configuration production`. The admin route will show a 403 page on the live site.
