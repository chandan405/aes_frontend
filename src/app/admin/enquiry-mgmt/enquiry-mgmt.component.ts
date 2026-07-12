import { Component, OnInit, signal, inject } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ContactEnquiry } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-enquiry-mgmt',
  imports: [NgClass, DatePipe],
  templateUrl: './enquiry-mgmt.component.html',
})
export class EnquiryMgmtComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  enquiries = signal<ContactEnquiry[]>([]);
  loading = signal(true);

  // Modal Setup
  showModal = signal(false);
  selectedEnq = signal<ContactEnquiry | null>(null);

  ngOnInit(): void {
    this.loadEnquiries();
  }

  loadEnquiries(): void {
    this.loading.set(true);
    this.api.getEnquiries().subscribe({
      next: r => { if (r.data) this.enquiries.set(r.data); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load enquiries'); this.loading.set(false); },
    });
  }

  openDetailsModal(enq: ContactEnquiry): void {
    this.selectedEnq.set(enq);
    this.showModal.set(true);
    // Mark as read automatically when opened if it's new
    if (enq.status === 'NEW') {
      this.api.updateEnquiryStatus(enq._id, 'READ').subscribe({
        next: () => this.loadEnquiries(),
      });
    }
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  updateStatus(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    const enq = this.selectedEnq();
    if (enq) {
      this.api.updateEnquiryStatus(enq._id, val).subscribe({
        next: () => {
          this.toast.success('Status updated successfully');
          this.loadEnquiries();
        },
        error: () => this.toast.error('Failed to change status'),
      });
    }
  }

  deleteEnquiry(id: string): void {
    if (confirm('Delete this message enquiry permanently?')) {
      this.api.deleteEnquiry(id).subscribe({
        next: () => {
          this.toast.success('Enquiry deleted');
          this.loadEnquiries();
        },
        error: () => this.toast.error('Failed to delete enquiry'),
      });
    }
  }
}
