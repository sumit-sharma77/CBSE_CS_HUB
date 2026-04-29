# Data Model: Dev-Only Admin Content Editor

**Feature**: 002-admin-editor
**Date**: 2026-04-29
**Derived from**: spec.md Key Entities + research.md Decisions 1–9

---

## Overview

The admin editor introduces no new stored entities — it reads existing content entities (defined in `001-cbse-cs-hub/data-model.md`) and produces transient in-memory drafts. The only new TypeScript types are:
1. **Draft interfaces** — mutable FormGroup value shapes (one per content type)
2. **OCR result** — transient, never persisted
3. **Admin service contracts** — method signatures

---

## Draft Interfaces (admin-only, never persisted)

### `McqDraft`
Maps directly to the `FormGroup` value in `McqEditorComponent`.

```typescript
interface McqDraft {
  id: string;               // auto-generated, editable override
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  isPreviousYear: boolean;
  year: number | null;      // required when isPreviousYear = true
}
```

**Output shape** (JSON snippet copied/downloaded):
```json
{
  "id": "cl12-py-016",
  "question": "What is the output of the following code?",
  "options": ["10", "20", "30", "Error"],
  "correctIndex": 2,
  "explanation": "The loop executes 3 times, printing 30.",
  "isPreviousYear": false
}
```
*(year omitted when `isPreviousYear = false`)*

---

### `SqlDraft`
Maps to the `FormGroup` value in `SqlEditorComponent`.

```typescript
interface SqlDraft {
  id: string;
  category: string;        // auto-filled from selected file (e.g. "aggregate", "joins")
  questionText: string;    // field name in actual JSON files
  answer: string;          // multi-line SQL query
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isPreviousYear: boolean;
  year?: number;
  marks?: number;          // optional, used in some questions
}
```

**Target files**: `src/assets/content/sql-questions/*.json` (plain arrays `[ ]`)

**Output shape**:
```json
{
  "id": "sql-joins-008",
  "category": "joins",
  "questionText": "Write a query to display employee names and their department names using INNER JOIN.",
  "answer": "SELECT e.Name, d.DeptName\nFROM Employee e\nINNER JOIN Department d ON e.DeptId = d.DeptId;",
  "explanation": "INNER JOIN returns only rows where the join condition matches in both tables.",
  "difficulty": "medium",
  "isPreviousYear": false
}
```
*(year/marks omitted when not set)*

---

### `PythonDraft`
Maps to the `FormGroup` value in `PythonEditorComponent`.

```typescript
interface PythonDraft {
  id: string;
  topic: string;            // auto-filled from selected file (e.g. "loops", "functions")
  type: 'output-based' | 'fill-blank' | 'mcq' | 'short-answer';
  difficulty: 'beginner' | 'intermediate';
  questionText?: string;   // optional in actual JSON files
  codeSnippet?: string;    // required when type = 'output-based'
  answer?: string;         // optional in actual JSON files
  explanation: string;
  isPreviousYear?: boolean; // optional in actual JSON files
  year?: number;
}
```

**Target files**: `src/assets/content/python-exercises/*.json` (plain arrays `[ ]`)

**Output shape** (output-based example):
```json
{
  "id": "py-loops-011",
  "topic": "loops",
  "type": "output-based",
  "difficulty": "beginner",
  "questionText": "What will be the output of the following code?",
  "codeSnippet": "for i in range(1, 4):\n    print(i * 10)",
  "answer": "10\n20\n30",
  "explanation": "range(1, 4) generates 1, 2, 3. Each is multiplied by 10 and printed.",
  "isPreviousYear": false
}
```
*(codeSnippet omitted when type is not output-based; optional fields omitted when not set)*

---

## OCR Result (transient — never persisted)

```typescript
interface OcrResult {
  text: string;             // raw extracted text from Tesseract.js
  confidence: number;       // 0–100, from Tesseract data.confidence
  lowConfidence: boolean;   // true if confidence < 70
}

interface ParsedOcrResult {
  questionText: string;
  options: [string, string, string, string] | null;
  // null when A)/B)/C)/D) or 1./2./3./4. pattern not detected
}
```

---

## ID Generation Rules

```typescript
// Prefix derivation per content type
type IdPrefix = string;

// MCQ: strip .json, take first 2 chars of topic slug
// "cl12-python.json" → prefix "cl12-py"
// "cl11-computer-fundamentals.json" → prefix "cl11-cf"
// "cl12-networking.json" → prefix "cl12-nw"
// "cl11-python.json" → prefix "cl11-py"
// "cl12-sql.json" → prefix "cl12-sql"

// SQL: "sql-" + filename-without-extension (hyphens preserved)
// "sql-questions/aggregate.json"        → prefix "sql-agg"
// "sql-questions/group-by.json"         → prefix "sql-groupby"
// "sql-questions/joins.json"            → prefix "sql-joins"
// "sql-questions/keys-constraints.json" → prefix "sql-keys"
// "sql-questions/order-by.json"         → prefix "sql-orderby"
// "sql-questions/select.json"           → prefix "sql-select"
// "sql-questions/where.json"            → prefix "sql-where"

// Python: "py-" + abbreviated filename-without-extension
// "python-exercises/conditions.json"   → prefix "py-cond"
// "python-exercises/dictionaries.json" → prefix "py-dict"
// "python-exercises/functions.json"    → prefix "py-fn"
// "python-exercises/lists.json"        → prefix "py-lists"
// "python-exercises/loops.json"        → prefix "py-loops"
// "python-exercises/mixed.json"        → prefix "py-mixed"
// "python-exercises/strings.json"      → prefix "py-str"
// "python-exercises/variables.json"    → prefix "py-vars"

// Counter: max(existing numeric suffix for same prefix) + 1, zero-padded to 3 digits
// No existing IDs → start at "001"
```

---

## Admin Service Interfaces

```typescript
// admin-content-loader.service.ts
interface IAdminContentLoaderService {
  load<T>(assetPath: string): Signal<T[] | null>;
  // assetPath: relative to /assets/content/, e.g. "mcq/cl12-python.json"
  // Returns: signal that emits loaded array, or null on error
}

// admin-id-generator.service.ts
interface IAdminIdGeneratorService {
  nextId(existingItems: { id: string }[], prefix: string): string;
  validateId(proposedId: string, existingItems: { id: string }[]): boolean;
}

// admin-ocr.service.ts
interface IAdminOcrService {
  processImage(imageData: File | Blob): Promise<OcrResult>;
  parseOptionsFromText(text: string): ParsedOcrResult;
}
```

---

## Validation Rules Summary

| Field | Rule | Error message |
|---|---|---|
| Any `id` | Non-empty, unique in `existingItems` | "ID already exists — please change it" |
| Any `id` | Matches format `{prefix}-{NNN}` | (shown as advisory warning only, not blocking) |
| `question` / `questionText` | Non-empty | "Question text is required" |
| MCQ `options[i]` | Non-empty (all 4) | "All four options are required" |
| MCQ `correctIndex` | 0–3 | "Select the correct answer" |
| Any `explanation` | Non-empty | "Explanation is required" |
| `isPreviousYear = true` → `year` | Integer 1990–2030 | "Year is required for previous year questions" |
| Python `codeSnippet` when type = output-based | Non-empty | "Code snippet is required for output-based questions" |
| SQL `difficulty` | One of easy/medium/hard | "Select a difficulty level" |
| Python `difficulty` | One of beginner/intermediate | "Select a difficulty level" |

---

## Relationship to Feature 001 Data Model

The admin editor is read-only with respect to the existing data model. It:
- **Reads** `McqQuestion`, `SqlQuestion`, `PythonExercise` arrays from asset files via `AdminContentLoaderService`
- **Produces** JSON snippets conforming to the same interfaces (no schema divergence)
- **Never writes** to asset files (copy/download only — manual paste by author)

No migrations, no schema changes, no localStorage interactions.
