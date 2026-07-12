import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Banner } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-banner-mgmt',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './banner-mgmt.component.html',
})
export class BannerMgmtComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  banners = signal<Banner[]>([]);
  loading = signal(true);
  submitting = signal(false);

  // Modal states
  showModal = signal(false);
  isEditMode = signal(false);
  selectedBannerId = signal<string | null>(null);

  imageFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);

  bannerForm = this.fb.group({
    title: ['', Validators.required],
    subtitle: [''],
    description: [''],
    ctaText: ['Learn More'],
    ctaLink: ['/services'],
    order: [0],
  });

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners(): void {
    this.loading.set(true);
    this.api.getAllBanners().subscribe({
      next: r => { if (r.data) this.banners.set(r.data); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load banners'); this.loading.set(false); },
    });
  }

  openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedBannerId.set(null);
    this.imageFile.set(null);
    this.imagePreview.set(null);
    this.bannerForm.reset({ ctaText: 'Learn More', ctaLink: '/services', order: 0 });
    this.showModal.set(true);
  }

  openEditModal(banner: Banner): void {
    this.isEditMode.set(true);
    this.selectedBannerId.set(banner._id);
    this.imageFile.set(null);
    this.imagePreview.set(banner.imageUrl);
    this.bannerForm.patchValue({
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      ctaText: banner.ctaText,
      ctaLink: banner.ctaLink,
      order: banner.order,
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
    if (this.bannerForm.invalid) return;
    this.submitting.set(true);

    const formData = new FormData();
    formData.append('title', this.bannerForm.value.title!);
    formData.append('subtitle', this.bannerForm.value.subtitle || '');
    formData.append('description', this.bannerForm.value.description || '');
    formData.append('ctaText', this.bannerForm.value.ctaText || 'Learn More');
    formData.append('ctaLink', this.bannerForm.value.ctaLink || '/services');
    formData.append('order', String(this.bannerForm.value.order || 0));

    if (this.imageFile()) {
      formData.append('image', this.imageFile()!);
    }

    const request = this.isEditMode()
      ? this.api.updateBanner(this.selectedBannerId()!, formData)
      : this.api.createBanner(formData);

    request.subscribe({
      next: () => {
        this.toast.success(this.isEditMode() ? 'Banner updated' : 'Banner created');
        this.submitting.set(false);
        this.closeModal();
        this.loadBanners();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to save banner');
        this.submitting.set(false);
      },
    });
  }

  toggleStatus(banner: Banner): void {
    this.api.toggleBannerStatus(banner._id).subscribe({
      next: () => {
        this.toast.success('Status updated');
        this.loadBanners();
      },
      error: () => this.toast.error('Failed to update status'),
    });
  }

  deleteBanner(id: string): void {
    if (confirm('Are you sure you want to delete this banner?')) {
      this.api.deleteBanner(id).subscribe({
        next: () => {
          this.toast.success('Banner deleted');
          this.loadBanners();
        },
        error: () => this.toast.error('Failed to delete banner'),
      });
    }
  }
}
