import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { McqProgressService } from '../../../core/services/mcq-progress.service';

interface McqSetEntry {
  id: string;
  classLevel: 11 | 12;
  topic: string;
  description: string;
  icon: string;
  totalQuestions: number;
  tags: string[];
}

@Component({
  selector: 'app-mcq-category-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-6 pb-20 md:pb-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">MCQ Quiz</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          CBSE Previous Year Multiple Choice Questions · Class 11 &amp; 12
        </p>
      </div>

      <!-- Stats strip -->
      @if (totalAttempted() > 0) {
        <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 p-4 flex items-center gap-4">
          <span class="text-2xl">🏆</span>
          <div>
            <p class="font-semibold text-indigo-800 dark:text-indigo-200 text-sm">
              {{ totalCorrect() }} correct out of {{ totalAttempted() }} attempted
            </p>
            <p class="text-xs text-indigo-600 dark:text-indigo-400">across all quiz sets</p>
          </div>
          <div class="ml-auto text-right">
            <p class="text-xl font-bold text-indigo-700 dark:text-indigo-300">{{ overallPercent() }}%</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">accuracy</p>
          </div>
        </div>
      }

      @if (loading()) {
        <div class="space-y-3">
          @for (i of [1,2,3]; track i) {
            <div class="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          }
        </div>
      } @else {
        <!-- Class 12 -->
        <section class="space-y-3">
          <h2 class="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <span class="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-2 py-0.5 rounded-full">Class 12</span>
          </h2>
          @for (set of class12Sets(); track set.id) {
            <a [routerLink]="['/mcq', set.id]" class="block">
              <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer">
                <div class="flex items-start gap-3">
                  <span class="text-2xl mt-0.5">{{ set.icon }}</span>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h3 class="font-semibold text-gray-900 dark:text-gray-100 text-sm">{{ set.topic }}</h3>
                      @if (isCompleted(set.id)) {
                        <span class="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">✓ Completed</span>
                      } @else if (isStarted(set.id)) {
                        <span class="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">In Progress</span>
                      }
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ set.description }}</p>
                    <!-- Progress bar -->
                    <div class="mt-2 flex items-center gap-2">
                      <div class="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all"
                             [class]="getProgressBarClass(set.id)"
                             [style.width.%]="getSetPercent(set.id)"></div>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {{ getAnsweredCount(set.id) }}/{{ set.totalQuestions }}
                      </span>
                    </div>
                  </div>
                  <span class="text-indigo-400 dark:text-indigo-500 self-center text-lg ml-1">›</span>
                </div>
              </div>
            </a>
          }
        </section>

        <!-- Class 11 -->
        <section class="space-y-3">
          <h2 class="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <span class="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-bold px-2 py-0.5 rounded-full">Class 11</span>
          </h2>
          @for (set of class11Sets(); track set.id) {
            <a [routerLink]="['/mcq', set.id]" class="block">
              <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600 transition-all cursor-pointer">
                <div class="flex items-start gap-3">
                  <span class="text-2xl mt-0.5">{{ set.icon }}</span>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h3 class="font-semibold text-gray-900 dark:text-gray-100 text-sm">{{ set.topic }}</h3>
                      @if (isCompleted(set.id)) {
                        <span class="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">✓ Completed</span>
                      } @else if (isStarted(set.id)) {
                        <span class="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">In Progress</span>
                      }
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ set.description }}</p>
                    <div class="mt-2 flex items-center gap-2">
                      <div class="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all"
                             [class]="getProgressBarClass(set.id)"
                             [style.width.%]="getSetPercent(set.id)"></div>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {{ getAnsweredCount(set.id) }}/{{ set.totalQuestions }}
                      </span>
                    </div>
                  </div>
                  <span class="text-purple-400 dark:text-purple-500 self-center text-lg ml-1">›</span>
                </div>
              </div>
            </a>
          }
        </section>
      }
    </div>
  `,
})
export class McqCategoryList implements OnInit {
  private http = inject(HttpClient);
  private mcqProgress = inject(McqProgressService);

  protected allSets = signal<McqSetEntry[]>([]);
  protected loading = signal(true);

  protected class12Sets = signal<McqSetEntry[]>([]);
  protected class11Sets = signal<McqSetEntry[]>([]);

  protected totalAttempted = signal(0);
  protected totalCorrect = signal(0);
  protected overallPercent = signal(0);

  ngOnInit(): void {
    this.http.get<McqSetEntry[]>('/CBSE_CS_HUB/assets/content/mcq/mcq-index.json').subscribe({
      next: (sets) => {
        this.allSets.set(sets);
        this.class12Sets.set(sets.filter(s => s.classLevel === 12));
        this.class11Sets.set(sets.filter(s => s.classLevel === 11));
        this.loading.set(false);
        this.computeTotals(sets);
      },
      error: () => this.loading.set(false),
    });
  }

  private computeTotals(sets: McqSetEntry[]): void {
    const prog = this.mcqProgress.progress();
    let attempted = 0;
    let correct = 0;
    for (const set of sets) {
      const session = prog[set.id];
      if (session) {
        attempted += Object.keys(session.answers).length;
        correct += session.score;
      }
    }
    this.totalAttempted.set(attempted);
    this.totalCorrect.set(correct);
    this.overallPercent.set(attempted > 0 ? Math.round((correct / attempted) * 100) : 0);
  }

  protected getAnsweredCount(setId: string): number {
    const session = this.mcqProgress.getSession(setId);
    return session ? Object.keys(session.answers).length : 0;
  }

  protected getSetPercent(setId: string): number {
    const set = this.allSets().find(s => s.id === setId);
    if (!set || set.totalQuestions === 0) return 0;
    return Math.round((this.getAnsweredCount(setId) / set.totalQuestions) * 100);
  }

  protected isStarted(setId: string): boolean {
    return this.getAnsweredCount(setId) > 0;
  }

  protected isCompleted(setId: string): boolean {
    const session = this.mcqProgress.getSession(setId);
    return !!session?.completedAt;
  }

  protected getProgressBarClass(setId: string): string {
    return this.isCompleted(setId)
      ? 'bg-green-500'
      : 'bg-indigo-500';
  }
}
