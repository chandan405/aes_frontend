import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Service } from '../../core/models/api.models';

@Component({
  selector: 'app-services',
  imports: [RouterLink],
  templateUrl: './services.component.html',
})
export class ServicesComponent implements OnInit {
  private api = inject(ApiService);
  services = signal<Service[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.api.getServices().subscribe({
      next: r => { r.data && this.services.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  getServiceIcon(name: string): string {
    const map: Record<string, string> = {
      'Radiographic': '📡', 'Magnetic': '🔧', 'Dye Penetrant': '🎨',
      'Ultrasonic': '📶', 'Eddy': '⚡', 'Thickness': '📏',
      'Corrosion': '🗺️', 'Advanced': '🔬', 'Civil': '🏗️', 'Condition': '📊',
    };
    for (const [k, v] of Object.entries(map)) {
      if (name.includes(k)) return v;
    }
    return '⚙️';
  }
}
