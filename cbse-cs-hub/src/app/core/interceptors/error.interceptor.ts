import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

/**
 * Handles 401 responses: attempts one token refresh then retries.
 * If refresh also fails, propagates the error.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // Only attempt refresh for 401s that are not auth endpoints themselves
      if (
        err.status === 401 &&
        !req.url.includes('/auth/login') &&
        !req.url.includes('/auth/refresh') &&
        !req.url.includes('/auth/register')
      ) {
        return auth.refreshToken().pipe(
          switchMap(() => next(req.clone({ withCredentials: true }))),
          catchError((refreshErr) => {
            auth.clearSession();
            return throwError(() => refreshErr);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
