import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SubscriptionService } from '../../../core/subscription/subscription.service';

@Component({
  selector: 'app-subscription-status',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (subscriptionService.currentPlan(); as plan) {
      @if (layout === 'banner' && plan.status === 'FREE') {
        <div class="bg-brand-50 border-b border-brand-100 py-2 px-4 text-center text-sm text-brand-700">
          You're on the Free plan · <strong>10 questions/topic/day</strong>
          <a routerLink="/plans" class="ml-2 font-bold underline hover:text-brand-900">Upgrade →</a>
        </div>
      }
      @if (layout === 'inline') {
        <div class="inline-flex items-center gap-2 text-sm">
          <span class="px-2 py-1 rounded-full font-semibold text-xs"
            [class]="plan.status === 'FREE' ? 'bg-gray-100 text-gray-600' : 'bg-brand-100 text-brand-700'">
            {{ plan.planName }}
          </span>
          @if (plan.status === 'FREE') {
            <a routerLink="/plans" class="text-brand-600 text-xs hover:underline font-semibold">Upgrade</a>
          }
        </div>
      }
    }
  `
})
export class SubscriptionStatusComponent {
  @Input() layout: 'banner' | 'inline' = 'banner';
  readonly subscriptionService = inject(SubscriptionService);
}
