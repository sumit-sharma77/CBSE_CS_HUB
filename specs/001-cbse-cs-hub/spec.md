# Feature Specification: CBSE CS Hub

**Feature Branch**: `001-cbse-cs-hub`  
**Created**: 2026-04-28  
**Status**: Draft  
**Author**: Sumit Vats  

---

## Clarifications

### Session 2026-04-28

- Q: How should bottom navigation treat Study Notes Library vs Personal Notes Pad — one shared tab or two separate tabs? → A: Two separate tabs ("Study Notes" and "My Notes"), making 6 tabs total in the bottom nav.
- Q: Does offline/PWA support (NFR-003 / SC-009) ship in v1 or is it deferred as FS-007 implies? → A: NFR-003 stands — service worker caching ships in v1; FS-007 removed from Future Scope as it duplicates in-scope work.
- Q: What is the depth of global search — titles/tags only, titles/tags/question text, or full chapter body text? → A: Titles and tags only — keeps the search index small and preserves lazy-loading performance (no upfront content loading).
- Q: What does "Reset Progress" clear — only SQL/Python attempt records, or also bookmarks, personal notes, and recently viewed? → A: Everything — all localStorage data (SQL/Python progress, recently viewed, bookmarks, AND personal notes) is cleared on reset.
- Q: Which year range does "Previous Year Questions" in the SQL module cover? → A: Last 3 years only — CBSE papers from 2023, 2024, and 2025.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Study Notes Discovery & Navigation (Priority: P1)

A Class 12 CBSE student needs to quickly find and read chapter-wise Computer Science notes before an exam. They open the site on their phone, browse to the Study Notes Library, and navigate to a specific chapter. They bookmark important sections for quick access later.

**Why this priority**: The Study Notes Library is the foundational value proposition of the platform. Most students will arrive with the primary intent of accessing curated study material. Without this, the platform has no core utility.

**Independent Test**: Can be fully tested by a student navigating to the Study Notes Library, selecting any chapter, reading notes, and bookmarking a page — delivering complete standalone study value.

**Acceptance Scenarios**:

1. **Given** a student opens the website on mobile, **When** they tap "Study Notes" in the bottom navigation, **Then** they see a list of chapters organized by class (11 and 12) with chapter names clearly visible.
2. **Given** a student is on the chapter list, **When** they tap a chapter title, **Then** the chapter notes open in full, formatted for reading on mobile with adequate font size and spacing.
3. **Given** a student is reading notes, **When** they tap the bookmark icon, **Then** the chapter is bookmarked and persists across browser sessions via local storage.
4. **Given** a student has bookmarked chapters, **When** they go to the Bookmarks section, **Then** they see all their bookmarked notes listed and can tap any to open it directly.
5. **Given** a student wants to find a specific topic, **When** they type in the search bar in the Study Notes Library, **Then** matching chapters and sections appear in real-time with the relevant terms highlighted.

---

### User Story 2 - SQL Practice for Class 12 Exam (Priority: P2)

A Class 12 student practising for their CBSE Computer Science practical exam needs to attempt MySQL questions by topic. They navigate to the SQL Practice module, filter by "GROUP BY", attempt previous year questions, check their understanding against shown answers, and move to the next question.

**Why this priority**: SQL is a high-weight section in the CBSE Class 12 curriculum with specific past-year questions. This module provides direct exam-preparation value and is the most unique content offering.

**Independent Test**: Can be fully tested by opening the SQL Practice module, selecting a category (e.g., "Joins"), viewing a question, revealing the answer, and moving to the next question — complete exam-prep value with no other sections needed.

**Acceptance Scenarios**:

1. **Given** a student opens SQL Practice, **When** they see the category list, **Then** they see all 7 categories: SELECT, WHERE, ORDER BY, GROUP BY, Aggregate Functions, Joins, Keys/Constraints — each showing a question count.
2. **Given** a student selects a category, **When** the questions load, **Then** each question is displayed with a clear "Show Answer" button, and the answer/explanation remains hidden until clicked.
3. **Given** a student clicks "Show Answer", **When** the answer is revealed, **Then** the SQL query is displayed with syntax highlighting and a plain-language explanation of why it is correct.
4. **Given** a student has viewed some questions, **When** they return to the category list, **Then** their progress for each category (e.g., "3/10 attempted") is shown using local storage.
5. **Given** a student wants to practise previous year questions specifically, **When** they toggle the "Previous Year Questions" filter, **Then** only questions sourced from past CBSE papers are shown.

---

### User Story 3 - Python Concept Practice (Priority: P3)

A Class 11 student learning Python as a beginner needs to test their understanding of loops. They open the Python Practice module, select "Loops" from the topic list, attempt an output-based question, check the explanation, and move to the next exercise.

**Why this priority**: Python is the primary programming language in the CBSE CS curriculum for both Class 11 and 12. Practice exercises reinforce understanding and are highly valued by students, but are secondary to reference notes.

**Independent Test**: Can be fully tested by opening Python Practice, choosing the "Loops" topic, reading a question, revealing the solution with explanation — complete value without any other module.

**Acceptance Scenarios**:

1. **Given** a student opens Python Practice, **When** they see the topic list, **Then** they see all 8 topics: Variables, Conditions, Loops, Functions, Lists, Strings, Dictionaries, and a "Mixed" option — with difficulty level indicated (Beginner / Intermediate).
2. **Given** a student selects a topic and difficulty, **When** questions load, **Then** they see the question type labelled clearly (Output-Based, Logic, or Coding Exercise).
3. **Given** a student is on an output-based question, **When** they click "Show Answer", **Then** the correct output and a step-by-step explanation of how Python executes the code is shown.
4. **Given** a student has completed all questions in a topic, **When** they finish the last one, **Then** a completion summary shows how many they attempted and encourages them to revisit incorrect ones.
5. **Given** a student attempts a small coding exercise, **When** they view the solution, **Then** it includes annotated code comments explaining each line.

---

### User Story 4 - Personal Notes Pad (Priority: P4)

A student wants to jot down their own study notes while reading a chapter. They open the Personal Notes Pad, type their notes, and the notes are auto-saved. Later they search for a keyword across their notes and export a text file for offline review.

**Why this priority**: The Personal Notes Pad provides utility as a companion tool to the Study Notes Library, but its value depends on students already using the platform's other content. It augments rather than forms the core.

**Independent Test**: Can be tested end-to-end by opening the Notes Pad, typing notes, closing and re-opening the browser, and verifying notes are still there — then searching within them and exporting.

**Acceptance Scenarios**:

1. **Given** a student opens the Personal Notes Pad, **When** they start typing, **Then** the content is auto-saved to local storage within 2 seconds of the last keystroke, with a visible "Saved" indicator.
2. **Given** a student has saved multiple notes, **When** they use the search bar, **Then** results filter to show only notes containing the searched keyword, with the keyword highlighted.
3. **Given** a student selects a note, **When** they click "Delete", **Then** a confirmation prompt appears before permanently removing the note from local storage.
4. **Given** a student wants to take their notes offline, **When** they click "Export", **Then** a plain-text (.txt) file is downloaded containing all their notes with timestamps.
5. **Given** a student closes and reopens the browser, **When** they go to Personal Notes Pad, **Then** all previously saved notes are still present, unmodified.

---

### User Story 5 - Progress Tracking & Recently Viewed (Priority: P5)

A student returns to the platform after a few days and wants to resume where they left off. They check the Progress Tracker to see which SQL categories they have completed and tap "Recently Viewed" to jump back to the Python chapter they were last reading.

**Why this priority**: Progress tracking and recently viewed items reduce friction for returning users and drive re-engagement, but they are utility features that depend on other modules being used first.

**Independent Test**: Can be tested by completing 2 SQL questions and 1 Python topic, then verifying the Progress Tracker shows correct counts and Recently Viewed shows the last 10 items visited.

**Acceptance Scenarios**:

1. **Given** a student has attempted questions in SQL Practice, **When** they open the Progress Tracker, **Then** they see per-category progress bars for SQL, per-topic progress for Python, and a count of bookmarked notes.
2. **Given** a student visits any content page (notes chapter, SQL question, Python exercise), **When** they navigate away, **Then** that item appears in the "Recently Viewed" list with a timestamp.
3. **Given** the "Recently Viewed" list has more than 10 items, **When** a new item is added, **Then** the oldest entry is automatically removed, keeping the list to the 10 most recent.
4. **Given** a student wants a fresh start, **When** they click "Reset All Data" and confirm, **Then** ALL locally stored data is permanently cleared — SQL/Python progress, bookmarks, personal notes, and recently viewed — and the app returns to its initial state. The confirmation dialog MUST explicitly list what will be deleted.

---

### User Story 6 - Dark/Light Mode Toggle (Priority: P6)

A student studying at night prefers dark mode to reduce eye strain. They toggle dark mode from the utility bar, and the entire interface switches to a dark theme. Their preference persists across sessions.

**Why this priority**: Dark/Light mode is a quality-of-life feature. It improves comfort for extended study sessions and is expected by modern users, but does not affect core learning functionality.

**Independent Test**: Fully tested by toggling the theme switch, verifying all pages render correctly in both modes, closing and reopening the browser, and confirming the preference was remembered.

**Acceptance Scenarios**:

1. **Given** a student is on any page, **When** they tap the dark/light mode toggle, **Then** the entire interface immediately switches to the other theme without a page reload.
2. **Given** a student has selected dark mode, **When** they close and reopen the browser, **Then** the site loads in dark mode automatically.
3. **Given** dark mode is active, **When** the student reads notes or code blocks, **Then** text contrast meets readability standards (no white-on-white or black-on-black text).

---

### Edge Cases

- What happens when a student's local storage is full? The platform must handle storage quota errors gracefully and inform the user without crashing.
- What happens when a student searches with special characters or empty strings? The search must return no results silently or show all results respectively without errors.
- What happens when a student's notes contain emojis or non-Latin characters? All Unicode content must be saved and displayed correctly.
- What happens when the student clears browser data? All local progress, notes, and bookmarks are lost — this is equivalent to "Reset All Data" and is an accepted limitation.
- What happens when a student accidentally confirms "Reset All Data"? Data cannot be recovered (no undo). The confirmation dialog must be explicit enough to prevent accidental activation.
- What happens when a student opens the site with no internet after the first load? All content (JSON files, styles, scripts) should be served from cache; core features remain functional offline after first visit.

---

## Requirements *(mandatory)*

### Functional Requirements

**Notes Module — Study Notes Library**

- **FR-001**: The platform MUST display Computer Science notes organised chapter-by-chapter for both Class 11 and Class 12.
- **FR-002**: Each chapter's notes MUST be searchable by keyword within a dedicated search bar in the notes section.
- **FR-003**: Students MUST be able to bookmark any chapter; bookmarks MUST persist via local storage.
- **FR-004**: The platform MUST provide easy chapter-to-chapter navigation (previous/next) within the notes viewer.

**Notes Module — Personal Notes Pad**

- **FR-005**: Students MUST be able to create, edit, and delete their own personal notes within the browser.
- **FR-006**: Personal notes MUST be auto-saved to local storage within 2 seconds of any change.
- **FR-007**: Students MUST be able to search across all their personal notes by keyword.
- **FR-008**: Students MUST be able to export all personal notes as a downloadable plain-text file.

**SQL Practice Module**

- **FR-009**: The SQL Practice module MUST contain questions categorised into: SELECT, WHERE, ORDER BY, GROUP BY, Aggregate Functions, Joins, and Keys/Constraints.
- **FR-010**: Each question MUST display a visible "Show Answer" button; the answer and explanation MUST remain hidden until the button is clicked.
- **FR-011**: SQL answers MUST be displayed with syntax highlighting and a plain-language explanation.
- **FR-012**: Previous year CBSE questions MUST be filterable or distinctly labelled within each SQL category. The initial content set covers papers from **2023, 2024, and 2025** only. Each such question MUST display its exam year.
- **FR-013**: Question attempt progress per SQL category MUST be stored in local storage and displayed to the student.

**Python Practice Module**

- **FR-014**: The Python Practice module MUST organise exercises under 8 topics: Variables, Conditions, Loops, Functions, Lists, Strings, Dictionaries, and a mixed/general set.
- **FR-015**: Each exercise MUST be labelled with its type: Output-Based, Logic, or Coding Exercise.
- **FR-016**: Each exercise MUST have a consistent difficulty label: Beginner or Intermediate.
- **FR-017**: Solutions MUST be hidden by default and revealed on user action, with a step-by-step explanation.
- **FR-018**: Student attempt progress per Python topic MUST be stored in local storage.

**Utility Features**

- **FR-019**: The platform MUST provide a global search bar that searches across all content modules (study notes chapters, SQL questions, Python exercises) by matching against **titles and tags only**. Results MUST be returned as categorised cards (Study Notes / SQL / Python). Full chapter body text is excluded from search to preserve performance.
- **FR-020**: A Progress Tracker MUST show per-category SQL progress, per-topic Python progress, and bookmark counts, all sourced from local storage.
- **FR-020a**: A "Reset All Data" action MUST be available from the Progress page. It MUST display a confirmation dialog explicitly listing all data categories that will be permanently deleted (SQL/Python progress, bookmarks, personal notes, recently viewed) before executing the reset.
- **FR-021**: A "Recently Viewed" list MUST track the last 10 items a student visited across all modules, persisted in local storage.
- **FR-022**: The platform MUST support a Dark/Light mode toggle with the chosen theme persisted in local storage.

**Technical Constraints**

- **FR-023**: The platform MUST be a fully static website with no backend server — all content served as static files (HTML, CSS, JS, JSON).
- **FR-024**: All content MUST be stored and loaded from JSON files.
- **FR-025**: All user data (bookmarks, notes, progress, preferences) MUST be stored exclusively in the browser's local storage.
- **FR-026**: The platform MUST be deployable and function correctly when hosted on GitHub Pages.

**Navigation & Layout**

- **FR-027**: On mobile devices, the platform MUST display a bottom navigation bar with 6 tabs: Study Notes, My Notes, SQL, Python, Progress, and Search. Each tab must be directly accessible from any page.
- **FR-028**: On desktop, the platform MUST display a top or side navigation menu listing all 6 sections: Study Notes, My Notes, SQL Practice, Python Practice, Progress, and Search.

---

### Key Entities

- **Chapter**: A unit of study content belonging to a class (11 or 12) and a subject area; has a title, content body, class level, and subject tags.
- **SQL Question**: A practice question with a category label, question text, SQL answer, plain-language explanation, difficulty, and a flag indicating whether it is a previous year CBSE question.
- **Python Exercise**: A practice exercise with a topic label, exercise type (Output-Based / Logic / Coding), difficulty (Beginner / Intermediate), problem statement, solution code, and step-by-step explanation.
- **Personal Note**: A student-created note with a unique ID, title, body text, creation timestamp, and last-modified timestamp — stored in local storage.
- **Bookmark**: A reference (type + item ID) stored in local storage linking to a bookmarked chapter or question.
- **Progress Record**: A local storage record tracking attempted/completed counts per SQL category and per Python topic.
- **Recently Viewed Entry**: A local storage record with item type, item ID, item title, and visit timestamp, capped at 10 entries.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Students can locate a chapter and open its notes within 3 taps/clicks from the home page.
- **SC-002**: The platform loads and displays the first content screen in under 2 seconds on a mid-range mobile device on a 4G connection.
- **SC-003**: All pages render correctly and are fully functional on screen widths from 320px (small mobile) to 1440px (large desktop).
- **SC-004**: Students can complete a full SQL category practice session (view question → show answer → move on) without any broken interactions across all 7 categories.
- **SC-005**: Personal notes written by a student persist and are retrievable after closing and reopening the browser 100% of the time (within local storage constraints).
- **SC-006**: Global search returns relevant results across all content modules within 1 second of the last keystroke.
- **SC-007**: Dark and light mode themes apply correctly to 100% of UI components with no visual contrast defects.
- **SC-008**: Progress tracking accurately reflects student activity — no over-counting or under-counting of attempted questions.
- **SC-009**: The platform is fully usable offline after the first successful load (core content accessible without an internet connection).
- **SC-010**: A first-time student with no tutorial can identify and use any of the 5 main content modules (Study Notes, My Notes, SQL, Python, Progress) within 2 minutes of landing on the site.

---

## Non-Functional Requirements

- **NFR-001 — Performance**: Total initial page weight MUST NOT exceed 500KB (excluding content JSON files loaded on demand). Core styles and scripts MUST be minified.
- **NFR-002 — Accessibility**: All interactive elements MUST have accessible labels. Colour contrast MUST meet WCAG 2.1 AA minimum ratios.
- **NFR-003 — Offline Support**: After first visit, core pages and content MUST be cached via a service worker so the site functions without an internet connection. This ships in v1.
- **NFR-004 — Browser Compatibility**: The platform MUST work correctly on Chrome, Firefox, Safari, and Edge — latest 2 versions of each.
- **NFR-005 — Privacy**: No user data is transmitted to any server. All data remains in the student's browser. No analytics, tracking scripts, or third-party services that receive personal data.
- **NFR-006 — Maintainability**: Content (notes, questions, exercises) MUST be stored in JSON files that can be updated without touching HTML or JS source files.
- **NFR-007 — Scalability of Content**: The JSON content structure MUST support adding new chapters, questions, or exercises without structural changes to the codebase.

---

## User Personas

### Persona 1 — Riya, Class 12 CBSE Student
- **Age**: 17
- **Goal**: Score above 90% in Computer Science theory and practical exams.
- **Behaviour**: Studies on her smartphone, often at night. Relies on curated notes rather than textbooks. Needs quick chapter navigation.
- **Pain points**: Hard to find chapter-specific notes on mobile; fear of missing important SQL commands for practicals.

### Persona 2 — Arjun, Class 11 CBSE Student
- **Age**: 16
- **Goal**: Build a solid Python foundation before Class 12.
- **Behaviour**: Uses desktop at home, has basic programming understanding. Wants structured exercises with immediate feedback.
- **Pain points**: Doesn't know if his Python logic is correct without running code; wants short, targeted practice.

### Persona 3 — Priya, Exam Preparer
- **Age**: 17
- **Goal**: Revise the entire CBSE CS syllabus in the 2 weeks before exams.
- **Behaviour**: Uses the platform intensively before exams. Needs to track what she has covered across SQL and Python. Values the progress tracker heavily.
- **Pain points**: Loses track of what she has already studied; wants to jot down summaries quickly.

---

## Risks

- **Risk 1 — Content Accuracy**: CBSE syllabus content (especially previous year SQL questions) may have inaccuracies if not verified against official CBSE papers. Mitigated by explicitly sourcing questions from published CBSE question papers.
- **Risk 2 — Local Storage Limitations**: Browsers impose a ~5MB local storage limit per origin. Heavy note-taking could approach this limit. Mitigated by showing a storage usage indicator and warning when near capacity.
- **Risk 3 — Outdated Content**: The CBSE syllabus changes periodically. Content may become outdated. Mitigated by storing all content in JSON files that can be updated independently of the application code.
- **Risk 4 — Mobile Performance**: Loading large JSON files for all chapters simultaneously on a slow mobile connection could degrade performance. Mitigated by lazy-loading content JSON only when a section is accessed.
- **Risk 5 — No Offline Fallback on First Visit**: If a student's first visit occurs without internet, the site will not load at all (no cached content). This is an accepted limitation for a static site.

---

## Future Scope

- **FS-001 — Class 11 SQL Content**: Add SQL notes and practice questions for the Class 11 curriculum (currently focused on Class 12).
- **FS-002 — Timed Mock Tests**: Full-syllabus timed mock tests simulating the CBSE Computer Science exam format with automatic scoring.
- **FS-003 — Shareable Notes**: Allow students to share their personal notes via URL using encoded local data (no backend required).
- **FS-004 — Flashcard Mode**: Spaced-repetition flashcards generated from chapter key terms and definitions.
- **FS-005 — C++ Module**: A separate practice section for C++ (the alternative language option in CBSE CS for older syllabi).
- **FS-006 — Community Q&A**: A GitHub Discussions-backed community space where students can ask and answer questions, kept static.
- **FS-007 — Advanced PWA Features**: Home-screen install banner, background sync, and push notifications (basic service worker caching is already in v1 per NFR-003).

---

## Assumptions

- Students have access to a modern smartphone (Android or iOS) or a desktop computer with a modern browser.
- Students are familiar with basic browser navigation (tapping, scrolling, typing in search bars).
- The platform author (Sumit Vats) is responsible for sourcing and verifying all CBSE curriculum content.
- Content is assumed to align with the current CBSE Computer Science syllabus (Class 11 and 12, Python track).
- Students are not expected to write or execute live Python code; exercises are pen-and-paper / mental model style.
- No user accounts or logins are required; all state is local to the individual student's browser.
- The platform will be hosted on GitHub Pages and accessed via a public URL.
- Initial content will focus on Class 12 SQL and Python; Class 11 content will follow.
