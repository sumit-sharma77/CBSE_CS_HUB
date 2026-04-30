import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Adds withCredentials: true to all outgoing HTTP requests,
 * ensuring httpOnly cookies are sent to the API.
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const withCreds = req.clone({ withCredentials: true });
  return next(withCreds);
};
