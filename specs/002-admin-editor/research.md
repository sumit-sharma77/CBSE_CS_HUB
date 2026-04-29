# Research: Dev-Only Admin Content Editor

**Feature**: 002-admin-editor
**Date**: 2026-04-29
**Status**: Complete — all NEEDS CLARIFICATION resolved

---

## Decision 1 — Angular Lazy Loading Strategy for Zero Production Leakage

**Decision**: Use `loadComponent` (single lazy standalone component) as the admin route target, not `loadChildren` (lazy routes module).

**Rationale**: Angular 21 standalone components support `loadComponent` directly. The admin shell is the only route entry point; child tabs are rendered via `@switch` signal control flow inside the shell — no nested lazy routing needed. This produces a single `admin-shell-*.js` chunk that is never fetched in production because the route guard returns a `UrlTree` before the router evaluates `loadComponent`.

**Alternatives considered**:
- `loadChildren` with a `admin.routes.ts` barrel: adds indirection without benefit for a single-tab shell.
- Eager load with `*ngIf (isDevMode())`: rejected — admin code would still be included in the main bundle (NFR-001 violation).

---

## Decision 2 — Inline Functional Route Guard (no `CanActivate` class)

**Decision**: `canActivate: [() => isDevMode() || router.createUrlTree(['/403'])]`

**Rationale**: Angular 14+ supports functional guards. No class boilerplate needed. `isDevMode()` is a tree-shakeable Angular function that resolves to `false` in production builds compiled with `--configuration production`. `inject(Router)` works inside a functional guard.

**Alternatives considered**:
- `CanActivate` class guard: more boilerplate, no benefit for a single-check guard.
- Environment file check (`environment.production`): `isDevMode()` is more reliable — it is set by the Angular build system, not manually edited; authors cannot accidentally leave a non-production flag set.

---

## Decision 3 — Tesseract.js Dynamic Import Pattern

**Decision**: `const { createWorker } = await import('tesseract.js')` inside `AdminOcrService.processImage()` — called only when the user initiates OCR.

**Rationale**: Angular's bundler (esbuild/webpack) only includes dynamic `import()` targets in the bundle when the import path can be statically resolved AND the containing module is included in the bundle. Because `AdminOcrService` lives exclusively inside the lazy admin chunk (which is excluded from production builds by the route guard), the dynamic import is doubly isolated:
1. The service file is not in the production bundle.
2. Even if it were, the dynamic import would produce a separate chunk, not inline code.

**Alternatives considered**:
- CDN `<script>` tag at runtime: requires DOM manipulation and is non-standard in Angular; harder to type.
- `import` at module top level inside the admin service: would work at runtime but would allow bundler to statically analyse and potentially include the package. Dynamic import inside an async function is the safest form.
- `tesseract.js` as a CDN URL in `angular.json` scripts: appears in the production `index.html`, violating NFR-002.

**Language pack**: `eng` only (English). CBSE board papers are in English. Additional language packs would increase Tesseract worker download size significantly with no benefit for this use case.

---

## Decision 4 — Reuse Existing Student-Facing Components for Live Preview

**Decision**: Import existing MCQ quiz card, SQL question card, and Python exercise card components directly into the editor live preview panes. No wrapper component; no copy.

**Rationale**: SC-005 requires that live preview renders "visually identically to the corresponding student-facing UI component". The only way to guarantee this is to use the exact same component instance. A thin signal-based adapter (`computed<McqQuestion> previewQuestion()`) converts the `FormGroup` value to the component's expected input shape.

**Risk**: Coupling between admin feature and shared component API. Mitigated by:
- Marking preview usages with `// ADMIN-PREVIEW-USE` comment in the template.
- Not modifying shared components — only consuming their public `@Input()` API.
- If a shared component's input API changes, the TypeScript compiler will surface the breakage immediately.

---

## Decision 5 — `providedIn: null` for Admin Services

**Decision**: All three admin services (`AdminContentLoaderService`, `AdminIdGeneratorService`, `AdminOcrService`) use `providedIn: null` and are declared in `AdminShellComponent.providers`.

**Rationale**: `providedIn: 'root'` would register the service in the root injector, causing it to be included in the main bundle even if never injected (tree-shaking of `providedIn: 'root'` services is not guaranteed in all Angular versions). `providedIn: null` + explicit `providers` in the shell ensures the service code stays inside the lazy chunk and is garbage-collected when the admin route is left.

---

## Decision 6 — Content File Enumeration

**Decision**: The MCQ file picker loads `assets/content/mcq/mcq-index.json` (already exists) to enumerate available MCQ files. SQL and Python pickers use hardcoded lists derived from known filenames (matching the existing `SqlCategory` and `PythonTopic` type unions).

**Rationale**: `mcq-index.json` already exists and lists all MCQ category files. SQL and Python filenames are fixed by the existing data model (`select.json`, `where.json`, etc.) — no dynamic enumeration needed; hardcoding eliminates an extra fetch.

---

## Decision 7 — No Draft Persistence

**Decision**: No `localStorage` or `sessionStorage` persistence for admin form drafts. Closing the tab discards unsaved form state.

**Rationale**: The spec explicitly states "No undo/redo or draft persistence is required" (Assumptions section). Adding persistence would introduce complexity (storage key collisions, stale draft recovery UX) for a single-author dev tool. The confirmation dialog on tab switch (FR-030) is the only safeguard.

---

## Decision 8 — OCR Confidence Threshold: 70%

**Decision**: `confidence < 70` triggers warning banner and yellow-border field highlight.

**Rationale**: Specified directly in the user's key technical decisions. Tesseract.js reports confidence as a 0–100 integer on the `data.confidence` property. 70 is a well-established practical threshold for OCR quality on printed text.

---

## Decision 9 — `tesseract.js` as `devDependency`

**Decision**: `npm install --save-dev tesseract.js`

**Rationale**: NFR-002 states Tesseract.js must not be a production dependency. As a `devDependency`, it is available for `ng serve` and `ng build` (esbuild resolves `node_modules` regardless of dep type), but it signals to the team that it should not be included in production. The dynamic import + admin-only service ensures it never reaches the production bundle regardless of dependency type.

---

## All Clarifications Resolved

| Item | Resolution |
|---|---|
| Tesseract.js loading mechanism | Dynamic `import()` inside `AdminOcrService.processImage()` |
| Language pack | `eng` only |
| OCR confidence threshold | `< 70` → warning |
| ID format | `{prefix}-{NNN}` (3-digit zero-padded counter) |
| Admin route type | `loadComponent` with inline `canActivate` guard |
| Services scope | `providedIn: null`, provided in shell `providers` |
| Draft persistence | None (by spec) |
| Content file enumeration | `mcq-index.json` for MCQ; hardcoded for SQL/Python |
