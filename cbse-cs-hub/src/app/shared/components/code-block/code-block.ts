import { Component, OnChanges, SimpleChanges, input, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-code-block',
  standalone: true,
  template: `
    <div class="my-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <span class="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase">{{ language() }}</span>
      </div>
      <pre class="overflow-x-auto bg-gray-50 dark:bg-gray-900 p-4 text-sm"><code #codeEl class="font-mono text-gray-800 dark:text-gray-200">{{ code() }}</code></pre>
      @if (explanation()) {
        <div class="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-100 dark:border-amber-900/30 text-sm text-amber-800 dark:text-amber-300">
          💡 {{ explanation() }}
        </div>
      }
    </div>
  `,
})
export class CodeBlock {
  language = input<'python' | 'sql' | 'text'>('text');
  code = input.required<string>();
  explanation = input<string>('');
}
