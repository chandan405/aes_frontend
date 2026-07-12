import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { ApiResponse, AuthTokens, LoginCredentials, AuthUser } from '../models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  // ── Signals ──────────────────────────────────────────────────────────────
  private _user = signal<AuthUser | null>(null);
  private _isAuthenticated = signal<boolean>(false);

  user = computed(() => this._user());
  isAuthenticated = computed(() => this._isAuthenticated());
  isAdmin = computed(() => {
    const user = this._user();
    return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  });
  isSuperAdmin = computed(() => this._user()?.role === 'SUPER_ADMIN');

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router,
  ) {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const token = this.storage.getAccessToken();
    const user = this.storage.getUser<AuthUser>();
    if (token && user) {
      this._user.set(user);
      this._isAuthenticated.set(true);
    }
  }

  login(credentials: LoginCredentials): Observable<ApiResponse<AuthTokens>> {
    return this.http.post<ApiResponse<AuthTokens>>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          const { accessToken, refreshToken, user } = response.data;
          this.storage.setTokens(accessToken, refreshToken);
          this.storage.setUser(user);
          this._user.set(user);
          this._isAuthenticated.set(true);
        }
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe();
    this.storage.clear();
    this._user.set(null);
    this._isAuthenticated.set(false);
    this.router.navigate(['/admin/login']);
  }

  refreshToken(): Observable<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    const refreshToken = this.storage.getRefreshToken();
    return this.http.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      `${this.apiUrl}/auth/refresh`,
      { refreshToken }
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.storage.setTokens(response.data.accessToken, response.data.refreshToken);
        }
      })
    );
  }

  getRole(): string | undefined {
    return this._user()?.role;
  }

  forgotPassword(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/reset-password`, { token, password });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/change-password`, { currentPassword, newPassword });
  }
}
