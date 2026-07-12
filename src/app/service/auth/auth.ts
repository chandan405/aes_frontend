import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1];
      let decoded = '';
      if (typeof window !== 'undefined') {
        decoded = window.atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      } else {
        decoded = Buffer.from(payload, 'base64').toString('utf-8');
      }
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    if (!token) return false;

    const payload = this.decodeToken(token);
    if (!payload) return false;

    if (payload.exp) {
      const expirationDate = payload.exp * 1000;
      return new Date().getTime() < expirationDate;
    }

    return true;
  }

  getRole(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = this.decodeToken(token);
    return payload ? (payload.role || payload.userRole || null) : null;
  }
}
