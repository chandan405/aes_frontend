import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';
import { User } from '../user/user';
import { ToastService } from '../../shared/toast/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const userService = inject(User);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (authService.isAuthenticated()) {
    const expectedRole = route.data['expectedRole'];
    if (!expectedRole) {
      return true;
    }

    const userRole = authService.getRole();
    if (userRole === expectedRole) {
      return true;
    }

    toastService.error('Unauthorized access. You do not have the required permissions.');
    router.navigate(['/cafe/dashboard']);
    return false;
  }

  toastService.warning('Please log in to access this page.');
  userService.showAuthModal.set(true);
  router.navigate(['/']);
  return false;
};
