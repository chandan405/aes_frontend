import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  loading = signal(false);
  error = signal('');
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  changeForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  }, {
    validators: (group) => {
      const newPass = group.get('newPassword')?.value;
      const confirmPass = group.get('confirmPassword')?.value;
      return newPass === confirmPass ? null : { passwordMismatch: true };
    }
  });

  onSubmit(): void {
    if (this.changeForm.invalid) {
      this.changeForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { currentPassword, newPassword } = this.changeForm.value;

    this.authService.changePassword(currentPassword!, newPassword!).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.toast.success(response.message || 'Password updated successfully.');
        this.changeForm.reset();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to update password. Please check your current password.');
        this.loading.set(false);
      },
    });
  }
}
