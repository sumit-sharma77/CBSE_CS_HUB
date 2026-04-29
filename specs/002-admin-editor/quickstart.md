# Quickstart: Dev-Only Admin Content Editor

**Feature**: 002-admin-editor
**Date**: 2026-04-29

---

## Prerequisites

Same environment as feature 001 (already set up):
- Node.js 24.13.1
- Angular CLI 21 (local — **do not** use a globally installed `ng`; PATH may not include it)
- The `cbse-cs-hub` workspace running

---

## Install Tesseract.js (dev dependency only)

```bash
cd cbse-cs-hub
npm install --save-dev tesseract.js
```

This installs Tesseract.js as a dev dependency. It will **not** appear in the production bundle — it is loaded only via dynamic `import()` inside `AdminOcrService` when the author triggers OCR.

---

## Start Development Server

The global `ng` command may not be in PATH. Use the PowerShell helper scripts (repo root) or the local CLI directly:

```powershell
# Recommended — PowerShell helper
.\start.ps1          # default port 4200
.\start.ps1 -Port 4300 -Open   # custom port + open browser

# Manual equivalent
cd cbse-cs-hub
node node_modules/@angular/cli/bin/ng serve
```

To stop: `.\stop.ps1`  |  To restart: `.\restart.ps1`

Navigate to [http://localhost:4200/admin](http://localhost:4200/admin).

---

## Access the Admin Panel

The `/admin` route is protected by a route guard that checks `Angular.isDevMode()`:

- **`ng serve`** → `isDevMode() = true` → admin panel loads ✓
- **`ng build --configuration production`** → `isDevMode() = false` → `/403` page shown ✓

---

## Authoring Workflow

### Adding an MCQ Question

Each editor has two screens: a **list view** (all existing questions) and a **form view**.

1. Open [http://localhost:4200/admin](http://localhost:4200/admin)
2. Select the **MCQ** tab
3. Choose the target file from the dropdown (e.g. `cl12-python.json`) — existing questions load automatically
4. Click **+ Add Question** to open the form view
5. Click **Auto** next to the ID field — the next available ID is generated (e.g. `cl12-py-016`)
6. Fill in: question text, four options, select the correct answer radio, explanation
7. Toggle **Previous Year Question** if applicable → fill in the year
8. Click **Generate JSON** — a JSON object appears in the output panel below
9. Click **Copy** in the JSON output panel → snippet is copied to clipboard
10. Open `cbse-cs-hub/src/assets/content/mcq/cl12-python.json`
11. Paste the snippet as a new element inside the top-level `[ ]` array
12. Save the file; the dev server hot-reloads

**To edit an existing question**: from the list view, click **Edit** on any row → the form view pre-fills all fields → make changes → **Save / Generate Updated JSON** → copy the result and replace the whole array in the JSON file.

**To delete a question**: from the list view, click **Delete** → the updated array (with that item removed) is shown → copy it and replace the file contents.

### Optional: Screenshot OCR

1. Take a screenshot of the question from a CBSE board paper PDF
2. Press **Ctrl+V** anywhere on the admin panel (or drag the image onto the OCR zone)
3. Wait for OCR to complete (≤15s on a clear ≤2MB screenshot)
4. Review auto-populated fields — if a yellow border appears, OCR confidence was low; review carefully
5. Correct any OCR errors, then proceed with the standard Copy/Download workflow

### Adding SQL or Python Questions

Follow the same flow on the **SQL** or **Python** tabs. The SQL answer field accepts multi-line SQL — newlines are preserved in the JSON output.

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
