import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../../core/subscription/subscription.service';
import { PlanDTO } from '../../../core/subscription/subscription.model';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-16 px-4">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-4xl font-extrabold text-center text-gray-900 mb-4">Choose Your Plan</h1>
        <p class="text-center text-gray-600 mb-12">Unlock unlimited practice and premium features</p>

        <!-- Billing toggle -->
        <div class="flex items-center justify-center gap-4 mb-10">
          <button (click)="showYearly.set(false)"
            [class]="!showYearly() ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border'"
            class="px-5 py-2 rounded-full text-sm font-semibold transition-all">Monthly</button>
          <button (click)="showYearly.set(true)"
            [class]="showYearly() ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border'"
            class="px-5 py-2 rounded-full text-sm font-semibold transition-all">
            Yearly <span class="text-xs font-normal ml-1 text-green-600">Save 20%</span>
          </button>
        </div>

        @if (loading()) {
          <div class="flex justify-center"><div class="animate-spin text-4xl">⟳</div></div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            @for (plan of filteredPlans(); track plan.planId) {
              <div class="bg-white rounded-2xl p-8 shadow-sm border-2 flex flex-col"
                [class.border-brand-500]="plan.planName.includes('Pro')"
                [class.border-gray-100]="!plan.planName.includes('Pro')">
                @if (plan.planName.includes('Pro')) {
                  <div class="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-4">POPULAR</div>
                }
                <h2 class="text-xl font-bold text-gray-900 mb-2">{{ plan.planName }}</h2>
                <div class="text-4xl font-extrabold text-gray-900 mb-1">
                  @if (plan.priceInr === 0) { Free }
                  @else { ₹{{ plan.priceInr }}<span class="text-base font-normal text-gray-500">/{{ plan.billingCycle }}</span> }
                </div>
                <p class="text-sm text-gray-500 mb-6">
                  @if (plan.maxQuestionsPerTopic) { {{ plan.maxQuestionsPerTopic }} questions/topic/day }
                  @else { Unlimited questions }
                </p>
                <button (click)="selectPlan(plan)"
                  [disabled]="checkoutLoading()"
                  class="mt-auto w-full py-3 rounded-xl font-semibold transition-colors"
                  [class]="plan.planName.includes('Pro') ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'">
                  @if (plan.priceInr === 0) { Get Started Free } @else { Subscribe Now }
                </button>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class PlansComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);

  readonly loading         = signal(true);
  readonly checkoutLoading = signal(false);
  readonly showYearly      = signal(false);
  readonly plans           = signal<PlanDTO[]>([]);

  get filteredPlans() {
    return () => this.plans().filter(p =>
      p.priceInr === 0 ||
      (this.showYearly() ? p.billingCycle === 'YEARLY' : p.billingCycle === 'MONTHLY')
    );
  }

  ngOnInit(): void {
    this.subscriptionService.getPlans().subscribe({
      next: plans => { this.plans.set(plans); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  selectPlan(plan: PlanDTO): void {
    if (plan.priceInr === 0) return;
    this.checkoutLoading.set(true);
    this.subscriptionService.initiateCheckout(plan.planId).subscribe({
      next: (res: any) => {
        this.checkoutLoading.set(false);
        this.openRazorpay(res);
      },
      error: () => this.checkoutLoading.set(false)
    });
  }

  private openRazorpay(options: any): void {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };
    document.body.appendChild(script);
  }
}
