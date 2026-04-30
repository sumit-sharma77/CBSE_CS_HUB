import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-test-runner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="text-sm text-gray-500">
          Question {{ currentIdx() + 1 }} / {{ questions().length }}
        </div>
        <div class="font-mono text-lg font-bold" [class.text-red-500]="timeLeft() < 60">
          {{ formatTime(timeLeft()) }}
        </div>
      </div>

      <!-- Progress bar -->
      <div class="w-full h-2 bg-gray-200 rounded-full mb-8">
        <div class="h-2 bg-brand-500 rounded-full transition-all"
          [style.width.%]="questions().length ? (currentIdx() + 1) / questions().length * 100 : 0"></div>
      </div>

      @if (currentQuestion(); as q) {
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <p class="text-gray-900 text-lg font-medium mb-6">{{ q.questionText }}</p>
          <div class="space-y-3">
            @for (opt of parseOptions(q.optionsJson); track opt.id) {
              <button (click)="selectAnswer(q.questionId, opt.id)"
                class="w-full text-left px-5 py-4 rounded-xl border-2 transition-all"
                [class]="answers().get(q.questionId) === opt.id ? 'border-brand-500 bg-brand-50 font-semibold' : 'border-gray-200 hover:border-brand-300'">
                <span class="font-mono text-gray-500 mr-3">{{ opt.id }}.</span>{{ opt.text }}
              </button>
            }
          </div>
        </div>

        <div class="flex gap-3 justify-between">
          <button (click)="prev()" [disabled]="currentIdx() === 0"
            class="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors">
            ← Prev
          </button>
          @if (currentIdx() < questions().length - 1) {
            <button (click)="next()"
              class="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors">
              Next →
            </button>
          } @else {
            <button (click)="submit()" [disabled]="submitting()"
              class="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors">
              @if (submitting()) { Submitting... } @else { Submit Test ✓ }
            </button>
          }
        </div>
      }
    </div>
  `
})
export class TestRunnerComponent implements OnInit, OnDestroy {
  private http   = inject(HttpClient);
  private route  = inject(ActivatedRoute);
  private router = inject(Router);

  readonly questions  = signal<any[]>([]);
  readonly currentIdx = signal(0);
  readonly answers    = signal<Map<string, string>>(new Map());
  readonly timeLeft   = signal(0);
  readonly submitting = signal(false);

  private sessionId = '';
  private timer?: ReturnType<typeof setInterval>;

  get currentQuestion() {
    return () => this.questions()[this.currentIdx()] ?? null;
  }

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.paramMap.get('sessionId')!;
    this.http.get<any>(`${environment.apiUrl}/tests/sessions/${this.sessionId}`).subscribe({
      next: (session) => {
        this.timeLeft.set(session.remainingSeconds);
        // Load question texts — questions API
        this.http.get<any[]>(`${environment.apiUrl}/questions?ids=${session.questionIds.join(',')}`).subscribe({
          next: (qs) => this.questions.set(qs),
          error: () => {}
        });
        this.startTimer();
      }
    });
  }

  ngOnDestroy(): void { clearInterval(this.timer); }

  private startTimer(): void {
    this.timer = setInterval(() => {
      this.timeLeft.update(t => {
        if (t <= 1) { clearInterval(this.timer); this.submit(); return 0; }
        return t - 1;
      });
    }, 1000);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  parseOptions(json: string): { id: string; text: string }[] {
    try { return JSON.parse(json); } catch { return []; }
  }

  selectAnswer(questionId: string, optionId: string): void {
    this.answers.update(m => { const n = new Map(m); n.set(questionId, optionId); return n; });
  }

  prev(): void { this.currentIdx.update(i => Math.max(0, i - 1)); }
  next(): void { this.currentIdx.update(i => Math.min(this.questions().length - 1, i + 1)); }

  submit(): void {
    if (this.submitting()) return;
    clearInterval(this.timer);
    this.submitting.set(true);
    const answersObj = Object.fromEntries(this.answers());
    this.http.post<any>(`${environment.apiUrl}/tests/sessions/${this.sessionId}/submit`,
      { answers: answersObj }).subscribe({
      next: () => this.router.navigate(['/practice/result', this.sessionId]),
      error: () => this.submitting.set(false)
    });
  }
}
