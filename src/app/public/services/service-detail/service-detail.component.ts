import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Service } from '../../../core/models/api.models';

@Component({
  selector: 'app-service-detail',
  imports: [],
  templateUrl: './service-detail.component.html',
})
export class ServiceDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  service = signal<Service | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.api.getServiceBySlug(slug).subscribe({
      next: r => { r.data && this.service.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
