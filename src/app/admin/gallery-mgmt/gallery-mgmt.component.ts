import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { GalleryImage, GalleryCategory } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-gallery-mgmt',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './gallery-mgmt.component.html',
})
export class GalleryMgmtComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  images = signal<GalleryImage[]>([]);
  loading = signal(true);
  submitting = signal(false);

  activeFilter = signal<string>('all');

  filters = [
    { label: 'All Categories', value: 'all' },
    { label: 'NDT Inspection', value: 'NDT Inspection' },
    { label: 'Advanced NDT', value: 'Advanced Testing' },
    { label: 'Civil NDT', value: 'Civil Testing' },
    { label: 'Training Gallery', value: 'Training Gallery' },
    { label: 'Equipments', value: 'Equipment Gallery' },
    { label: 'Projects', value: 'Client Projects' },
    { label: 'Events', value: 'Company Events' },
  ];

  // Modal setup
  showModal = signal(false);
  isEditMode = signal(false);
  selectedImageId = signal<string | null>(null);

  imageFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);

  galleryForm = this.fb.group({
    title: ['', Validators.required],
    category: ['NDT Inspection', Validators.required],
    description: [''],
    altText: ['', Validators.required],
    displayOrder: [0],
    isFeatured: [false],
    status: ['ACTIVE', Validators.required],
  });

  ngOnInit(): void {
    this.loadGallery();
  }

  loadGallery(): void {
    this.loading.set(true);
    const filterCat = this.activeFilter();
    const query = filterCat === 'all' ? undefined : { category: filterCat };

    this.api.getAllGallery(query).subscribe({
      next: r => { if (r.data) this.images.set(r.data); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load gallery images'); this.loading.set(false); },
    });
  }

  openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedImageId.set(null);
    this.imageFile.set(null);
    this.imagePreview.set(null);
    this.galleryForm.reset({ category: 'NDT Inspection', displayOrder: 0, isFeatured: false, status: 'ACTIVE' });
    this.showModal.set(true);
  }

  openEditModal(img: GalleryImage): void {
    this.isEditMode.set(true);
    this.selectedImageId.set(img._id);
    this.imageFile.set(null);
    this.imagePreview.set(img.imageUrl);
    this.galleryForm.patchValue({
      title: img.title,
      category: img.category,
      description: img.description,
      altText: img.altText,
      displayOrder: img.displayOrder,
      isFeatured: img.isFeatured,
      status: img.status,
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
    if (this.galleryForm.invalid) return;
    this.submitting.set(true);

    const formData = new FormData();
    formData.append('title', this.galleryForm.value.title!);
    formData.append('category', this.galleryForm.value.category!);
    formData.append('description', this.galleryForm.value.description || '');
    formData.append('altText', this.galleryForm.value.altText!);
    formData.append('displayOrder', String(this.galleryForm.value.displayOrder || 0));
    formData.append('isFeatured', String(this.galleryForm.value.isFeatured || false));
    formData.append('status', this.galleryForm.value.status!);

    if (this.imageFile()) {
      formData.append('image', this.imageFile()!);
    }

    const request = this.isEditMode()
      ? this.api.updateGalleryImage(this.selectedImageId()!, formData)
      : this.api.uploadGalleryImage(formData);

    request.subscribe({
      next: () => {
        this.toast.success(this.isEditMode() ? 'Gallery details saved' : 'Image uploaded successfully');
        this.submitting.set(false);
        this.closeModal();
        this.loadGallery();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to save gallery image');
        this.submitting.set(false);
      },
    });
  }

  toggleStatus(img: GalleryImage): void {
    this.api.toggleGalleryStatus(img._id).subscribe({
      next: () => {
        this.toast.success('Status toggled');
        this.loadGallery();
      },
      error: () => this.toast.error('Failed to change status'),
    });
  }

  deleteImage(id: string): void {
    if (confirm('Delete this gallery photo permanently?')) {
      this.api.deleteGalleryImage(id).subscribe({
        next: () => {
          this.toast.success('Image deleted from gallery');
          this.loadGallery();
        },
        error: () => this.toast.error('Failed to delete image'),
      });
    }
  }
}
