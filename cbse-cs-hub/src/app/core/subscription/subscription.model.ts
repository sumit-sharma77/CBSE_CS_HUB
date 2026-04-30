export interface PlanDTO {
  planId: number;
  planName: string;
  billingCycle: 'MONTHLY' | 'YEARLY' | 'NONE';
  priceInr: number;
  maxQuestionsPerTopic: number | null;
  features: Record<string, boolean | string | number>;
  isActive: boolean;
}

export interface SubscriptionDTO {
  id: string;
  planId: number;
  planName: string;
  status: 'FREE' | 'ACTIVE' | 'GRACE_PERIOD' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  currentPeriodEnd?: string;
  gracePeriodEnd?: string;
}
