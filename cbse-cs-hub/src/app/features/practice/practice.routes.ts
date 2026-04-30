import { Routes } from '@angular/router';

export const practiceRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./test-config/test-config.component').then(m => m.TestConfigComponent)
  },
  {
    path: 'session/:sessionId',
    loadComponent: () => import('./test-runner/test-runner.component').then(m => m.TestRunnerComponent)
  },
  {
    path: 'result/:sessionId',
    loadComponent: () => import('./test-result/test-result.component').then(m => m.TestResultComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./test-history/test-history.component').then(m => m.TestHistoryComponent)
  }
];
