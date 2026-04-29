# Feature Specification: Dev-Only Admin Content Editor

**Feature Branch**: `002-admin-editor`  
**Created**: 2026-04-29  
**Status**: Implemented (2026-04-29)  
**Author**: Sumit Vats  

---

## Overview

A hidden `/admin` route available **exclusively in development mode** (Angular `isDevMode()` enforced by a `CanActivate` route guard). When accessed in a production build the route renders a 403 Forbidden page and no admin UI code is evaluated. The admin page provides a visual form-driven interface that lets the content author add, edit, and delete questions in the existing static JSON asset files **directly** — changes are written to disk immediately via a local `content-server.js` (Node.js) that the Angular dev-server proxies. No manual JSON copy/paste is required.

The tool runs entirely locally on the developer's machine — a small Node.js write server (port 3001) handles file I/O; the Angular dev server (port 4200) proxies `/api/content/*` to it. Neither the write server nor any admin code reaches the production bundle or the GitHub Pages deployment.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Production Route Block (Priority: P1)

The content author (or any visitor) navigates to `/admin` on the live GitHub Pages site. The route guard immediately redirects them to a 403 Forbidden page. No admin UI markup, form logic, or Tesseract.js dependency is included in the production bundle.

**Why this priority**: Security baseline. If the route is accessible in production, sensitive tooling and unreviewed content pathways are exposed. Everything else depends on this guard being solid.

**Independent Test**: Deploy a production build (`ng build`), open the deployed URL at `/admin`, and confirm a 403 page is shown. Inspect the production bundle to confirm no admin component code or Tesseract.js reference is present.

**Acceptance Scenarios**:

1. **Given** the app is running as a production build, **When** a user navigates to `/admin`, **Then** a 403 Forbidden page is displayed with a clear "Not available" message — no admin UI is rendered.
2. **Given** the production bundle is inspected, **When** examining all emitted JavaScript chunks, **Then** no code referencing the admin component, the question forms, or Tesseract.js is present.
3. **Given** the app is running in development mode (`ng serve`), **When** a user navigates to `/admin`, **Then** the admin dashboard loads successfully.
4. **Given** a user in production manually crafts a direct URL to `/admin`, **When** the Angular router evaluates the route, **Then** the `CanActivate` guard returns `false` and renders the 403 page — no data is leaked, no partial UI is shown.

---

### User Story 2 — Add a New MCQ Question via Form (Priority: P2)

The content author opens the admin panel in development mode, selects the **MCQ** tab, chooses the target category file (e.g., `cl12-python.json`), fills in the question text, four answer options, correct answer index, explanation, and optional year/isPreviousYear fields. Satisfied, they click **Add Question** — the question is written directly to the JSON file and immediately appears in the list view.

**Why this priority**: MCQ is the highest-volume content type. The direct-save form is the primary workflow for the majority of content additions and delivers immediate standalone value.

**Independent Test**: Open admin in dev mode, add one MCQ question end-to-end (fill form → Add Question), then open the student-facing quiz and confirm the new question appears.

**Acceptance Scenarios**:

1. **Given** the author is on the MCQ tab, **When** they select a target file from a dropdown (listing all `mcq/*.json` files), **Then** the list view loads all existing questions for that file.
2. **Given** the author fills in the question text, four options, correct answer index, and explanation, **When** they click **Add Question**, **Then** the question is written to the JSON file and the list view updates immediately without a page reload.
3. **Given** all required fields are filled, **When** the question is saved, **Then** a valid, schema-conformant question object exists in the asset file matching the MCQ schema: `{ id, question, options[], correctIndex, explanation, isPreviousYear, year? }`.
4. **Given** a required field (question text, any option, correct index, explanation) is left empty, **When** the author clicks **Add Question**, **Then** a validation error is shown inline and no save is performed.
5. **Given** `isPreviousYear` is toggled on, **When** the author does not enter a year value, **Then** the form shows a validation error for the year field before allowing save.

---

### User Story 3 — Add a New SQL Practice Question via Form (Priority: P3)

The content author switches to the **SQL** tab, selects the target file (e.g., `sql-questions/joins.json`), fills in the question text, SQL answer, explanation, and difficulty. They click **Add Question** and the question is written directly to the file.

**Why this priority**: SQL is the most exam-critical content in the CBSE CS curriculum. Adding SQL questions correctly (matching exact schema) is a high-frequency authoring task.

**Independent Test**: Add one SQL question through the form, navigate to SQL Practice in the student app, and confirm the new question appears with correct formatting.

**Acceptance Scenarios**:

1. **Given** the author selects the SQL tab and a target file, **When** they fill in question text, SQL answer, explanation, and difficulty (`easy`/`medium`/`hard`), **Then** the form validates that all required fields are present.
2. **Given** the author fills all required SQL fields, **When** they click **Add Question**, **Then** the question is written to `src/assets/content/sql-questions/{file}.json` and appears immediately in the list view.
3. **Given** the question is saved, **Then** the stored object conforms to the SQL schema: `{ id, category, questionText, answer, explanation, difficulty, isPreviousYear, year?, marks? }`.
4. **Given** the author enters a multi-line SQL answer (e.g., a JOIN query across multiple lines), **When** the question is saved, **Then** the multi-line answer is correctly escaped and preserved in the JSON file.

---

### User Story 4 — Add a New Python Exercise via Form (Priority: P4)

The content author switches to the **Python** tab, selects the target topic file (e.g., `python-exercises/loops.json`), selects exercise type (`output-based`, `fill-blank`, `mcq`, `short-answer`), fills in optional question text, optional code snippet (required for output-based), optional answer, and explanation. They click **Add Question** and the exercise is written directly to the file.

**Why this priority**: Python exercises are the second most frequent content type. Forms for all three content types together constitute the core authoring workflow.

**Independent Test**: Add one Python exercise, open Python Practice in the student app, navigate to Loops, and confirm the new exercise appears correctly.

**Acceptance Scenarios**:

1. **Given** the author selects `output-based` as exercise type, **When** they view the form, **Then** the `codeSnippet` field is shown as required and rendered with a monospace/code input area.
2. **Given** the author selects `fill-blank`, `mcq`, or `short-answer` as exercise type, **When** they fill in the answer and explanation, **Then** the `codeSnippet` field is hidden.
3. **Given** all required Python fields are filled, **When** the question is saved, **Then** the stored object conforms to the Python schema: `{ id, topic, type, difficulty, questionText?, codeSnippet?, answer?, explanation, isPreviousYear?, year? }`.

---

### User Story 5 — Screenshot OCR: Paste a Question from a Board Paper (Priority: P5)

The content author has a CBSE board paper open as a PDF on screen. They take a screenshot of a question block, switch to the admin panel, and press Ctrl+V (or drag and drop the image) into the OCR drop zone. Tesseract.js (loaded lazily in the browser — no backend call) performs OCR on the image. The extracted text is auto-populated into the question text and, for MCQ, the four option fields. The author reviews, corrects any OCR errors, and proceeds with the standard copy/download workflow.

**Why this priority**: OCR eliminates the most tedious part of content authoring — manually re-typing printed text from board papers. It is a significant productivity multiplier but depends on the form (P2–P4) being in place first.

**Independent Test**: Paste a screenshot of a printed MCQ from a CBSE board paper, confirm OCR populates the question and options fields with recognisable text, manually correct one field, and produce a valid JSON snippet.

**Acceptance Scenarios**:

1. **Given** the author presses Ctrl+V with an image in the clipboard, **When** the paste event fires, **Then** the image is accepted if it is a supported type (JPEG, PNG, WebP, BMP), an OCR spinner is shown, and Tesseract.js is loaded lazily via dynamic import (not from the main bundle).
2. **Given** the author drags and drops an image file onto the OCR drop zone, **When** the drop event fires, **Then** the same OCR pipeline is triggered as for Ctrl+V.
3. **Given** Tesseract.js completes OCR processing, **When** extracted text is available, **Then** it is automatically parsed and populated into the question text field; for MCQ forms, detected option patterns (A)/B)/C)/D) or 1.2.3.4.) are split into the four option fields.
4. **Given** OCR produces a low-confidence result (below a defined threshold), **When** the result is shown, **Then** the author sees a visible warning banner ("OCR confidence is low — please review all fields carefully") and all auto-populated fields are visually highlighted for review.
5. **Given** a non-image file is pasted or dropped (e.g., a PDF, .txt, or .docx file), **When** the drop/paste event fires, **Then** a clear error message is shown ("Only image files are supported for OCR") and no processing occurs.
6. **Given** the OCR operation takes longer than 10 seconds, **When** the timeout is reached, **Then** the author is shown an error ("OCR timed out — please try a clearer screenshot") and can proceed to fill the form manually.
7. **Given** Tesseract.js fails to load (network error during dynamic import), **When** the import fails, **Then** the OCR zone shows an error state and the form remains fully usable for manual entry.

---

### User Story 6 — Browse Existing Content to Avoid Duplicates (Priority: P6)

The content author wants to check whether a particular SQL question about GROUP BY already exists before adding it. They open the existing content browser panel for `group-by.json`, scroll through the read-only list of questions, and confirm the question is not already present.

**Why this priority**: Without visibility into existing content, authors will inadvertently add duplicate questions. This is a quality-of-life safeguard for the authoring workflow.

**Independent Test**: Open the existing content browser for any content file, confirm all questions from that file are listed read-only, and confirm no editing actions are available within the browser pane.

**Acceptance Scenarios**:

1. **Given** the author opens the existing content browser for a selected file, **When** the component renders, **Then** all existing questions from that file are fetched via `fetch` from the assets and listed in a compact read-only format (ID + question text preview).
2. **Given** the existing content is loaded, **When** the author types in the search/filter box, **Then** the list filters in real-time to show only items whose question text contains the search term.
3. **Given** the author clicks on an existing question in the browser, **When** the item expands, **Then** the full question detail is shown (all fields visible) — no edit or delete actions are available.
4. **Given** the asset file cannot be fetched (e.g., running outside a dev server context), **When** the fetch fails, **Then** the browser pane shows a friendly error ("Could not load existing content — ensure the dev server is running") and the form remains usable.
5. **Given** a content file is empty or contains zero questions, **When** the browser loads it, **Then** an "No questions yet — be the first to add one!" placeholder message is shown.

---

### Edge Cases

- What happens if the author generates a question ID that already exists in the target file? The ID auto-generator increments past any detected highest ID; if the author overrides the ID manually, the form shows a warning if the typed ID matches an existing one loaded in the content browser.
- What happens if the clipboard contains a very large image (e.g., a full A4 page scan)? Tesseract.js processes the full image; a warning is shown if the image exceeds 5 MB advising the author to crop to just the question area for better accuracy.
- What happens if the author copies JSON, pastes it into the wrong array level in the asset file (e.g., at root instead of inside the `questions` array for MCQ)? This is out of scope for the tool — the author is responsible for pasting in the correct location; instructions are displayed alongside the Copy/Download buttons.
- What happens if the admin panel is open in two browser tabs simultaneously in dev mode? Each tab operates independently; there is no shared state between tabs beyond what the asset files contain on load.
- What happens when the author switches between content-type tabs (MCQ → SQL) with an unsaved draft in the form? A confirmation prompt warns "You have unsaved changes — switching tabs will clear the form. Continue?" before clearing the state.
- What happens if the OCR text for an MCQ contains more or fewer than four options? All extracted text is placed into the question text field as a single block; the author manually distributes the content into option fields.

---

## Requirements *(mandatory)*

### Functional Requirements

**Route Security**

- **FR-001**: The `/admin` route MUST be protected by an Angular `CanActivate` route guard that evaluates `isDevMode()` at runtime. In a production build `isDevMode()` returns `false` and the guard MUST deny access.
- **FR-002**: When the guard denies access, the router MUST redirect to a dedicated 403 Forbidden route that displays a human-readable "Admin panel not available" page.
- **FR-003**: The admin Angular component module (including all child form components) MUST be loaded via lazy routing so that no admin-related code is included in the initial production bundle.
- **FR-004**: Tesseract.js MUST be imported exclusively via a dynamic `import()` statement triggered only when the author initiates an OCR action. It MUST NOT appear in any statically resolved import graph.

**MCQ Form**

- **FR-005**: The MCQ form MUST include fields matching the MCQ question schema: question text, four option fields (A–D), correct answer index selector (0–3), explanation, optional year (integer), and `isPreviousYear` toggle.
- **FR-006**: The MCQ form MUST auto-generate a question ID in the format `<fileId>-NNN` (e.g., `cl12-py-016`) based on the highest existing ID in the selected target file plus one. The author MAY override the generated ID.
- **FR-007**: The MCQ form MUST show a **Generate JSON** button. *(Live preview using the shared MCQ card component is not implemented in v1 — replaced by JSON output panel.)*
- **FR-008**: If `isPreviousYear` is `true`, the `year` field MUST be required before output is allowed.

**SQL Question Form**

- **FR-009**: The SQL form MUST include fields matching the SQL question schema: question text, SQL answer (multi-line text area), explanation, difficulty selector (`easy`/`medium`/`hard`), optional year, and `isPreviousYear` toggle.
- **FR-010**: The SQL form MUST auto-generate a question ID in the format `sql-<file>-NNN` (e.g., `sql-joins-008`).
- **FR-011**: The SQL form MUST show a **Generate JSON** button. *(Live preview using the shared SQL practice component is not implemented in v1 — replaced by JSON output panel.)*

**Python Exercise Form**

- **FR-012**: The Python form MUST include fields matching the Python exercise schema: exercise type selector (`output-based`/`fill-blank`/`mcq`/`short-answer`), difficulty selector (`beginner`/`intermediate`), question text, optional code snippet (code-formatted text area — required when `output-based`), answer, explanation, optional year, and `isPreviousYear` toggle.
- **FR-013**: The Python form MUST auto-generate a question ID using the file-based prefix (e.g., `py-loops-011` for `loops.json`).
- **FR-014**: When `output-based` is selected, the `codeSnippet` field MUST be marked required. For all other types (`fill-blank`, `mcq`, `short-answer`), `codeSnippet` is hidden.
- **FR-015**: The Python form MUST show a **Generate JSON** button. *(Live preview using the shared Python exercise component is not implemented in v1 — replaced by JSON output panel.)*

**JSON Output**

- **FR-016**: A **Copy JSON** button MUST copy a single, correctly indented JSON object (2-space indentation) to the system clipboard.
- **FR-017**: A **Download JSON Snippet** button MUST trigger a browser file download of a `.json` file named `<generatedId>.json` containing only the single question object.
- **FR-018**: Both output actions MUST be blocked (buttons disabled with tooltip) if any required field fails validation. Validation MUST run on every field change (reactive form validation).
- **FR-019**: After a successful copy, the **Copy JSON** button MUST display a transient "Copied!" confirmation for 2 seconds before reverting to its normal label.

**Screenshot OCR**

- **FR-020**: The OCR input zone MUST accept images via clipboard paste (Ctrl+V / Cmd+V) and via drag-and-drop anywhere within the admin panel viewport.
- **FR-021**: Accepted image formats MUST include PNG, JPEG, WebP, and BMP. Any other file type MUST show a clear rejection message.
- **FR-022**: Tesseract.js MUST be loaded lazily (dynamic import) on first OCR use. A loading spinner MUST be shown while the library is being fetched and while OCR is processing.
- **FR-023**: On OCR completion, extracted text MUST be auto-populated: full text into the question text field; for MCQ forms, the system MUST attempt to detect and split option patterns (parenthesised letters A)–D) or numbered 1.–4.) into the four option fields.
- **FR-024**: If OCR confidence (as reported by Tesseract.js) is below 70%, a visible warning banner MUST be displayed and all auto-populated fields MUST be visually highlighted (e.g., yellow border) to prompt review.
- **FR-025**: If the dropped/pasted image exceeds 5 MB, a warning MUST be displayed advising the author to crop the image for better accuracy. Processing MUST still proceed.

**Existing Content Browser**

- **FR-026**: The existing content browser MUST display a read-only list of all questions in the currently selected target file, fetched via `fetch` from the assets folder.
- **FR-027**: The browser list MUST support real-time text filtering by question text content.
- **FR-028**: Each list item MUST be expandable to show all field values for that question — no edit or delete controls MUST be present.
- **FR-029**: Fetch errors (network unavailable, file not found) MUST display a non-blocking error message within the browser pane without affecting the form's usability.

**Navigation & Layout**

- **FR-030**: The admin panel MUST use a tabbed layout with three tabs: **MCQ**, **SQL**, and **Python**. Switching tabs MUST prompt confirmation if the current form has unsaved changes.
- **FR-031**: The admin panel MUST display a persistent banner at the top reading "⚠ Admin Panel — Development Mode Only. Not available in production." to reinforce the dev-only nature.

### Key Entities

- **MCQ Question**: A question in a category file; fields: `id` (string), `question` (string), `options` (string[4]), `correctIndex` (0–3), `explanation` (string), `year` (integer, optional), `isPreviousYear` (boolean). MCQ files use a **wrapper object** format: `{ id, classLevel, topic, description, questions: [...] }`.
- **SQL Question**: A practice question in a category file; fields: `id` (string), `category` (string), `questionText` (string), `answer` (string), `explanation` (string), `difficulty` (`easy`|`medium`|`hard`), `isPreviousYear` (boolean), `year` (integer, optional), `marks` (integer, optional). SQL files are **plain arrays** `[ ]`.
- **Python Exercise**: An exercise in a topic file; fields: `id` (string), `topic` (string), `type` (`output-based`|`fill-blank`|`mcq`|`short-answer`), `difficulty` (`beginner`|`intermediate`), `questionText` (string, optional), `codeSnippet` (string, optional — required for output-based), `answer` (string, optional), `explanation` (string), `isPreviousYear` (boolean, optional), `year` (integer, optional). Python files are **plain arrays** `[ ]`.
- **OCR Result**: Transient in-memory data produced by Tesseract.js; fields: raw extracted text (string), confidence score (number 0–100), bounding-box data (discarded after extraction).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A content author can add a correctly shaped MCQ question — from opening the admin panel to having a valid JSON snippet on the clipboard — within 3 minutes, without consulting the JSON schema documentation.
- **SC-002**: When the production build is inspected, zero bytes of admin component code or Tesseract.js are present in any emitted JavaScript file.
- **SC-003**: OCR processing of a clear, well-cropped screenshot (≤ 2 MB, 200+ DPI equivalent) completes within 15 seconds on a typical developer laptop.
- **SC-004**: 100% of generated JSON snippets (for all three content types) pass schema validation against the existing asset files' structure without any manual correction.
- **SC-005**: *(Deferred — not implemented in v1.)* The live preview for all three content types renders visually identically to the corresponding student-facing UI component — verified by side-by-side comparison.
- **SC-006**: The admin panel loads and is interactive within 3 seconds on first navigation (in development mode, on localhost), excluding Tesseract.js (lazily loaded only on demand).
- **SC-007**: The existing content browser successfully loads and displays all questions from any content file within 2 seconds of the file being selected.
- **SC-008**: Switching between MCQ, SQL, and Python tabs with an unsaved draft always triggers the confirmation prompt — 0 accidental data-loss incidents during authoring.

---

## Non-Functional Requirements

- **NFR-001 — Bundle Isolation**: Admin components MUST be in a lazy-loaded Angular route chunk. The main production bundle size MUST be unaffected (delta ≤ 0 bytes in production build).
- **NFR-002 — No New Runtime Dependencies in Production**: Tesseract.js MUST NOT be listed as a production dependency that affects the student-facing app. It is loaded on-demand in development only.
- **NFR-003 — Browser Compatibility**: The admin panel MUST function on the latest version of Chrome and Firefox on desktop (macOS/Windows/Linux). Mobile browser support is not required.
- **NFR-004 — Local Write Server**: All file I/O is handled by `content-server.js`, a plain Node.js HTTP server (no frameworks) running on `127.0.0.1:3001`. The Angular dev server proxies `/api/content/*` to it via `proxy.conf.json`. The write server is **never deployed** — it exists only for local development. The production build has no knowledge of it.
- **NFR-005 — Accessibility**: Interactive controls (form fields, buttons, tabs) MUST have accessible labels sufficient for keyboard-only navigation. Screen reader support is desirable but not required for a dev-only tool.
- **NFR-006 — Codebase Consistency**: Admin components MUST follow the same Angular 21 standalone component patterns (signals, reactive forms, no NgModules) used throughout the existing codebase.

---

## Assumptions

- The admin panel will only ever be used by the single content author (Sumit Vats) on a local development machine running `ng serve`. Multi-user or remote access is explicitly out of scope.
- Tesseract.js v5 is available either via `npm install tesseract.js` (dev dependency) or via a CDN dynamic import — the exact loading mechanism is an implementation decision, not a spec constraint.
- The content author is responsible for pasting generated JSON into the correct position within the target asset file and for running `deploy.sh` to publish changes. The admin tool provides the JSON snippet only.
- The existing shared MCQ and SQL/Python practice UI components are reusable for a future live preview enhancement (FS-006); live preview was not implemented in v1.
- Study notes chapters are intentionally excluded from the admin tool; they have a freeform Markdown structure that does not map cleanly to a structured form.
- The `/admin` URL path will not be indexed by search engines; `robots.txt` disallow rules for `/admin` are assumed to be configured by the deployment author.
- The OCR text-parsing heuristic (detecting option patterns A)–D)) will not handle 100% of board-paper layouts; the feature is explicitly a time-saver, not a perfect parser.
- No undo/redo or draft persistence is required; if the author closes the browser tab, any unsaved form data is lost.

---

## Risks

- **Risk 1 — Tesseract.js Bundle Leakage**: If the dynamic `import()` is referenced in a way that Angular's static analyser can resolve it, Tesseract.js may be included in the production bundle. Mitigated by using a string-constructed import path or wrapping in a function that only Angular's runtime evaluates, and by CI bundle-size checks.
- **Risk 2 — isDevMode() Reliability**: Angular's `isDevMode()` is `true` in `ng serve` and `false` in `ng build --configuration production`. If the author runs `ng build` without the production configuration, `isDevMode()` may return `true` and the guard would allow access in a non-production build. Mitigated by documenting that `deploy.sh` must always use `--configuration production`.
- **Risk 3 — OCR Accuracy on Low-Quality Scans**: Tesseract.js performs poorly on images with skew, low contrast, or decorative fonts common in scanned board papers. Mitigated by showing confidence warnings and keeping all OCR output editable before use.
- **Risk 4 — Shared Component Coupling**: *(Risk avoided in v1 — live preview not implemented.)* If reusing student-facing components for live preview in a future version, this creates coupling between the admin feature and the core feature’s internal APIs.
- **Risk 5 — Manual Paste Errors**: The workflow requires the author to manually paste JSON into the correct position in the asset file. A misplaced paste could corrupt the JSON file. Mitigated by displaying clear paste instructions and providing a JSON structure reminder alongside the output buttons.

---

## Future Scope

- **FS-001 — Direct File Write via Local Write Server**: ~~Future scope~~ **Implemented in v1.** A plain Node.js HTTP server (`content-server.js`, port 3001) handles `GET` (read questions array) and `PUT` (write updated array) for all content files. The Angular dev server proxies `/api/content/*` to it. `AdminContentLoaderService` uses `save<T>(assetPath, items[])` to write and update the in-memory signal cache simultaneously.
- **FS-006 — Live Preview Panel**: Render the new question inside the actual shared MCQ/SQL/Python student-facing card component in a side panel, so authors can verify layout before copying JSON.
- **FS-002 — Batch OCR**: Process multiple question screenshots in a single session, queuing them for review before generating a batch of JSON snippets.
- **FS-003 — Duplicate Detection**: Automatically compare the new question's text against all existing questions (using fuzzy string matching) and warn if a near-duplicate is detected.
- **FS-004 — Admin for Study Notes**: A Markdown editor within the admin panel for creating and editing study notes chapters, with live Markdown preview.
- **FS-005 — Content Validation**: A "Validate All Files" action that fetches every content JSON file and runs schema validation, reporting any files that have drifted from the expected schema.
