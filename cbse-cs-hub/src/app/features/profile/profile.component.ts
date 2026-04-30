import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      @if (authService.currentUser(); as user) {
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 class="font-bold text-gray-900 text-lg mb-2">{{ user.displayName || 'Student' }}</h2>
          <p class="text-gray-500 text-sm">{{ user.email }}</p>
          <span class="inline-block mt-2 text-xs px-2 py-1 bg-brand-100 text-brand-700 rounded-full font-semibold">
            {{ user.role }}
          </span>
        </div>
      }

      @if (progress()) {
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <div class="text-3xl font-extrabold text-brand-600">{{ progress()!.testsTaken }}</div>
            <div class="text-sm text-gray-500 mt-1">Tests Taken</div>
          </div>
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <div class="text-3xl font-extrabold text-brand-600">#{{ progress()!.globalRank > 0 ? progress()!.globalRank : '—' }}</div>
            <div class="text-sm text-gray-500 mt-1">Global Rank</div>
          </div>
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <div class="text-3xl font-extrabold text-brand-600">{{ progress()!.globalScore }}</div>
            <div class="text-sm text-gray-500 mt-1">Total Score</div>
          </div>
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <div class="text-3xl font-extrabold text-brand-600">{{ progress()!.badgeCount }}</div>
            <div class="text-sm text-gray-500 mt-1">Badges</div>
          </div>
        </div>

        @if (progress()!.badges?.length) {
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 class="font-bold text-gray-900 mb-4">Badges</h3>
            <div class="flex flex-wrap gap-2">
              @for (badge of progress()!.badges; track badge) {
                <span class="text-xs px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full font-semibold border border-brand-200">
                  🏅 {{ badge }}
                </span>
              }
            </div>
          </div>
        }
      }
    </div>
  `
})
export class ProfileComponent implements OnInit {
  readonly authService = inject(AuthService);
  private http         = inject(HttpClient);

  readonly progress = signal<any>(null);

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}/users/me/progress`).subscribe({
      next: (p) => this.progress.set(p),
      error: () => {}
    });
  }
}
