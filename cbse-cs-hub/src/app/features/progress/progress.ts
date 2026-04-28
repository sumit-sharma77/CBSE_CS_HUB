import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressService } from '../../core/services/progress.service';
import { BookmarkService } from '../../core/services/bookmark.service';
import { RecentlyViewedService } from '../../core/services/recently-viewed.service';
import { StorageService } from '../../core/services/storage.service';
import { ProgressBar } from '../../shared/components/progress-bar/progress-bar';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

const SQL_CATEGORIES = [
  { key: 'select', label: 'SELECT Queries' },
  { key: 'where', label: 'WHERE Clause' },
  { key: 'order-by', label: 'ORDER BY' },
  { key: 'group-by', label: 'GROUP BY & HAVING' },
  { key: 'aggregate', label: 'Aggregate Functions' },
  { key: 'joins', label: 'JOINs' },
  { key: 'keys-constraints', label: 'Keys & Constraints' },
];

const PYTHON_TOPICS = [
  { key: 'variables', label: 'Variables & Types' },
  { key: 'conditions', label: 'Conditions' },
  { key: 'loops', label: 'Loops' },
  { key: 'functions', label: 'Functions' },
  { key: 'lists', label: 'Lists' },
  { key: 'strings', label: 'Strings' },
  { key: 'dictionaries', label: 'Dictionaries' },
  { key: 'mixed', label: 'Mixed Practice' },
];

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [ProgressBar, TimeAgoPipe],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">My Progress</h1>

      <!-- SQL Section -->
      <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          🗄️ SQL Practice
        </h2>
        @for (cat of sqlCategories; track cat.key) {
          <div class="space-y-1">
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ cat.label }}</p>
            <app-progress-bar
              [attempted]="getSqlProgress(cat.key).attempted"
              [total]="getSqlProgress(cat.key).total"
              [percentage]="getSqlProgress(cat.key).percentage">
            </app-progress-bar>
          </div>
        }
      </section>

      <!-- Python Section -->
      <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          🐍 Python Practice
        </h2>
        @for (t of pythonTopics; track t.key) {
          <div class="space-y-1">
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ t.label }}</p>
            <app-progress-bar
              [attempted]="getPythonProgress(t.key).attempted"
              [total]="getPythonProgress(t.key).total"
              [percentage]="getPythonProgress(t.key).percentage">
            </app-progress-bar>
          </div>
        }
      </section>

      <!-- Bookmarks summary -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <span class="text-gray-700 dark:text-gray-300 font-medium">🔖 Bookmarks</span>
        <span class="text-indigo-600 dark:text-indigo-400 font-bold text-lg">{{ bookmarkService.bookmarks().length }}</span>
      </div>

      <!-- Recently Viewed -->
      <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100">🕐 Recently Viewed</h2>
        @if (recentlyViewedService.entries().length === 0) {
          <p class="text-sm text-gray-400 dark:text-gray-500">Nothing viewed yet. Start exploring!</p>
        }
        @for (entry of recentlyViewedService.entries(); track entry.itemId) {
          <button (click)="navigate(entry.routePath)"
                  class="w-full flex items-start justify-between gap-3 py-2 border-t border-gray-100 dark:border-gray-700 first:border-0 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded px-1 transition-colors"
                  [attr.aria-label]="'Go to ' + entry.title">
            <div class="flex items-center gap-2">
              <span class="text-sm">{{ moduleIcon(entry.type) }}</span>
              <div>
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{{ entry.title }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500">{{ entry.visitedAt | timeAgo }}</p>
              </div>
            </div>
            <span class="text-xs text-indigo-500 dark:text-indigo-400 shrink-0">→</span>
          </button>
        }
      </section>

      <!-- Reset All Data -->
      @if (!resetConfirm) {
        <button (click)="resetConfirm = true"
                aria-label="Reset all data"
                class="w-full py-3 rounded-xl border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          Reset All Data
        </button>
      } @else {
        <div class="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-4 space-y-3">
          <p class="text-sm text-red-700 dark:text-red-300 font-medium">This will permanently delete:</p>
          <ul class="text-sm text-red-600 dark:text-red-400 list-disc pl-4 space-y-1">
            <li>All SQL practice progress</li>
            <li>All Python practice progress</li>
            <li>All bookmarks</li>
            <li>All personal notes</li>
            <li>Recently viewed history</li>
          </ul>
          <div class="flex gap-3">
            <button (click)="confirmReset()"
                    class="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                    aria-label="Confirm reset all data">
              Yes, Reset Everything
            </button>
            <button (click)="resetConfirm = false"
                    class="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
                    aria-label="Cancel reset">
              Cancel
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class Progress {
  protected progressService = inject(ProgressService);
  protected bookmarkService = inject(BookmarkService);
  protected recentlyViewedService = inject(RecentlyViewedService);
  private storageService = inject(StorageService);
  private router = inject(Router);

  protected sqlCategories = SQL_CATEGORIES;
  protected pythonTopics = PYTHON_TOPICS;
  protected resetConfirm = false;

  protected getSqlProgress(key: string) {
    return this.progressService.getCategoryProgress('sql', key)();
  }

  protected getPythonProgress(key: string) {
    return this.progressService.getCategoryProgress('python', key)();
  }

  protected navigate(path: string): void {
    this.router.navigateByUrl(path);
  }

  protected moduleIcon(type: string): string {
    const icons: Record<string, string> = {
      chapter: '📖', 'sql-question': '🗄️', 'python-exercise': '🐍',
    };
    return icons[type] ?? '📄';
  }

  protected confirmReset(): void {
    this.progressService.reset();
    this.bookmarkService.clear();
    this.recentlyViewedService.clear();
    this.storageService.remove('cbse-notes');
    this.resetConfirm = false;
    this.router.navigate(['/']);
  }
}
