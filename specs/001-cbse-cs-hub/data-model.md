# Data Model: CBSE CS Hub

**Feature**: 001-cbse-cs-hub  
**Date**: 2026-04-28  
**Derived from**: spec.md Key Entities + research.md Decisions 4–8

---

## Entities Overview

| Entity | Storage | Mutable by | Key |
|--------|---------|-----------|-----|
| `Chapter` | JSON asset | Content author | `id` |
| `ChapterIndex` | JSON asset | Content author | — |
| `SqlQuestion` | JSON asset | Content author | `id` |
| `PythonExercise` | JSON asset | Content author | `id` |
| `PersonalNote` | localStorage | Student | `id` |
| `Bookmark` | localStorage | Student | `type + itemId` |
| `ProgressRecord` | localStorage | Student | `moduleKey` |
| `RecentlyViewedEntry` | localStorage | Student | `itemId` |
| `ThemePreference` | localStorage | Student | — |
| `SearchIndexEntry` | JSON asset | Content author | `id` |

---

## Content Entities (JSON Assets)

### `Chapter`

Stored in: `src/assets/content/study-notes/<class>/<chapter-id>.json`

```typescript
interface Chapter {
  id: string;               // e.g., "cl12-ch01-python-revision"
  classLevel: 11 | 12;
  title: string;            // "Python Revision Tour"
  subject: string;          // "Computer Science"
  chapterNumber: number;    // 1
  tags: string[];           // ["python", "data types", "variables"]
  sections: ChapterSection[];
}

interface ChapterSection {
  heading: string;
  content: string;          // Plain text / Markdown
  codeBlocks?: CodeBlock[];
}

interface CodeBlock {
  language: 'python' | 'sql' | 'text';
  code: string;
  explanation?: string;
}
```

### `ChapterIndex`

Stored in: `src/assets/content/study-notes/class-11-index.json` and `class-12-index.json`

```typescript
interface ChapterIndexEntry {
  id: string;
  classLevel: 11 | 12;
  title: string;
  chapterNumber: number;
  tags: string[];
  assetPath: string;        // "study-notes/class-12/cl12-ch01-python-revision.json"
}

type ChapterIndex = ChapterIndexEntry[];
```

### `SqlQuestion`

Stored in: `src/assets/content/sql-questions/<category>.json`

```typescript
type SqlCategory =
  | 'select'
  | 'where'
  | 'order-by'
  | 'group-by'
  | 'aggregate'
  | 'joins'
  | 'keys-constraints';

interface SqlQuestion {
  id: string;               // "sql-select-001"
  category: SqlCategory;
  questionText: string;     // Plain text description / table schema
  answer: string;           // SQL query
  explanation: string;      // Plain-language explanation
  difficulty: 'easy' | 'medium' | 'hard';
  isPreviousYear: boolean;
  year?: number;            // CBSE exam year if isPreviousYear is true
  marks?: number;           // Mark allocation in exam
}
```

### `PythonExercise`

Stored in: `src/assets/content/python-exercises/<topic>.json`

```typescript
type PythonTopic =
  | 'variables'
  | 'conditions'
  | 'loops'
  | 'functions'
  | 'lists'
  | 'strings'
  | 'dictionaries'
  | 'mixed';

type ExerciseType = 'output-based' | 'logic' | 'coding';
type Difficulty = 'beginner' | 'intermediate';

interface PythonExercise {
  id: string;               // "py-loops-001"
  topic: PythonTopic;
  type: ExerciseType;
  difficulty: Difficulty;
  questionText: string;
  codeSnippet?: string;     // For output-based questions: the code to analyse
  answer: string;           // Correct output or explanation
  explanation: string;      // Step-by-step walkthrough
  annotatedCode?: string;   // For coding exercises: solution with inline comments
}
```

### `SearchIndexEntry`

Stored in: `src/assets/content/search-index.json`

```typescript
type SearchableModule = 'study-notes' | 'sql' | 'python';

interface SearchIndexEntry {
  id: string;
  module: SearchableModule;
  title: string;
  tags: string[];
  preview: string;          // First 120 chars of content for result preview
  routePath: string;        // Angular router path to navigate on click
}
```

---

## LocalStorage Entities

All localStorage keys are prefixed with `cbse-` to avoid collisions.

### `PersonalNote`

localStorage key: `cbse-notes`  
Value: `PersonalNote[]` (JSON-serialised array)

```typescript
interface PersonalNote {
  id: string;               // UUID v4 (crypto.randomUUID())
  title: string;            // First line of content, max 60 chars
  content: string;          // Full note body (plain text)
  createdAt: string;        // ISO 8601 timestamp
  updatedAt: string;        // ISO 8601 timestamp
}
```

### `Bookmark`

localStorage key: `cbse-bookmarks`  
Value: `Bookmark[]` (JSON-serialised array)

```typescript
interface Bookmark {
  type: 'chapter' | 'sql-question' | 'python-exercise';
  itemId: string;           // ID of the bookmarked item
  title: string;            // Denormalised for display without re-fetching
  addedAt: string;          // ISO 8601 timestamp
}
```

### `ProgressRecord`

localStorage key: `cbse-progress`  
Value: `ProgressStore` (JSON-serialised object)

```typescript
interface ProgressStore {
  sql: Record<SqlCategory, CategoryProgress>;
  python: Record<PythonTopic, CategoryProgress>;
}

interface CategoryProgress {
  attempted: string[];      // Array of question/exercise IDs
  total: number;            // Total items available (denormalised for display)
}
```

### `RecentlyViewedEntry`

localStorage key: `cbse-recently-viewed`  
Value: `RecentlyViewedEntry[]` capped at 10 entries (newest first)

```typescript
interface RecentlyViewedEntry {
  type: 'chapter' | 'sql-question' | 'python-exercise';
  itemId: string;
  title: string;
  visitedAt: string;        // ISO 8601 timestamp
  routePath: string;        // Angular router path for direct navigation
}
```

### `ThemePreference`

localStorage key: `cbse-theme`  
Value: `'light' | 'dark'` (raw string, not JSON)

---

## Entity Relationships

```
ChapterIndex  1 ──< *  Chapter
              (index loads on module entry; chapters load individually)

SqlQuestion   belongs-to  SqlCategory (category field)
PythonExercise belongs-to  PythonTopic (topic field)

SearchIndexEntry  references  (Chapter | SqlQuestion | PythonExercise).id

Bookmark          references  (Chapter | SqlQuestion | PythonExercise).id
RecentlyViewedEntry  references  (Chapter | SqlQuestion | PythonExercise).id
ProgressRecord.sql[category].attempted[]  references  SqlQuestion.id
ProgressRecord.python[topic].attempted[]  references  PythonExercise.id
```

---

## State Transitions

### PersonalNote lifecycle
```
Create (empty) → Edit (auto-save on blur/keystroke) → Search → Export → Delete
```

### SQL/Python question progression
```
Not attempted → Viewed (question shown) → Answered (answer revealed)
                                              ↓
                                    Recorded in ProgressRecord
```

### Bookmark lifecycle
```
Not bookmarked → Bookmarked (added to Bookmark[]) → Unbookmarked (removed)
```

---

## Validation Rules

| Field | Rule |
|-------|------|
| `PersonalNote.content` | Non-empty string; max 50,000 characters |
| `PersonalNote.title` | Auto-derived from first 60 chars of content |
| `Bookmark[]` | Max 200 entries (localStorage size guard) |
| `RecentlyViewedEntry[]` | Exactly 10 entries max; oldest auto-evicted |
| `ProgressRecord.sql[*].attempted` | No duplicate IDs |
| `Chapter.id` | Kebab-case, unique across all classes |
| `SqlQuestion.id` | Format: `sql-<category>-<3-digit-number>` |
| `PythonExercise.id` | Format: `py-<topic>-<3-digit-number>` |
