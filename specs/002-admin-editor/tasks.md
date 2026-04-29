# Tasks: Dev-Only Admin Content Editor

**Feature**: `002-admin-editor`
**Input**: `specs/002-admin-editor/` — plan.md, spec.md, data-model.md, contracts/admin-form-schemas.md, research.md
**Generated**: 2026-04-29

---

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1–US6, mapped to spec.md priorities P1–P6)
- Exact file paths included in all descriptions

## Path Conventions

Angular workspace root: `cbse-cs-hub/`
All admin feature files: `cbse-cs-hub/src/app/features/admin/`
Shared services: `cbse-cs-hub/src/app/core/services/`
Routes: `cbse-cs-hub/src/app/app.routes.ts`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install the OCR dependency and define the shared TypeScript type contracts used across all admin components.

- [x] T001 Install tesseract.js as a devDependency by running `npm install tesseract.js --save-dev` inside `cbse-cs-hub/` and confirm it appears under `devDependencies` in `cbse-cs-hub/package.json`
- [x] T002 Create TypeScript draft interfaces and OCR result types (`McqDraft`, `SqlDraft`, `PythonDraft`, `OcrResult`, `ParsedOcrResult`) and admin service interfaces (`IAdminContentLoaderService`, `IAdminIdGeneratorService`, `IAdminOcrService`) in `cbse-cs-hub/src/app/features/admin/admin.types.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core admin services used by User Stories 2–6. Both services are independent of each other and of any specific content type.

**⚠️ CRITICAL**: MCQ, SQL, and Python editor stories (US2–US4) and the content browser (US6) all depend on these services. No form story work can begin until this phase is complete.

- [x] T003 [P] Create `AdminContentLoaderService` (`providedIn: null`) with `load<T>(assetPath: string): Signal<T[] | null>` using `HttpClient` + `toSignal`, resolving paths to `/assets/content/{assetPath}`, with in-memory cache keyed by `assetPath`, in `cbse-cs-hub/src/app/features/admin/services/admin-content-loader.service.ts`
- [x] T004 [P] Create `AdminIdGeneratorService` (`providedIn: null`) with `nextId(existingItems: { id: string }[], prefix: string): string` (max numeric suffix + 1, zero-padded to 3 digits, prefix derivation table for MCQ/SQL/Python filenames) and `validateId(proposedId: string, existingItems: { id: string }[]): boolean` in `cbse-cs-hub/src/app/features/admin/services/admin-id-generator.service.ts`

**Checkpoint**: Foundation ready — editor story implementation can begin (US1–US6 phases)

---

## Phase 3: User Story 1 — Production Route Block (Priority: P1) 🎯 MVP

**Goal**: Ensure the `/admin` route is completely inaccessible in production builds, redirects to a 403 Forbidden page, and that zero bytes of admin component code or Tesseract.js appear in any production bundle chunk.

**Independent Test**: Run `ng build --configuration production` in `cbse-cs-hub/`, open the deployed `/admin` URL, confirm the 403 page is shown. Inspect emitted JS chunks to confirm no `AdminShell`, `McqEditor`, `tesseract` references are present.

- [x] T005 [P] [US1] Create `ForbiddenComponent` (standalone, displays "Admin panel not available in production" message with a home navigation link) in `cbse-cs-hub/src/app/features/forbidden/forbidden.ts` with template in `cbse-cs-hub/src/app/features/forbidden/forbidden.html`
- [x] T006 [P] [US1] Create `AdminShellComponent` (standalone, lazy-loadable root shell) with persistent dev banner ("⚠ Admin Panel — Development Mode Only. Not available in production."), `signal<'mcq'|'sql'|'python'>` `activeTab`, empty `@switch` outlet placeholders for the three tabs, and `providers` array pre-wired for `AdminContentLoaderService`, `AdminIdGeneratorService`, `AdminOcrService` in `cbse-cs-hub/src/app/features/admin/admin-shell/admin-shell.ts`, `admin-shell.html`, and `admin-shell.css`
- [x] T007 [US1] Add two new route entries to `cbse-cs-hub/src/app/app.routes.ts`: a `/403` route lazy-loading `ForbiddenComponent`, and an `/admin` route lazy-loading `AdminShellComponent` with an inline `canActivate` functional guard that returns `true` when `isDevMode()` is `true` and returns `router.createUrlTree(['/403'])` otherwise

**Checkpoint**: US1 fully testable — production build blocks `/admin`, development `ng serve` allows access

---

## Phase 4: User Story 2 — Add MCQ Question via Form (Priority: P2)

**Goal**: Author can select a target MCQ file, fill the reactive form (question, 4 options, correct index, explanation, optional year/isPreviousYear), see a live preview using the actual shared MCQ card component, and copy or download a schema-conformant JSON snippet.

**Independent Test**: Open admin in dev mode, navigate to MCQ tab, fill all fields, click Live Preview (confirm identical to student-facing quiz card), click Copy JSON, paste the JSON object into any `mcq/*.json` file array, run `ng serve`, and confirm the new question appears in the student-facing MCQ quiz.

- [x] T008 [P] [US2] Create `JsonOutputComponent` (standalone, accepts `@Input() json: string` and `@Input() filename: string`) with a **Copy JSON** button using `navigator.clipboard.writeText`, a transient `signal<boolean> copied` that resets after 2 seconds, a **Download JSON Snippet** button using `Blob` + `URL.createObjectURL` + programmatic `<a>` click, both buttons `[disabled]` when `@Input() formInvalid: boolean` is true, with tooltip on disabled state, in `cbse-cs-hub/src/app/features/admin/json-output/json-output.ts`, `json-output.html`, and `json-output.css`
- [x] T009 [US2] Create `McqEditorComponent` (standalone) with: a file picker dropdown populated from `mcq-index.json` entries via `AdminContentLoaderService`; a `FormGroup` with controls `id` (auto-generated via `AdminIdGeneratorService`, editable, unique validator), `question`, `options` (FormArray of 4 controls), `correctIndex` (0–3), `explanation`, `isPreviousYear` (boolean), `year` (conditionally required when `isPreviousYear = true`, range 1990–2030); a live preview pane using the shared MCQ quiz card component from `cbse-cs-hub/src/app/features/mcq/quiz/`; `JsonOutputComponent` wired to the serialized form value using `JSON.stringify(draft, null, 2)` — in `cbse-cs-hub/src/app/features/admin/mcq-editor/mcq-editor.ts`, `mcq-editor.html`, and `mcq-editor.css`
- [x] T010 [US2] Import and render `McqEditorComponent` inside the `@case ('mcq')` block of the `@switch` outlet in `cbse-cs-hub/src/app/features/admin/admin-shell/admin-shell.ts` and `admin-shell.html`

**Checkpoint**: US2 fully testable — MCQ authoring end-to-end (form → preview → copy JSON)

---

## Phase 5: User Story 3 — Add SQL Practice Question via Form (Priority: P3)

**Goal**: Author can select a SQL category file, fill the SQL form (questionText, multi-line answer, explanation, difficulty, optional marks/year), see a live preview with "Show Answer" toggle, and copy a schema-conformant JSON snippet.

**Independent Test**: Fill SQL form in dev mode, copy JSON, paste into `cbse-cs-hub/src/assets/content/sql-questions/joins.json`, open SQL Practice, navigate to Joins, confirm the new question appears with correct formatting and working "Show Answer" toggle.

- [x] T011 [US3] Create `SqlEditorComponent` (standalone) with: a file picker dropdown listing `sql-questions/*.json` files; a `FormGroup` with controls `id` (auto-generated, unique validator), `category` (pre-filled from filename, editable), `questionText`, `answer` (multi-line textarea, `\n` preserved), `explanation`, `difficulty` (`easy`/`medium`/`hard`), `isPreviousYear`, `year` (conditionally required), `marks` (optional positive integer); a live preview pane using the shared SQL question card component from `cbse-cs-hub/src/app/features/sql-practice/question-list/`; `JsonOutputComponent` wired to the serialized draft — in `cbse-cs-hub/src/app/features/admin/sql-editor/sql-editor.ts`, `sql-editor.html`, and `sql-editor.css`
- [x] T012 [US3] Import and render `SqlEditorComponent` inside the `@case ('sql')` block of the `@switch` outlet in `cbse-cs-hub/src/app/features/admin/admin-shell/admin-shell.ts` and `admin-shell.html`

**Checkpoint**: US3 fully testable — SQL authoring end-to-end (form → preview → copy JSON)

---

## Phase 6: User Story 4 — Add Python Exercise via Form (Priority: P4)

**Goal**: Author can select a Python topic file, choose exercise type (output-based/coding/logic), fill the form with type-conditional fields (`codeSnippet` required for output-based, `annotatedCode` optional for coding), see a live preview, and copy a schema-conformant JSON snippet.

**Independent Test**: Fill Python form (output-based type), copy JSON, paste into `cbse-cs-hub/src/assets/content/python-exercises/loops.json`, open Python Practice, navigate to Loops, confirm the new exercise appears with code block styled correctly and working "Show Answer" toggle.

- [x] T013 [US4] Create `PythonEditorComponent` (standalone) with: a file picker dropdown listing `python-exercises/*.json` files; a `FormGroup` with controls `id` (auto-generated, unique validator), `topic` (pre-filled from filename, editable), `type` (`output-based`/`coding`/`logic` — drives conditional validators), `difficulty` (`beginner`/`intermediate`), `questionText`, `codeSnippet` (code-format textarea; required when `type = 'output-based'`, conditionally shown otherwise), `answer`, `explanation`, `annotatedCode` (code-format textarea; optional, shown when `type = 'coding'`); a live preview pane using the shared Python exercise card from `cbse-cs-hub/src/app/features/python-practice/exercise-list/`; `JsonOutputComponent` wired to the serialized draft (omitting null optional fields) — in `cbse-cs-hub/src/app/features/admin/python-editor/python-editor.ts`, `python-editor.html`, and `python-editor.css`
- [x] T014 [US4] Import and render `PythonEditorComponent` inside the `@case ('python')` block of the `@switch` outlet in `cbse-cs-hub/src/app/features/admin/admin-shell/admin-shell.ts` and `admin-shell.html`

**Checkpoint**: US4 fully testable — all three content-type forms are operational end-to-end

---

## Phase 7: User Story 5 — Screenshot OCR (Priority: P5)

**Goal**: Author can paste (Ctrl+V) or drag-and-drop an image into the OCR zone; Tesseract.js is loaded lazily (dynamic import, never in production bundle); extracted text auto-populates form fields; low-confidence results show a warning banner.

**Independent Test**: Paste a screenshot of a printed MCQ from a CBSE board paper into the MCQ tab OCR zone, confirm OCR text populates the question and option fields with recognisable text, confirm Tesseract.js import does not appear in the production bundle.

- [x] T015 [P] [US5] Create `AdminOcrService` (`providedIn: null`) with `processImage(imageData: File | Blob): Promise<OcrResult>` (dynamic `import('tesseract.js')` on first call only, cached `Worker`, `createWorker('eng')`, `worker.recognize()` wrapped in `Promise.race` with a 10 000ms timeout, returns `{ text, confidence, lowConfidence: confidence < 70 }`), `parseOptionsFromText(text: string): ParsedOcrResult` (detects `A)/B)/C)/D)` or `1./2./3./4.` patterns), and `ngOnDestroy()` (terminates worker) — in `cbse-cs-hub/src/app/features/admin/services/admin-ocr.service.ts`
- [x] T016 [P] [US5] Create `OcrZoneComponent` (standalone) with: `@HostListener('paste')` and drag-and-drop event handlers accepting `File | Blob`; MIME-type validation (PNG, JPEG, WebP, BMP — reject others with error message); 5 MB size warning banner (continue processing); spinner states ("Loading OCR library..." then "Processing..."); completion state ("Done ✓"); network-error state for failed dynamic import; emits `@Output() ocrResult: EventEmitter<ParsedOcrResult>` — in `cbse-cs-hub/src/app/features/admin/ocr-zone/ocr-zone.ts`, `ocr-zone.html`, and `ocr-zone.css`
- [x] T017 [US5] Integrate `OcrZoneComponent` into `McqEditorComponent`, `SqlEditorComponent`, and `PythonEditorComponent`: add `OcrZoneComponent` to each editor template, wire `(ocrResult)` output to `form.patchValue({ questionText: result.questionText })` and (MCQ only) patch `options` FormArray from `result.options`; apply yellow-border CSS class to auto-populated fields when `ocrResult.lowConfidence = true` and show a visible warning banner — in `cbse-cs-hub/src/app/features/admin/mcq-editor/mcq-editor.ts`, `cbse-cs-hub/src/app/features/admin/sql-editor/sql-editor.ts`, and `cbse-cs-hub/src/app/features/admin/python-editor/python-editor.ts`

**Checkpoint**: US5 fully testable — OCR paste/drop pipeline operational, Tesseract.js confirmed absent from production bundle

---

## Phase 8: User Story 6 — Browse Existing Content (Priority: P6)

**Goal**: Author can open a read-only list of all questions in the selected content file, filter by text, expand items to see all fields, with no edit or delete actions available.

**Independent Test**: Open the content browser for `sql-questions/group-by.json`, confirm all existing questions are listed (ID + question text preview), type a filter term and confirm real-time filtering works, expand one item and confirm all fields are visible with no edit/delete controls present.

- [x] T018 [P] [US6] Create `ContentBrowserComponent` (standalone, `@Input() assetPath: string`) that uses `AdminContentLoaderService.load(assetPath)` to fetch questions into a `Signal<unknown[] | null>`; renders a compact read-only list (ID + truncated question text); provides a real-time text `filterControl: FormControl` that filters the signal-derived list; on item click shows an expanded detail view of all fields (read-only, no edit/delete); shows a fetch-error state ("Could not load existing content — ensure the dev server is running") when the signal is null; shows an empty-state message ("No questions yet — be the first to add one!") for empty arrays — in `cbse-cs-hub/src/app/features/admin/content-browser/content-browser.ts`, `content-browser.html`, and `content-browser.css`
- [x] T019 [US6] Integrate `ContentBrowserComponent` into `McqEditorComponent`, `SqlEditorComponent`, and `PythonEditorComponent` *(impl note: list view inlined directly into each editor component — ContentBrowserComponent superseded by embedded list/form pattern)* by importing and rendering `<app-content-browser [assetPath]="selectedFile()">` in each editor template, passing the currently selected file path as the `assetPath` input — in `cbse-cs-hub/src/app/features/admin/mcq-editor/mcq-editor.html`, `cbse-cs-hub/src/app/features/admin/sql-editor/sql-editor.html`, and `cbse-cs-hub/src/app/features/admin/python-editor/python-editor.html`

**Checkpoint**: US6 fully testable — content browser works independently for any content file selection

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Refine UX details that span multiple components or are non-blocking for individual story completion.

- [x] T020 [P] Add paste-position instructions ("Paste inside the top-level `[ ]` array, after the last existing element. Add a comma after the previous element if needed.") and a JSON structure reminder snippet below the Copy/Download buttons in `cbse-cs-hub/src/app/features/admin/json-output/json-output.html`
- [x] T021 [P] Implement unsaved-draft tab-switch confirmation in `AdminShellComponent`: add a `signal<boolean> isDirty` that each child editor sets via `@Output() dirtyChange`; in the tab-switch handler, call `window.confirm('You have unsaved changes — switching tabs will clear the form. Continue?')` before updating `activeTab` when `isDirty()` is `true`, and emit a `resetForm` signal to the active editor on confirmed switch — in `cbse-cs-hub/src/app/features/admin/admin-shell/admin-shell.ts`
- [x] T022 Run `ng build --configuration production` in `cbse-cs-hub/`, inspect all emitted JS chunk filenames and contents in `cbse-cs-hub/dist/`, and confirm: (a) no chunk contains the string `AdminShell`, `McqEditor`, `SqlEditor`, `PythonEditor`, or `tesseract`; (b) the total main bundle size has not increased compared to the pre-feature baseline

---

## Post-Implementation Tasks (added after initial implementation)

*These tasks capture work done beyond the original T001–T022 scope during the implementation session.*

- [x] T023 [P] Create `cbse-cs-hub/content-server.js` — plain Node.js HTTP server (no external dependencies, port 3001) with: `GET /content/{path}` (reads file, extracts `.questions` array from wrapper objects, returns plain array); `PUT /content/{path}` (receives plain array, re-wraps wrapper objects, writes file to disk); path-traversal prevention (`filePath.startsWith(CONTENT_DIR)`); `CONTENT_DIR = path.resolve(__dirname, 'src', 'assets', 'content')`
- [x] T024 [P] Create `cbse-cs-hub/proxy.conf.json` (proxies `/api/content/*` → `http://127.0.0.1:3001`, strips `/api` prefix) and update `cbse-cs-hub/angular.json` serve options to include `"proxyConfig": "proxy.conf.json"`
- [x] T025 Update `AdminContentLoaderService` to use `/api/content/` base URL (removing `APP_BASE_HREF` dependency) and add `save<T>(assetPath: string, items: T[]): Observable<void>` method that calls `PUT /api/content/{assetPath}` and updates the in-memory signal cache on success
- [x] T026 Rewrite all three editors (`McqEditorComponent`, `SqlEditorComponent`, `PythonEditorComponent`) to use `loader.save()` for all CRUD operations (add, edit, delete) — replacing the `JsonOutputComponent`/draft/copy pattern entirely; each editor now has an inline list view with Edit/Delete buttons and a form view that saves directly on submit
- [x] T027 Update `cbse-cs-hub/start.ps1` to start `content-server.js` as a background process before `ng serve`, and update `cbse-cs-hub/stop.ps1` to also kill port 3001
- [x] T028 Update SQL editor file list to the 7 actual files (`sql-questions/aggregate.json`, `group-by.json`, `joins.json`, `keys-constraints.json`, `order-by.json`, `select.json`, `where.json`) with correct field names (`questionText`, `category`, `marks?`); update Python editor file list to the 8 actual files (`python-exercises/conditions.json`, `dictionaries.json`, `functions.json`, `lists.json`, `loops.json`, `mixed.json`, `strings.json`, `variables.json`) with correct field names (`questionText?`, `topic`, `answer?`, `isPreviousYear?`)

---

## Dependencies

```
T001 ──────────────────────────────────────────────────► T015 (tesseract.js installed before OcrService)
T002 ──► T003, T004, T006, T009, T011, T013, T015       (types defined before any component/service)
T003 ──► T009, T011, T013, T018                          (ContentLoader used by all editors + browser)
T004 ──► T009, T011, T013                                (IdGenerator used by all editors)
T005 ──► T007                                            (ForbiddenComponent must exist before route)
T006 ──► T007, T010, T012, T014                          (AdminShell must exist before wiring editors)
T008 ──► T009, T011, T013                                (JsonOutput used by all editors)
T009 ──► T010, T017, T019                                (McqEditor must exist before shell wire + OCR + browser)
T011 ──► T012, T017, T019                                (SqlEditor same)
T013 ──► T014, T017, T019                                (PythonEditor same)
T015 ──► T017                                            (OcrService before OcrZone integration)
T016 ──► T017                                            (OcrZone component before integration)
T018 ──► T019                                            (ContentBrowser component before integration)
```

### Story Completion Order

```
Phase 1 (Setup) → Phase 2 (Foundation) → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3)
→ Phase 6 (US4) → Phase 7 (US5) → Phase 8 (US6) → Phase 9 (Polish)
```

US3, US4 can begin implementation in parallel once US2 foundational shell (T006, T010) is done — they each create independent editor files and only need the shell wiring steps (T012, T014) to be sequential within their own phase.

---

## Parallel Execution Examples

### Phase 2 — Services in parallel
```
T003: AdminContentLoaderService    ──┐
T004: AdminIdGeneratorService      ──┴──► both complete → Phase 3 begins
```

### Phase 3 — US1 parallel stubs
```
T005: ForbiddenComponent           ──┐
T006: AdminShellComponent          ──┴──► T007: add routes (depends on both)
```

### Phase 7 — OCR pipeline
```
T015: AdminOcrService              ──┐
T016: OcrZoneComponent             ──┴──► T017: integrate into 3 editors
```

### Phase 8 — Content browser
```
T018: ContentBrowserComponent      ──────► T019: integrate into 3 editors
```

---

## Implementation Strategy

### MVP Scope (Phase 1 → Phase 4 only)

After completing Phases 1–4 (T001–T010), the following is independently shippable:

- Production bundle isolation (US1) — the security baseline
- Full MCQ authoring workflow (US2) — the highest-volume content type
- Core admin services reusable by SQL and Python editors

This is a complete, usable tool for the most common authoring task.

### Incremental Delivery

| After phase | Delivered capability |
|---|---|
| Phase 3 (T001–T007) | Route guard + 403 page; admin shell accessible in dev |
| Phase 4 (T001–T010) | **MVP** — MCQ form, live preview, copy/download JSON |
| Phase 5 (T001–T012) | SQL form added |
| Phase 6 (T001–T014) | All three content-type forms complete |
| Phase 7 (T001–T017) | OCR paste/drop workflow added |
| Phase 8 (T001–T019) | Content browser (duplicate detection) added |
| Phase 9 (T001–T022) | Full polish, bundle verification |

---

## Task Count Summary

| Phase | Tasks | Notes |
|---|---|---|
| Phase 1: Setup | 2 | T001–T002 |
| Phase 2: Foundational | 2 | T003–T004 (both [P]) |
| Phase 3: US1 Production Route Block | 3 | T005–T007 (T005, T006 [P]) |
| Phase 4: US2 MCQ Form | 3 | T008–T010 (T008 [P]) |
| Phase 5: US3 SQL Form | 2 | T011–T012 |
| Phase 6: US4 Python Form | 2 | T013–T014 |
| Phase 7: US5 OCR | 3 | T015–T017 (T015, T016 [P]) |
| Phase 8: US6 Content Browser | 2 | T018–T019 (T018 [P]) |
| Phase 9: Polish | 3 | T020–T022 (T020, T021 [P]) |
| **Total** | **22** | |
