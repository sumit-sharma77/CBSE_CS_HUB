import { Injectable, effect, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storage = inject(StorageService);

  readonly theme = signal<'light' | 'dark'>(
    (this.storage.getString('cbse-theme') as 'light' | 'dark') ?? 'light'
  );

  constructor() {
    effect(() => {
      const t = this.theme();
      if (t === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      this.storage.setString('cbse-theme', t);
    });
  }

  toggle(): void {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
  }
}
