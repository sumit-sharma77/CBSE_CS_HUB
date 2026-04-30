import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';

const BASE = environment.apiUrl.replace('/v1', '') + '/admin';
const API  = environment.apiUrl;

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-10">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">🎟️ Subscriptions</h1>
      <p class="text-gray-500 mb-8 text-sm">Grant or revoke paid plans without Razorpay payment.</p>

      @if (message()) {
        <div class="mb-4 p-3 rounded-lg text-sm"
          [class]="messageType() === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
          {{ message() }}
        </div>
      }

      <!-- Grant form -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 class="font-bold text-gray-900 mb-4">Grant Subscription (No Payment Required)</h2>
        <form [formGroup]="grantForm" (ngSubmit)="grant()" class="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">User Email</label>
            <input type="email" formControlName="email"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              placeholder="user@example.com">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Plan</label>
            <select formControlName="planId" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              @for (p of plans(); track p.planId) {
                <option [value]="p.planId">{{ p.planName }} (₹{{ p.priceInr }})</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Months</label>
            <input type="number" formControlName="months" min="1" max="120"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400">
          </div>
          <button type="submit" [disabled]="grantForm.invalid || granting()"
            class="py-2 px-4 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors text-sm">
            @if (granting()) { Granting... } @else { Grant Plan ✓ }
          </button>
        </form>
      </div>

      <!-- Subscription list -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">User ID</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Plan</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Expires</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            @for (sub of subscriptions(); track sub.id) {
              <tr class="border-b border-gray-100 hover:bg-gray-50">
                <td class="px-4 py-3 font-mono text-xs text-gray-600">{{ sub.userId | slice:0:8 }}...</td>
                <td class="px-4 py-3">{{ sub.planName }}</td>
                <td class="px-4 py-3">
                  <span class="text-xs px-2 py-0.5 rounded-full font-semibold"
                    [class]="sub.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                             sub.status === 'FREE'   ? 'bg-gray-100 text-gray-600' :
                             'bg-red-100 text-red-600'">
                    {{ sub.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-500 text-xs">
                  {{ sub.currentPeriodEnd ? (sub.currentPeriodEnd | date:'mediumDate') : '—' }}
                </td>
                <td class="px-4 py-3">
                  @if (sub.status !== 'FREE') {
                    <button (click)="revoke(sub.userId)"
                      class="text-xs px-3 py-1 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">
                      Revoke
                    </button>
                  }
                </td>
              </tr>
            }
            @empty {
              <tr><td colspan="5" class="text-center py-10 text-gray-400">No subscriptions</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminSubscriptionsComponent implements OnInit {
  private http = inject(HttpClient);
  private fb   = inject(FormBuilder);

  readonly plans         = signal<any[]>([]);
  readonly subscriptions = signal<any[]>([]);
  readonly granting      = signal(false);
  readonly message       = signal<string | null>(null);
  readonly messageType   = signal<'success' | 'error'>('success');

  grantForm = this.fb.group({
    email:   ['', [Validators.required, Validators.email]],
    planId:  [null as number | null, Validators.required],
    months:  [1, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    this.http.get<any[]>(`${API}/plans`).subscribe(p => {
      this.plans.set(p.filter(x => x.priceInr > 0));
      if (p.length) this.grantForm.patchValue({ planId: p[0].planId });
    });
    this.loadSubs();
  }

  private loadSubs(): void {
    this.http.get<any[]>(`${BASE}/subscriptions`).subscribe({
      next: subs => this.subscriptions.set(subs),
      error: () => {}
    });
  }

  grant(): void {
    if (this.grantForm.invalid) return;
    this.granting.set(true);
    const { email, planId, months } = this.grantForm.value;

    // Resolve email → userId first
    this.http.get<any[]>(`${BASE}/users?size=500`).subscribe({
      next: (page) => {
        const user = (page as any).content?.find((u: any) => u.email === email);
        if (!user) { this.showMsg('User not found', 'error'); this.granting.set(false); return; }
        this.http.post(`${BASE}/subscriptions/grant`, { userId: user.id, planId, months }).subscribe({
          next: () => { this.granting.set(false); this.showMsg('Subscription granted!', 'success'); this.loadSubs(); },
          error: () => { this.granting.set(false); this.showMsg('Grant failed', 'error'); }
        });
      },
      error: () => { this.granting.set(false); this.showMsg('Could not fetch users', 'error'); }
    });
  }

  revoke(userId: string): void {
    if (!confirm('Revoke this subscription and revert to Free plan?')) return;
    this.http.delete(`${BASE}/subscriptions/${userId}`).subscribe({
      next: () => { this.loadSubs(); this.showMsg('Subscription revoked', 'success'); },
      error: () => this.showMsg('Revoke failed', 'error')
    });
  }

  private showMsg(msg: string, type: 'success' | 'error'): void {
    this.message.set(msg); this.messageType.set(type);
    setTimeout(() => this.message.set(null), 4000);
  }
}
