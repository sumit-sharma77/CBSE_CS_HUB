import { Injectable, signal } from '@angular/core';
import { Toast } from './toast.component';

let _id = 0;

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<(Toast & { id: number })[]>([]);

  show(toast: Toast): number {
    const id = ++_id;
    this.toasts.update(list => [...list, { ...toast, id }]);
    return id;
  }

  success(message: string, duration = 4000): number {
    return this.show({ message, variant: 'success', duration });
  }

  error(message: string, duration = 6000): number {
    return this.show({ message, variant: 'error', duration });
  }

  info(message: string, duration = 4000): number {
    return this.show({ message, variant: 'info', duration });
  }

  warning(message: string, duration = 5000): number {
    return this.show({ message, variant: 'warning', duration });
  }

  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
