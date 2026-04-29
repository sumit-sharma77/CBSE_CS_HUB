import { Component, inject, output, signal, HostListener } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AdminOcrService } from '../services/admin-ocr.service';
import { ParsedOcrResult } from '../admin.types';

const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
const MAX_SIZE_MB = 5;

@Component({
  selector: 'app-ocr-zone',
  standalone: true,
  imports: [DecimalPipe],
  providers: [AdminOcrService],
  template: `
    <div class="rounded-xl border-2 border-dashed transition-colors"
         [class]="dragOver()
           ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30'
           : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'"
         (dragover)="onDragOver($event)"
         (dragleave)="onDragLeave()"
         (drop)="onDrop($event)">

      <div class="p-4 text-center space-y-2">
        <div class="text-2xl">📷</div>
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
          OCR Image Input
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Paste (Ctrl+V), drag &amp; drop, or
          <label class="text-indigo-600 dark:text-indigo-400 underline cursor-pointer hover:no-underline">
            browse
            <input type="file" accept="image/*" class="sr-only" (change)="onFileInput($event)">
          </label>
          an image of a question
        </p>
      </div>

      @if (status() === 'processing') {
        <div class="px-4 pb-4 flex items-center justify-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
          <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
          Extracting text…
        </div>
      }

      @if (status() === 'done' && result()) {
        <div class="px-4 pb-4 space-y-2">
          @if (result()!.lowConfidence) {
            <div class="rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 px-3 py-2">
              <p class="text-xs text-amber-700 dark:text-amber-300">
                ⚠️ Low OCR confidence ({{ result()!.confidence | number:'1.0-0' }}%) — please review extracted text carefully.
              </p>
            </div>
          }
          <div class="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Extracted text:</p>
            <p class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{{ result()!.text }}</p>
          </div>
          <button type="button" (click)="applyResult()"
            class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
            Apply to Form
          </button>
        </div>
      }

      @if (status() === 'error') {
        <div class="px-4 pb-4">
          <div class="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 px-3 py-2">
            <p class="text-xs text-red-700 dark:text-red-300">{{ errorMessage() }}</p>
          </div>
        </div>
      }
    </div>
  `,
})
export class OcrZoneComponent {
  parsed = output<ParsedOcrResult>();

  private ocr = inject(AdminOcrService);

  status = signal<'idle' | 'processing' | 'done' | 'error'>('idle');
  dragOver = signal(false);
  result = signal<{ text: string; confidence: number; lowConfidence: boolean } | null>(null);
  errorMessage = signal('');
  private lastParsed: ParsedOcrResult | null = null;

  @HostListener('window:paste', ['$event'])
  onWindowPaste(event: ClipboardEvent): void {
    const items = event.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        if (blob) this.processFile(blob);
        break;
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(true);
  }

  onDragLeave(): void {
    this.dragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.processFile(file);
  }

  private processFile(file: File | Blob): void {
    const type = file instanceof File ? file.type : file.type;
    const size = file.size;

    if (!ALLOWED_TYPES.has(type)) {
      this.status.set('error');
      this.errorMessage.set(`Unsupported file type: ${type}. Use PNG, JPEG, or WEBP.`);
      return;
    }

    if (size > MAX_SIZE_MB * 1024 * 1024) {
      this.status.set('error');
      this.errorMessage.set(`Image is too large (${(size / 1024 / 1024).toFixed(1)} MB). Maximum is ${MAX_SIZE_MB} MB.`);
      return;
    }

    this.status.set('processing');
    this.result.set(null);
    this.ocr.processImage(file).then(ocrResult => {
      this.result.set(ocrResult);
      this.lastParsed = this.ocr.parseOptionsFromText(ocrResult.text);
      this.status.set('done');
    }).catch((err: Error) => {
      this.status.set('error');
      this.errorMessage.set(err.message ?? 'OCR failed — please try again.');
    });
  }

  applyResult(): void {
    if (this.lastParsed) {
      this.parsed.emit(this.lastParsed);
    }
  }
}
