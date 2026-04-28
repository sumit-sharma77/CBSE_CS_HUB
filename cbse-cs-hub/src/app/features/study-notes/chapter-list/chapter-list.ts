import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SearchBar } from '../../../shared/components/search-bar/search-bar';
import { Card } from '../../../shared/components/card/card';
import { BookmarkBtn } from '../../../shared/components/bookmark-btn/bookmark-btn';
import { RecentlyViewedService } from '../../../core/services/recently-viewed.service';

interface ChapterIndexEntry {
  id: string;
  classLevel: 11 | 12;
  title: string;
  chapterNumber: number;
  tags: string[];
  assetPath: string;
}

@Component({
  selector: 'app-chapter-list',
  standalone: true,
  imports: [SearchBar, Card, BookmarkBtn],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Study Notes</h1>

      <app-search-bar placeholder="Search chapters by title or tag…"
                      (queryChange)="filterQuery.set($event)">
      </app-search-bar>

      @if (loading()) {
        <div class="text-center py-12 text-gray-500 dark:text-gray-400">Loading chapters…</div>
      } @else {
        @for (group of filteredGroups(); track group.classLevel) {
          <section>
            <h2 class="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
              Class {{ group.classLevel }}
            </h2>
            <div class="space-y-3">
              @for (chapter of group.chapters; track chapter.id) {
                <div (click)="openChapter(chapter)"
                     class="cursor-pointer"
                     role="button"
                     [attr.aria-label]="'Open chapter: ' + chapter.title">
                  <app-card [title]="chapter.title"
                            [subtitle]="'Chapter ' + chapter.chapterNumber"
                            [tags]="chapter.tags">
                    <app-bookmark-btn slot="action"
                                      type="chapter"
                                      [itemId]="chapter.id"
                                      [title]="chapter.title">
                    </app-bookmark-btn>
                  </app-card>
                </div>
              }
              @empty {
                <p class="text-gray-400 dark:text-gray-500 text-sm py-2">No chapters match your search.</p>
              }
            </div>
          </section>
        }
        @if (filteredGroups().length === 0 && filterQuery()) {
          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            No results for "{{ filterQuery() }}"
          </div>
        }
      }
    </div>
  `,
})
export class ChapterList implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private recentlyViewed = inject(RecentlyViewedService);

  protected loading = signal(true);
  protected allChapters = signal<ChapterIndexEntry[]>([]);
  protected filterQuery = signal('');

  protected filteredGroups = computed(() => {
    const q = this.filterQuery().toLowerCase();
    const chapters = q
      ? this.allChapters().filter(c =>
          c.title.toLowerCase().includes(q) ||
          c.tags.some(t => t.toLowerCase().includes(q))
        )
      : this.allChapters();

    const class12 = chapters.filter(c => c.classLevel === 12)
      .sort((a, b) => a.chapterNumber - b.chapterNumber);
    const class11 = chapters.filter(c => c.classLevel === 11)
      .sort((a, b) => a.chapterNumber - b.chapterNumber);

    return [
      ...(class12.length ? [{ classLevel: 12 as const, chapters: class12 }] : []),
      ...(class11.length ? [{ classLevel: 11 as const, chapters: class11 }] : []),
    ];
  });

  ngOnInit(): void {
    forkJoin({
      class12: this.http.get<ChapterIndexEntry[]>('assets/content/study-notes/class-12-index.json'),
      class11: this.http.get<ChapterIndexEntry[]>('assets/content/study-notes/class-11-index.json'),
    }).subscribe({
      next: ({ class12, class11 }) => {
        this.allChapters.set([...class12, ...class11]);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected openChapter(chapter: ChapterIndexEntry): void {
    this.recentlyViewed.track({
      type: 'chapter',
      itemId: chapter.id,
      title: chapter.title,
      routePath: `/study-notes/${chapter.id}`,
    });
    this.router.navigate(['/study-notes', chapter.id]);
  }
}
