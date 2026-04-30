import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-10">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">⚙️ Admin Dashboard</h1>

      @if (stats()) {
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          @for (card of statCards(); track card.label) {
            <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
              <div class="text-3xl font-extrabold text-brand-600">{{ card.value }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ card.label }}</div>
            </div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          @for (i of [1,2,3,4,5,6,7]; track i) {
            <div class="h-20 bg-gray-100 rounded-2xl animate-pulse"></div>
          }
        </div>
      }

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a routerLink="/admin/users"
           class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-brand-300 transition-all">
          <div class="text-2xl mb-2">👥</div>
          <h2 class="font-bold text-gray-900">Users</h2>
          <p class="text-sm text-gray-500 mt-1">View, manage roles, delete users</p>
        </a>
        <a routerLink="/admin/subscriptions"
           class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-brand-300 transition-all">
          <div class="text-2xl mb-2">🎟️</div>
          <h2 class="font-bold text-gray-900">Subscriptions</h2>
          <p class="text-sm text-gray-500 mt-1">Grant/revoke plans without Razorpay</p>
        </a>
        <a routerLink="/admin/content"
           class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-brand-300 transition-all">
          <div class="text-2xl mb-2">📚</div>
          <h2 class="font-bold text-gray-900">Content</h2>
          <p class="text-sm text-gray-500 mt-1">Add/edit topics and questions</p>
        </a>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  readonly stats = signal<any>(null);

  get statCards() {
    return () => {
      const s = this.stats();
      if (!s) return [];
      return [
        { label: 'Users',         value: s.totalUsers },
        { label: 'Topics',        value: s.totalTopics },
        { label: 'Questions',     value: s.totalQuestions },
        { label: 'Test Sessions', value: s.totalTestSessions },
        { label: 'Attempts',      value: s.totalAttempts },
        { label: 'Plans',         value: s.totalPlans },
      ];
    };
  }

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl.replace('/v1', '')}/admin/stats`).subscribe({
      next: s => this.stats.set(s),
      error: () => {}
    });
  }
}
