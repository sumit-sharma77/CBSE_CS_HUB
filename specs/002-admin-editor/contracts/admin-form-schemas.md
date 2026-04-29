# Admin Form Schema Contracts

**Feature**: 002-admin-editor
**Date**: 2026-04-29
**Audience**: Developer implementing the admin editor forms

---

## Overview

The admin editor generates JSON snippets that must conform exactly to the schemas defined in `specs/001-cbse-cs-hub/contracts/content-schema.md`. This document maps each admin form's output to those schemas and lists the field-level contracts for each form.

---

## MCQ Form → MCQ Question Schema

**Target files**: `src/assets/content/mcq/*.json`
**Array wrapper**: each file is a top-level JSON array `[ ]`

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

**Target files**: `src/assets/content/sql/*.json`
**Array wrapper**: each file is a top-level JSON array `[ ]`

### Output contract

```typescript
{
  id: string;                          // "sql-{file}-{NNN}"  e.g. "sql-joins-008"
  question: string;
  answer: string;                      // may contain \n (multi-line SQL)
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isPreviousYear: boolean;
  year?: number;                       // omitted when falsy
}
```

### Form → JSON field mapping

| Form field | JSON key | Notes |
|---|---|---|
| `id` | `id` | Auto-generated |
| `question` | `question` | Plain text; may include table schema |
| `answer` | `answer` | Multi-line SQL; `\n` preserved by `JSON.stringify` |
| `explanation` | `explanation` | Plain text |
| `difficulty` | `difficulty` | `easy` / `medium` / `hard` |
| `isPreviousYear` | `isPreviousYear` | Always included |
| `year` | `year` | Omitted when `null` |

---

## Python Form → Python Exercise Schema

**Target files**: `src/assets/content/python/*.json`
**Array wrapper**: each file is a top-level JSON array `[ ]`

### Output contract

```typescript
{
  id: string;                          // "py-{file}-{NNN}"  e.g. "py-loops-011"
  type: 'output-based' | 'fill-blank' | 'mcq' | 'short-answer';
  difficulty: 'beginner' | 'intermediate';
  question: string;
  codeSnippet?: string;                // required for output-based; omitted otherwise
  answer: string;
  explanation: string;
  isPreviousYear: boolean;
  year?: number;                       // omitted when falsy
}
```

### Form → JSON field mapping

| Form field | JSON key | Notes |
|---|---|---|
| `id` | `id` | Auto-generated |
| `type` | `type` | `output-based` / `fill-blank` / `mcq` / `short-answer` |
| `difficulty` | `difficulty` | `beginner` / `intermediate` |
| `question` | `question` | Plain text |
| `codeSnippet` | `codeSnippet` | Code string; omitted when type ≠ output-based |
| `answer` | `answer` | Plain text output or short answer |
| `explanation` | `explanation` | Step-by-step explanation |

---

## JSON Output Formatting

All generated snippets use `JSON.stringify(obj, null, 2)` — 2-space indentation, no trailing comma, standard JSON (not JSONC). Authors paste a single JSON object into the existing array in the target file.

**Paste position reminder** (shown in admin UI near Copy/Download buttons):
```
Paste inside the top-level [ ] array, after the last existing element.
Add a comma after the previous element if needed.
```

Example:
```json
[
  { "id": "cl12-py-015", ... },
  { "id": "cl12-py-016", ... }   ← paste here (no trailing comma on last item)
]
```
