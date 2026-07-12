import { Component, OnInit, signal, inject } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Client } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
})
export class ClientsComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  clients = signal<Client[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.api.getClients().subscribe({
      next: r => {
        if (r.data) this.clients.set(r.data);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load clients');
        this.loading.set(false);
      },
    });
  }
}
