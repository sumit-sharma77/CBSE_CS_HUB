# CBSE CS Hub

A static Angular PWA for CBSE Class 11 & 12 Computer Science — MCQs, SQL exercises, Python exercises, and study notes. Includes a **dev-only admin panel** for directly editing content JSON files.

---

## Prerequisites

Install these tools **once** on a new machine before cloning the repo.

### 1. Node.js 24 LTS

Download from https://nodejs.org and install the **LTS** release.

Verify:
```powershell
node --version   # v24.x.x
npm --version    # 11.x.x
```

### 2. Git

Download from https://git-scm.com and install.

Verify:
```powershell
git --version
```

### 3. (Optional) VS Code

Download from https://code.visualstudio.com. Recommended extensions:
- Angular Language Service
- Tailwind CSS IntelliSense

---

## First-Time Setup

### 1. Clone the repository

```powershell
git clone https://github.com/sumit-sharma77/CBSE_CS_HUB.git
cd CBSE_CS_HUB
```

### 2. Install dependencies

```powershell
cd cbse-cs-hub
npm install
```

This installs Angular, Tailwind CSS, Tesseract.js (OCR, dev-only), and all other dependencies listed in `package.json`.

### 3. (Windows) Allow PowerShell scripts

The helper scripts (`start.ps1`, `stop.ps1`, `restart.ps1`) are unsigned. Run this **once** in an Administrator PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Running the Dev Server

Always run from the **repository root** (`CBSE_CS_HUB/`), not from inside `cbse-cs-hub/`.

```powershell
# From CBSE_CS_HUB/
.\start.ps1
```

This starts **two** servers:
| Server | Port | Purpose |
|--------|------|---------|
| Angular dev server | 4200 | Serves the app with hot-reload |
| Content write server | 3001 | Handles admin save/delete (local only) |

Open in browser:
- **App**: http://localhost:4200/CBSE_CS_HUB
- **Admin**: http://localhost:4200/CBSE_CS_HUB/admin *(dev mode only)*

To stop: `.\stop.ps1`  
To restart: `.\restart.ps1`

> **Note**: The global `ng` command may not be in PATH. The scripts use `node node_modules/@angular/cli/bin/ng` internally — you do **not** need a globally installed Angular CLI.

---

## Admin Panel — Editing Content

The `/admin` route is only accessible when `ng serve` is running (Angular's `isDevMode()` must be `true`). In a production build it redirects to a 403 page.

### Quick workflow

1. Start the dev server (`.\start.ps1`)
2. Go to http://localhost:4200/CBSE_CS_HUB/admin
3. Pick a tab: **MCQ**, **SQL**, or **Python**
4. Pick the file from the dropdown — existing questions load instantly

| Action | Steps |
|--------|-------|
| **Add** | Click **+ Add Question** → fill the form → click **Add Question** → saved to file |
| **Edit** | Click **Edit** on any row → update fields → click **Save Changes** → saved to file |
| **Delete** | Click **Delete** on any row → confirm → saved to file |

Changes write directly to `src/assets/content/` JSON files and reflect immediately in the list (no copy/paste required).

### Content file locations

| Tab | Folder | Files |
|-----|--------|-------|
| MCQ | `src/assets/content/mcq/` | `cl12-python.json`, `cl12-sql.json`, `cl12-networking.json`, `cl11-python.json`, `cl11-computer-fundamentals.json` |
| SQL | `src/assets/content/sql-questions/` | `aggregate.json`, `group-by.json`, `joins.json`, `keys-constraints.json`, `order-by.json`, `select.json`, `where.json` |
| Python | `src/assets/content/python-exercises/` | `conditions.json`, `dictionaries.json`, `functions.json`, `lists.json`, `loops.json`, `mixed.json`, `strings.json`, `variables.json` |

---

## Building

```powershell
cd cbse-cs-hub

# Development build (admin panel enabled)
node node_modules/@angular/cli/bin/ng build --configuration development

# Production build (admin panel disabled, optimised)
node node_modules/@angular/cli/bin/ng build --configuration production
```

Output goes to `dist/cbse-cs-hub/browser/`.

---

## Deploying to GitHub Pages

```bash
# From repo root (bash / Git Bash)
./deploy.sh
```

This builds for production, strips admin/OCR chunks, and pushes the `dist/` folder to the `gh-pages` branch.

Live site: https://sumit-sharma77.github.io/CBSE_CS_HUB/

---

## Project Structure

```
CBSE_CS_HUB/
├── cbse-cs-hub/                  Angular workspace
│   ├── src/
│   │   ├── app/
│   │   │   └── features/
│   │   │       ├── admin/        Dev-only admin panel
│   │   │       ├── mcq/          MCQ quiz feature
│   │   │       ├── sql/          SQL exercises feature
│   │   │       └── python/       Python exercises feature
│   │   └── assets/content/       JSON content files (editable via admin)
│   ├── content-server.js         Local write server (admin dev tool)
│   └── proxy.conf.json           Angular dev-server proxy config
├── specs/                        Feature specs & plans
├── start.ps1                     Start dev + content servers
├── stop.ps1                      Stop all servers
└── restart.ps1                   Restart all servers
```
