import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AdminUser } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-user-mgmt',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './user-mgmt.component.html',
})
export class UserMgmtComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  users = signal<AdminUser[]>([]);
  loading = signal(true);
  submitting = signal(false);

  // Modal setup
  showModal = signal(false);
  isEditMode = signal(false);
  selectedUserId = signal<string | null>(null);

  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    role: ['ADMIN', Validators.required],
    status: ['ACTIVE', Validators.required],
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.api.getUsers().subscribe({
      next: r => { if (r.data) this.users.set(r.data); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load user list'); this.loading.set(false); },
    });
  }

  openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedUserId.set(null);
    this.userForm.reset({ role: 'ADMIN', status: 'ACTIVE' });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal.set(true);
  }

  openEditModal(user: AdminUser): void {
    this.isEditMode.set(true);
    this.selectedUserId.set(user._id);
    this.userForm.reset();
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;
    this.submitting.set(true);

    const body = { ...this.userForm.value };
    if (this.isEditMode()) {
      delete body.password;
    }

    const request = this.isEditMode()
      ? this.api.updateUser(this.selectedUserId()!, body as Partial<AdminUser>)
      : this.api.createUser(body as any);

    request.subscribe({
      next: () => {
        this.toast.success(this.isEditMode() ? 'User updated successfully' : 'User account created');
        this.submitting.set(false);
        this.closeModal();
        this.loadUsers();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to save user account');
        this.submitting.set(false);
      },
    });
  }

  deleteUser(id: string): void {
    if (confirm('Delete this admin user account permanently?')) {
      this.api.deleteUser(id).subscribe({
        next: () => {
          this.toast.success('User account deleted');
          this.loadUsers();
        },
        error: () => this.toast.error('Failed to delete user account'),
      });
    }
  }
}
