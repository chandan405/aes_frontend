import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  token = signal<string | null>(null);
  loading = signal(false);
  success = signal(false);
  error = signal('');
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  resetForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  }, {
    validators: (group) => {
      const pass = group.get('password')?.value;
      const confirmPass = group.get('confirmPassword')?.value;
      return pass === confirmPass ? null : { passwordMismatch: true };
    }
  });

  ngOnInit(): void {
    // Get token from query parameter
    const tokenParam = this.route.snapshot.queryParamMap.get('token');
    if (!tokenParam) {
      this.error.set('Invalid request: Reset token is missing.');
    } else {
      this.token.set(tokenParam);
    }
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token()) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { password } = this.resetForm.value;

    this.authService.resetPassword(this.token()!, password!).subscribe({
      next: (response) => {
        this.success.set(true);
        this.loading.set(false);
        this.toast.success(response.message || 'Password reset successfully.');
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to reset password. The link may have expired.');
        this.loading.set(false);
      },
    });
  }
}
