import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses">
      <ng-content></ng-content>
    </span>
  `,
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';

  get badgeClasses(): string {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const variants: Record<BadgeVariant, string> = {
      success: 'bg-success-50 text-success-700',
      warning: 'bg-warning-50 text-warning-600',
      danger: 'bg-danger-50 text-danger-700',
      info: 'bg-info-50 text-info-600',
      neutral: 'bg-gray-100 text-gray-700',
      brand: 'bg-brand-50 text-brand-700',
    };
    return `${base} ${variants[this.variant]}`;
  }
}
