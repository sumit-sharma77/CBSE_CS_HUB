import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

export interface Bookmark {
  type: 'chapter' | 'sql-question' | 'python-exercise';
  itemId: string;
  title: string;
  addedAt: string;
}

const STORAGE_KEY = 'cbse-bookmarks';

@Injectable({ providedIn: 'root' })
export class BookmarkService {
  private storage = inject(StorageService);

  readonly bookmarks = signal<Bookmark[]>(
    this.storage.get<Bookmark[]>(STORAGE_KEY) ?? []
  );

  constructor() {
    effect(() => {
      this.storage.set(STORAGE_KEY, this.bookmarks());
    });
  }

  toggle(type: Bookmark['type'], itemId: string, title: string): void {
    const current = this.bookmarks();
    const exists = current.some(b => b.type === type && b.itemId === itemId);
    if (exists) {
      this.bookmarks.set(current.filter(b => !(b.type === type && b.itemId === itemId)));
    } else {
      this.bookmarks.set([...current, { type, itemId, title, addedAt: new Date().toISOString() }]);
    }
  }

  isBookmarked(type: Bookmark['type'], itemId: string) {
    return computed(() => this.bookmarks().some(b => b.type === type && b.itemId === itemId));
  }

  clear(): void {
    this.bookmarks.set([]);
    this.storage.remove(STORAGE_KEY);
  }
}
