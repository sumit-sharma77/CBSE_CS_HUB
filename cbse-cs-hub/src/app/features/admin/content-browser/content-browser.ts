import {
  Component, computed, inject, input, output, signal
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { AdminContentLoaderService } from '../services/admin-content-loader.service';
import { ContentItem } from '../admin.types';

@Component({
  selector: 'app-content-browser',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 space-y-2">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Existing Questions
          @if (items() !== null) {
            <span class="ml-1.5 text-xs font-normal text-gray-500">({{ filtered().length }} items)</span>
          }
        </h3>
        <input
          [formControl]="filterControl"
          type="search"
          placeholder="Filter by ID or question…"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500">
      </div>

      <div class="divide-y divide-gray-100 dark:divide-gray-800 max-h-96 overflow-y-auto">
        @if (items() === null) {
          <div class="px-4 py-5 text-center">
            <p class="text-xs text-red-500 dark:text-red-400">
              Could not load existing content — ensure the dev server is running.
            </p>
          </div>
        } @else if (filtered().length === 0) {
          <div class="px-4 py-5 text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              @if (filterControl.value) {
                No items match "{{ filterControl.value }}".
              } @else {
                No questions yet — be the first to add one!
              }
            </p>
          </div>
        } @else {
          @for (item of filtered(); track item.id) {
            <div class="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
              <!-- Row: ID + question + actions -->
              <div class="flex items-start gap-2">
                <button type="button" (click)="toggleDetail(item.id)"
                  class="flex-1 text-left min-w-0">
                  <div class="flex items-baseline gap-2">
                    <span class="text-xs font-mono text-indigo-600 dark:text-indigo-400 shrink-0">{{ item.id }}</span>
                    <span class="text-xs text-gray-600 dark:text-gray-400 truncate">{{ questionText(item) }}</span>
                  </div>
                </button>
                <!-- Action buttons -->
                <div class="flex gap-1 shrink-0">
                  <button type="button" (click)="onEdit(item)"
                    class="px-2 py-1 text-xs font-medium rounded bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 transition-colors"
                    title="Load into form for editing">
                    ✏️ Edit
                  </button>
                  <button type="button" (click)="onDelete(item)"
                    class="px-2 py-1 text-xs font-medium rounded bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors"
                    title="Remove this question">
                    🗑 Delete
                  </button>
                </div>
              </div>

              <!-- Expanded detail -->
              @if (expandedId() === item.id) {
                <div class="mt-2 rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                  @for (entry of objectEntries(item); track entry[0]) {
                    <div class="grid grid-cols-[auto_1fr] gap-x-2 py-0.5">
                      <span class="text-xs font-mono text-gray-500 dark:text-gray-400">{{ entry[0] }}:</span>
                      <span class="text-xs text-gray-800 dark:text-gray-200 break-all">{{ formatValue(entry[1]) }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          }
        }
      </div>

      <!-- Delete preview panel -->
      @if (deletePreview()) {
        <div class="border-t border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4 space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold text-red-700 dark:text-red-400">
              🗑 Deleted: <code>{{ deletePreview()!.id }}</code> — copy the updated array and replace the entire file
            </p>
            <button type="button" (click)="deletePreview.set(null)"
              class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 ml-2">✕</button>
          </div>
          <div class="flex gap-2">
            <button type="button" (click)="copyDelete()"
              class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
              [class]="deleteCopied()
                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50'">
              {{ deleteCopied() ? '✓ Copied!' : '📋 Copy Updated Array' }}
            </button>
          </div>
          <pre class="text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 rounded p-2 overflow-x-auto max-h-48 border border-gray-200 dark:border-gray-700 font-mono whitespace-pre-wrap break-all">{{ deletePreview()!.json }}</pre>
        </div>
      }
    </div>
  `,
})
export class ContentBrowserComponent {
  assetPath = input.required<string>();
  editRequest = output<ContentItem>();

  private loader = inject(AdminContentLoaderService);

  filterControl = new FormControl('');
  expandedId = signal<string | null>(null);
  deletePreview = signal<{ id: string; json: string } | null>(null);
  deleteCopied = signal(false);

  private filterValue = toSignal(this.filterControl.valueChanges, { initialValue: '' });

  items = computed<ContentItem[] | null>(() => {
    return this.loader.load<ContentItem>(this.assetPath())() as ContentItem[] | null;
  });

  filtered = computed<ContentItem[]>(() => {
    const all = this.items();
    if (!all) return [];
    const q = (this.filterValue() ?? '').toLowerCase().trim();
    if (!q) return all;
    return all.filter(item => {
      const text = (this.questionText(item) + item.id).toLowerCase();
      return text.includes(q);
    });
  });

  questionText(item: ContentItem): string {
    const raw = (item['question'] ?? item['questionText'] ?? '') as string;
    return raw.length > 90 ? raw.slice(0, 90) + '…' : raw;
  }

  toggleDetail(id: string): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  onEdit(item: ContentItem): void {
    this.editRequest.emit(item);
    // Scroll to top of page so form is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDelete(item: ContentItem): void {
    const remaining = (this.items() ?? []).filter(i => i.id !== item.id);
    this.deletePreview.set({
      id: item.id,
      json: JSON.stringify(remaining, null, 2),
    });
  }

  copyDelete(): void {
    const preview = this.deletePreview();
    if (!preview) return;
    navigator.clipboard.writeText(preview.json).then(() => {
      this.deleteCopied.set(true);
      setTimeout(() => this.deleteCopied.set(false), 2000);
    });
  }

  objectEntries(item: ContentItem): [string, unknown][] {
    return Object.entries(item);
  }

  formatValue(val: unknown): string {
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'object' && val !== null) return JSON.stringify(val);
    return String(val ?? '');
  }
}

