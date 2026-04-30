import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-test-result',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-12">
      @if (result()) {
        <div class="text-center mb-10">
          <div class="text-6xl mb-4">{{ scoreEmoji() }}</div>
          <h1 class="text-3xl font-extrabold text-gray-900 mb-2">
            {{ result()!.rawScore }} / {{ result()!.maxScore }}
          </h1>
          <p class="text-gray-600">{{ result()!.correctCount }} correct · {{ result()!.incorrectCount }} wrong · {{ result()!.skippedCount }} skipped</p>
          @if (result()!.percentileRank !== null) {
            <p class="text-brand-600 font-semibold mt-2">Top {{ 100 - result()!.percentileRank }}% nationally</p>
          }
        </div>

        <!-- Stats grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div class="bg-green-50 rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-green-700">{{ result()!.correctCount }}</div>
            <div class="text-xs text-green-600">Correct</div>
          </div>
          <div class="bg-red-50 rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-red-700">{{ result()!.incorrectCount }}</div>
            <div class="text-xs text-red-600">Wrong</div>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-gray-700">{{ result()!.skippedCount }}</div>
            <div class="text-xs text-gray-600">Skipped</div>
          </div>
          <div class="bg-brand-50 rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-brand-700">{{ result()!.timeTakenSeconds }}s</div>
            <div class="text-xs text-brand-600">Time</div>
          </div>
        </div>

        <!-- Question breakdown -->
        <div class="space-y-4">
          @for (q of result()!.questions; track q.questionId) {
            <div class="bg-white rounded-xl p-5 border"
              [class.border-green-200]="q.isCorrect"
              [class.border-red-200]="!q.isCorrect && q.selectedOptionId"
              [class.border-gray-200]="!q.isCorrect && !q.selectedOptionId">
              <p class="text-sm text-gray-800 mb-2">{{ q.questionText }}</p>
              <p class="text-xs">
                <span class="text-gray-500">Your answer: </span>
                <span [class]="q.isCorrect ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                  {{ q.selectedOptionId ?? 'Skipped' }}
                </span>
                @if (!q.isCorrect) {
                  <span class="text-gray-500"> · Correct: </span>
                  <span class="text-green-600 font-semibold">{{ q.correctOptionId }}</span>
                }
              </p>
            </div>
          }
        </div>

        <div class="flex gap-4 mt-10 justify-center">
          <a routerLink="/practice" class="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors">
            New Test
          </a>
          <a routerLink="/leaderboard" class="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            Leaderboard
          </a>
        </div>
      } @else {
        <div class="flex justify-center pt-24"><div class="animate-spin text-4xl">⟳</div></div>
      }
    </div>
  `
})
export class TestResultComponent implements OnInit {
  private http  = inject(HttpClient);
  private route = inject(ActivatedRoute);

  readonly result = signal<any>(null);

  get scoreEmoji() {
    return () => {
      const r = this.result();
      if (!r) return '';
      const pct = r.rawScore / r.maxScore;
      if (pct >= 0.9) return '🎯';
      if (pct >= 0.7) return '🌟';
      if (pct >= 0.5) return '👍';
      return '📚';
    };
  }

  ngOnInit(): void {
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    // Result may already be POSTed; try to get from attempt history
    this.http.get<any>(`${environment.apiUrl}/tests/sessions/${sessionId}/result`).subscribe({
      next: r => this.result.set(r),
      error: () => {} // silently handle if endpoint varies
    });
  }
}
