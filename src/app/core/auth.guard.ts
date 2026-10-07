import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, of } from 'rxjs';
import { AuthService } from './auth.service';

// Everything inside the layout needs a signed-in person. The main Toolbox can send
// people here with ?token=...&refreshToken=...; those are picked up (and removed
// from the address bar) before the page opens.
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = route.queryParamMap.get('token');
  const refreshToken = route.queryParamMap.get('refreshToken');

  if (token && refreshToken) {
    const cleanPath = state.url.split('?')[0] || '/dashboard';
    return auth.acceptHandoff(token, refreshToken).pipe(
      map(() => router.createUrlTree([cleanPath === '/' ? '/dashboard' : cleanPath])),
    );
  }

  return auth.restore().pipe(map((ok) => (ok ? true : router.createUrlTree(['/login']))));
};

// The login page itself: someone already signed in goes straight to the dashboard.
export const loginRedirectGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) return of(true);
  return auth.restore().pipe(map((ok) => (ok ? router.createUrlTree(['/dashboard']) : true)));
};
