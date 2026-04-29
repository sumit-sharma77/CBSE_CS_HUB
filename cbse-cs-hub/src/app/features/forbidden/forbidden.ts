import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="text-center space-y-4 max-w-sm">
        <div class="text-6xl">🚫</div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">403 — Access Denied</h1>
        <p class="text-gray-600 dark:text-gray-400">
          The Admin panel is only available in development mode.
        </p>
        <a routerLink="/"
           class="inline-block mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
          Back to Home
        </a>
      </div>
    </div>
  `,
})
export class ForbiddenComponent {}
