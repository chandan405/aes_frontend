import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { DashboardStats } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe, NgClass],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  stats = signal<DashboardStats | null>(null);
  loading = signal(true);

  statCards: Array<{ label: string; value: number | string; icon: string }> = [];

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading.set(true);
    this.api.getDashboardStats().subscribe({
      next: r => {
        if (r.data) {
          this.stats.set(r.data);
          const s = r.data.stats;
          this.statCards = [
            { label: 'Total Services', value: s.totalServices, icon: '⚙️' },
            { label: 'Courses Published', value: s.totalTrainings, icon: '🎓' },
            { label: 'Student Enrollments', value: s.totalRegistrations, icon: '👨‍🎓' },
            { label: 'Contact Enquiries', value: s.totalEnquiries, icon: '📨' },
          ];
        }
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load dashboard statistics');
        this.loading.set(false);
      },
    });
  }
}
