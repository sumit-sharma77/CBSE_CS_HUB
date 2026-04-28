import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { BottomNav } from './shared/components/bottom-nav/bottom-nav';
import { SideNav } from './shared/components/side-nav/side-nav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, BottomNav, SideNav],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <app-header></app-header>
      <div class="flex flex-1">
        <app-side-nav></app-side-nav>
        <main class="flex-1 min-w-0 px-4 py-6 pb-20 md:pb-6 max-w-3xl mx-auto w-full">
          <router-outlet></router-outlet>
        </main>
      </div>
      <app-bottom-nav></app-bottom-nav>
    </div>
  `,
})
export class App {}
