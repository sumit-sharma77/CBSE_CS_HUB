import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="titleId"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/50 transition-opacity"
          (click)="onOverlayClick()"
        ></div>

        <!-- Dialog -->
        <div
          class="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-xl transition-all"
          [class.max-w-sm]="size === 'sm'"
          [class.max-w-lg]="size === 'md'"
          [class.max-w-2xl]="size === 'lg'"
        >
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 [id]="titleId" class="text-lg font-semibold text-gray-900">
              <ng-content select="[modal-title]"></ng-content>
            </h2>
            <button
              type="button"
              class="text-gray-400 hover:text-gray-600 transition-colors"
              (click)="close()"
              aria-label="Close dialog"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="px-6 py-4">
            <ng-content></ng-content>
          </div>
          @if (hasFooter) {
            <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <ng-content select="[modal-footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() hasFooter = false;
  @Input() closeOnOverlay = true;
  @Output() closed = new EventEmitter<void>();

  readonly titleId = `modal-title-${Math.random().toString(36).slice(2)}`;

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) this.close();
  }

  onOverlayClick(): void {
    if (this.closeOnOverlay) this.close();
  }

  close(): void {
    this.closed.emit();
  }
}
