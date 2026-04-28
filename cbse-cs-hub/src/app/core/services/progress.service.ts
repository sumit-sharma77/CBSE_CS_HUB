import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

export type SqlCategory = 'select' | 'where' | 'order-by' | 'group-by' | 'aggregate' | 'joins' | 'keys-constraints';
export type PythonTopic = 'variables' | 'conditions' | 'loops' | 'functions' | 'lists' | 'strings' | 'dictionaries' | 'mixed';

export interface CategoryProgress {
  attempted: string[];
  total: number;
}

export interface ProgressStore {
  sql: Partial<Record<SqlCategory, CategoryProgress>>;
  python: Partial<Record<PythonTopic, CategoryProgress>>;
}

const STORAGE_KEY = 'cbse-progress';

const DEFAULT_STORE: ProgressStore = { sql: {}, python: {} };

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private storage = inject(StorageService);

  readonly progress = signal<ProgressStore>(
    this.storage.get<ProgressStore>(STORAGE_KEY) ?? DEFAULT_STORE
  );

  constructor() {
    effect(() => {
      this.storage.set(STORAGE_KEY, this.progress());
    });
  }

  recordAttempt(module: 'sql' | 'python', categoryKey: string, itemId: string): void {
    const current = this.progress();
    const section = module === 'sql' ? current.sql : current.python;
    const existing = (section as Record<string, CategoryProgress>)[categoryKey] ?? { attempted: [], total: 0 };
    if (existing.attempted.includes(itemId)) return;
    const updated = { ...existing, attempted: [...existing.attempted, itemId] };
    this.progress.set({
      ...current,
      [module]: { ...section, [categoryKey]: updated },
    });
  }

  updateTotal(module: 'sql' | 'python', categoryKey: string, total: number): void {
    const current = this.progress();
    const section = module === 'sql' ? current.sql : current.python;
    const existing = (section as Record<string, CategoryProgress>)[categoryKey] ?? { attempted: [], total: 0 };
    this.progress.set({
      ...current,
      [module]: { ...section, [categoryKey]: { ...existing, total } },
    });
  }

  getCategoryProgress(module: 'sql' | 'python', categoryKey: string) {
    return computed(() => {
      const section = module === 'sql' ? this.progress().sql : this.progress().python;
      const cat = (section as Record<string, CategoryProgress>)[categoryKey] ?? { attempted: [], total: 0 };
      const attempted = cat.attempted.length;
      const total = cat.total;
      const percentage = total > 0 ? Math.round((attempted / total) * 100) : 0;
      return { attempted, total, percentage };
    });
  }

  reset(): void {
    this.progress.set(DEFAULT_STORE);
    this.storage.remove(STORAGE_KEY);
  }
}
