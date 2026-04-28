# Tasks: CBSE CS Hub

**Input**: Design documents from `specs/001-cbse-cs-hub/`  
**Branch**: `001-cbse-cs-hub`  
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/content-schema.md ✅

## Format: `[ID] [P?] [Story?] Description — file path`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[US1–US6]**: User story this task belongs to
- No story label = Setup or Foundational phase

---

## Phase 1: Setup

**Purpose**: Angular 21 workspace created, Tailwind + PWA + deployment wired, skeleton routes confirmed runnable.

- [x] T001 Create Angular 21 standalone workspace: `ng new cbse-cs-hub --routing --style=css --standalone --skip-git` in repo root
- [x] T002 Install Tailwind CSS v4 dependencies: `npm install tailwindcss @tailwindcss/postcss postcss` in `cbse-cs-hub/`
- [x] T003 Create PostCSS config for Tailwind v4 in `cbse-cs-hub/.postcssrc.json`
- [x] T004 Replace contents of `cbse-cs-hub/src/styles.css` with `@import "tailwindcss";` and dark-mode custom variant
- [x] T005 [P] Set `baseHref: /CBSE_CS_HUB/` in `cbse-cs-hub/angular.json` build configuration
- [x] T006 [P] Add flash-prevention inline script to `cbse-cs-hub/src/index.html` (reads `cbse-theme` from localStorage and sets `dark` class before Angular bootstrap)
- [x] T007 Install PWA support: `ng add @angular/pwa --project cbse-cs-hub`
- [x] T008 Configure `cbse-cs-hub/ngsw-config.json` to pre-cache all `assets/content/**` JSON files
- [x] T009 [P] Install GitHub Pages deploy tool: `ng add angular-cli-ghpages` in `cbse-cs-hub/`
- [x] T010 Create all feature route stubs in `cbse-cs-hub/src/app/app.routes.ts` (12 routes: `/`, `/study-notes`, `/study-notes/:chapterId`, `/notes`, `/sql`, `/sql/:category`, `/python`, `/python/:topic`, `/bookmarks`, `/progress`, `/search`, wildcard redirect)
- [x] T011 Configure `cbse-cs-hub/src/app/app.config.ts` with `provideRouter`, `provideHttpClient(withFetch())`
- [x] T012 Create content asset directory structure under `cbse-cs-hub/src/assets/content/` (study-notes/class-11, study-notes/class-12, sql-questions, python-exercises)

**Checkpoint**: `ng serve` runs without errors; all routes reachable; dark mode class toggled by script.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core services and shared UI shell — MUST be complete before any user story feature work.

**⚠️ CRITICAL**: All US1–US6 work depends on these services and layout being in place.

- [x] T013 Implement `StorageService` with generic get/set/remove, JSON serialisation, and `QuotaExceededError` signal in `cbse-cs-hub/src/app/core/services/storage.service.ts`
- [x] T014 [P] Implement `ThemeService` (WritableSignal + `effect()` syncing `dark` class on `<html>` + `cbse-theme` key) in `cbse-cs-hub/src/app/core/services/theme.service.ts`
- [x] T015 [P] Implement `BookmarkService` (WritableSignal<Bookmark[]>, `toggle()`, `isBookmarked()` computed, `effect()` persistence) in `cbse-cs-hub/src/app/core/services/bookmark.service.ts`
- [x] T016 [P] Implement `RecentlyViewedService` (WritableSignal<RecentlyViewedEntry[]> capped at 10, `track()`, dedup by itemId, `effect()` persistence) in `cbse-cs-hub/src/app/core/services/recently-viewed.service.ts`
- [x] T017 [P] Implement `ProgressService` (WritableSignal<ProgressStore>, `recordAttempt()`, `getCategoryProgress()` computed, `reset()` wipes signal + storage) in `cbse-cs-hub/src/app/core/services/progress.service.ts`
- [x] T018 [P] Implement `SearchService` (lazy-loads `search-index.json` via HttpClient on first call, `search(query)` filters by title+tags, 300ms debounce contract) in `cbse-cs-hub/src/app/core/services/search.service.ts`
- [x] T019 Implement `HeaderComponent` (logo, search icon routing to `/search`, theme toggle button calling `ThemeService`) in `cbse-cs-hub/src/app/shared/components/header/`
- [x] T020 [P] Implement `BottomNavComponent` (6 tabs: Study Notes, My Notes, SQL, Python, Progress, Search — hidden on `md:` and above via Tailwind) in `cbse-cs-hub/src/app/shared/components/bottom-nav/`
- [x] T021 [P] Implement `SideNavComponent` (same 6 items as vertical list — hidden below `md:` via Tailwind) in `cbse-cs-hub/src/app/shared/components/side-nav/`
- [x] T022 [P] Implement `CardComponent` (title, subtitle, tag chips, optional progress bar slot — generic standalone component) in `cbse-cs-hub/src/app/shared/components/card/`
- [x] T023 [P] Implement `CodeBlockComponent` (wraps `<pre><code>` with Prism.js syntax highlighting for `python` and `sql` languages) in `cbse-cs-hub/src/app/shared/components/code-block/`
- [x] T024 [P] Implement `BookmarkBtnComponent` (toggle icon button calling `BookmarkService.toggle()`; active state via `isBookmarked()` computed) in `cbse-cs-hub/src/app/shared/components/bookmark-btn/`
- [x] T025 [P] Implement `ProgressBarComponent` (displays `attempted/total` as a filled bar with percentage label) in `cbse-cs-hub/src/app/shared/components/progress-bar/`
- [x] T026 [P] Implement `SearchBarComponent` (text input with 300ms debounce signal, clears on Escape, emits search query) in `cbse-cs-hub/src/app/shared/components/search-bar/`
- [x] T027 Wire `AppComponent` root template: `<app-header>` + responsive grid + `<router-outlet>` + `<app-bottom-nav>` + `<app-side-nav>` in `cbse-cs-hub/src/app/app.component.ts`

**Checkpoint**: Full responsive shell renders on 320px mobile and 1280px desktop; all 6 nav tabs active; theme toggle persists; no console errors.

---

## Phase 3: User Story 1 — Study Notes Discovery & Navigation (Priority: P1) 🎯 MVP

**Goal**: Students can browse chapter-wise study notes, search by title/tag, bookmark chapters, and navigate prev/next.

**Independent Test**: Navigate to `/study-notes`, select a chapter, read it, bookmark it, confirm bookmark appears in `/bookmarks`, and use prev/next navigation — all working without any other module.

- [x] T028 [US1] Create `class-12-index.json` with at least 3 sample chapter entries in `cbse-cs-hub/src/assets/content/study-notes/class-12-index.json`
- [x] T029 [P] [US1] Create `class-11-index.json` with at least 2 sample chapter entries in `cbse-cs-hub/src/assets/content/study-notes/class-11-index.json`
- [x] T030 [P] [US1] Create 3 sample chapter content JSON files (with sections and codeBlocks) in `cbse-cs-hub/src/assets/content/study-notes/class-12/`
- [x] T031 [US1] Implement `ChapterListComponent`: loads both class index files via HttpClient, groups by classLevel (11/12), search bar filters by title+tags in real-time, each card shows chapter title + tags + bookmark state in `cbse-cs-hub/src/app/features/study-notes/chapter-list/`
- [x] T032 [US1] Wire `BookmarkBtnComponent` into `ChapterListComponent` chapter cards; tapping card calls `RecentlyViewedService.track()` before routing to `/study-notes/:chapterId`
- [x] T033 [US1] Implement `ChapterViewerComponent`: loads chapter JSON by route param, renders sections as `<h2>` headings + paragraphs, renders `CodeBlockComponent` for each codeBlock in `cbse-cs-hub/src/app/features/study-notes/chapter-viewer/`
- [x] T034 [US1] Add Prev/Next navigation to `ChapterViewerComponent` using chapter index order; display chapter title + bookmark button in page header

**Independent Test Criteria**: Can navigate to `/study-notes`, open a chapter, bookmark it, see it in `/bookmarks`, use prev/next. No SQL or Python module required.

---

## Phase 4: User Story 2 — SQL Practice for Class 12 Exam (Priority: P2)

**Goal**: Students can browse 7 SQL categories, attempt questions, reveal answers with syntax highlighting, filter by previous year (2023–2025), and track per-category progress.

**Independent Test**: Navigate to `/sql`, select "Joins" category, reveal an answer, see it highlighted, toggle Previous Year filter — all working without Study Notes or Python modules.

- [x] T035 [US2] Create all 7 SQL question JSON files with at least 3 questions each (including at least 1 `isPreviousYear: true` per file) in `cbse-cs-hub/src/assets/content/sql-questions/` (select.json, where.json, order-by.json, group-by.json, aggregate.json, joins.json, keys-constraints.json)
- [x] T036 [US2] Implement `SqlCategoryListComponent`: shows 7 category cards each with a `ProgressBarComponent` driven by `ProgressService.getCategoryProgress('sql', category)`, "Previous Year" badge if any questions in that category have `isPreviousYear: true` in `cbse-cs-hub/src/app/features/sql-practice/category-list/`
- [x] T037 [US2] Implement `SqlQuestionListComponent`: loads category JSON on route activate, renders question cards with hidden answer, sticky progress bar at top in `cbse-cs-hub/src/app/features/sql-practice/question-list/`
- [x] T038 [US2] Add "Show Answer" toggle to `SqlQuestionListComponent`: clicking reveals `CodeBlockComponent` (sql) + explanation text; `ProgressService.recordAttempt('sql', category, id)` fires on first reveal
- [x] T039 [P] [US2] Add "Previous Year Only" filter toggle to `SqlQuestionListComponent`; filter signal hides questions where `isPreviousYear === false`; display `year` badge on matching cards
- [x] T040 [P] [US2] Add `BookmarkBtnComponent` to each SQL question card calling `BookmarkService.toggle('sql-question', id, questionText.slice(0,60))`

**Independent Test Criteria**: All 7 categories load; answers reveal with SQL highlighting; progress bars update; previous year filter works; bookmarks persist.

---

## Phase 5: User Story 3 — Python Concept Practice (Priority: P3)

**Goal**: Students can browse 8 Python topics, filter by difficulty, attempt output-based/logic/coding exercises, reveal annotated solutions, and track per-topic progress.

**Independent Test**: Navigate to `/python`, select "Loops", reveal a solution with explanation — working without any other module.

- [x] T041 [US3] Create all 8 Python exercise JSON files with at least 3 exercises each (mix of types and difficulties) in `cbse-cs-hub/src/assets/content/python-exercises/` (variables.json, conditions.json, loops.json, functions.json, lists.json, strings.json, dictionaries.json, mixed.json)
- [x] T042 [US3] Implement `PythonTopicListComponent`: shows 8 topic cards + "Mixed" card each with `ProgressBarComponent`; difficulty filter chips (All / Beginner / Intermediate) above card grid in `cbse-cs-hub/src/app/features/python-practice/topic-list/`
- [x] T043 [US3] Implement `PythonExerciseListComponent`: loads topic JSON on route activate, applies difficulty filter signal, renders exercise cards with type badge and difficulty badge in `cbse-cs-hub/src/app/features/python-practice/exercise-list/`
- [x] T044 [US3] Add "Show Solution" toggle to `PythonExerciseListComponent`: clicking reveals answer + explanation; for `output-based` type shows `codeSnippet` in CodeBlock above question; for `coding` type shows `annotatedCode` in CodeBlock; `ProgressService.recordAttempt('python', topic, id)` fires on first reveal
- [x] T045 [P] [US3] Add completion summary to `PythonExerciseListComponent`: when last exercise in topic is revealed, show inline summary card ("You completed X/Y exercises in this topic")
- [x] T046 [P] [US3] Add `BookmarkBtnComponent` to each Python exercise card calling `BookmarkService.toggle('python-exercise', id, questionText.slice(0,60))`

**Independent Test Criteria**: All 8 topics load; difficulty filter works; solutions reveal with type-appropriate display; progress bars update.

---

## Phase 6: User Story 4 — Personal Notes Pad (Priority: P4)

**Goal**: Students can create, edit, delete, search, and export personal notes with auto-save to localStorage.

**Independent Test**: Open `/notes`, type a note, close the browser, reopen and verify note persists; search filters by keyword; export downloads `.txt` file.

- [x] T047 [US4] Implement `NotesComponent` shell: note list view (cards sorted by `updatedAt` desc) + floating "+" button to create new note in `cbse-cs-hub/src/app/features/notes/`
- [x] T048 [US4] Add note editor view within `NotesComponent`: `<textarea>` bound to a `WritableSignal<string>`; `effect()` with 2-second debounce auto-saves to `StorageService` under `cbse-notes` key; "Saved ✓" indicator appears after save
- [x] T049 [US4] Implement create/edit flow in `NotesComponent`: "+" creates a blank note and opens editor; tapping a list card opens that note's editor; derive `title` from first 60 chars of content
- [x] T050 [US4] Implement delete in `NotesComponent`: delete icon on each card; clicks show inline confirmation ("Delete this note? This cannot be undone."); confirmed delete removes from signal and storage
- [x] T051 [P] [US4] Add keyword search bar to `NotesComponent` list view: `computed()` signal filters `PersonalNote[]` by `content.toLowerCase().includes(query)`; matching keyword in titles highlighted via Angular pipe
- [x] T052 [P] [US4] Implement export in `NotesComponent`: "Export All" button creates a `Blob` of all notes (formatted with title, timestamp, body, separator); triggers download as `my-cbse-notes.txt` via `URL.createObjectURL`

**Independent Test Criteria**: Note survives browser restart; search filters in real-time; export file contains all notes with timestamps.

---

## Phase 7: User Story 5 — Progress Tracking & Recently Viewed (Priority: P5)

**Goal**: Students can see SQL/Python attempt progress, recently visited items, bookmarks count, and reset all data.

**Independent Test**: Attempt 2 SQL questions and 1 Python exercise, open `/progress` — see correct progress bars and recently viewed list. Confirm "Reset All Data" wipes everything.

- [x] T053 [US5] Implement `ProgressComponent` SQL section: two-column grid of 7 SQL category rows each showing `ProgressBarComponent` with `attempted/total` counts sourced from `ProgressService` in `cbse-cs-hub/src/app/features/progress/`
- [x] T054 [P] [US5] Add Python section to `ProgressComponent`: 8 topic rows with progress bars sourced from `ProgressService`
- [x] T055 [P] [US5] Add bookmarks summary row to `ProgressComponent`: count of total bookmarks from `BookmarkService`
- [x] T056 [US5] Implement "Recently Viewed" section in `ProgressComponent`: lists last 10 entries from `RecentlyViewedService` with item title, module badge, and relative timestamp (`time-ago.pipe.ts`); each row tappable → navigates to `routePath`
- [x] T057 [US5] Implement `TimeAgoPipe` in `cbse-cs-hub/src/app/shared/pipes/time-ago.pipe.ts` (transforms ISO timestamp to "2 hours ago" / "yesterday" / date string)
- [x] T058 [US5] Implement "Reset All Data" button in `ProgressComponent`: opens confirmation overlay explicitly listing: SQL progress, Python progress, bookmarks, personal notes, recently viewed; confirmed click calls `ProgressService.reset()`, `BookmarkService` clear, `RecentlyViewedService` clear, `StorageService.remove('cbse-notes')`, routes back to `/`

**Independent Test Criteria**: Progress bars reflect actual attempt counts; recently viewed list correct; reset clears everything and redirects home.

---

## Phase 8: User Story 6 — Dark/Light Mode Toggle (Priority: P6)

**Goal**: Students can toggle dark/light mode from anywhere in the app; preference persists across sessions; no flash-of-wrong-theme on load.

**Independent Test**: Toggle dark mode, close browser, reopen — site loads in dark mode. Check all pages in both modes for contrast defects.

- [x] T059 [US6] Wire theme toggle button in `HeaderComponent` to call `ThemeService.toggle()`; button icon switches between sun/moon icons based on current theme signal
- [x] T060 [US6] Apply Tailwind dark-mode variants (`dark:bg-*`, `dark:text-*`) to `AppComponent`, `HeaderComponent`, `BottomNavComponent`, `SideNavComponent`, `CardComponent` — covering the full shell
- [x] T061 [P] [US6] Apply dark-mode Tailwind variants to study-notes components (`ChapterListComponent`, `ChapterViewerComponent`) and `CodeBlockComponent`
- [x] T062 [P] [US6] Apply dark-mode Tailwind variants to SQL and Python feature components (`SqlCategoryListComponent`, `SqlQuestionListComponent`, `PythonTopicListComponent`, `PythonExerciseListComponent`)
- [x] T063 [P] [US6] Apply dark-mode Tailwind variants to utility components (`NotesComponent`, `ProgressComponent`, `BookmarksComponent`, `SearchResultsComponent`)
- [x] T064 [US6] Verify flash-prevention: confirm inline `<script>` in `index.html` runs synchronously, reads `cbse-theme`, and sets `dark` class before Angular bootstrap — test by hard-refreshing in dark mode

**Independent Test Criteria**: Theme toggle switches instantly; preference persists; all 6 nav sections readable in both modes; no FOUC on page load.

---

## Phase 9: Utilities (Search & Bookmarks)

**Goal**: Global search across all content titles/tags; bookmarks page listing all saved items across modules.

- [x] T065 Create `search-index.json` combining entries from all chapters, SQL questions, and Python exercises (title, tags, module, routePath, preview) in `cbse-cs-hub/src/assets/content/search-index.json`
- [x] T066 Implement `SearchResultsComponent`: loads `search-index.json` via `SearchService`, renders debounced real-time results grouped into three sections (Study Notes / SQL / Python), each result card tappable → navigates to `routePath` in `cbse-cs-hub/src/app/features/search-results/`
- [x] T067 [P] Add empty-state to `SearchResultsComponent`: when query length ≥ 2 and no results found, display "No results for '…'" message
- [x] T068 Implement `BookmarksComponent`: loads `BookmarkService` signal, groups bookmark cards by type (Chapters / SQL / Python), each card tap navigates to content, unbookmark icon on each card calls `BookmarkService.toggle()` to remove in `cbse-cs-hub/src/app/features/bookmarks/`
- [x] T069 Implement `HomeComponent`: 4 content module cards (Study Notes, SQL Practice, Python Practice, My Notes — Progress is accessed via nav, not a home card), "Recently Viewed" section (last 5 from `RecentlyViewedService`), progress summary strip (SQL + Python total attempted counts) in `cbse-cs-hub/src/app/features/home/`

---

## Phase 10: Polish & Production

**Goal**: Optimised production build deployed to live GitHub Pages; offline verified; cross-browser tested.

- [x] T070 Run `ng build --configuration production` and verify total initial JS bundle size is < 500KB (use `--stats-json` + `webpack-bundle-analyzer` or equivalent)
- [ ] T071 [P] Verify PWA offline: open app in Chrome, DevTools → Application → Service Workers → confirm registration; then Network → Offline; hard-refresh → verify app loads from cache
- [ ] T072 [P] Cross-browser smoke test: open `/`, `/study-notes`, `/sql`, `/python`, `/notes`, `/progress` in Chrome, Firefox, Edge (latest); verify no layout breakage or JS errors
- [ ] T073 [P] Mobile responsive test: verify bottom nav visible at 320px, 375px, 414px; verify side nav visible at 768px+; verify card layout correct at all widths
- [ ] T074 [P] Accessibility check: run Chrome Lighthouse accessibility audit; fix any interactive elements missing `aria-label`; verify colour contrast ≥ 4.5:1 in both themes
- [ ] T075 Deploy to GitHub Pages: `ng deploy --base-href=/CBSE_CS_HUB/` from `cbse-cs-hub/`
- [ ] T076 Verify live site at `https://<username>.github.io/CBSE_CS_HUB/`: navigate all routes, test 404 → Angular redirect works, confirm PWA service worker active on live URL
- [ ] T077 [P] Privacy verification: open DevTools → Network on live URL; confirm zero requests to external analytics/tracking origins; confirm no third-party scripts loaded per NFR-005
- [ ] T078 [P] Run Chrome Lighthouse Performance audit on live GitHub Pages URL; verify LCP < 2.5s and TTI < 2s per SC-002

---

## Dependencies (Story Completion Order)

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational Shell + Services)  ← GATE: nothing below can start until this completes
    ↓                    ↓                    ↓                    ↓
Phase 3 (US1)        Phase 4 (US2)        Phase 5 (US3)        Phase 6 (US4)
Study Notes         SQL Practice         Python Practice       Personal Notes
    ↓                    ↓                    ↓                    ↓
Phase 7 (US5)  ← depends on US1+US2+US3 data being present to demonstrate progress tracking
    ↓
Phase 8 (US6)  ← can be started after Phase 2; dark-mode variants applied incrementally per feature
    ↓
Phase 9 (Utilities)  ← Search index requires phases 3–5 content JSON to exist
    ↓
Phase 10 (Production)
```

**Parallel opportunities per story** (after Phase 2 gate):
- US1 · US2 · US3 · US4 can all run in parallel — no inter-story dependencies
- US6 dark-mode variants (T061–T063) can be applied in parallel after each feature phase lands
- Within US2: T039 (PY filter) + T040 (bookmark) can run in parallel after T038
- Within US3: T045 (completion summary) + T046 (bookmark) can run in parallel after T044

---

## Implementation Strategy

**MVP Scope** (deliver first, demonstrates full P1 value):
- Phase 1 + Phase 2 + Phase 3 (US1 Study Notes)
- Tasks T001–T034 = runnable app with browsable study notes, bookmarks, chapter search, and persistent bookmarks

**Increment 2** (adds exam-prep value):
- Phase 4 (US2 SQL) = T035–T040

**Increment 3** (completes practice modules):
- Phase 5 (US3 Python) = T041–T046

**Increment 4** (personal utility):
- Phase 6 (US4 Notes Pad) = T047–T052

**Increment 5** (engagement + polish):
- Phase 7 (US5 Progress) + Phase 8 (US6 Theme) + Phase 9 (Utilities) = T053–T069

**Increment 6** (production release):
- Phase 10 = T070–T078
