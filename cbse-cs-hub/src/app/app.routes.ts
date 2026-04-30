import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./features/auth/password-reset/password-reset.component').then(m => m.PasswordResetComponent) },
  { path: 'reset-password', loadComponent: () => import('./features/auth/password-reset/password-reset.component').then(m => m.PasswordResetComponent) },
  { path: 'plans', loadComponent: () => import('./features/subscription/plans/plans.component').then(m => m.PlansComponent) },
  { path: 'practice', canActivate: [authGuard], loadChildren: () => import('./features/practice/practice.routes').then(m => m.practiceRoutes) },
  { path: 'leaderboard', canActivate: [authGuard], loadComponent: () => import('./features/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent) },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'admin', canActivate: [authGuard, roleGuard('ADMIN')], loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes) },
  { path: '**', redirectTo: '' }
];
