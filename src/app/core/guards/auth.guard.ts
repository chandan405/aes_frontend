import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (authService.isAuthenticated()) {
    return true;
  }

  toast.warning('Please log in to access the admin portal.');
  router.navigate(['/admin/login']);
  return false;
};

export const adminGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  if (!authService.isAuthenticated()) {
    toast.warning('Please log in to access the admin portal.');
    router.navigate(['/admin/login']);
    return false;
  }

  toast.error('You do not have admin permissions.');
  router.navigate(['/']);
  return false;
};

export const superAdminGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (authService.isAuthenticated() && authService.isSuperAdmin()) {
    return true;
  }

  toast.error('Super Admin access required.');
  router.navigate(['/admin/dashboard']);
  return false;
};

export const publicGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    router.navigate(['/admin/dashboard']);
    return false;
  }
  return true;
};
