import { Component, OnInit, signal, inject } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { TrainingRegistration } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-student-mgmt',
  imports: [NgClass, DatePipe],
  templateUrl: './student-mgmt.component.html',
})
export class StudentMgmtComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  registrations = signal<TrainingRegistration[]>([]);
  loading = signal(true);

  activeStatusFilter = signal<string>('all');

  statuses = [
    { label: 'All Registrations', value: 'all' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  // Details Modal State
  showDetailsModal = signal(false);
  selectedReg = signal<TrainingRegistration | null>(null);

  ngOnInit(): void {
    this.loadRegistrations();
  }

  loadRegistrations(): void {
    this.loading.set(true);
    const filterStatus = this.activeStatusFilter();
    const query = filterStatus === 'all' ? undefined : { status: filterStatus };

    this.api.getRegistrations(query).subscribe({
      next: r => { if (r.data) this.registrations.set(r.data); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load registrations'); this.loading.set(false); },
    });
  }

  openDetailsModal(reg: TrainingRegistration): void {
    this.selectedReg.set(reg);
    this.showDetailsModal.set(true);
  }

  closeDetailsModal(): void {
    this.showDetailsModal.set(false);
  }

  updateStatus(id: string, status: 'APPROVED' | 'REJECTED'): void {
    if (confirm(`Are you sure you want to mark this candidate as ${status}?`)) {
      this.api.updateRegistrationStatus(id, status).subscribe({
        next: () => {
          this.toast.success(`Candidate ${status === 'APPROVED' ? 'Approved' : 'Rejected'} successfully.`);
          this.closeDetailsModal();
          this.loadRegistrations();
        },
        error: () => this.toast.error('Failed to update student status'),
      });
    }
  }

  exportToExcel(): void {
    const raw = this.registrations();
    if (raw.length === 0) {
      this.toast.warning('No student data to export.');
      return;
    }

    const data = raw.map(x => ({
      'Full Name': x.name,
      'Email Address': x.email,
      'Phone Number': x.phone,
      'Company Name': x.company,
      'Qualification': x.qualification,
      'Experience': x.experience,
      'Course Name': x.trainingName,
      'Status': x.status,
      'Registered At': new Date(x.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, `AES_Student_Registrations_${Date.now()}.xlsx`);
    this.toast.success('Excel spreadsheet downloaded.');
  }
}
