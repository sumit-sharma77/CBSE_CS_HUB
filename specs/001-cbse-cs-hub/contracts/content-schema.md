# Content Schema Contracts: CBSE CS Hub

**Feature**: 001-cbse-cs-hub  
**Date**: 2026-04-28  
**Audience**: Content author (Sumit Vats) — describes the exact JSON format to use when adding/editing content

---

## Overview

All platform content is stored as JSON files under `src/assets/content/`. This document defines the exact structure each file must follow. The Angular application reads these files at runtime; any deviation from the schema will cause runtime errors.

---

## Study Notes — Chapter Index

**Files**: `src/assets/content/study-notes/class-11-index.json`, `class-12-index.json`  
**Purpose**: Lists all chapters for a class (loaded once when the Notes module opens)

```json
[
  {
    "id": "cl12-ch01-python-revision",
    "classLevel": 12,
    "title": "Python Revision Tour",
    "chapterNumber": 1,
    "tags": ["python", "data types", "variables", "revision"],
    "assetPath": "study-notes/class-12/cl12-ch01-python-revision.json"
  },
  {
    "id": "cl12-ch02-oop",
    "classLevel": 12,
    "title": "Object-Oriented Programming",
    "chapterNumber": 2,
    "tags": ["OOP", "class", "object", "inheritance", "python"],
    "assetPath": "study-notes/class-12/cl12-ch02-oop.json"
  }
]
```

**Rules**:
- `id` must be unique across ALL classes and kebab-case: `cl<classLevel>-ch<nn>-<short-name>`
- `chapterNumber` must be unique within a class
- `assetPath` is relative to `src/assets/content/`
- At least one tag required

---

## Study Notes — Chapter Content

**Files**: `src/assets/content/study-notes/class-12/<chapter-id>.json` (and `class-11/`)  
**Purpose**: Full chapter content loaded on demand

```json
{
  "id": "cl12-ch01-python-revision",
  "classLevel": 12,
  "title": "Python Revision Tour",
  "chapterNumber": 1,
  "tags": ["python", "data types", "variables", "revision"],
  "sections": [
    {
      "heading": "Introduction",
      "content": "Python is a high-level, general-purpose programming language used extensively in CBSE Computer Science.\n\nThis chapter revises core concepts from Class 11."
    },
    {
      "heading": "Data Types",
      "content": "Python supports the following built-in data types:",
      "codeBlocks": [
        {
          "language": "python",
          "code": "x = 10          # int\ny = 3.14        # float\nz = \"hello\"     # str\nb = True        # bool",
          "explanation": "Python is dynamically typed — you do not need to declare the type of a variable explicitly."
        }
      ]
    }
  ]
}
```

**Rules**:
- `id` must match exactly what is in the chapter index
- `sections` must have at least 1 entry
- `codeBlocks` is optional per section
- `language` must be one of: `"python"`, `"sql"`, `"text"`
- `content` supports `\n` for line breaks; do not use HTML tags

---

## SQL Questions

**Files**: `src/assets/content/sql-questions/select.json`, `where.json`, `order-by.json`, `group-by.json`, `aggregate.json`, `joins.json`, `keys-constraints.json`  
**Purpose**: All questions for one SQL category

```json
[
  {
    "id": "sql-select-001",
    "category": "select",
    "questionText": "Write an SQL query to display the Name and Salary of all employees from the EMPLOYEE table.",
    "answer": "SELECT Name, Salary FROM EMPLOYEE;",
    "explanation": "The SELECT statement retrieves specific columns. We list Name and Salary separated by a comma. The FROM clause specifies the source table.",
    "difficulty": "easy",
    "isPreviousYear": true,
    "year": 2023,
    "marks": 2
  },
  {
    "id": "sql-select-002",
    "category": "select",
    "questionText": "Write an SQL query to display all unique Department values from the EMPLOYEE table.",
    "answer": "SELECT DISTINCT Department FROM EMPLOYEE;",
    "explanation": "DISTINCT removes duplicate rows from the result. Without DISTINCT, the same department name would appear multiple times if multiple employees belong to it.",
    "difficulty": "easy",
    "isPreviousYear": false
  }
]
```

**Rules**:
- `id` format: `sql-<category>-<3-digit-number>` (e.g., `sql-joins-001`)
- `category` must exactly match the file name (without `.json`)
- `difficulty` must be one of: `"easy"`, `"medium"`, `"hard"`
- `isPreviousYear: true` requires `year` to be set
- `marks` is optional; include only for previous-year questions

---

## Python Exercises

**Files**: `src/assets/content/python-exercises/variables.json`, `conditions.json`, `loops.json`, `functions.json`, `lists.json`, `strings.json`, `dictionaries.json`, `mixed.json`  
**Purpose**: All exercises for one Python topic

```json
[
  {
    "id": "py-loops-001",
    "topic": "loops",
    "type": "output-based",
    "difficulty": "beginner",
    "questionText": "What will be the output of the following Python code?",
    "codeSnippet": "for i in range(1, 6):\n    if i % 2 == 0:\n        print(i)",
    "answer": "2\n4",
    "explanation": "The loop iterates i from 1 to 5. The condition i % 2 == 0 checks if i is even. Only 2 and 4 satisfy this condition, so they are printed."
  },
  {
    "id": "py-loops-002",
    "topic": "loops",
    "type": "coding",
    "difficulty": "intermediate",
    "questionText": "Write a Python program to print the sum of all numbers from 1 to n, where n is input by the user.",
    "answer": "The sum of numbers from 1 to n.",
    "explanation": "Use a for loop with range(1, n+1) and accumulate the sum in a variable.",
    "annotatedCode": "n = int(input())   # Read integer input from user\ntotal = 0          # Initialise accumulator\nfor i in range(1, n+1):   # Loop from 1 to n inclusive\n    total += i     # Add current number to accumulator\nprint(total)       # Print the final sum"
  }
]
```

**Rules**:
- `id` format: `py-<topic>-<3-digit-number>` (e.g., `py-loops-001`)
- `topic` must exactly match the file name (without `.json`)
- `type` must be one of: `"output-based"`, `"logic"`, `"coding"`
- `difficulty` must be one of: `"beginner"`, `"intermediate"`
- `codeSnippet` is required for `output-based` type; optional otherwise
- `annotatedCode` is required for `coding` type
- Use `\n` for line breaks within code; do not use HTML

---

## Search Index

**File**: `src/assets/content/search-index.json`  
**Purpose**: Flat list of all searchable items across all modules (generated/maintained manually)

```json
[
  {
    "id": "cl12-ch01-python-revision",
    "module": "study-notes",
    "title": "Python Revision Tour",
    "tags": ["python", "data types", "variables"],
    "preview": "Python is a high-level, general-purpose programming language used extensively in CBSE Computer Science.",
    "routePath": "/notes/chapter/cl12-ch01-python-revision"
  },
  {
    "id": "sql-joins-001",
    "module": "sql",
    "title": "JOIN query on two tables",
    "tags": ["joins", "inner join", "foreign key"],
    "preview": "Write an SQL query to display employee names and their department names using a JOIN.",
    "routePath": "/sql/joins"
  },
  {
    "id": "py-loops-001",
    "module": "python",
    "title": "Output-based: for loop with even check",
    "tags": ["loops", "for loop", "range", "even"],
    "preview": "What will be the output of the following Python code? for i in range(1, 6): if i % 2 == 0:",
    "routePath": "/python/loops"
  }
]
```

**Rules**:
- `id` must match the `id` from the source entity exactly
- `module` must be one of: `"study-notes"`, `"sql"`, `"python"`
- `preview` must be 80–150 characters (will be truncated to 120 in the UI)
- `routePath` must match the Angular Router route for that content
- This file must be manually updated whenever content is added or removed

---

## File Naming Conventions

| Content Type | Directory | File Pattern |
|---|---|---|
| Class 11 chapter index | `study-notes/` | `class-11-index.json` |
| Class 12 chapter index | `study-notes/` | `class-12-index.json` |
| Class 11 chapter | `study-notes/class-11/` | `cl11-ch<nn>-<short-name>.json` |
| Class 12 chapter | `study-notes/class-12/` | `cl12-ch<nn>-<short-name>.json` |
| SQL questions | `sql-questions/` | `<category>.json` (7 fixed files) |
| Python exercises | `python-exercises/` | `<topic>.json` (8 fixed files) |
| Search index | `content/` | `search-index.json` |
