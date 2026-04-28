import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecentlyViewedService } from '../../core/services/recently-viewed.service';
import { ProgressService } from '../../core/services/progress.service';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

interface ModuleCard {
  label: string;
  route: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TimeAgoPipe],
  template: `
    <div class="space-y-6">
      <!-- Hero -->
      <div class="text-center py-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">CBSE CS Hub</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Class 11 &amp; 12 Computer Science · Study Notes, SQL, Python
        </p>
      </div>

      <!-- Module cards (4 content modules) -->
      <div class="grid grid-cols-2 gap-3">
        @for (card of moduleCards; track card.route) {
          <a [routerLink]="card.route"
             class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow"
             [attr.aria-label]="card.label">
            <span class="text-3xl">{{ card.icon }}</span>
            <span class="font-semibold text-sm text-gray-900 dark:text-gray-100">{{ card.label }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400 leading-tight">{{ card.description }}</span>
          </a>
        }
      </div>

      <!-- Progress summary strip -->
      <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 p-4 flex justify-around">
        <div class="text-center">
          <p class="text-lg font-bold text-indigo-700 dark:text-indigo-300">{{ sqlAttempted() }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">SQL attempted</p>
        </div>
        <div class="text-center border-x border-indigo-200 dark:border-indigo-800 px-4">
          <p class="text-lg font-bold text-indigo-700 dark:text-indigo-300">{{ pythonAttempted() }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Python attempted</p>
        </div>
        <div class="text-center">
          <a routerLink="/progress" class="text-lg font-bold text-indigo-700 dark:text-indigo-300 hover:underline">
            View →
          </a>
          <p class="text-xs text-gray-500 dark:text-gray-400">All progress</p>
        </div>
      </div>

      <!-- Recently Viewed (last 5) -->
      @if (recentlyViewed.entries().length > 0) {
        <section class="space-y-2">
          <h2 class="font-semibold text-gray-700 dark:text-gray-200">Recently Viewed</h2>
          @for (entry of recentlyViewed.entries().slice(0, 5); track entry.itemId) {
            <a [routerLink]="entry.routePath"
               class="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 hover:shadow-sm transition-shadow"
               [attr.aria-label]="'Revisit: ' + entry.title">
              <span>{{ moduleIcon(entry.type) }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{{ entry.title }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500">{{ entry.visitedAt | timeAgo }}</p>
              </div>
              <span class="text-xs text-indigo-500 dark:text-indigo-400 shrink-0">→</span>
            </a>
          }
        </section>
      }
    </div>
  `,
})
export class Home {
  protected recentlyViewed = inject(RecentlyViewedService);
  private progressService = inject(ProgressService);

  protected moduleCards: ModuleCard[] = [
    { label: 'Study Notes', route: '/study-notes', icon: '📖', description: 'Class 11 & 12 chapters' },
    { label: 'MCQ Quiz', route: '/mcq', icon: '🧠', description: 'CBSE PYQ MCQs · Class 11 & 12' },
    { label: 'SQL Practice', route: '/sql', icon: '🗄️', description: '7 categories + PYQ' },
    { label: 'Python Practice', route: '/python', icon: '🐍', description: '8 topics + exercises' },
    { label: 'My Notes', route: '/notes', icon: '📝', description: 'Personal study notes' },
    { label: 'Progress', route: '/progress', icon: '📊', description: 'Track your performance' },
  ];

  protected sqlAttempted() {
    return ['select', 'where', 'order-by', 'group-by', 'aggregate', 'joins', 'keys-constraints']
      .reduce((sum, k) => sum + this.progressService.getCategoryProgress('sql', k)().attempted, 0);
  }

  protected pythonAttempted() {
    return ['variables', 'conditions', 'loops', 'functions', 'lists', 'strings', 'dictionaries', 'mixed']
      .reduce((sum, k) => sum + this.progressService.getCategoryProgress('python', k)().attempted, 0);
  }

  protected moduleIcon(type: string): string {
    const icons: Record<string, string> = { chapter: '📖', 'sql-question': '🗄️', 'python-exercise': '🐍', mcq: '🧠' };
    return icons[type] ?? '📄';
  }
}
