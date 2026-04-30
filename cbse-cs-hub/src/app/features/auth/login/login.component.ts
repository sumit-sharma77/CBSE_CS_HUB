import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 page-enter">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome back</h1>

        @if (errorMessage()) {
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {{ errorMessage() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" formControlName="email"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="you@example.com">
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <p class="text-xs text-red-600 mt-1">Valid email required</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" formControlName="password"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="••••••••">
          </div>

          <button type="submit" [disabled]="loading() || form.invalid"
            class="w-full py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            @if (loading()) { <span class="animate-spin">⟳</span> Signing in... }
            @else { Sign In }
          </button>
        </form>

        <p class="text-center text-sm text-gray-600 mt-6">
          No account? <a routerLink="/register" class="text-brand-600 font-semibold hover:underline">Register</a>
          · <a routerLink="/forgot-password" class="text-brand-600 hover:underline">Forgot password?</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  readonly loading      = signal(false);
  readonly errorMessage = signal<string | null>(null);

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set(null);
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigate(['/practice']),
      error: (err) => {
        this.errorMessage.set(err?.error?.detail ?? 'Invalid email or password');
        this.loading.set(false);
      }
    });
  }
}
