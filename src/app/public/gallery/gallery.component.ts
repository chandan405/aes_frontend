import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { GalleryImage } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-gallery',
  imports: [NgClass],
  templateUrl: './gallery.component.html',
})
export class GalleryComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  images = signal<GalleryImage[]>([]);
  loading = signal(true);
  activeFilter = signal<string>('all');

  // Lightbox State
  lightboxOpen = signal(false);
  currentImageIdx = signal(0);

  filters = [
    { label: 'All Work', value: 'all' },
    { label: 'NDT Inspection', value: 'NDT Inspection' },
    { label: 'Advanced NDT', value: 'Advanced Testing' },
    { label: 'Civil NDT', value: 'Civil Testing' },
    { label: 'Training Gallery', value: 'Training Gallery' },
    { label: 'Equipments', value: 'Equipment Gallery' },
    { label: 'Projects', value: 'Client Projects' },
    { label: 'Events', value: 'Company Events' },
  ];

  filteredImages = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'all') return this.images();
    return this.images().filter(img => img.category === filter);
  });

  currentLightboxImage = computed(() => {
    const imgs = this.filteredImages();
    const idx = this.currentImageIdx();
    return imgs[idx] || null;
  });

  ngOnInit(): void {
    this.api.getGallery().subscribe({
      next: r => {
        if (r.data) this.images.set(r.data);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load gallery images');
        this.loading.set(false);
      },
    });
  }

  openLightbox(idx: number): void {
    this.currentImageIdx.set(idx);
    this.lightboxOpen.set(true);
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
  }

  nextImage(event: MouseEvent): void {
    event.stopPropagation();
    const len = this.filteredImages().length;
    if (len > 0) {
      this.currentImageIdx.update(idx => (idx + 1) % len);
    }
  }

  prevImage(event: MouseEvent): void {
    event.stopPropagation();
    const len = this.filteredImages().length;
    if (len > 0) {
      this.currentImageIdx.update(idx => (idx - 1 + len) % len);
    }
  }
}
