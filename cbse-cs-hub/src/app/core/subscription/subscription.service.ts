import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlanDTO, SubscriptionDTO } from './subscription.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  readonly currentPlan = signal<SubscriptionDTO | null>(null);

  getPlans(): Observable<PlanDTO[]> {
    return this.http.get<PlanDTO[]>(`${this.base}/plans`);
  }

  getMySubscription(): Observable<SubscriptionDTO> {
    return this.http.get<SubscriptionDTO>(`${this.base}/subscriptions/me`).pipe(
      tap((sub) => this.currentPlan.set(sub))
    );
  }

  initiateCheckout(planId: number): Observable<{ subscriptionId: string; shortUrl: string; keyId: string }> {
    return this.http.post<{ subscriptionId: string; shortUrl: string; keyId: string }>(
      `${this.base}/subscriptions/checkout`,
      { planId }
    );
  }

  cancelSubscription(): Observable<void> {
    return this.http.post<void>(`${this.base}/subscriptions/cancel`, {});
  }
}
