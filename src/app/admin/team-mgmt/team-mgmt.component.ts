import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { TeamMember } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-team-mgmt',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './team-mgmt.component.html',
})
export class TeamMgmtComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  team = signal<TeamMember[]>([]);
  loading = signal(true);
  submitting = signal(false);

  // Modal State
  showModal = signal(false);
  isEditMode = signal(false);
  selectedMemberId = signal<string | null>(null);

  imageFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);

  teamForm = this.fb.group({
    name: ['', Validators.required],
    designation: ['', Validators.required],
    qualification: [''],
    experience: [''],
    skills: [''],
    description: [''],
    order: [0],
    status: ['ACTIVE', Validators.required],
  });

  ngOnInit(): void {
    this.loadTeam();
  }

  loadTeam(): void {
    this.loading.set(true);
    this.api.getAllTeam().subscribe({
      next: r => { if (r.data) this.team.set(r.data); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load team members'); this.loading.set(false); },
    });
  }

  openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedMemberId.set(null);
    this.imageFile.set(null);
    this.imagePreview.set(null);
    this.teamForm.reset({ order: 0, status: 'ACTIVE' });
    this.showModal.set(true);
  }

  openEditModal(member: TeamMember): void {
    this.isEditMode.set(true);
    this.selectedMemberId.set(member._id);
    this.imageFile.set(null);
    this.imagePreview.set(member.imageUrl || null);
    this.teamForm.patchValue({
      name: member.name,
      designation: member.designation,
      qualification: member.qualification,
      experience: member.experience,
      skills: (member.skills || []).join(', '),
      description: member.description,
      order: member.order,
      status: member.status,
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
    if (this.teamForm.invalid) return;
    this.submitting.set(true);

    const formData = new FormData();
    formData.append('name', this.teamForm.value.name!);
    formData.append('designation', this.teamForm.value.designation!);
    formData.append('qualification', this.teamForm.value.qualification || '');
    formData.append('experience', this.teamForm.value.experience || '');
    formData.append('description', this.teamForm.value.description || '');
    formData.append('order', String(this.teamForm.value.order || 0));
    formData.append('status', this.teamForm.value.status!);

    // Handle skills array parsing
    const rawSkills = this.teamForm.value.skills || '';
    const skillsArr = rawSkills.split(',').map(s => s.trim()).filter(s => s !== '');
    formData.append('skills', JSON.stringify(skillsArr));

    if (this.imageFile()) {
      formData.append('image', this.imageFile()!);
    }

    const request = this.isEditMode()
      ? this.api.updateTeamMember(this.selectedMemberId()!, formData)
      : this.api.createTeamMember(formData);

    request.subscribe({
      next: () => {
        this.toast.success(this.isEditMode() ? 'Member profile updated' : 'Member profile added');
        this.submitting.set(false);
        this.closeModal();
        this.loadTeam();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to save member profile');
        this.submitting.set(false);
      },
    });
  }

  deleteMember(id: string): void {
    if (confirm('Delete this team member profile permanently?')) {
      this.api.deleteTeamMember(id).subscribe({
        next: () => {
          this.toast.success('Member profile deleted');
          this.loadTeam();
        },
        error: () => this.toast.error('Failed to delete member profile'),
      });
    }
  }
}
