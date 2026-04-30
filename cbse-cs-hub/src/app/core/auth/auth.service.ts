import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from './user.model';

export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly base = environment.apiUrl;

  /** Signal holding the currently authenticated user (null = not logged in) */
  readonly currentUser = signal<User | null>(null);

  /** Initialise: try to restore session from existing cookie */
  init(): void {
    this.http.get<User>(`${this.base}/users/me`).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError(() => { this.currentUser.set(null); return of(null); })
    ).subscribe();
  }

  register(email: string, password: string, displayName?: string): Observable<void>;
  register(dto: RegisterRequest): Observable<void>;
  register(emailOrDto: string | RegisterRequest, password?: string, displayName?: string): Observable<void> {
    const dto: RegisterRequest = typeof emailOrDto === 'string'
      ? { email: emailOrDto, password: password!, displayName: displayName ?? '' }
      : emailOrDto;
    return this.http.post<void>(`${this.base}/auth/register`, dto).pipe(
      tap(() => this.fetchMe().subscribe())
    );
  }

  login(email: string, password: string): Observable<void>;
  login(dto: LoginRequest): Observable<void>;
  login(emailOrDto: string | LoginRequest, password?: string): Observable<void> {
    const dto: LoginRequest = typeof emailOrDto === 'string'
      ? { email: emailOrDto, password: password! }
      : emailOrDto;
    return this.http.post<void>(`${this.base}/auth/login`, dto).pipe(
      tap(() => this.fetchMe().subscribe())
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.base}/auth/logout`, {}).pipe(
      tap(() => {
        this.currentUser.set(null);
        this.router.navigate(['/login']);
      })
    );
  }

  refreshToken(): Observable<void> {
    return this.http.post<void>(`${this.base}/auth/refresh`, {});
  }

  clearSession(): void {
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  private fetchMe(): Observable<User | null> {
    return this.http.get<User>(`${this.base}/users/me`).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError(() => of(null))
    );
  }
}
