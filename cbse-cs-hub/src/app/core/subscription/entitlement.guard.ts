import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

interface EntitlementResult {
  allowed: boolean;
  questionsLimit: number | null;
  reason: string;
}

export const entitlementGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const topicId = route.params['topicId'] ?? route.queryParams['topicId'];

  if (!topicId) return true;

  return http
    .get<EntitlementResult>(`${environment.apiUrl}/entitlement/check?topic=${topicId}`)
    .pipe(
      map((result) => {
        if (result.allowed) return true;
        router.navigate(['/plans'], { queryParams: { reason: result.reason } });
        return false;
      }),
      catchError(() => of(true))
    );
};
