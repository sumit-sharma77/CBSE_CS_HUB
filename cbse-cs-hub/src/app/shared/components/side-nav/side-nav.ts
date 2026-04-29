import { Component, isDevMode } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="hidden md:flex flex-col w-56 min-h-screen border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-6 px-3 shrink-0">
      <ul class="space-y-1">
        @for (item of navItems; track item.route) {
          <li>
            <a [routerLink]="item.route" routerLinkActive="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold"
               [routerLinkActiveOptions]="{ exact: item.route === '/' }"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
               [attr.aria-label]="item.label">
              <span class="text-lg">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </a>
          </li>
        }
        @if (showAdmin) {
          <li class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <a routerLink="/admin" routerLinkActive="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-semibold"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
               aria-label="Admin Editor">
              <span class="text-lg">⚙️</span>
              <span>Admin Editor</span>
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
})
export class SideNav {
  protected readonly showAdmin = isDevMode();

  protected navItems: NavItem[] = [
    { label: 'Study Notes', route: '/study-notes', icon: '📖' },
    { label: 'MCQ Quiz', route: '/mcq', icon: '🧠' },
    { label: 'SQL Practice', route: '/sql', icon: '🗄️' },
    { label: 'Python Practice', route: '/python', icon: '🐍' },
    { label: 'My Notes', route: '/notes', icon: '📝' },
    { label: 'Progress', route: '/progress', icon: '📊' },
    { label: 'Search', route: '/search', icon: '🔍' },
  ];
}
