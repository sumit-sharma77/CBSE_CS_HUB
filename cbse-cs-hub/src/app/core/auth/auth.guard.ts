import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.currentUser()) {
    return true;
  }

  const returnUrl = route.url.map((s) => s.path).join('/');
  router.navigate(['/login'], { queryParams: { returnUrl: `/${returnUrl}` } });
  return false;
};
