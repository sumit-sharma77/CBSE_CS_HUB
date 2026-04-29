import { Signal } from '@angular/core';

// ─── Shared ──────────────────────────────────────────────────────────────────

export interface ContentItem {
  id: string;
  question?: string;
  questionText?: string;
  [key: string]: unknown;
}

// ─── Draft Interfaces ───────────────────────────────────────────────────────

export interface McqDraft {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  isPreviousYear: boolean;
  year?: number;
}

export interface SqlDraft {
  id: string;
  category: string;
  questionText: string;
  answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isPreviousYear: boolean;
  year?: number;
  marks?: number;
}

export interface PythonDraft {
  id: string;
  topic: string;
  type: 'output-based' | 'fill-blank' | 'mcq' | 'short-answer';
  questionText?: string;
  codeSnippet?: string;
  answer?: string;
  explanation: string;
  difficulty: 'beginner' | 'intermediate';
  isPreviousYear?: boolean;
  year?: number;
}

// ─── OCR Interfaces ─────────────────────────────────────────────────────────

export interface OcrResult {
  text: string;
  confidence: number;
  lowConfidence: boolean;
}

export interface ParsedOcrResult {
  questionText: string;
  options: [string, string, string, string] | null;
}

// ─── Service Interfaces ──────────────────────────────────────────────────────

export interface IAdminContentLoaderService {
  load<T>(assetPath: string): Signal<T[] | null>;
  save<T>(assetPath: string, items: T[]): import('rxjs').Observable<void>;
}

export interface IAdminIdGeneratorService {
  nextId(existingItems: { id: string }[], prefix: string): string;
  validateId(proposedId: string, existingItems: { id: string }[]): boolean;
}

export interface IAdminOcrService {
  processImage(imageData: File | Blob): Promise<OcrResult>;
  parseOptionsFromText(text: string): ParsedOcrResult;
}
