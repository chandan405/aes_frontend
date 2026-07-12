import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = signal(false);
  success = signal(false);
  error = signal('');

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.success.set(false);

    const { email } = this.forgotForm.value;
    this.authService.forgotPassword(email!).subscribe({
      next: (response) => {
        this.success.set(true);
        this.loading.set(false);
        this.toast.success(response.message || 'Reset link sent to your email.');
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to send reset link. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
