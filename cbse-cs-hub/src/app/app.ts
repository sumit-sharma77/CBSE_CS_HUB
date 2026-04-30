import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { NavbarComponent } from './shared/ui/navbar/navbar.component';
import { ToastService } from './shared/ui/toast/toast.service';
import { ToastComponent } from './shared/ui/toast/toast.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, ToastComponent],
  template: `
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <!-- Toast overlay -->
    @for (toast of toastService.toasts(); track toast.id) {
      <app-toast
        [message]="toast.message"
        [variant]="toast.variant"
        [duration]="toast.duration ?? 4000"
        (dismissed)="toastService.dismiss(toast.id)" />
    }
  `
})
export class App implements OnInit {
  private authService = inject(AuthService);
  readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.authService.init();
  }
}

