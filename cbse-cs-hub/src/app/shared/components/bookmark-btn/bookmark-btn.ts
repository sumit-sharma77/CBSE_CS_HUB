import { Component, computed, inject, input } from '@angular/core';
import { BookmarkService } from '../../../core/services/bookmark.service';

@Component({
  selector: 'app-bookmark-btn',
  standalone: true,
  template: `
    <button (click)="onToggle($event)"
            [attr.aria-label]="isBookmarked() ? 'Remove bookmark' : 'Add bookmark'"
            class="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            [class.text-amber-500]="isBookmarked()"
            [class.text-gray-400]="!isBookmarked()">
      @if (isBookmarked()) {
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 3a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2H5z"/>
        </svg>
      } @else {
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M5 3a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2H5z"/>
        </svg>
      }
    </button>
  `,
})
export class BookmarkBtn {
  type = input.required<'chapter' | 'sql-question' | 'python-exercise'>();
  itemId = input.required<string>();
  title = input.required<string>();

  private bookmarkService = inject(BookmarkService);

  protected isBookmarked = computed(() =>
    this.bookmarkService.isBookmarked(this.type(), this.itemId())()
  );

  protected onToggle(event: Event): void {
    event.stopPropagation();
    this.bookmarkService.toggle(this.type(), this.itemId(), this.title());
  }
}
