import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">🏆 Leaderboard</h1>

      <!-- Tab -->
      <div class="flex gap-2 mb-6">
        @for (tab of tabs; track tab) {
          <button (click)="activeTab.set(tab)"
            [class]="activeTab() === tab ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border'"
            class="px-4 py-2 rounded-full text-sm font-semibold transition-all">
            {{ tab }}
          </button>
        }
      </div>

      @if (loading()) {
        <div class="space-y-3">
          @for (i of [1,2,3,4,5,6,7,8,9,10]; track i) {
            <div class="h-14 bg-gray-100 rounded-xl animate-pulse"></div>
          }
        </div>
      } @else {
        <div class="space-y-3">
          @for (entry of entries(); track entry.rank) {
            <div class="flex items-center gap-4 bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
              <span class="text-xl font-bold w-8 text-center"
                [class]="entry.rank === 1 ? 'text-yellow-500' : entry.rank === 2 ? 'text-gray-400' : entry.rank === 3 ? 'text-orange-400' : 'text-gray-500'">
                {{ entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : entry.rank }}
              </span>
              <span class="flex-1 font-medium text-gray-900">{{ entry.displayName }}</span>
              <span class="font-bold text-brand-600">{{ entry.cumulativeScore }}</span>
            </div>
          }
          @if (!entries().length) {
            <p class="text-center text-gray-500 py-12">No entries yet. Be the first!</p>
          }
        </div>
      }
    </div>
  `
})
export class LeaderboardComponent implements OnInit {
  private http = inject(HttpClient);

  readonly tabs      = ['Global', 'Weekly'];
  readonly activeTab = signal('Global');
  readonly loading   = signal(true);
  readonly entries   = signal<any[]>([]);

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.loading.set(true);
    const path = this.activeTab() === 'Weekly' ? '/leaderboard/weekly' : '/leaderboard/global';
    this.http.get<any>(`${environment.apiUrl}${path}`).subscribe({
      next: (res) => { this.entries.set(res.top10 ?? []); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
