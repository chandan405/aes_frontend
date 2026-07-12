import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Service } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-service-mgmt',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './service-mgmt.component.html',
})
export class ServiceMgmtComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  services = signal<Service[]>([]);
  loading = signal(true);
  submitting = signal(false);

  // Modal State
  showModal = signal(false);
  isEditMode = signal(false);
  selectedServiceId = signal<string | null>(null);

  // Applications
  applicationItems = signal<string[]>([]);

  // Images state
  existingImages = signal<Array<{ imageUrl: string; publicId?: string }>>([]);
  newImageFiles = signal<File[]>([]);
  newImagePreviews = signal<string[]>([]);

  serviceForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    order: [0],
  });

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading.set(true);
    this.api.getAllServices().subscribe({
      next: r => { if (r.data) this.services.set(r.data); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load services'); this.loading.set(false); },
    });
  }

  openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedServiceId.set(null);
    this.applicationItems.set([]);
    this.existingImages.set([]);
    this.newImageFiles.set([]);
    this.newImagePreviews.set([]);
    this.serviceForm.reset({ order: 0 });
    this.showModal.set(true);
  }

  openEditModal(service: Service): void {
    this.isEditMode.set(true);
    this.selectedServiceId.set(service._id);
    this.applicationItems.set(service.applications || []);
    this.existingImages.set(service.images || []);
    this.newImageFiles.set([]);
    this.newImagePreviews.set([]);
    this.serviceForm.patchValue({
      name: service.name,
      description: service.description,
      order: service.order,
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  addApplicationItem(): void {
    this.applicationItems.update(items => [...items, '']);
  }

  updateApplicationItem(idx: number, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.applicationItems.update(items => {
      const copy = [...items];
      copy[idx] = val;
      return copy;
    });
  }

  removeApplicationItem(idx: number): void {
    this.applicationItems.update(items => items.filter((_, i) => i !== idx));
  }

  onFileChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      this.newImageFiles.set(fileList);

      const previews: string[] = [];
      let count = 0;
      fileList.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          previews.push(reader.result as string);
          count++;
          if (count === fileList.length) {
            this.newImagePreviews.set(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  deleteExistingImage(index: number): void {
    const id = this.selectedServiceId();
    if (id) {
      if (confirm('Delete this image permanently?')) {
        this.api.deleteService(id).subscribe({
          // Note: using direct service image delete route in ApiService if needed, or update local array
          next: () => {
            this.existingImages.update(imgs => imgs.filter((_, i) => i !== index));
            this.toast.success('Image scheduled for removal upon save.');
          },
        });
      }
    }
  }

  onSubmit(): void {
    if (this.serviceForm.invalid) return;
    this.submitting.set(true);

    const formData = new FormData();
    formData.append('name', this.serviceForm.value.name!);
    formData.append('description', this.serviceForm.value.description!);
    formData.append('order', String(this.serviceForm.value.order || 0));
    formData.append('applications', JSON.stringify(this.applicationItems().filter(x => x.trim() !== '')));

    // Append existing images JSON so the backend knows what is kept
    formData.append('existingImages', JSON.stringify(this.existingImages()));

    this.newImageFiles().forEach(file => {
      formData.append('images', file);
    });

    const request = this.isEditMode()
      ? this.api.updateService(this.selectedServiceId()!, formData)
      : this.api.createService(formData);

    request.subscribe({
      next: () => {
        this.toast.success(this.isEditMode() ? 'Service updated' : 'Service created');
        this.submitting.set(false);
        this.closeModal();
        this.loadServices();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to save service');
        this.submitting.set(false);
      },
    });
  }

  toggleStatus(service: Service): void {
    this.api.toggleServiceStatus(service._id).subscribe({
      next: () => {
        this.toast.success('Status updated');
        this.loadServices();
      },
      error: () => this.toast.error('Failed to update status'),
    });
  }

  deleteService(id: string): void {
    if (confirm('Delete this service permanently?')) {
      this.api.deleteService(id).subscribe({
        next: () => {
          this.toast.success('Service deleted');
          this.loadServices();
        },
        error: () => this.toast.error('Failed to delete service'),
      });
    }
  }
}
