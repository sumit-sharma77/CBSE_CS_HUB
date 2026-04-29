import { Component, isDevMode } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden">
      <ul class="flex justify-around items-center h-16">
        @for (item of navItems; track item.route) {
          <li class="flex-1">
            <a [routerLink]="item.route" routerLinkActive="text-indigo-600 dark:text-indigo-400"
               [routerLinkActiveOptions]="{ exact: item.route === '/' }"
               class="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-xs gap-1"
               [attr.aria-label]="item.label">
              <span class="text-lg leading-none">{{ item.icon }}</span>
              <span class="truncate max-w-[4rem]">{{ item.label }}</span>
            </a>
          </li>
        }
        @if (showAdmin) {
          <li class="flex-1">
            <a routerLink="/admin" routerLinkActive="text-amber-600 dark:text-amber-400"
               class="flex flex-col items-center justify-center h-full text-amber-500 dark:text-amber-400 text-xs gap-1"
               aria-label="Admin">
              <span class="text-lg leading-none">⚙️</span>
              <span>Admin</span>
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
})
export class BottomNav {
  protected readonly showAdmin = isDevMode();

  protected navItems: NavItem[] = [
    { label: 'Study', route: '/study-notes', icon: '📖' },
    { label: 'MCQ', route: '/mcq', icon: '🧠' },
    { label: 'SQL', route: '/sql', icon: '🗄️' },
    { label: 'Python', route: '/python', icon: '🐍' },
    { label: 'Progress', route: '/progress', icon: '📊' },
    { label: 'Notes', route: '/notes', icon: '📝' },
  ];
}
