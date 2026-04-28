import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService, SearchIndexEntry } from '../../core/services/search.service';
import { SearchBar } from '../../shared/components/search-bar/search-bar';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [SearchBar],
  template: `
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Search</h1>

      <app-search-bar placeholder="Search by title or tag…" (queryChange)="search($event)">
      </app-search-bar>

      @if (query() && results().length === 0 && !searching()) {
        <div class="text-center py-8 text-gray-400 dark:text-gray-500">
          No results for "{{ query() }}"
        </div>
      }

      @for (group of groupedResults(); track group.module) {
        <section class="space-y-2">
          <h2 class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
            {{ moduleLabel(group.module) }}
          </h2>
          @for (result of group.items; track result.id) {
            <div (click)="navigate(result)"
                 role="button"
                 [attr.aria-label]="'Open: ' + result.title"
                 class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 cursor-pointer hover:shadow-md transition-shadow">
              <p class="font-medium text-gray-900 dark:text-gray-100 text-sm">{{ result.title }}</p>
              <div class="flex flex-wrap gap-1 mt-1">
                @for (tag of result.tags.slice(0, 3); track tag) {
                  <span class="text-xs px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                    {{ tag }}
                  </span>
                }
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">{{ result.preview }}</p>
            </div>
          }
        </section>
      }
    </div>
  `,
})
export class SearchResults {
  private searchService = inject(SearchService);
  private router = inject(Router);

  protected query = signal('');
  protected results = signal<SearchIndexEntry[]>([]);
  protected searching = signal(false);

  protected groupedResults() {
    const modules = ['study-notes', 'sql', 'python'] as const;
    return modules
      .map(m => ({ module: m, items: this.results().filter(r => r.module === m) }))
      .filter(g => g.items.length > 0);
  }

  protected search(q: string): void {
    this.query.set(q);
    if (!q || q.length < 2) {
      this.results.set([]);
      return;
    }
    this.searching.set(true);
    this.searchService.search(q).subscribe({
      next: (results) => {
        this.results.set(results);
        this.searching.set(false);
      },
      error: () => this.searching.set(false),
    });
  }

  protected navigate(result: SearchIndexEntry): void {
    this.router.navigateByUrl(result.routePath);
  }

  protected moduleLabel(module: string): string {
    const labels: Record<string, string> = {
      'study-notes': '📖 Study Notes',
      sql: '🗄️ SQL Practice',
      python: '🐍 Python Practice',
    };
    return labels[module] ?? module;
  }
}
