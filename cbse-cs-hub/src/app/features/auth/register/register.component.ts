import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pw = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pw && confirm && pw !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 page-enter">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">Create your account</h1>

        @if (errorMessage()) {
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{{ errorMessage() }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input type="text" formControlName="displayName"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Your name">
          </div>

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
              placeholder="Min 8 chars, 1 uppercase, 1 digit">
            @if (form.get('password')?.errors?.['minlength'] && form.get('password')?.touched) {
              <p class="text-xs text-red-600 mt-1">At least 8 characters required</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input type="password" formControlName="confirmPassword"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="••••••••">
            @if (form.errors?.['passwordMismatch'] && form.get('confirmPassword')?.touched) {
              <p class="text-xs text-red-600 mt-1">Passwords do not match</p>
            }
          </div>

          <button type="submit" [disabled]="loading() || form.invalid"
            class="w-full py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            @if (loading()) { <span class="animate-spin">⟳</span> Creating account... }
            @else { Create Account }
          </button>
        </form>

        <p class="text-center text-sm text-gray-600 mt-6">
          Already have an account? <a routerLink="/login" class="text-brand-600 font-semibold hover:underline">Login</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  readonly loading      = signal(false);
  readonly errorMessage = signal<string | null>(null);

  form = this.fb.group({
    displayName:     [''],
    email:           ['', [Validators.required, Validators.email]],
    password:        ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator });

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set(null);
    const { email, password, displayName } = this.form.value;
    this.auth.register(email!, password!, displayName || undefined).subscribe({
      next: () => this.router.navigate(['/practice']),
      error: (err) => {
        if (err?.status === 409) this.errorMessage.set('An account with this email already exists');
        else this.errorMessage.set(err?.error?.detail ?? 'Registration failed. Please try again.');
        this.loading.set(false);
      }
    });
  }
}
