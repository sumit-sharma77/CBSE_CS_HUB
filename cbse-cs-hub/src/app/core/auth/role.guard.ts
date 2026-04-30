import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard = (requiredRole: 'ADMIN' | 'STUDENT'): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const user = auth.currentUser();
    if (!user) {
      router.navigate(['/login']);
      return false;
    }
    if (user.role !== requiredRole) {
      router.navigate(['/practice']);
      return false;
    }
    return true;
  };
};
