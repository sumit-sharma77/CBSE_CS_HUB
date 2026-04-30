import { Routes } from '@angular/router';
import { roleGuard } from '../../core/auth/role.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    canActivate: [roleGuard('ADMIN')],
    loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'users',
    canActivate: [roleGuard('ADMIN')],
    loadComponent: () => import('./users/admin-users.component').then(m => m.AdminUsersComponent)
  },
  {
    path: 'subscriptions',
    canActivate: [roleGuard('ADMIN')],
    loadComponent: () => import('./subscriptions/admin-subscriptions.component').then(m => m.AdminSubscriptionsComponent)
  },
  {
    path: 'content',
    canActivate: [roleGuard('ADMIN')],
    loadComponent: () => import('./content/admin-content.component').then(m => m.AdminContentComponent)
  }
];
