import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CodeBlock } from '../../../shared/components/code-block/code-block';
import { BookmarkBtn } from '../../../shared/components/bookmark-btn/bookmark-btn';
import { ProgressBar } from '../../../shared/components/progress-bar/progress-bar';
import { ProgressService } from '../../../core/services/progress.service';

interface PythonExercise {
  id: string;
  topic: string;
  type: 'output-based' | 'logic' | 'coding';
  difficulty: 'beginner' | 'intermediate';
  questionText: string;
  codeSnippet?: string;
  answer: string;
  explanation: string;
  annotatedCode?: string;
}

@Component({
  selector: 'app-python-exercise-list',
  standalone: true,
  imports: [CodeBlock, BookmarkBtn, ProgressBar],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 capitalize">
          {{ topic() }} Exercises
        </h1>
        <div class="flex gap-2">
          @for (f of filters; track f.value) {
            <button (click)="diffFilter.set(f.value)"
                    [class.bg-indigo-600]="diffFilter() === f.value"
                    [class.text-white]="diffFilter() === f.value"
                    [class.bg-gray-100]="diffFilter() !== f.value"
                    [class.dark:bg-gray-800]="diffFilter() !== f.value"
                    class="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
                    [attr.aria-label]="'Filter ' + f.label">
              {{ f.label }}
            </button>
          }
        </div>
      </div>

      <!-- Sticky progress -->
      <div class="sticky top-14 z-10 bg-white dark:bg-gray-950 pt-1 pb-2">
        <app-progress-bar
          [attempted]="progressData().attempted"
          [total]="progressData().total"
          [percentage]="progressData().percentage">
        </app-progress-bar>
      </div>

      @if (loading()) {
        <div class="text-center py-12 text-gray-500 dark:text-gray-400">Loading exercises…</div>
      }

      @for (ex of visibleExercises(); track ex.id) {
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1">
              <div class="flex flex-wrap gap-1.5 mb-2">
                <span class="text-xs px-2 py-0.5 rounded-full border"
                      [class]="typeClass(ex.type)">
                  {{ typeLabel(ex.type) }}
                </span>
                <span class="text-xs px-2 py-0.5 rounded-full border"
                      [class]="diffClass(ex.difficulty)">
                  {{ ex.difficulty }}
                </span>
              </div>
              <p class="text-sm text-gray-800 dark:text-gray-200">{{ ex.questionText }}</p>
            </div>
            <app-bookmark-btn type="python-exercise"
                              [itemId]="ex.id"
                              [title]="ex.questionText.slice(0, 60)">
            </app-bookmark-btn>
          </div>

          <!-- Code snippet for output-based questions -->
          @if (ex.codeSnippet) {
            <app-code-block language="python" [code]="ex.codeSnippet"></app-code-block>
          }

          @if (!revealed().has(ex.id)) {
            <button (click)="reveal(ex)"
                    class="w-full py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                    aria-label="Show solution">
              Show Solution
            </button>
          } @else {
            @if (ex.annotatedCode) {
              <app-code-block language="python" [code]="ex.annotatedCode"></app-code-block>
            } @else {
              <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm font-mono text-green-800 dark:text-green-300">
                Output: {{ ex.answer }}
              </div>
            }
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">💡 {{ ex.explanation }}</p>
          }
        </div>
      }

      @if (allRevealed() && visibleExercises().length > 0) {
        <div class="text-center py-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
          <span class="text-indigo-700 dark:text-indigo-300 font-medium">
            🎉 You completed {{ visibleExercises().length }}/{{ visibleExercises().length }} exercises in this topic!
          </span>
        </div>
      }
    </div>
  `,
})
export class PythonExerciseList implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private progressService = inject(ProgressService);

  protected loading = signal(true);
  protected exercises = signal<PythonExercise[]>([]);
  protected revealed = signal(new Set<string>());
  protected diffFilter = signal<'all' | 'beginner' | 'intermediate'>('all');
  private topicKey = '';

  protected filters = [
    { label: 'All', value: 'all' as const },
    { label: 'Beginner', value: 'beginner' as const },
    { label: 'Intermediate', value: 'intermediate' as const },
  ];

  protected topic = signal('');

  protected progressData() {
    return this.progressService.getCategoryProgress('python', this.topicKey)();
  }

  protected visibleExercises() {
    const f = this.diffFilter();
    return f === 'all' ? this.exercises() : this.exercises().filter(e => e.difficulty === f);
  }

  protected allRevealed() {
    const visible = this.visibleExercises();
    return visible.length > 0 && visible.every(e => this.revealed().has(e.id));
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.topicKey = params.get('topic') ?? '';
      this.topic.set(this.topicKey.replace(/-/g, ' '));
      this.load();
    });
  }

  private load(): void {
    this.loading.set(true);
    this.http.get<PythonExercise[]>(`assets/content/python-exercises/${this.topicKey}.json`).subscribe({
      next: (exercises) => {
        this.exercises.set(exercises);
        this.progressService.updateTotal('python', this.topicKey, exercises.length);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected reveal(ex: PythonExercise): void {
    const next = new Set(this.revealed());
    next.add(ex.id);
    this.revealed.set(next);
    this.progressService.recordAttempt('python', this.topicKey, ex.id);
  }

  protected typeLabel(type: string): string {
    const map: Record<string, string> = {
      'output-based': 'Output', 'logic': 'Logic', 'coding': 'Coding',
    };
    return map[type] ?? type;
  }

  protected typeClass(type: string): string {
    const map: Record<string, string> = {
      'output-based': 'border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-400',
      'logic': 'border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-400',
      'coding': 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-400',
    };
    return map[type] ?? '';
  }

  protected diffClass(d: string): string {
    return d === 'beginner'
      ? 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400'
      : 'border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-400';
  }
}
