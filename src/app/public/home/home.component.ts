import { Component, OnInit, OnDestroy, signal, inject, ElementRef, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgStyle, isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Banner, Service, GalleryImage, Client } from '../../core/models/api.models';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgClass, NgStyle],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  banners = signal<Banner[]>([]);
  services = signal<Service[]>([]);
  featuredGallery = signal<GalleryImage[]>([]);
  clients = signal<Client[]>([]);
  currentSlide = signal(0);
  private sliderInterval: ReturnType<typeof setInterval> | null = null;

  currentBanner = () => this.banners()[this.currentSlide()] || null;

  quickStats = [
    { value: '20+', label: 'Years Experience' },
    { value: '500+', label: 'Happy Clients' },
    { value: '1000+', label: 'Projects Done' },
    { value: '50+', label: 'Certified Engineers' },
  ];

  stats = [
    { icon: '📅', value: '20+', label: 'Years of Experience' },
    { icon: '🏆', value: '500+', label: 'Clients Served' },
    { icon: '🔧', value: '1000+', label: 'Projects Completed' },
    { icon: '👷', value: '50+', label: 'Certified Engineers' },
  ];

  whyChooseUs = [
    'ASNT Level III Certified',
    'ISO Compliant',
    '24/7 Support',
    'Advanced Equipment',
    'Pan-India Presence',
    'Industry Experts',
  ];

  aboutCards = [
    { icon: '🔬', title: 'Advanced NDT', desc: 'PAUT, TOFD, UT, RT, MT, PT' },
    { icon: '🎓', title: 'Training', desc: 'ASNT Level I, II, III Programs' },
    { icon: '🏗️', title: 'Civil Testing', desc: 'UPV, Rebound Hammer, Rebar' },
    { icon: '📊', title: 'Consultancy', desc: 'Engineering & Inspection Reports' },
  ];

  industries = [
    { icon: '✈️', name: 'Aerospace' },
    { icon: '🛡️', name: 'Defense' },
    { icon: '⛽', name: 'Oil & Gas' },
    { icon: '⚡', name: 'Power Plant' },
    { icon: '🏭', name: 'Steel Plant' },
    { icon: '🚂', name: 'Railway' },
    { icon: '⚓', name: 'Marine' },
    { icon: '🏗️', name: 'Infrastructure' },
    { icon: '⛏️', name: 'Mining' },
    { icon: '🏢', name: 'Commercial' },
  ];

  ngOnInit(): void {
    this.loadData();
    this.startSlider();
  }

  ngOnDestroy(): void {
    if (this.sliderInterval) clearInterval(this.sliderInterval);
  }

  private loadData(): void {
    this.api.getBanners().subscribe({ next: r => r.data && this.banners.set(r.data) });
    this.api.getServices().subscribe({ next: r => r.data && this.services.set(r.data) });
    this.api.getFeaturedGallery().subscribe({ next: r => r.data && this.featuredGallery.set(r.data) });
    this.api.getClients().subscribe({ next: r => r.data && this.clients.set(r.data) });
  }

  private startSlider(): void {
    if (this.isBrowser) {
      this.sliderInterval = setInterval(() => {
        if (this.banners().length > 1) this.nextSlide();
      }, 5000);
    }
  }

  nextSlide(): void {
    const len = this.banners().length;
    if (len > 0) this.currentSlide.update(v => (v + 1) % len);
  }

  prevSlide(): void {
    const len = this.banners().length;
    if (len > 0) this.currentSlide.update(v => (v - 1 + len) % len);
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
  }

  openGallery(): void {
    this.router.navigate(['/gallery']);
  }

  getServiceIcon(name: string): string {
    const icons: Record<string, string> = {
      'Radiographic Testing': '📡',
      'Magnetic Particle': '🔧',
      'Dye Penetrant': '🎨',
      'Ultrasonic Testing': '📶',
      'Eddy Current': '⚡',
      'Thickness Measurement': '📏',
      'Corrosion Mapping': '🗺️',
      'Advanced NDT': '🔬',
      'Civil Engineering': '🏗️',
      'Condition Monitoring': '📊',
    };
    for (const [key, icon] of Object.entries(icons)) {
      if (name.toLowerCase().includes(key.toLowerCase())) return icon;
    }
    return '⚙️';
  }
}
