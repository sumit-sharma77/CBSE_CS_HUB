import { Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  template: `
    <div class="w-full">
      <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>{{ attempted() }}/{{ total() }} attempted</span>
        <span>{{ percentage() }}%</span>
      </div>
      <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div class="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-300"
             [style.width.%]="percentage()">
        </div>
      </div>
    </div>
  `,
})
export class ProgressBar {
  attempted = input.required<number>();
  total = input.required<number>();
  percentage = input.required<number>();
}
