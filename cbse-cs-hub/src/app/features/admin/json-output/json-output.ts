import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-json-output',
  standalone: true,
  imports: [],
  template: `
    <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">JSON Output</h3>
        <div class="flex gap-2">
          <button
            type="button"
            [disabled]="formInvalid()"
            (click)="copyJson()"
            class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            [class]="copied()
              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300'">
            {{ copied() ? '✓ Copied!' : '📋 Copy JSON' }}
          </button>
          <button
            type="button"
            [disabled]="formInvalid()"
            (click)="downloadJson()"
            class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                   bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:hover:bg-indigo-900/60 dark:text-indigo-300">
            ⬇ Download
          </button>
        </div>
      </div>

      @if (formInvalid()) {
        <div class="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 italic">
          Fill all required fields to preview JSON output.
        </div>
      } @else {
        <pre class="px-4 py-3 text-xs text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap break-all font-mono leading-relaxed max-h-64">{{ prettyJson() }}</pre>
      }

      <!-- Paste instructions (T020) -->
      <div class="px-4 py-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">How to add to content file:</p>
        <p class="text-xs text-gray-400 dark:text-gray-500">
          Paste inside the <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">"questions": [ ]</code> array
          in the JSON file, after the last existing element. Add a comma after the previous element if needed.
        </p>
        <pre class="text-xs text-gray-400 dark:text-gray-500 font-mono">"questions": [ ...existing, <span class="text-indigo-400">{{ '{' }}...newItem{{ '}' }}</span> ]</pre>
      </div>
    </div>
  `,
})
export class JsonOutputComponent {
  data = input.required<unknown>();
  formInvalid = input<boolean>(false);
  filename = input<string>('content-item');

  copied = signal(false);

  prettyJson(): string {
    try {
      return JSON.stringify(this.data(), null, 2);
    } catch {
      return '';
    }
  }

  copyJson(): void {
    const text = this.prettyJson();
    navigator.clipboard.writeText(text).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  downloadJson(): void {
    const blob = new Blob([this.prettyJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.filename()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
