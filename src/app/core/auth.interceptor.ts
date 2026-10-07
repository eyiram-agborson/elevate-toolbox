import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

const withToken = (req: HttpRequest<unknown>, token: string | null) =>
  token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

// Adds the access token to calls to the Toolbox API. On a 401 it tries the refresh
// token once; if that also fails the person is signed out.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  const isApi = req.url.startsWith(environment.apiBaseUrl);
  const isAuthCall =
    req.url.includes('/authentication/login') || req.url.includes('/authentication/refresh-Token');
  if (!isApi || isAuthCall) return next(req);

  return next(withToken(req, auth.token)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) return throwError(() => error);

      return auth.refresh().pipe(
        switchMap((token) => next(withToken(req, token))),
        catchError((refreshError) => {
          auth.logout();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
