import { Injectable, effect, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

export interface RecentlyViewedEntry {
  type: 'chapter' | 'sql-question' | 'python-exercise' | 'mcq';
  itemId: string;
  title: string;
  visitedAt: string;
  routePath: string;
}

const STORAGE_KEY = 'cbse-recently-viewed';
const MAX_ENTRIES = 10;

@Injectable({ providedIn: 'root' })
export class RecentlyViewedService {
  private storage = inject(StorageService);

  readonly entries = signal<RecentlyViewedEntry[]>(
    this.storage.get<RecentlyViewedEntry[]>(STORAGE_KEY) ?? []
  );

  constructor() {
    effect(() => {
      this.storage.set(STORAGE_KEY, this.entries());
    });
  }

  track(entry: Omit<RecentlyViewedEntry, 'visitedAt'>): void {
    const current = this.entries().filter(e => e.itemId !== entry.itemId);
    const updated: RecentlyViewedEntry[] = [
      { ...entry, visitedAt: new Date().toISOString() },
      ...current,
    ].slice(0, MAX_ENTRIES);
    this.entries.set(updated);
  }

  clear(): void {
    this.entries.set([]);
    this.storage.remove(STORAGE_KEY);
  }
}
