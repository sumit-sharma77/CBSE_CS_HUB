import { Injectable, Signal, WritableSignal, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { IAdminContentLoaderService } from '../admin.types';

const API_BASE = '/api/content/';

@Injectable()
export class AdminContentLoaderService implements IAdminContentLoaderService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, WritableSignal<unknown[] | null>>();

  load<T>(assetPath: string): Signal<T[] | null> {
    if (this.cache.has(assetPath)) {
      return this.cache.get(assetPath) as Signal<T[] | null>;
    }
    const sig = signal<T[] | null>(null);
    this.cache.set(assetPath, sig as WritableSignal<unknown[] | null>);
    this.fetch(assetPath, sig);
    return sig;
  }

  /**
   * Writes the questions array back to disk via the local content server.
   * The server handles both plain-array files and wrapper-object files.
   * On success the in-memory cache signal is updated so the list rerenders.
   */
  save<T>(assetPath: string, items: T[]): Observable<void> {
    return this.http.put<{ ok: boolean }>(API_BASE + assetPath, items).pipe(
      tap(() => {
        const sig = this.cache.get(assetPath) as WritableSignal<unknown[] | null> | undefined;
        if (sig) sig.set(items as unknown[]);
      }),
      map(() => undefined),
      catchError((err: HttpErrorResponse) => {
        const msg = err.status === 0
          ? 'Content server not reachable. Is it running? (restart dev server)'
          : `Save failed: ${err.status} ${err.statusText}`;
        throw new Error(msg);
      })
    );
  }

  reload(assetPath: string): void {
    const sig = this.cache.get(assetPath);
    if (sig) {
      this.cache.delete(assetPath);
      this.fetch(assetPath, sig);
    }
  }

  private fetch<T>(assetPath: string, sig: WritableSignal<T[] | null>): void {
    // Reads go through the proxy too — content-server returns a plain array
    this.http.get<T[]>(API_BASE + assetPath).pipe(
      catchError((err: HttpErrorResponse) => of(err.status === 404 ? ([] as T[]) : null))
    ).subscribe(data => (sig as WritableSignal<T[] | null>).set(data));
  }
}

