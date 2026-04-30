import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  template: `
    <div class="w-full" role="progressbar" [attr.aria-valuenow]="value" aria-valuemin="0" aria-valuemax="100">
      @if (label) {
        <div class="flex justify-between mb-1">
          <span class="text-sm font-medium text-gray-700">{{ label }}</span>
          <span class="text-sm text-gray-500">{{ value }}%</span>
        </div>
      }
      <div class="w-full bg-gray-200 rounded-full overflow-hidden" [style.height]="height">
        <div
          class="rounded-full transition-all duration-500 ease-out"
          [class]="barColorClass"
          [style.width.%]="value"
          [style.height]="height"
        ></div>
      </div>
    </div>
  `,
})
export class ProgressBarComponent {
  @Input() value = 0;
  @Input() label = '';
  @Input() color: 'brand' | 'success' | 'warning' | 'danger' = 'brand';
  @Input() height = '0.5rem';

  get barColorClass(): string {
    const colors = {
      brand: 'bg-brand-500',
      success: 'bg-success-500',
      warning: 'bg-warning-500',
      danger: 'bg-danger-500',
    };
    return colors[this.color];
  }
}
