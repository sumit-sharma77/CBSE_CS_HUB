import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { SubscriptionService } from '../../../core/subscription/subscription.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 font-bold text-xl text-brand-700">
            <span class="text-2xl">🎓</span>
            <span>CBSE CS Hub</span>
          </a>

          <!-- Nav links (authenticated) -->
          @if (authService.currentUser()) {
            <div class="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
              <a routerLink="/practice" routerLinkActive="text-brand-700 font-semibold"
                 class="hover:text-brand-700 transition-colors">Practice</a>
              <a routerLink="/leaderboard" routerLinkActive="text-brand-700 font-semibold"
                 class="hover:text-brand-700 transition-colors">Leaderboard</a>
              <a routerLink="/plans" routerLinkActive="text-brand-700 font-semibold"
                 class="hover:text-brand-700 transition-colors">Plans</a>
              @if (authService.currentUser()?.role === 'ADMIN') {
                <a routerLink="/admin" routerLinkActive="text-brand-700 font-semibold"
                   class="hover:text-brand-700 transition-colors font-semibold text-brand-600">⚙️ Admin</a>
              }
            </div>

            <div class="flex items-center gap-3">
              <!-- Subscription badge -->
              @if (subscriptionService.currentPlan()) {
                <span class="text-xs px-2 py-1 rounded-full font-semibold"
                  [class]="subscriptionService.currentPlan()!.planName === 'Free' ? 'bg-gray-100 text-gray-600' : 'bg-brand-100 text-brand-700'">
                  {{ subscriptionService.currentPlan()!.planName }}
                </span>
              }
              <!-- User avatar + logout -->
              <a routerLink="/profile" class="text-sm text-gray-700 hover:text-brand-700">
                {{ authService.currentUser()!.displayName || authService.currentUser()!.email }}
              </a>
              <button (click)="logout()"
                class="text-sm text-gray-500 hover:text-red-600 transition-colors">
                Logout
              </button>
            </div>
          } @else {
            <div class="flex items-center gap-3">
              <a routerLink="/login" class="text-sm font-medium text-gray-600 hover:text-brand-700">Login</a>
              <a routerLink="/register"
                 class="text-sm font-semibold px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors">
                Get Started
              </a>
            </div>
          }
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  readonly subscriptionService = inject(SubscriptionService);

  logout(): void {
    this.authService.logout().subscribe();
  }
}
