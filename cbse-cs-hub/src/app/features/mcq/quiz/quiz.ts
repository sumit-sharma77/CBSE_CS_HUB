import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { McqProgressService } from '../../../core/services/mcq-progress.service';
import { RecentlyViewedService } from '../../../core/services/recently-viewed.service';

interface McqQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  year?: number;
  isPreviousYear: boolean;
}

interface McqSet {
  id: string;
  classLevel: 11 | 12;
  topic: string;
  description: string;
  questions: McqQuestion[];
}

@Component({
  selector: 'app-mcq-quiz',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-4 pb-24 md:pb-8">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <a routerLink="/mcq"
           class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
           aria-label="Back to MCQ list">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </a>
        <div class="flex-1 min-w-0">
          <h1 class="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">{{ title() }}</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Class {{ classLevel() }} ·
            @if (allAnswered()) {
              Quiz complete
            } @else {
              {{ answeredCount() }}/{{ questions().length }} answered
            }
          </p>
        </div>
      </div>

      @if (loading()) {
        <div class="space-y-3">
          @for (i of [1,2,3]; track i) {
            <div class="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          }
        </div>
      } @else {

        <!-- Sticky progress bar + score -->
        <div class="sticky top-[3.5rem] z-20 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm space-y-2">
          <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>{{ answeredCount() }}/{{ questions().length }} answered</span>
            @if (answeredCount() > 0) {
              <span class="font-semibold"
                    [class]="scoreColor()">
                {{ correctCount() }} correct ({{ scorePercent() }}%)
              </span>
            }
          </div>
          <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div class="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-500"
                 [style.width.%]="progressPercent()"></div>
          </div>
        </div>

        <!-- Result card (shown when all answered) -->
        @if (allAnswered()) {
          <div class="rounded-xl border-2 p-5 text-center space-y-2"
               [class]="resultCardClass()">
            <div class="text-4xl">{{ resultEmoji() }}</div>
            <p class="text-xl font-bold">{{ correctCount() }}/{{ questions().length }}</p>
            <p class="font-semibold text-lg">{{ resultLabel() }}</p>
            <p class="text-sm opacity-80">{{ scorePercent() }}% accuracy</p>
            <div class="flex gap-3 justify-center mt-3">
              <a routerLink="/mcq"
                 class="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                ← All Quizzes
              </a>
              <button (click)="retakeQuiz()"
                      class="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
                Retake Quiz
              </button>
            </div>
          </div>
        }

        <!-- Question cards -->
        @for (q of questions(); track q.id; let idx = $index) {
          <div class="bg-white dark:bg-gray-800 rounded-xl border transition-colors"
               [class]="questionCardBorderClass(q.id)">
            <div class="p-4 space-y-4">
              <!-- Question header -->
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                    Q{{ idx + 1 }}
                  </span>
                  @if (q.isPreviousYear && q.year) {
                    <span class="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
                      📋 {{ q.year }} Board
                    </span>
                  }
                </div>
                @if (isAnswered(q.id)) {
                  <span class="text-lg shrink-0">{{ isCorrect(q.id) ? '✅' : '❌' }}</span>
                }
              </div>

              <!-- Question text (supports multi-line with code) -->
              <div class="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-sans">{{ q.question }}</div>

              <!-- Options -->
              <div class="space-y-2">
                @for (option of q.options; track option; let optIdx = $index) {
                  <button
                    (click)="selectOption(q, optIdx)"
                    [disabled]="isAnswered(q.id)"
                    class="w-full text-left px-4 py-3 rounded-lg border text-sm transition-all"
                    [class]="getOptionClass(q, optIdx)"
                    [attr.aria-label]="'Option ' + (optIdx + 1) + ': ' + option">
                    <span class="font-semibold mr-2">{{ optionLabel(optIdx) }}.</span>{{ option }}
                  </button>
                }
              </div>

              <!-- Explanation (revealed after answering) -->
              @if (isAnswered(q.id)) {
                <div class="rounded-lg p-3 text-sm leading-relaxed"
                     [class]="explanationClass(q.id)">
                  <p class="font-semibold mb-1">💡 Explanation</p>
                  <p>{{ q.explanation }}</p>
                </div>
              }
            </div>
          </div>
        }

        <!-- Bottom CTA if not completed -->
        @if (!allAnswered() && answeredCount() > 0) {
          <p class="text-center text-sm text-gray-400 dark:text-gray-500 pb-2">
            {{ questions().length - answeredCount() }} question{{ questions().length - answeredCount() === 1 ? '' : 's' }} remaining
          </p>
        }
      }
    </div>
  `,
})
export class McqQuiz implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mcqProgress = inject(McqProgressService);
  private recentlyViewed = inject(RecentlyViewedService);

  protected setId = signal('');
  protected title = signal('');
  protected classLevel = signal<11 | 12>(12);
  protected questions = signal<McqQuestion[]>([]);
  protected loading = signal(true);

  /** questionId → selected option index */
  protected answers = signal<Record<string, number>>({});

  protected answeredCount = computed(() => Object.keys(this.answers()).length);

  protected correctCount = computed(() =>
    this.questions().filter(q => this.answers()[q.id] === q.correctIndex).length
  );

  protected allAnswered = computed(() =>
    this.questions().length > 0 && this.answeredCount() === this.questions().length
  );

  protected progressPercent = computed(() => {
    const total = this.questions().length;
    return total > 0 ? Math.round((this.answeredCount() / total) * 100) : 0;
  });

  protected scorePercent = computed(() => {
    const answered = this.answeredCount();
    return answered > 0 ? Math.round((this.correctCount() / answered) * 100) : 0;
  });

  protected scoreColor = computed(() => {
    const pct = this.scorePercent();
    if (pct >= 75) return 'text-green-600 dark:text-green-400';
    if (pct >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  });

  protected resultEmoji = computed(() => {
    const pct = this.scorePercent();
    if (pct >= 90) return '🏆';
    if (pct >= 75) return '🎉';
    if (pct >= 50) return '👍';
    return '📚';
  });

  protected resultLabel = computed(() => {
    const pct = this.scorePercent();
    if (pct >= 90) return 'Excellent! Outstanding performance!';
    if (pct >= 75) return 'Great job! Well done!';
    if (pct >= 50) return 'Good effort! Keep practising.';
    return 'Keep studying — you\'ll improve!';
  });

  protected resultCardClass = computed(() => {
    const pct = this.scorePercent();
    if (pct >= 75)
      return 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200';
    if (pct >= 50)
      return 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200';
    return 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200';
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('setId') ?? '';
    this.setId.set(id);

    this.http.get<McqSet>(`/CBSE_CS_HUB/assets/content/mcq/${id}.json`).subscribe({
      next: (set) => {
        this.title.set(set.topic);
        this.classLevel.set(set.classLevel);
        this.questions.set(set.questions);
        this.loading.set(false);

        // Restore saved answers
        const saved = this.mcqProgress.getSession(id);
        if (saved) {
          this.answers.set({ ...saved.answers });
        }

        this.recentlyViewed.track({
          itemId: `mcq-${id}`,
          title: set.topic,
          type: 'mcq',
          routePath: `/mcq/${id}`,
        });
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/mcq']);
      },
    });
  }

  protected selectOption(question: McqQuestion, optionIndex: number): void {
    if (this.isAnswered(question.id)) return;
    this.answers.update(a => ({ ...a, [question.id]: optionIndex }));
    this.mcqProgress.saveAnswer(this.setId(), question.id, optionIndex, question.correctIndex);

    // Mark completed when all answered
    if (this.allAnswered()) {
      this.mcqProgress.markCompleted(this.setId(), this.questions().length);
    }
  }

  protected retakeQuiz(): void {
    this.mcqProgress.resetSet(this.setId());
    this.answers.set({});
  }

  protected isAnswered(questionId: string): boolean {
    return this.answers()[questionId] !== undefined;
  }

  protected isCorrect(questionId: string): boolean {
    const q = this.questions().find(q => q.id === questionId);
    return q ? this.answers()[questionId] === q.correctIndex : false;
  }

  protected getOptionClass(question: McqQuestion, optionIndex: number): string {
    const answered = this.isAnswered(question.id);
    if (!answered) {
      return 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer';
    }
    if (optionIndex === question.correctIndex) {
      return 'border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 font-medium cursor-default';
    }
    if (optionIndex === this.answers()[question.id]) {
      return 'border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 cursor-default';
    }
    return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-500 opacity-60 cursor-default';
  }

  protected questionCardBorderClass(questionId: string): string {
    if (!this.isAnswered(questionId)) return 'border-gray-200 dark:border-gray-700';
    return this.isCorrect(questionId)
      ? 'border-green-300 dark:border-green-800'
      : 'border-red-300 dark:border-red-800';
  }

  protected explanationClass(questionId: string): string {
    return this.isCorrect(questionId)
      ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800';
  }

  protected optionLabel(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D
  }
}
