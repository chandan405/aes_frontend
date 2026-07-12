import { Injectable, signal } from '@angular/core';
import { environment } from "../../../environments/environment"
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class User {
  url = environment.apiUrl;

  // Reactively track authentication states
  isLoggedIn = signal<boolean>(false);
  currentUser = signal<any>(null);
  
  // Reactively control the global Auth Modal Dialog
  showAuthModal = signal<boolean>(false);
  authModalTab = signal<'login' | 'signup' | 'forgot'>('login');

  constructor(private http: HttpClient) {
    // SSR safe check for browser storage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        this.isLoggedIn.set(true);
        try {
          this.currentUser.set(JSON.parse(user));
        } catch {
          this.currentUser.set({ name: 'User' });
        }
      }
    }
  }

  signUp(data: any) {
    return this.http.post(this.url + "user/signup", data, {
      headers: new HttpHeaders().set("content-Type", "application/json")
    })
  }

  login(data: any) {
    return this.http.post(this.url + "user/login", data, {
      headers: new HttpHeaders().set("content-Type", "application/json")
    })
  }

  forgotPassword(data: any) {
    return this.http.post(this.url + "user/forgot-password", data, {
      headers: new HttpHeaders().set("content-Type", "application/json")
    })
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    this.showAuthModal.set(false);
  }
}
