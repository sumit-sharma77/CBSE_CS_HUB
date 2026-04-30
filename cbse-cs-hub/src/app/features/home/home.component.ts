import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-brand-50 to-white">

      <!-- Hero -->
      <section class="max-w-5xl mx-auto px-4 pt-24 pb-16 text-center">
        <div class="inline-block bg-brand-100 text-brand-700 text-sm font-semibold px-3 py-1 rounded-full mb-6">
          CBSE Class 11 &amp; 12 Computer Science
        </div>
        <h1 class="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Master Computer Science<br>
          <span class="text-brand-600">with Adaptive Practice</span>
        </h1>
        <p class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          MCQ practice tests designed for CBSE board exams. Instant scoring,
          topic-wise analysis, and national leaderboards to keep you motivated.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          @if (authService.currentUser()) {
            <a routerLink="/practice"
               class="px-8 py-4 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors text-lg shadow-lg">
              Start Practicing →
            </a>
          } @else {
            <a routerLink="/register"
               class="px-8 py-4 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors text-lg shadow-lg">
              Get Started Free →
            </a>
            <a routerLink="/login"
               class="px-8 py-4 bg-white text-brand-600 font-semibold rounded-xl border-2 border-brand-200 hover:border-brand-400 transition-colors text-lg">
              Login
            </a>
          }
        </div>
      </section>

      <!-- Features -->
      <section class="max-w-5xl mx-auto px-4 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="text-3xl mb-3">⚡</div>
          <h3 class="font-bold text-gray-900 mb-2">Adaptive Tests</h3>
          <p class="text-gray-600 text-sm">40/40/20 difficulty distribution with negative marking — just like the real board exam.</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="text-3xl mb-3">🏆</div>
          <h3 class="font-bold text-gray-900 mb-2">Live Leaderboard</h3>
          <p class="text-gray-600 text-sm">Compete with students nationwide. Real-time rankings updated after every test.</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="text-3xl mb-3">📊</div>
          <h3 class="font-bold text-gray-900 mb-2">Detailed Analytics</h3>
          <p class="text-gray-600 text-sm">Percentile rank, topic scores, streak badges — track your progress every step.</p>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent {
  readonly authService = inject(AuthService);
}
