import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

        @if (!token()) {
          <!-- Step 1: Request reset -->
          <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">Reset Password</h1>
          @if (message()) { <p class="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded-lg">{{ message() }}</p> }
          @if (errorMessage()) { <p class="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded-lg">{{ errorMessage() }}</p> }
          <form [formGroup]="requestForm" (ngSubmit)="requestReset()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" formControlName="email"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            </div>
            <button type="submit" [disabled]="loading() || requestForm.invalid"
              class="w-full py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors">
              @if (loading()) { Sending... } @else { Send Reset Link }
            </button>
          </form>
        } @else {
          <!-- Step 2: Confirm new password -->
          <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">Set New Password</h1>
          @if (message()) { <p class="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded-lg">{{ message() }}</p> }
          @if (errorMessage()) { <p class="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded-lg">{{ errorMessage() }}</p> }
          <form [formGroup]="confirmForm" (ngSubmit)="confirmReset()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" formControlName="newPassword"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            </div>
            <button type="submit" [disabled]="loading() || confirmForm.invalid"
              class="w-full py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors">
              @if (loading()) { Saving... } @else { Save New Password }
            </button>
          </form>
        }

        <p class="text-center text-sm text-gray-600 mt-6">
          <a routerLink="/login" class="text-brand-600 hover:underline">Back to Login</a>
        </p>
      </div>
    </div>
  `
})
export class PasswordResetComponent implements OnInit {
  private fb    = inject(FormBuilder);
  private http  = inject(HttpClient);
  private route = inject(ActivatedRoute);

  readonly loading      = signal(false);
  readonly message      = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly token        = signal<string | null>(null);

  requestForm = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  confirmForm = this.fb.group({ newPassword: ['', [Validators.required, Validators.minLength(8)]] });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(p => {
      const t = p.get('token');
      if (t) this.token.set(t);
    });
  }

  requestReset(): void {
    this.loading.set(true);
    this.http.post(`${environment.apiUrl}/auth/password-reset-request`,
      { email: this.requestForm.value.email }).subscribe({
      next: () => {
        this.message.set('If that email exists, a reset link has been sent.');
        this.loading.set(false);
      },
      error: () => { this.errorMessage.set('Request failed. Try again.'); this.loading.set(false); }
    });
  }

  confirmReset(): void {
    this.loading.set(true);
    this.http.post(`${environment.apiUrl}/auth/password-reset-confirm`,
      { token: this.token(), newPassword: this.confirmForm.value.newPassword }).subscribe({
      next: () => { this.message.set('Password updated! You can now login.'); this.loading.set(false); },
      error: (err) => { this.errorMessage.set(err?.error?.detail ?? 'Reset failed.'); this.loading.set(false); }
    });
  }
}
