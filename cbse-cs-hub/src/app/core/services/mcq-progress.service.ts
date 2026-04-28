import { Injectable, effect, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

export interface McqSessionResult {
  answers: Record<string, number>; // questionId -> selectedOptionIndex
  score: number;
  total: number;
  completedAt?: string;
}

export interface McqProgressStore {
  [setId: string]: McqSessionResult;
}

const STORAGE_KEY = 'cbse-mcq-progress';

@Injectable({ providedIn: 'root' })
export class McqProgressService {
  private storage = inject(StorageService);

  readonly progress = signal<McqProgressStore>(
    this.storage.get<McqProgressStore>(STORAGE_KEY) ?? {}
  );

  constructor() {
    effect(() => {
      this.storage.set(STORAGE_KEY, this.progress());
    });
  }

  /** Save a single MCQ answer. */
  saveAnswer(setId: string, questionId: string, selectedIndex: number, correctIndex: number): void {
    const current = this.progress();
    const session = current[setId] ?? { answers: {}, score: 0, total: 0 };
    if (session.answers[questionId] !== undefined) return; // already answered — immutable

    const newScore = session.score + (selectedIndex === correctIndex ? 1 : 0);
    const updatedSession: McqSessionResult = {
      ...session,
      answers: { ...session.answers, [questionId]: selectedIndex },
      score: newScore,
    };
    this.progress.set({ ...current, [setId]: updatedSession });
  }

  /** Mark a quiz set as completed with final score. */
  markCompleted(setId: string, total: number): void {
    const current = this.progress();
    const session = current[setId] ?? { answers: {}, score: 0, total };
    this.progress.set({
      ...current,
      [setId]: { ...session, total, completedAt: new Date().toISOString() },
    });
  }

  /** Get saved session for a set (or null if not started). */
  getSession(setId: string): McqSessionResult | null {
    return this.progress()[setId] ?? null;
  }

  /** Reset progress for a single set. */
  resetSet(setId: string): void {
    const current = { ...this.progress() };
    delete current[setId];
    this.progress.set(current);
  }

  /** Reset all MCQ progress. */
  resetAll(): void {
    this.progress.set({});
    this.storage.remove(STORAGE_KEY);
  }
}
