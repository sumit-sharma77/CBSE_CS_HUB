# Admin Form Schema Contracts

**Feature**: 002-admin-editor
**Date**: 2026-04-29
**Audience**: Developer implementing the admin editor forms

---

## Overview

The admin editor saves questions directly to the content JSON files via `content-server.js` (local Node.js write server). Each form's submitted data must conform exactly to the schemas defined in `specs/001-cbse-cs-hub/contracts/content-schema.md`. This document maps each admin form’s output to those schemas and lists the field-level contracts.

**How saves work**: `AdminContentLoaderService.save(assetPath, items[])` sends `PUT /api/content/{assetPath}` to the local write server, which writes the updated array to disk. MCQ wrapper objects (`{ questions: [...] }`) are handled transparently by the server.

---

## MCQ Form → MCQ Question Schema

**Target files**: `src/assets/content/mcq/*.json`
**File format**: each file is a **wrapper object** `{ id, classLevel, topic, description, questions: [...] }` — the `questions` array is what gets read and written; the wrapper metadata is preserved by the server.

### Output contract

```typescript
// Minimum required output (isPreviousYear = false)
{
  id: string;                          // "{prefix}-{NNN}"  e.g. "cl12-py-016"
  question: string;                    // non-empty
  options: [string, string, string, string];  // exactly 4 elements
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;                 // non-empty
  isPreviousYear: false;
}

// When isPreviousYear = true: year field is added
{
  ...above,
  isPreviousYear: true;
  year: number;                        // required integer
}
```

### Form → JSON field mapping

| Form field | JSON key | Notes |
|---|---|---|
| `id` | `id` | Auto-generated; author may override |
| `question` | `question` | Plain text string |
| `options[0]`–`options[3]` | `options` | Output as `string[4]` array |
| `correctIndex` | `correctIndex` | 0-based integer |
| `explanation` | `explanation` | Plain text string |
| `isPreviousYear` | `isPreviousYear` | Boolean; always included |
| `year` | `year` | Only emitted when `isPreviousYear = true` |

---

## SQL Form → SQL Question Schema

**Target files**: `src/assets/content/sql-questions/*.json`
**File format**: each file is a **plain array** `[ ]`

### Output contract

```typescript
{
  id: string;                          // "sql-{abbrev}-{NNN}"  e.g. "sql-joins-008"
  category: string;                    // auto-filled from file name e.g. "joins"
  questionText: string;                // non-empty
  answer: string;                      // may contain \n (multi-line SQL)
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isPreviousYear: boolean;
  year?: number;                       // omitted when falsy
  marks?: number;                      // optional
}
```

### Form → JSON field mapping

| Form field | JSON key | Notes |
|---|---|---|
| `id` | `id` | Auto-generated |
| `category` | `category` | Auto-filled from selected file |
| `questionText` | `questionText` | Plain text; may include table schema |
| `answer` | `answer` | Multi-line SQL; `\n` preserved by `JSON.stringify` |
| `explanation` | `explanation` | Plain text |
| `difficulty` | `difficulty` | `easy` / `medium` / `hard` |
| `isPreviousYear` | `isPreviousYear` | Always included |
| `year` | `year` | Omitted when `null` |
| `marks` | `marks` | Omitted when not set |

---

## Python Form → Python Exercise Schema

**Target files**: `src/assets/content/python-exercises/*.json`
**File format**: each file is a **plain array** `[ ]`

### Output contract

```typescript
{
  id: string;                          // "py-{abbrev}-{NNN}"  e.g. "py-loops-011"
  topic: string;                       // auto-filled from file name e.g. "loops"
  type: 'output-based' | 'fill-blank' | 'mcq' | 'short-answer';
  difficulty: 'beginner' | 'intermediate';
  questionText?: string;               // optional
  codeSnippet?: string;                // required for output-based; omitted otherwise
  answer?: string;                     // optional
  explanation: string;                 // required
  isPreviousYear?: boolean;            // optional
  year?: number;                       // omitted when falsy
}
```

### Form → JSON field mapping

| Form field | JSON key | Notes |
|---|---|---|
| `id` | `id` | Auto-generated |
| `topic` | `topic` | Auto-filled from selected file |
| `type` | `type` | `output-based` / `fill-blank` / `mcq` / `short-answer` |
| `difficulty` | `difficulty` | `beginner` / `intermediate` |
| `questionText` | `questionText` | Optional plain text |
| `codeSnippet` | `codeSnippet` | Code string; omitted when type ≠ output-based |
| `answer` | `answer` | Optional plain text output or short answer |
| `explanation` | `explanation` | Step-by-step explanation |
| `isPreviousYear` | `isPreviousYear` | Optional boolean |
| `year` | `year` | Omitted when not set |

---

## Direct Save Behaviour

All form submissions call `AdminContentLoaderService.save(assetPath, updatedItems[])` which sends `PUT /api/content/{assetPath}` to `content-server.js`. The server:
- Reads the current file to detect format (plain array vs wrapper object)
- Merges the incoming array back, preserving wrapper metadata for MCQ files
- Writes the file atomically and returns `{ ok: true }`

On success the in-memory signal cache is updated and the list view rerenders immediately — no page reload or manual file editing required.
