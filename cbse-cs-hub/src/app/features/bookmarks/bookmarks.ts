import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BookmarkService } from '../../core/services/bookmark.service';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [],
  template: `
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Bookmarks</h1>

      @if (bookmarkService.bookmarks().length === 0) {
        <div class="text-center py-16 text-gray-400 dark:text-gray-500 space-y-2">
          <p class="text-4xl">🔖</p>
          <p class="font-medium">No bookmarks yet</p>
          <p class="text-sm">Tap the bookmark icon on any chapter, SQL question, or Python exercise to save it here.</p>
        </div>
      }

      @for (group of groupedBookmarks(); track group.type) {
        <section class="space-y-2">
          <h2 class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
            {{ groupLabel(group.type) }}
          </h2>
          @for (bm of group.items; track bm.itemId) {
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between gap-3">
              <button (click)="navigate(bm)"
                      class="flex-1 text-left"
                      [attr.aria-label]="'Open bookmarked item: ' + bm.title">
                <p class="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2">{{ bm.title }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {{ formatDate(bm.addedAt) }}
                </p>
              </button>
              <button (click)="remove(bm)"
                      aria-label="Remove bookmark"
                      class="p-1.5 text-amber-500 hover:text-gray-400 dark:hover:text-gray-500 transition-colors shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2H5z"/>
                </svg>
              </button>
            </div>
          }
        </section>
      }
    </div>
  `,
})
export class Bookmarks {
  protected bookmarkService = inject(BookmarkService);
  private router = inject(Router);

  protected groupedBookmarks() {
    const types = ['chapter', 'sql-question', 'python-exercise'] as const;
    return types
      .map(type => ({
        type,
        items: this.bookmarkService.bookmarks().filter(b => b.type === type),
      }))
      .filter(g => g.items.length > 0);
  }

  protected groupLabel(type: string): string {
    const labels: Record<string, string> = {
      chapter: '📖 Study Notes Chapters',
      'sql-question': '🗄️ SQL Questions',
      'python-exercise': '🐍 Python Exercises',
    };
    return labels[type] ?? type;
  }

  protected navigate(bm: { type: string; itemId: string }): void {
    const routes: Record<string, string> = {
      chapter: `/study-notes/${bm.itemId}`,
      'sql-question': '/sql',
      'python-exercise': '/python',
    };
    this.router.navigateByUrl(routes[bm.type] ?? '/');
  }

  protected remove(bm: { type: 'chapter' | 'sql-question' | 'python-exercise'; itemId: string; title: string }): void {
    this.bookmarkService.toggle(bm.type, bm.itemId, bm.title);
  }

  protected formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
