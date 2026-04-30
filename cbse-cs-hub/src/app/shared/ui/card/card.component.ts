import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div [class]="cardClasses">
      @if (hasHeader) {
        <div class="px-6 py-4 border-b border-gray-200">
          <ng-content select="[card-header]"></ng-content>
        </div>
      }
      <div class="px-6 py-4">
        <ng-content></ng-content>
      </div>
      @if (hasFooter) {
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <ng-content select="[card-footer]"></ng-content>
        </div>
      }
    </div>
  `,
})
export class CardComponent {
  @Input() hasHeader = false;
  @Input() hasFooter = false;
  @Input() elevated = false;

  get cardClasses(): string {
    const base = 'bg-white rounded-xl border border-gray-200 overflow-hidden';
    const shadow = this.elevated ? 'shadow-md' : 'shadow-sm';
    return `${base} ${shadow}`;
  }
}
