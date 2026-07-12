import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Client } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-client-mgmt',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './client-mgmt.component.html',
})
export class ClientMgmtComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  clients = signal<Client[]>([]);
  loading = signal(true);
  submitting = signal(false);

  // Modal settings
  showModal = signal(false);
  isEditMode = signal(false);
  selectedClientId = signal<string | null>(null);

  imageFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);

  clientForm = this.fb.group({
    name: ['', Validators.required],
    website: [''],
    description: [''],
    order: [0],
    status: ['ACTIVE', Validators.required],
  });

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading.set(true);
    this.api.getAllClients().subscribe({
      next: r => { if (r.data) this.clients.set(r.data); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load clients'); this.loading.set(false); },
    });
  }

  openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedClientId.set(null);
    this.imageFile.set(null);
    this.imagePreview.set(null);
    this.clientForm.reset({ order: 0, status: 'ACTIVE' });
    this.showModal.set(true);
  }

  openEditModal(client: Client): void {
    this.isEditMode.set(true);
    this.selectedClientId.set(client._id);
    this.imageFile.set(null);
    this.imagePreview.set(client.logoUrl || null);
    this.clientForm.patchValue({
      name: client.name,
      website: client.website,
      description: client.description,
      order: client.order,
      status: client.status,
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageFile.set(file);
      const reader = new FileReader();
      reader.onload = () => this.imagePreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.clientForm.invalid) return;
    this.submitting.set(true);

    const formData = new FormData();
    formData.append('name', this.clientForm.value.name!);
    formData.append('website', this.clientForm.value.website || '');
    formData.append('description', this.clientForm.value.description || '');
    formData.append('order', String(this.clientForm.value.order || 0));
    formData.append('status', this.clientForm.value.status!);

    if (this.imageFile()) {
      formData.append('logo', this.imageFile()!);
    }

    const request = this.isEditMode()
      ? this.api.updateClient(this.selectedClientId()!, formData)
      : this.api.createClient(formData);

    request.subscribe({
      next: () => {
        this.toast.success(this.isEditMode() ? 'Client profile saved' : 'Client profile added');
        this.submitting.set(false);
        this.closeModal();
        this.loadClients();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to save client');
        this.submitting.set(false);
      },
    });
  }

  deleteClient(id: string): void {
    if (confirm('Are you sure you want to remove this client?')) {
      this.api.deleteClient(id).subscribe({
        next: () => {
          this.toast.success('Client profile removed');
          this.loadClients();
        },
        error: () => this.toast.error('Failed to remove client'),
      });
    }
  }
}
