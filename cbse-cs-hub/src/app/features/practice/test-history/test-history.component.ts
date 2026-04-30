import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-test-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Test History</h1>
        <a routerLink="/practice" class="text-sm text-brand-600 font-semibold hover:underline">New Test →</a>
      </div>

      @if (loading()) {
        <div class="space-y-3">@for (i of [1,2,3,4,5]; track i) { <div class="h-20 bg-gray-100 rounded-xl animate-pulse"></div> }</div>
      } @else if (!attempts().length) {
        <p class="text-gray-500 text-center py-16">No tests taken yet. <a routerLink="/practice" class="text-brand-600 hover:underline">Start practicing!</a></p>
      } @else {
        <div class="space-y-4">
          @for (attempt of attempts(); track attempt.id) {
            <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div class="text-2xl">{{ attempt.rawScore >= attempt.maxScore * 0.9 ? '🎯' : attempt.rawScore >= attempt.maxScore * 0.7 ? '🌟' : '📚' }}</div>
              <div class="flex-1">
                <div class="font-semibold text-gray-900">{{ attempt.mode }} · {{ attempt.questionCount }} questions</div>
                <div class="text-sm text-gray-500">{{ attempt.correctCount }} correct · {{ attempt.incorrectCount }} wrong · {{ attempt.skippedCount }} skipped</div>
              </div>
              <div class="text-right">
                <div class="font-bold text-brand-600 text-lg">{{ attempt.rawScore }}/{{ attempt.maxScore }}</div>
                @if (attempt.percentileRank) {
                  <div class="text-xs text-gray-500">Top {{ 100 - attempt.percentileRank | number:'1.0-0' }}%</div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class TestHistoryComponent implements OnInit {
  private http = inject(HttpClient);

  readonly loading  = signal(true);
  readonly attempts = signal<any[]>([]);

  ngOnInit(): void {
    this.http.get<any>(`${environment.apiUrl}/tests/history`).subscribe({
      next: (page) => { this.attempts.set(page.content ?? []); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
