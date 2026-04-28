import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CodeBlock } from '../../../shared/components/code-block/code-block';
import { BookmarkBtn } from '../../../shared/components/bookmark-btn/bookmark-btn';
import { ProgressBar } from '../../../shared/components/progress-bar/progress-bar';
import { ProgressService } from '../../../core/services/progress.service';

interface SqlQuestion {
  id: string;
  category: string;
  questionText: string;
  answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isPreviousYear: boolean;
  year?: number;
  marks?: number;
}

@Component({
  selector: 'app-sql-question-list',
  standalone: true,
  imports: [CodeBlock, BookmarkBtn, ProgressBar],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 capitalize">
          {{ categoryLabel() }}
        </h1>
        <button (click)="pyqOnly.set(!pyqOnly())"
                [class.bg-amber-500]="pyqOnly()"
                [class.text-white]="pyqOnly()"
                [class.bg-gray-100]="!pyqOnly()"
                [class.dark:bg-gray-800]="!pyqOnly()"
                class="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
                aria-label="Toggle Previous Year filter">
          {{ pyqOnly() ? '✓ PYQ Only' : 'PYQ Only' }}
        </button>
      </div>

      <!-- Sticky progress bar -->
      <div class="sticky top-14 z-10 bg-white dark:bg-gray-950 pt-1 pb-2">
        <app-progress-bar
          [attempted]="progressData().attempted"
          [total]="progressData().total"
          [percentage]="progressData().percentage">
        </app-progress-bar>
      </div>

      @if (loading()) {
        <div class="text-center py-12 text-gray-500 dark:text-gray-400">Loading questions…</div>
      }

      @for (q of visibleQuestions(); track q.id) {
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <!-- Header -->
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1">
              <div class="flex flex-wrap gap-1.5 mb-2">
                <span class="text-xs px-2 py-0.5 rounded-full border"
                      [class]="difficultyClass(q.difficulty)">
                  {{ q.difficulty }}
                </span>
                @if (q.isPreviousYear) {
                  <span class="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                    CBSE {{ q.year }}{{ q.marks ? ' · ' + q.marks + ' marks' : '' }}
                  </span>
                }
              </div>
              <p class="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{{ q.questionText }}</p>
            </div>
            <app-bookmark-btn type="sql-question"
                              [itemId]="q.id"
                              [title]="q.questionText.slice(0, 60)">
            </app-bookmark-btn>
          </div>

          <!-- Show Answer toggle -->
          @if (!revealed().has(q.id)) {
            <button (click)="reveal(q)"
                    class="w-full py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                    aria-label="Show answer">
              Show Answer
            </button>
          } @else {
            <app-code-block language="sql" [code]="q.answer"></app-code-block>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">📖 {{ q.explanation }}</p>
          }
        </div>
      }

      @if (visibleQuestions().length === 0 && !loading()) {
        <div class="text-center py-8 text-gray-400 dark:text-gray-500">No questions found.</div>
      }
    </div>
  `,
})
export class SqlQuestionList implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private progressService = inject(ProgressService);

  protected loading = signal(true);
  protected questions = signal<SqlQuestion[]>([]);
  protected revealed = signal(new Set<string>());
  protected pyqOnly = signal(false);

  protected visibleQuestions = computed(() => {
    const pyqOnly = this.pyqOnly();
    return pyqOnly ? this.questions().filter(q => q.isPreviousYear) : this.questions();
  });
  private category = '';

  protected categoryLabel() {
    return this.category.replace(/-/g, ' ');
  }

  protected progressData() {
    return this.progressService.getCategoryProgress('sql', this.category)();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.category = params.get('category') ?? '';
      this.load();
    });
  }

  private load(): void {
    this.loading.set(true);
    this.http.get<SqlQuestion[]>(`assets/content/sql-questions/${this.category}.json`).subscribe({
      next: (qs) => {
        this.questions.set(qs);
        this.progressService.updateTotal('sql', this.category, qs.length);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected reveal(q: SqlQuestion): void {
    const next = new Set(this.revealed());
    next.add(q.id);
    this.revealed.set(next);
    this.progressService.recordAttempt('sql', this.category, q.id);
  }

  protected difficultyClass(d: string): string {
    const map: Record<string, string> = {
      easy: 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-400',
      medium: 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400',
      hard: 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400',
    };
    return map[d] ?? '';
  }
}
