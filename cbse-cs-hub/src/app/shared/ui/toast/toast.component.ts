import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  message: string;
  variant: ToastVariant;
  duration?: number;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      role="alert"
      [class]="toastClasses"
    >
      <span class="text-sm font-medium">{{ message }}</span>
      <button
        type="button"
        class="ml-4 text-current opacity-70 hover:opacity-100"
        (click)="dismiss()"
        aria-label="Dismiss"
      >✕</button>
    </div>
  `,
})
export class ToastComponent implements OnInit {
  @Input() message = '';
  @Input() variant: ToastVariant = 'info';
  @Input() duration = 4000;
  @Output() dismissed = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.duration > 0) {
      setTimeout(() => this.dismiss(), this.duration);
    }
  }

  dismiss(): void {
    this.dismissed.emit();
  }

  get toastClasses(): string {
    const base = 'flex items-center justify-between px-4 py-3 rounded-lg shadow-lg text-white pointer-events-auto';
    const variants: Record<ToastVariant, string> = {
      success: 'bg-success-600',
      error: 'bg-danger-600',
      warning: 'bg-warning-500',
      info: 'bg-info-600',
    };
    return `${base} ${variants[this.variant]}`;
  }
}
