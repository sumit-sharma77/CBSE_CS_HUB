import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProgressBar } from '../../../shared/components/progress-bar/progress-bar';
import { ProgressService } from '../../../core/services/progress.service';
import { Card } from '../../../shared/components/card/card';

interface SqlQuestion {
  id: string;
  category: string;
  isPreviousYear: boolean;
}

const CATEGORIES = [
  { key: 'select', label: 'SELECT Queries', icon: '📋' },
  { key: 'where', label: 'WHERE Clause', icon: '🔍' },
  { key: 'order-by', label: 'ORDER BY', icon: '↕️' },
  { key: 'group-by', label: 'GROUP BY & HAVING', icon: '📊' },
  { key: 'aggregate', label: 'Aggregate Functions', icon: '∑' },
  { key: 'joins', label: 'JOINs', icon: '🔗' },
  { key: 'keys-constraints', label: 'Keys & Constraints', icon: '🔑' },
];

@Component({
  selector: 'app-sql-category-list',
  standalone: true,
  imports: [ProgressBar],
  template: `
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">SQL Practice</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">7 categories · Practice with previous year questions</p>

      <div class="space-y-3">
        @for (cat of categories; track cat.key) {
          <div (click)="openCategory(cat.key)"
               class="cursor-pointer"
               role="button"
               [attr.aria-label]="'Open ' + cat.label + ' category'">
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl">{{ cat.icon }}</span>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ cat.label }}</h3>
                    @if (hasPYQ(cat.key)) {
                      <span class="text-xs px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-medium">
                        PYQ
                      </span>
                    }
                  </div>
                </div>
              </div>
              <app-progress-bar
                [attempted]="getProgress(cat.key).attempted"
                [total]="getProgress(cat.key).total"
                [percentage]="getProgress(cat.key).percentage">
              </app-progress-bar>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class SqlCategoryList implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private progressService = inject(ProgressService);

  protected categories = CATEGORIES;
  private pyqCategories = new Set<string>();

  ngOnInit(): void {
    // Pre-load categories to detect PYQ presence
    CATEGORIES.forEach(cat => {
      this.http.get<SqlQuestion[]>(`assets/content/sql-questions/${cat.key}.json`).subscribe({
        next: (questions) => {
          if (questions.some(q => q.isPreviousYear)) {
            this.pyqCategories.add(cat.key);
          }
          this.progressService.updateTotal('sql', cat.key, questions.length);
        },
      });
    });
  }

  protected hasPYQ(category: string): boolean {
    return this.pyqCategories.has(category);
  }

  protected getProgress(category: string) {
    return this.progressService.getCategoryProgress('sql', category)();
  }

  protected openCategory(category: string): void {
    this.router.navigate(['/sql', category]);
  }
}
