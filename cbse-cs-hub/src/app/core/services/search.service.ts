import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, of, shareReplay } from 'rxjs';

export interface SearchIndexEntry {
  id: string;
  module: 'study-notes' | 'sql' | 'python';
  title: string;
  tags: string[];
  preview: string;
  routePath: string;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);
  private index$: Observable<SearchIndexEntry[]> | null = null;

  private loadIndex(): Observable<SearchIndexEntry[]> {
    if (!this.index$) {
      this.index$ = this.http.get<SearchIndexEntry[]>('assets/content/search-index.json').pipe(
        shareReplay(1)
      );
    }
    return this.index$;
  }

  search(query: string): Observable<SearchIndexEntry[]> {
    if (!query || query.trim().length < 2) {
      return of([]);
    }
    const q = query.toLowerCase().trim();
    return this.loadIndex().pipe(
      map(entries =>
        entries.filter(e =>
          e.title.toLowerCase().includes(q) ||
          e.tags.some(tag => tag.toLowerCase().includes(q))
        )
      )
    );
  }
}
