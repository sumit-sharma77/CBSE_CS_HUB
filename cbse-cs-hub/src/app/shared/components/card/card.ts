import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100 truncate">{{ title() }}</h3>
          @if (subtitle()) {
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{{ subtitle() }}</p>
          }
        </div>
        <ng-content select="[slot=action]"></ng-content>
      </div>
      @if (tags().length > 0) {
        <div class="flex flex-wrap gap-1.5 mt-2">
          @for (tag of tags(); track tag) {
            <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
              {{ tag }}
            </span>
          }
        </div>
      }
      <ng-content></ng-content>
    </div>
  `,
})
export class Card {
  title = input.required<string>();
  subtitle = input<string>('');
  tags = input<string[]>([]);
}
