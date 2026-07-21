import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Service } from '../../../core/models/api.models';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-service-detail',
  imports: [],
  templateUrl: './service-detail.component.html',
})
export class ServiceDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);

  service = signal<Service | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.api.getServiceBySlug(slug).subscribe({
      next: r => {
        if (r.data) {
          this.service.set(r.data);
          this.seo.updateMetaTags(
            `${r.data.name} - Abinash Engineering Services`,
            r.data.description || `Professional ${r.data.name} Non-Destructive Testing (NDT) inspection and certification services by Abinash Engineering Services.`,
            `NDT, ${r.data.name}, inspection, engineering testing, quality assurance, Abinash Engineering Services`
          );
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
