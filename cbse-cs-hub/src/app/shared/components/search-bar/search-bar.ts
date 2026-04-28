import { Component, OnDestroy, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="relative">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg"
           fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
      </svg>
      <input
        type="search"
        [ngModel]="query()"
        (ngModelChange)="onInput($event)"
        (keydown.escape)="clear()"
        [placeholder]="placeholder()"
        class="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        [attr.aria-label]="placeholder()"
      />
      @if (query()) {
        <button (click)="clear()" aria-label="Clear search"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          ✕
        </button>
      }
    </div>
  `,
})
export class SearchBar implements OnDestroy {
  placeholder = input('Search…');

  readonly query = signal('');
  readonly queryChange = output<string>();

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  protected onInput(value: string): void {
    this.query.set(value);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.queryChange.emit(value);
    }, 300);
  }

  protected clear(): void {
    this.query.set('');
    this.queryChange.emit('');
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }
}
