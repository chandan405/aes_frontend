import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass, DatePipe, CurrencyPipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Training } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-training-mgmt',
  imports: [ReactiveFormsModule, NgClass, DatePipe, CurrencyPipe],
  templateUrl: './training-mgmt.component.html',
})
export class TrainingMgmtComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  trainings = signal<Training[]>([]);
  loading = signal(true);
  submitting = signal(false);

  // Modal settings
  showModal = signal(false);
  isEditMode = signal(false);
  selectedCourseId = signal<string | null>(null);

  syllabusItems = signal<string[]>([]);
  imageFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);

  courseForm = this.fb.group({
    name: ['', Validators.required],
    duration: ['', Validators.required],
    fees: [0, [Validators.required, Validators.min(0)]],
    startDate: [''],
    trainerName: ['', Validators.required],
    mode: ['OFFLINE', Validators.required],
    description: ['', Validators.required],
    maxStudents: [30],
  });

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings(): void {
    this.loading.set(true);
    this.api.getAllTrainings().subscribe({
      next: r => { if (r.data) this.trainings.set(r.data); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load courses'); this.loading.set(false); },
    });
  }

  openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedCourseId.set(null);
    this.syllabusItems.set([]);
    this.imageFile.set(null);
    this.imagePreview.set(null);
    this.courseForm.reset({ fees: 0, mode: 'OFFLINE', maxStudents: 30 });
    this.showModal.set(true);
  }

  openEditModal(course: Training): void {
    this.isEditMode.set(true);
    this.selectedCourseId.set(course._id);
    this.syllabusItems.set(course.syllabus || []);
    this.imageFile.set(null);
    this.imagePreview.set(course.imageUrl || null);
    this.courseForm.patchValue({
      name: course.name,
      duration: course.duration,
      fees: course.fees,
      startDate: course.startDate ? new Date(course.startDate).toISOString().split('T')[0] : '',
      trainerName: course.trainerName,
      mode: course.mode,
      description: course.description,
      maxStudents: course.maxStudents || 30,
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  addSyllabusItem(): void {
    this.syllabusItems.update(items => [...items, '']);
  }

  updateSyllabusItem(idx: number, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.syllabusItems.update(items => {
      const copy = [...items];
      copy[idx] = val;
      return copy;
    });
  }

  removeSyllabusItem(idx: number): void {
    this.syllabusItems.update(items => items.filter((_, i) => i !== idx));
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
    if (this.courseForm.invalid) return;
    this.submitting.set(true);

    const formData = new FormData();
    formData.append('name', this.courseForm.value.name!);
    formData.append('duration', this.courseForm.value.duration!);
    formData.append('fees', String(this.courseForm.value.fees || 0));
    formData.append('startDate', this.courseForm.value.startDate || '');
    formData.append('trainerName', this.courseForm.value.trainerName!);
    formData.append('mode', this.courseForm.value.mode!);
    formData.append('description', this.courseForm.value.description!);
    formData.append('maxStudents', String(this.courseForm.value.maxStudents || 30));
    formData.append('syllabus', JSON.stringify(this.syllabusItems().filter(x => x.trim() !== '')));

    if (this.imageFile()) {
      formData.append('image', this.imageFile()!);
    }

    const request = this.isEditMode()
      ? this.api.updateTraining(this.selectedCourseId()!, formData)
      : this.api.createTraining(formData);

    request.subscribe({
      next: () => {
        this.toast.success(this.isEditMode() ? 'Course updated' : 'Course scheduled');
        this.submitting.set(false);
        this.closeModal();
        this.loadTrainings();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to save course');
        this.submitting.set(false);
      },
    });
  }

  toggleStatus(course: Training): void {
    this.api.toggleTrainingStatus(course._id).subscribe({
      next: () => {
        this.toast.success('Status updated');
        this.loadTrainings();
      },
      error: () => this.toast.error('Failed to update status'),
    });
  }

  deleteCourse(id: string): void {
    if (confirm('Delete this training course permanently?')) {
      this.api.deleteTraining(id).subscribe({
        next: () => {
          this.toast.success('Course deleted');
          this.loadTrainings();
        },
        error: () => this.toast.error('Failed to delete course'),
      });
    }
  }
}
