import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProgressBar } from '../../../shared/components/progress-bar/progress-bar';
import { ProgressService } from '../../../core/services/progress.service';

const TOPICS = [
  { key: 'variables', label: 'Variables & Types', icon: '📌' },
  { key: 'conditions', label: 'Conditions (if/elif/else)', icon: '🔀' },
  { key: 'loops', label: 'Loops (for/while)', icon: '🔁' },
  { key: 'functions', label: 'Functions', icon: '⚙️' },
  { key: 'lists', label: 'Lists', icon: '📋' },
  { key: 'strings', label: 'Strings', icon: '🔤' },
  { key: 'dictionaries', label: 'Dictionaries', icon: '📖' },
  { key: 'mixed', label: 'Mixed Practice', icon: '🎯' },
];

@Component({
  selector: 'app-python-topic-list',
  standalone: true,
  imports: [ProgressBar],
  template: `
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Python Practice</h1>

      <!-- Difficulty filter -->
      <div class="flex gap-2 flex-wrap">
        @for (f of filters; track f.value) {
          <button (click)="activeFilter.set(f.value)"
                  [class.bg-indigo-600]="activeFilter() === f.value"
                  [class.text-white]="activeFilter() === f.value"
                  [class.bg-gray-100]="activeFilter() !== f.value"
                  [class.dark:bg-gray-800]="activeFilter() !== f.value"
                  [class.text-gray-600]="activeFilter() !== f.value"
                  [class.dark:text-gray-300]="activeFilter() !== f.value"
                  class="text-sm px-4 py-1.5 rounded-full font-medium transition-colors"
                  [attr.aria-label]="'Filter by ' + f.label">
            {{ f.label }}
          </button>
        }
      </div>

      <div class="space-y-3">
        @for (topic of topics; track topic.key) {
          <div (click)="openTopic(topic.key)"
               class="cursor-pointer"
               role="button"
               [attr.aria-label]="'Open topic: ' + topic.label">
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl">{{ topic.icon }}</span>
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 flex-1">{{ topic.label }}</h3>
              </div>
              <app-progress-bar
                [attempted]="getProgress(topic.key).attempted"
                [total]="getProgress(topic.key).total"
                [percentage]="getProgress(topic.key).percentage">
              </app-progress-bar>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class PythonTopicList implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private progressService = inject(ProgressService);

  protected topics = TOPICS;
  protected activeFilter = signal<'all' | 'beginner' | 'intermediate'>('all');
  protected filters = [
    { label: 'All', value: 'all' as const },
    { label: 'Beginner', value: 'beginner' as const },
    { label: 'Intermediate', value: 'intermediate' as const },
  ];

  ngOnInit(): void {
    TOPICS.forEach(t => {
      this.http.get<{ difficulty: string }[]>(`assets/content/python-exercises/${t.key}.json`).subscribe({
        next: (exercises) => {
          this.progressService.updateTotal('python', t.key, exercises.length);
        },
      });
    });
  }

  protected getProgress(topic: string) {
    return this.progressService.getCategoryProgress('python', topic)();
  }

  protected openTopic(topic: string): void {
    this.router.navigate(['/python', topic], {
      queryParams: this.activeFilter() !== 'all' ? { diff: this.activeFilter() } : {},
    });
  }
}
