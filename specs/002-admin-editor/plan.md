# Implementation Plan: Dev-Only Admin Content Editor

**Branch**: `002-admin-editor` | **Date**: 2026-04-29 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/002-admin-editor/spec.md`

---

## Implementation Status

**T001–T021**: ✅ Complete (2026-04-29)
**T022**: ✅ Complete — production bundle verified clean (no admin/tesseract strings in production chunks)

### Implementation Deviations

| Area | Original Plan | Actual Implementation |
|------|--------------|----------------------|
| Editor layout | Form-only + `ContentBrowserComponent` below | **List/form pattern**: list view shows all questions with Edit/Delete; form view is a separate screen within the same component |
| Separate HTML/CSS files | `mcq-editor.html`, `mcq-editor.css`, etc. | Inline template in `.ts` (single-file standalone components) |
| `ContentBrowserComponent` | Used by all three editors | Still exists; superseded by the inline list — editors no longer import it |
| JSON copy/paste workflow | Generate JSON snippet → author pastes manually | **Direct save via local write server**: form submit calls `AdminContentLoaderService.save()` → `PUT /api/content/{path}` → file written to disk; list rerenders instantly |
| `AdminContentLoaderService` URL | `assets/content/{assetPath}` (relative) | Uses `/api/content/{assetPath}` (proxied to `content-server.js` on port 3001) for both reads and writes |
| No backend | NFR-004 stated no server calls | `content-server.js` — plain Node.js HTTP server (no framework), local-only, never deployed, handles GET (read) + PUT (write) |
| `JsonOutputComponent` | Used by all three editors for copy/download | **Removed from editors** — direct save replaces the copy/paste workflow entirely |
| SQL content path | `sql/basics.json`, `sql/joins.json`, etc. | **Actual path**: `sql-questions/aggregate.json`, `sql-questions/joins.json`, etc. (7 files) |
| Python content path | `python/loops.json`, `python/functions.json`, etc. | **Actual path**: `python-exercises/loops.json`, etc. (8 files: conditions, dictionaries, functions, lists, loops, mixed, strings, variables) |
| SQL field name | `question` | **Actual**: `questionText`; added `category` and optional `marks` fields |
| Python field name | `question` | **Actual**: `questionText` (optional); added `topic`; `answer`/`isPreviousYear` optional |
| MCQ file format | Plain array `[ ]` | **Wrapper object**: `{ id, classLevel, topic, description, questions: [...] }` — service extracts `.questions` on read; write server re-wraps on save |
| `app.config.ts` `APP_BASE_HREF` | Used for URL construction | Not provided in DI — service now uses `/api/content/` directly (no base-href logic needed) |
| 404 handling | Not specified | 404 → empty array `[]`; other errors → `null` (error state) |
| Start/stop scripts | Not in feature scope | `start.ps1` now starts **both** Angular dev server AND `content-server.js`; `stop.ps1` kills both ports (4200 + 3001) |
| `deploy.sh` | Not modified | Updated: strips admin JS chunks + patches `ngsw.json` before GitHub Pages push |

---

## Summary

Build a hidden `/admin` route — accessible only in Angular `isDevMode()` — that provides a **form-driven CRUD UI** for the content author to add, edit, and delete MCQ, SQL, and Python content questions with **direct file writes** (no copy/paste required). A local Node.js write server (`content-server.js`, port 3001) handles disk I/O; the Angular dev server proxies API calls to it via `proxy.conf.json`. The feature is lazy-loaded into a completely separate Angular chunk; **zero bytes** of admin code appear in the production bundle. Core capabilities: reactive forms per content type, direct save with instant list refresh, drag-and-drop OCR via Tesseract.js (lazily imported), and an inline list/form pattern for browse + edit + delete.

---

## Technical Context

**Language/Version**: TypeScript 5.9.x, JavaScript ES2022+
**Framework**: Angular 21.2.x (standalone components, Angular Signals, `inject()` pattern, Reactive Forms)
**Styling**: Tailwind CSS 4.2.x — same config as feature 001; admin-specific classes scoped inside the lazy chunk
**Storage**: None (no persistence); content read via `HttpClient` from assets; clipboard via `navigator.clipboard`
**Testing**: Jasmine + Karma (unit tests for `AdminIdGeneratorService`, `AdminOcrService`, `AdminContentLoaderService`)
**Target Platform**: Desktop browser only — Chrome latest, Firefox latest (macOS/Windows/Linux). Mobile not required (NFR-003).
**Project Type**: Lazy-loaded admin feature within the existing `cbse-cs-hub` Angular SPA
**Performance Goals**: Admin panel interactive within 3s on `ng serve` first navigation (SC-006); OCR under 15s for clear ≤2MB screenshot (SC-003)
**Constraints**: No backend; no SSR; no admin code in production bundle (NFR-001); Tesseract.js dev-only (NFR-002); `isDevMode()` guard (FR-001)
**Scale/Scope**: Single-author tool; 3 content types; 1 `/admin` route with 3 tabs; 1 OCR zone

---

## Constitution Check

*Constitution file is unpopulated (template only) — no project-specific gates defined.*

Standard engineering gates applied:

- [x] **No production bundle pollution** — admin route loaded only via `loadComponent` in a separate lazy chunk; verified by `ng build --configuration production` + chunk inspection (FR-003, NFR-001)
- [x] **No new runtime deps for students** — `tesseract.js` installed as `devDependency` and imported exclusively inside a lazily-evaluated dynamic `import()` (FR-004, NFR-002)
- [x] **No backend** — content read via `HttpClient` from local dev-server assets; OCR runs in-browser (NFR-004)
- [x] **Same codebase patterns** — standalone components, signals, `inject()`, reactive forms, Tailwind dark mode (NFR-006)
- [x] **Route guard correctness** — inline functional guard with `isDevMode()` returns `UrlTree` for redirect (FR-001, FR-002)
- [x] **Reuse shared components for live preview** — no duplication of MCQ/SQL/Python UI (SC-005)

---

## Project Structure

### Documentation (this feature)

```text
specs/002-admin-editor/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 — technology decisions
├── data-model.md        # Phase 1 — TypeScript interfaces for admin forms
├── quickstart.md        # Phase 1 — developer setup guide
├── checklists/
│   └── requirements.md  # Requirements traceability
└── contracts/
    └── admin-form-schemas.md  # Admin form schema contracts
```

### Source Code (repository root)

```text
cbse-cs-hub/src/app/
│
├── features/
│   └── admin/                                    # NEW — entire subtree lazy-loaded
│       ├── admin-shell/
│       │   ├── admin-shell.ts                    # Root shell: dev banner, tab bar, @switch outlet
│       │   ├── admin-shell.html
│       │   └── admin-shell.css
│       ├── mcq-editor/
│       │   ├── mcq-editor.ts                     # MCQ reactive form + live preview + output
│       │   ├── mcq-editor.html
│       │   └── mcq-editor.css
│       ├── sql-editor/
│       │   ├── sql-editor.ts                     # SQL reactive form + live preview + output
│       │   ├── sql-editor.html
│       │   └── sql-editor.css
│       ├── python-editor/
│       │   ├── python-editor.ts                  # Python reactive form + live preview + output
│       │   ├── python-editor.html
│       │   └── python-editor.css
│       ├── ocr-zone/
│       │   ├── ocr-zone.ts                       # Paste/drop image → calls AdminOcrService
│       │   ├── ocr-zone.html
│       │   └── ocr-zone.css
│       ├── content-browser/
│       │   ├── content-browser.ts                # Read-only list + filter for existing questions
│       │   ├── content-browser.html
│       │   └── content-browser.css
│       ├── json-output/
│       │   ├── json-output.ts                    # Copy + Download buttons + "Copied!" state
│       │   ├── json-output.html
│       │   └── json-output.css
│       └── services/
│           ├── admin-content-loader.service.ts   # HttpClient fetches for existing content files
│           ├── admin-id-generator.service.ts     # ID auto-generation + override validation
│           └── admin-ocr.service.ts              # Tesseract.js dynamic import + OCR pipeline
│
├── features/
│   └── forbidden/                                # NEW — 403 page (minimal, eager-capable)
│       └── forbidden.ts
│
└── app.routes.ts                                 # MODIFIED — add admin + 403 lazy routes
```

> **Reused shared components** (imported directly — no copy, no modification):
> - MCQ quiz card from `features/mcq/quiz/`
> - SQL question card from `features/sql-practice/question-list/`
> - Python exercise card from `features/python-practice/exercise-list/`
> - `CodeBlockComponent` from `shared/components/code-block/`

**Structure Decision**: All admin code lives under `features/admin/`. The lazy `loadComponent` route ensures the entire subtree is excluded from the production bundle. Three admin services are `providedIn: null` and provided manually in `AdminShellComponent`'s `providers` array, limiting their lifetime to the admin chunk.

---

## Angular Router Configuration (delta)

```typescript
// app.routes.ts — two new entries added
{
  path: '403',
  loadComponent: () =>
    import('./features/forbidden/forbidden').then(m => m.ForbiddenComponent)
},
{
  path: 'admin',
  canActivate: [
    () => {
      const router = inject(Router);
      return isDevMode() || router.createUrlTree(['/403']);
    }
  ],
  loadComponent: () =>
    import('./features/admin/admin-shell/admin-shell')
      .then(m => m.AdminShellComponent)
}
```

**Guard contract**:
- `isDevMode() === true` (ng serve) → returns `true` → admin renders
- `isDevMode() === false` (ng build --configuration production) → returns `UrlTree('/403')` → forbidden page
- The `loadComponent` arrow is only resolved at runtime when the guard returns `true`; the import path is never statically linked into the production bundle

---

## Component Tree

```
AdminShellComponent                        [lazy root — providedIn: null services]
├── [inline] DevBanner
│     "⚠ Admin Panel — Development Mode Only. Not available in production."
├── [inline] TabBar
│     Tabs: [MCQ | SQL | Python]
│     signal<'mcq'|'sql'|'python'> activeTab
│     Unsaved-draft guard: checks dirtyFlag signal per editor before switching
│
├── @switch (activeTab())
│
│   @case ('mcq') ─── McqEditorComponent
│     ├── FilePickerControl        dropdown (mcq-index.json entries)
│     ├── OcrZoneComponent         paste/drag-drop → AdminOcrService
│     ├── McqFormGroup             ReactiveForm (FormGroup)
│     │     ├── id                 auto-generated, editable            FR-006
│     │     ├── question           textarea
│     │     ├── options[0..3]      4 × text input
│     │     ├── correctIndex       radio/select 0–3
│     │     ├── explanation        textarea
│     │     ├── isPreviousYear     toggle
│     │     └── year               conditional required                FR-008
│     ├── LivePreviewPane
│     │     └── <app-mcq-quiz [question]="previewQuestion()">          FR-007
│     ├── ContentBrowserComponent  read-only list of existing MCQs
│     └── JsonOutputComponent      Copy + Download                     FR-016/017
│
│   @case ('sql') ─── SqlEditorComponent
│     ├── FilePickerControl        dropdown (sql-questions/*.json)
│     ├── OcrZoneComponent
│     ├── SqlFormGroup             ReactiveForm
│     │     ├── id                 auto-generated, editable            FR-010
│     │     ├── category           pre-filled from filename, editable
│     │     ├── questionText       textarea
│     │     ├── answer             multi-line textarea (full SQL)
│     │     ├── explanation        textarea
│     │     ├── difficulty         select: easy/medium/hard
│     │     ├── isPreviousYear     toggle
│     │     ├── year               optional integer
│     │     └── marks              optional integer
│     ├── LivePreviewPane
│     │     └── <app-sql-question [question]="previewQuestion()">      FR-011
│     ├── ContentBrowserComponent
│     └── JsonOutputComponent
│
│   @case ('python') ─── PythonEditorComponent
│     ├── FilePickerControl        dropdown (python-exercises/*.json)
│     ├── OcrZoneComponent
│     ├── PythonFormGroup          ReactiveForm
│     │     ├── id                 auto-generated, editable            FR-013
│     │     ├── topic              pre-filled, editable
│     │     ├── type               select: output-based/coding/logic
│     │     ├── difficulty         select: beginner/intermediate
│     │     ├── questionText       textarea
│     │     ├── codeSnippet        conditional required (output-based)  FR-014
│     │     ├── answer             textarea
│     │     ├── explanation        textarea
│     │     └── annotatedCode      optional code textarea (coding)     FR-014
│     ├── LivePreviewPane
│     │     └── <app-python-exercise [exercise]="previewExercise()">   FR-015
│     ├── ContentBrowserComponent
│     └── JsonOutputComponent
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AdminShellComponent                                │
│  signal<'mcq'|'sql'|'python'> activeTab                                     │
│  Tab switch → check dirtyFlag → window.confirm() if dirty → reset editor   │
└──────────────────────────┬──────────────────────────────────────────────────┘
                           │ activeTab drives @switch
             ┌─────────────▼──────────────┐
             │     Editor Component        │  (McqEditor | SqlEditor | PythonEditor)
             │     [list view / form view]  │
             │                             │
             │  signal<string> targetFile ──► AdminContentLoaderService.load(path)
             │                             │         │  GET /api/content/{path}
             │  items[] ◄───────────────────────────┘  (plain array; server handles wrapper)
             │                             │
             │  AdminIdGeneratorService.nextId(items, prefix)
             │  → auto-generated ID         │
             │                             │
             │  ReactiveForm ◄──────── OcrZoneComponent → AdminOcrService
             │  form.valueChanges           │   dynamic import('tesseract.js')
             │                             │
             │  onSubmit() → build updated items[]
             │  AdminContentLoaderService.save(path, items[])
             │       │  PUT /api/content/{path}
             │       │  → content-server.js writes file to disk
             │       │  → cached signal updated → list rerenders
             │       │
             │  deleteItem() → filter items → save()
             │  startEdit()  → patchValue()  → onSubmit() → map+replace → save()
             └─────────────────────────────────────────────────────────────────┘

content-server.js (port 3001, local only)
  GET /content/{path}  → read file, extract .questions if wrapper, return array
  PUT /content/{path}  → receive array, re-wrap if wrapper file, write to disk
```

---

## Service Design

### `AdminContentLoaderService`
*Location*: `features/admin/services/admin-content-loader.service.ts`
*Scope*: `providedIn: null` — provided in `AdminShellComponent.providers`

```typescript
const API_BASE = '/api/content/';  // proxied to content-server.js on port 3001

class AdminContentLoaderService {
  private http = inject(HttpClient);
  private cache = new Map<string, WritableSignal<unknown[] | null>>();

  load<T>(assetPath: string): Signal<T[] | null>
  // GET /api/content/{assetPath} → returns plain array
  // content-server extracts .questions from wrapper objects automatically
  // Cached in-memory; subsequent calls return same signal

  save<T>(assetPath: string, items: T[]): Observable<void>
  // PUT /api/content/{assetPath} with items[] as body
  // content-server writes file (re-wraps wrapper objects)
  // On success: updates the cached signal → list rerenders instantly
  // On error (status 0 = server not reachable, other = write failure): throws Error

  reload(assetPath: string): void
  // Clears cache entry and re-fetches
}
```

---

### `AdminIdGeneratorService`
*Location*: `features/admin/services/admin-id-generator.service.ts`
*Scope*: `providedIn: null`

```typescript
class AdminIdGeneratorService {
  nextId(existingItems: { id: string }[], prefix: string): string
  // Returns "{prefix}-{NNN}" where NNN = max(existing counters) + 1, zero-padded to 3
  // Example: existing ["cl12-py-014", "cl12-py-015"] + prefix "cl12-py" → "cl12-py-016"

  validateId(proposedId: string, existingItems: { id: string }[]): boolean
  // Returns false if proposedId already exists in existingItems (duplicate warning)
}
```

**ID prefix derivation**:
| Content type | File | Prefix | Example output |
|---|---|---|---|
| MCQ | `mcq/cl12-python.json` | `cl12-py` | `cl12-py-016` |
| MCQ | `mcq/cl12-sql.json` | `cl12-sql` | `cl12-sql-008` |
| MCQ | `mcq/cl12-networking.json` | `cl12-nw` | `cl12-nw-005` |
| MCQ | `mcq/cl11-python.json` | `cl11-py` | `cl11-py-004` |
| MCQ | `mcq/cl11-computer-fundamentals.json` | `cl11-cf` | `cl11-cf-005` |
| SQL | `sql-questions/aggregate.json` | `sql-agg` | `sql-agg-008` |
| SQL | `sql-questions/group-by.json` | `sql-groupby` | `sql-groupby-003` |
| SQL | `sql-questions/joins.json` | `sql-joins` | `sql-joins-008` |
| SQL | `sql-questions/keys-constraints.json` | `sql-keys` | `sql-keys-004` |
| SQL | `sql-questions/order-by.json` | `sql-orderby` | `sql-orderby-005` |
| SQL | `sql-questions/select.json` | `sql-select` | `sql-select-010` |
| SQL | `sql-questions/where.json` | `sql-where` | `sql-where-006` |
| Python | `python-exercises/conditions.json` | `py-cond` | `py-cond-004` |
| Python | `python-exercises/dictionaries.json` | `py-dict` | `py-dict-003` |
| Python | `python-exercises/functions.json` | `py-fn` | `py-fn-007` |
| Python | `python-exercises/lists.json` | `py-lists` | `py-lists-005` |
| Python | `python-exercises/loops.json` | `py-loops` | `py-loops-011` |
| Python | `python-exercises/mixed.json` | `py-mixed` | `py-mixed-006` |
| Python | `python-exercises/strings.json` | `py-str` | `py-str-008` |
| Python | `python-exercises/variables.json` | `py-vars` | `py-vars-005` |

**Counter rules**: scan all existing IDs with the same prefix, extract numeric suffix, take max, increment by 1, zero-pad to 3 digits. If no existing IDs match: start at `001`.

---

### `AdminOcrService`
*Location*: `features/admin/services/admin-ocr.service.ts`
*Scope*: `providedIn: null`

```typescript
interface OcrResult {
  text: string;
  confidence: number;      // 0–100 from Tesseract
  lowConfidence: boolean;  // true if confidence < 70  (FR-024)
}

class AdminOcrService {
  private workerPromise: Promise<Worker> | null = null;

  async processImage(imageData: File | Blob): Promise<OcrResult>
  // Step 1: const { createWorker } = await import('tesseract.js')  ← ONLY dynamic import
  // Step 2: createWorker('eng') — reuse cached worker
  // Step 3: worker.recognize(imageData) with 10 000ms timeout via Promise.race
  // Step 4: return { text, confidence, lowConfidence: confidence < 70 }

  parseOptionsFromText(text: string): {
    questionText: string;
    options: [string, string, string, string] | null;
  }
  // Detects A)/B)/C)/D) or 1./2./3./4. split patterns
  // Returns options: null when pattern not found (full text → questionText only)

  ngOnDestroy(): void
  // Terminates Tesseract worker to free memory
}
```

**Configuration constants**:
- Language pack: `eng` (English; CBSE papers)
- Confidence warn threshold: `70`
- Image size warn threshold: `5 * 1024 * 1024` bytes (5 MB) — warn but still process (FR-025)
- OCR timeout: `10_000` ms (FR scenario 6)

---

## OCR Pipeline

```
User pastes (Ctrl+V) or drags image onto OcrZoneComponent
        │
        ▼
1. Validate MIME type ∈ {image/png, image/jpeg, image/webp, image/bmp}
   └─ Invalid type → show error message, stop              (FR-021)
        │
2. Check file.size > 5 MB → show warning banner            (FR-025)
   (continue processing regardless)
        │
        ▼
3. AdminOcrService.processImage(blob)
   a. First call: dynamic import('tesseract.js')           (FR-004)
      show "Loading OCR library..." spinner
   b. createWorker('eng') — single reusable worker
   c. await worker.recognize(blob)  ─── timeout: 10 000ms ──► OcrTimeoutError
   d. extract { text, confidence } from Tesseract result
        │
4. confidence < 70 → show warning banner                   (FR-024)
   apply yellow-border CSS class to all auto-populated fields
        │
5. AdminOcrService.parseOptionsFromText(text)
   → { questionText, options: string[4] | null }           (FR-023)
        │
6. Patch FormGroup controls:
   - form.get('questionText').setValue(questionText)
   - for MCQ: form.get('options').controls[i].setValue(options[i])
        │
7. Spinner dismissed; zone shows "Done ✓"
   Author reviews, corrects, then Copy / Download
```

---

## Form Validation Rules

### MCQ Form (FR-005, FR-006, FR-008)
| Field | Required | Rule |
|---|---|---|
| `question` | Always | Non-empty string |
| `options[0..3]` | Always | All 4 non-empty |
| `correctIndex` | Always | Integer 0–3 |
| `explanation` | Always | Non-empty string |
| `year` | When `isPreviousYear = true` | Integer, range 1990–2030 |
| `id` | Always | Unique in `existingItems`; format `{prefix}-{NNN}` |

### SQL Form (FR-009, FR-010)
| Field | Required | Rule |
|---|---|---|
| `questionText` | Always | Non-empty |
| `answer` | Always | Non-empty (multi-line preserved) |
| `explanation` | Always | Non-empty |
| `difficulty` | Always | `easy` \| `medium` \| `hard` |
| `category` | Always | Non-empty, matches SqlCategory values |
| `year` | When `isPreviousYear = true` | Integer |
| `marks` | No | Positive integer if present |

### Python Form (FR-012, FR-013, FR-014)
| Field | Required | Rule |
|---|---|---|
| `questionText` | Always | Non-empty |
| `type` | Always | `output-based` \| `coding` \| `logic` |
| `difficulty` | Always | `beginner` \| `intermediate` |
| `answer` | Always | Non-empty |
| `explanation` | Always | Non-empty |
| `codeSnippet` | When `type = output-based` | Non-empty |
| `annotatedCode` | No | Optional for `coding` type |

---

## JSON Output Design

### Copy JSON (FR-016, FR-019)

```typescript
async copyJson(question: object): Promise<void> {
  const json = JSON.stringify(question, null, 2);   // 2-space indent
  await navigator.clipboard.writeText(json);
  this.copied.set(true);
  setTimeout(() => this.copied.set(false), 2000);   // revert after 2s
}
```

### Download JSON Snippet (FR-017)

```typescript
downloadJson(question: object, id: string): void {
  const blob = new Blob(
    [JSON.stringify(question, null, 2)],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
```

### Output guard (FR-018)
Both buttons are `[disabled]="form.invalid"`. When disabled, `title` attribute shows the primary validation error as a tooltip.

---

## Content Browser Design (FR-026 – FR-029)

`ContentBrowserComponent` is generic and reused across all 3 editors.

```typescript
// Inputs
targetFile = input.required<string>();      // e.g. "mcq/cl12-python.json"

// State
items  = toSignal(loader.load(targetFile()));
filter = signal('');
shown  = computed(() =>
  (items() ?? []).filter(q =>
    (q['questionText'] ?? q['question'] ?? '')
      .toLowerCase().includes(filter().toLowerCase())
  )
);
expanded = signal<string | null>(null);     // ID of expanded item
```

**Layout**: search input → scrollable list. Each row: `{id} — {first 80 chars of question}`. Click expands to show all fields read-only (no edit/delete — FR-028). `items() === null` → inline error (FR-029). `items().length === 0` → "No questions yet" placeholder.

---

## Tab Unsaved-Draft Guard (FR-030)

```typescript
// AdminShellComponent
mcqDirty    = signal(false);
sqlDirty    = signal(false);
pythonDirty = signal(false);

switchTab(next: 'mcq' | 'sql' | 'python'): void {
  const dirty = { mcq: this.mcqDirty, sql: this.sqlDirty, python: this.pythonDirty };
  if (dirty[this.activeTab()]()) {
    if (!window.confirm('You have unsaved changes — switching tabs will clear the form. Continue?')) {
      return;
    }
  }
  this.activeTab.set(next);
}
// Each editor: (dirtyChange)="mcqDirty.set($event)"
```

---

## Implementation Phases

### Phase 1 — Route Guard + Forbidden Page + Empty Shell
**Goal**: Confirm zero production bundle leakage; route guard enforced.

1. Add `ForbiddenComponent` at `features/forbidden/forbidden.ts` (static "403" template)
2. Add `/403` route (lazy) and `/admin` route with inline `canActivate` guard in `app.routes.ts`
3. Create `AdminShellComponent` stub (renders "Admin stub" text only)
4. Verify:
   - `ng serve` → `/admin` loads stub ✓
   - `ng build --configuration production` → `grep -l "AdminShell\|admin-shell" dist/**/*.js` → 0 matches ✓

**Deliverable**: Guard works in dev; zero admin bytes in production bundle.

---

### Phase 2 — Admin Shell Layout + Tab Switcher
**Goal**: Full two-column layout; tab switching with dirty-check.

1. Full `AdminShellComponent` template: dev banner, tab bar, `@switch (activeTab())` control flow
2. Tailwind layout: sticky warning banner, 2-col grid (form | preview) on ≥ 1024px, stacked below
3. Dirty-flag signal wiring between shell and editor outputs
4. `window.confirm()` guard on tab switch

**Deliverable**: Shell renders; tabs switch; dirty-change prompt fires correctly.

---

### Phase 3 — MCQ Editor (Core Authoring Flow)
**Goal**: Complete MCQ form → ID generation → live preview → copy/download.

1. Implement `AdminContentLoaderService` (load + cache via `toSignal`)
2. Implement `AdminIdGeneratorService` (`nextId` + `validateId`)
3. Implement `McqEditorComponent` with full `FormGroup`, conditional `year` validator, `computed` preview signal
4. Implement `ContentBrowserComponent` (generic, reused)
5. Implement `JsonOutputComponent` (Copy + "Copied!" 2s + Download)
6. File picker loads `mcq-index.json` to enumerate target files

**Deliverable**: Full MCQ authoring round-trip (form → preview → copy JSON → paste → verify in student app).

---

### Phase 4 — SQL Editor
**Goal**: SQL form with multi-line answer + live preview.

1. Implement `SqlEditorComponent` following MCQ patterns
2. Multi-line `<textarea>` for `answer`; `JSON.stringify` handles `\n` preservation
3. Wire live preview with SQL practice question card
4. Reuse `ContentBrowserComponent`, `JsonOutputComponent`

**Deliverable**: Full SQL authoring round-trip.

---

### Phase 5 — Python Editor
**Goal**: Python form with conditional fields based on exercise type.

1. Implement `PythonEditorComponent`
2. `type` field change → `effect()` updates validators:
   - `codeSnippet`: add `Validators.required` when `type === 'output-based'`
   - `annotatedCode`: no validator change (always optional)
3. Show/hide `codeSnippet` and `annotatedCode` fields via `@if (type() === ...)`
4. Wire live preview with Python exercise card

**Deliverable**: Full Python authoring round-trip; conditional field visibility works.

---

### Phase 6 — OCR Zone
**Goal**: Paste/drop image → Tesseract.js OCR → populate form fields.

1. Implement `OcrZoneComponent`:
   - Global `document` paste listener (active while admin panel mounted)
   - `dragover` + `drop` on zone element
   - MIME type validation; 5 MB size warning
   - Spinner during library load + OCR; "Done ✓" on success; error on timeout/failure
2. Implement `AdminOcrService`:
   - `dynamic import('tesseract.js')` on first call only
   - Single `eng` worker, reused, terminated on `ngOnDestroy`
   - `parseOptionsFromText` heuristic (A)–D) or 1.–4. patterns)
   - `Promise.race` with 10 000ms timeout
3. Yellow-border CSS class on auto-populated fields when `lowConfidence = true`

**Deliverable**: Paste CBSE paper screenshot → fields populated → confidence warning shown if needed.

---

### Phase 7 — Polish, Validation & Bundle Verification
**Goal**: Hardened UX; all FR gates confirmed.

1. Full inline validation error messages under each invalid field
2. ID duplicate-detection warning when author overrides generated ID
3. Paste instructions + JSON array context note displayed near output buttons (Risk 5)
4. Bundle verification:
   ```bash
   ng build --configuration production
   grep -rl "tesseract\|AdminShell\|McqEditor\|SqlEditor\|PythonEditor" dist/cbse-cs-hub/
   # Expected: 0 matches
   ```
5. Chrome + Firefox cross-browser test

**Deliverable**: All FRs verified; NFR-001/NFR-002 confirmed; SC-002 passes.

---

## Milestones

| Milestone | Phase | Definition of Done |
|---|---|---|
| **M1 — Guard** | Phase 1 | `/admin` blocked in prod build; 0 admin bytes in production chunks |
| **M2 — Shell** | Phase 2 | Tab layout renders; dirty-check prompt works |
| **M3 — MCQ** | Phase 3 | Full MCQ authoring round-trip end-to-end |
| **M4 — SQL** | Phase 4 | Full SQL authoring round-trip |
| **M5 — Python** | Phase 5 | Full Python authoring round-trip with conditional fields |
| **M6 — OCR** | Phase 6 | Paste CBSE screenshot → fields populated → confidence warning shown |
| **M7 — Ship** | Phase 7 | All FRs verified; bundle isolation confirmed; cross-browser tested |

---

## Dependencies

| Dependency | Type | Notes |
|---|---|---|
| `tesseract.js` v5 | `devDependency` | Dynamic import only; never in production bundle |
| `@angular/forms` (ReactiveFormsModule) | Already in project | All editor forms |
| `@angular/common/http` (HttpClient) | Already in project | Content fetching |
| Existing MCQ/SQL/Python UI components | Internal | Live preview — import only, no modification |
| `navigator.clipboard` | Web API | Chrome/Firefox latest — no polyfill needed |

---

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Tesseract.js bundle leakage via static analysis | High — violates NFR-001/SC-002 | `await import('tesseract.js')` inside async function only; verify with grep in Phase 7 |
| `isDevMode()` true in non-production build | Medium — admin exposed on staging | Document: `deploy.sh` must always use `--configuration production`; note in dev banner |
| Shared component API coupling | Medium — breakage on refactor | Wrap preview usage in computed signal adapter; add `// ADMIN-PREVIEW-USE` marker comment |
| OCR accuracy on low-quality scans | Low — UX only | Confidence warning shown; all fields editable; documented as known limitation |
| Manual paste error corrupts asset file | Medium — data loss | Display paste instructions + JSON structure reminder alongside output buttons |

---

## Constitution Check (Post-Design)

Re-evaluated after Phase 1 design:

- [x] **Production bundle isolation** — confirmed via lazy `loadComponent` + dynamic OCR import; no static reference to admin code in `app.routes.ts` beyond the arrow function body
- [x] **No backend dependency for student app** — production build has no server requirements; `AdminContentLoaderService` reads/writes `/api/content/*` only during dev mode via `content-server.js` (local, port 3001). The write server never ships.
- [x] **Codebase consistency** — all components standalone; signals used for reactive state; `inject()` for DI; Tailwind for styles; no NgModules introduced; reactive forms follow existing patterns
- [x] **Reuse over duplication** — live preview uses existing shared components directly; `ContentBrowserComponent` and `JsonOutputComponent` are generic and shared across all 3 editors
- [x] **Guard correctness** — `isDevMode() || router.createUrlTree(['/403'])` is the canonical Angular 21 inline functional guard pattern
