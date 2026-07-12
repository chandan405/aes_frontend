import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Industry } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-industry-mgmt',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './industry-mgmt.component.html',
})
export class IndustryMgmtComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  industries = signal<Industry[]>([]);
  loading = signal(true);
  submitting = signal(false);

  // Modal setup
  showModal = signal(false);
  isEditMode = signal(false);
  selectedIndustryId = signal<string | null>(null);

  imageFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);

  industryForm = this.fb.group({
    name: ['', Validators.required],
    icon: [''],
    description: [''],
    order: [0],
    status: ['ACTIVE', Validators.required],
  });

  ngOnInit(): void {
    this.loadIndustries();
  }

  loadIndustries(): void {
    this.loading.set(true);
    this.api.getAllIndustries().subscribe({
      next: r => { if (r.data) this.industries.set(r.data); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load industries'); this.loading.set(false); },
    });
  }

  openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedIndustryId.set(null);
    this.imageFile.set(null);
    this.imagePreview.set(null);
    this.industryForm.reset({ order: 0, status: 'ACTIVE' });
    this.showModal.set(true);
  }

  openEditModal(ind: Industry): void {
    this.isEditMode.set(true);
    this.selectedIndustryId.set(ind._id);
    this.imageFile.set(null);
    this.imagePreview.set(ind.imageUrl || null);
    this.industryForm.patchValue({
      name: ind.name,
      icon: ind.icon,
      description: ind.description,
      order: ind.order,
      status: ind.status,
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
    if (this.industryForm.invalid) return;
    this.submitting.set(true);

    const formData = new FormData();
    formData.append('name', this.industryForm.value.name!);
    formData.append('icon', this.industryForm.value.icon || '');
    formData.append('description', this.industryForm.value.description || '');
    formData.append('order', String(this.industryForm.value.order || 0));
    formData.append('status', this.industryForm.value.status!);

    if (this.imageFile()) {
      formData.append('image', this.imageFile()!);
    }

    const request = this.isEditMode()
      ? this.api.updateIndustry(this.selectedIndustryId()!, formData)
      : this.api.createIndustry(formData);

    request.subscribe({
      next: () => {
        this.toast.success(this.isEditMode() ? 'Industry updated' : 'Industry created');
        this.submitting.set(false);
        this.closeModal();
        this.loadIndustries();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to save industry');
        this.submitting.set(false);
      },
    });
  }

  deleteIndustry(id: string): void {
    if (confirm('Are you sure you want to remove this industry?')) {
      this.api.deleteIndustry(id).subscribe({
        next: () => {
          this.toast.success('Industry removed');
          this.loadIndustries();
        },
        error: () => this.toast.error('Failed to remove industry'),
      });
    }
  }
}
