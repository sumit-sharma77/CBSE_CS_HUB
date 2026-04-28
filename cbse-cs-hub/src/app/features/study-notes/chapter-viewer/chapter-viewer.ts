import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CodeBlock } from '../../../shared/components/code-block/code-block';
import { BookmarkBtn } from '../../../shared/components/bookmark-btn/bookmark-btn';

interface ChapterIndexEntry {
  id: string;
  classLevel: 11 | 12;
  title: string;
  chapterNumber: number;
  tags: string[];
  assetPath: string;
}

interface CodeBlockData {
  language: 'python' | 'sql' | 'text';
  code: string;
  explanation?: string;
}

interface ChapterSection {
  heading: string;
  content: string;
  codeBlocks?: CodeBlockData[];
}

interface Chapter {
  id: string;
  classLevel: 11 | 12;
  title: string;
  chapterNumber: number;
  tags: string[];
  sections: ChapterSection[];
}

@Component({
  selector: 'app-chapter-viewer',
  standalone: true,
  imports: [CodeBlock, BookmarkBtn],
  template: `
    <div class="space-y-6 max-w-2xl">
      @if (loading()) {
        <div class="text-center py-12 text-gray-500 dark:text-gray-400">Loading chapter…</div>
      } @else if (chapter()) {
        <!-- Header -->
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
              Class {{ chapter()!.classLevel }} · Chapter {{ chapter()!.chapterNumber }}
            </p>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {{ chapter()!.title }}
            </h1>
            <div class="flex flex-wrap gap-1.5 mt-2">
              @for (tag of chapter()!.tags; track tag) {
                <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                  {{ tag }}
                </span>
              }
            </div>
          </div>
          <app-bookmark-btn type="chapter"
                            [itemId]="chapter()!.id"
                            [title]="chapter()!.title">
          </app-bookmark-btn>
        </div>

        <!-- Sections -->
        @for (section of chapter()!.sections; track section.heading) {
          <section>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
              {{ section.heading }}
            </h2>
            <div class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm">
              {{ section.content }}
            </div>
            @for (block of section.codeBlocks ?? []; track $index) {
              <app-code-block [language]="block.language"
                              [code]="block.code"
                              [explanation]="block.explanation ?? ''">
              </app-code-block>
            }
          </section>
        }

        <!-- Prev / Next Navigation -->
        <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <button (click)="navigate(-1)"
                  [disabled]="!prevChapter()"
                  aria-label="Previous chapter"
                  class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed">
            ← {{ prevChapter()?.title ?? 'Previous' }}
          </button>
          <button (click)="navigate(1)"
                  [disabled]="!nextChapter()"
                  aria-label="Next chapter"
                  class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed">
            {{ nextChapter()?.title ?? 'Next' }} →
          </button>
        </div>
      } @else {
        <div class="text-center py-12 text-gray-500 dark:text-gray-400">Chapter not found.</div>
      }
    </div>
  `,
})
export class ChapterViewer implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected loading = signal(true);
  protected chapter = signal<Chapter | null>(null);
  protected prevChapter = signal<ChapterIndexEntry | null>(null);
  protected nextChapter = signal<ChapterIndexEntry | null>(null);

  private allChapters: ChapterIndexEntry[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('chapterId')!;
      this.loadChapter(id);
    });
  }

  private loadChapter(id: string): void {
    this.loading.set(true);

    // Load indexes to build prev/next
    Promise.all([
      this.http.get<ChapterIndexEntry[]>('assets/content/study-notes/class-12-index.json').toPromise(),
      this.http.get<ChapterIndexEntry[]>('assets/content/study-notes/class-11-index.json').toPromise(),
    ]).then(([c12, c11]) => {
      this.allChapters = [...(c12 ?? []), ...(c11 ?? [])].sort((a, b) => {
        if (a.classLevel !== b.classLevel) return b.classLevel - a.classLevel;
        return a.chapterNumber - b.chapterNumber;
      });

      const idx = this.allChapters.findIndex(c => c.id === id);
      this.prevChapter.set(idx > 0 ? this.allChapters[idx - 1] : null);
      this.nextChapter.set(idx < this.allChapters.length - 1 ? this.allChapters[idx + 1] : null);

      // Find asset path
      const entry = this.allChapters.find(c => c.id === id);
      const assetPath = entry?.assetPath ?? `study-notes/class-12/${id}.json`;

      this.http.get<Chapter>(`assets/content/${assetPath}`).subscribe({
        next: (chapter) => {
          this.chapter.set(chapter);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    });
  }

  protected navigate(dir: -1 | 1): void {
    const target = dir === -1 ? this.prevChapter() : this.nextChapter();
    if (target) {
      this.router.navigate(['/study-notes', target.id]);
    }
  }
}
