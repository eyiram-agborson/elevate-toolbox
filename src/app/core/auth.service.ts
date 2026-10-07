import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, shareReplay, switchMap, tap, throwError, finalize } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role } from '../services/role';
import { Me } from './models';

const TOKEN_KEY = 'elevate.token';
const REFRESH_KEY = 'elevate.refreshToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly roles = inject(Role);

  /** The signed-in person, from GET /elevate/me. */
  readonly me = signal<Me | null>(null);

  private refreshing$: Observable<string> | null = null;

  get token(): string | null {
    return this.read(TOKEN_KEY);
  }

  get refreshToken(): string | null {
    return this.read(REFRESH_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  get fullName(): string {
    const m = this.me();
    return m ? `${m.firstName ?? ''} ${m.lastName ?? ''}`.trim() : '';
  }

  login(email: string, password: string): Observable<Me> {
    return this.http
      .post<{ token: string; refreshToken: string }>(
        `${environment.apiBaseUrl}/authentication/login`,
        { email, password },
      )
      .pipe(
        tap((res) => this.store(res.token, res.refreshToken)),
        switchMap(() => this.loadMe()),
      );
  }

  /** The main Toolbox hands over tokens as query parameters after sign-in. */
  acceptHandoff(token: string, refreshToken: string): Observable<Me> {
    this.store(token, refreshToken);
    return this.loadMe();
  }

  loadMe(): Observable<Me> {
    return this.http.get<Me>(`${environment.apiBaseUrl}/elevate/me`).pipe(
      tap((me) => {
        this.me.set(me);
        this.roles.applyLevels(me.levels);
      }),
    );
  }

  /** Gets a new access token with the refresh token. One request at a time. */
  refresh(): Observable<string> {
    const refreshToken = this.refreshToken;
    if (!refreshToken) return throwError(() => new Error('No refresh token'));

    if (!this.refreshing$) {
      this.refreshing$ = this.http
        .post<{ token: string; refreshToken: string }>(
          `${environment.apiBaseUrl}/authentication/refresh-Token`,
          { refreshToken },
        )
        .pipe(
          tap((res) => this.store(res.token, res.refreshToken)),
          map((res) => res.token),
          finalize(() => (this.refreshing$ = null)),
          shareReplay(1),
        );
    }
    return this.refreshing$;
  }

  /** True when a stored token still works; loads the person as a side effect. */
  restore(): Observable<boolean> {
    if (!this.isLoggedIn()) return of(false);
    if (this.me()) return of(true);
    return this.loadMe().pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  logout(): void {
    this.clear();
    this.router.navigate(['/login']);
  }

  clear(): void {
    this.me.set(null);
    this.roles.reset();
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
    } catch {
      /* storage unavailable */
    }
  }

  private store(token: string, refreshToken: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REFRESH_KEY, refreshToken);
    } catch {
      /* storage unavailable */
    }
  }

  private read(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
}
