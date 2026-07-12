import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass, DatePipe, CurrencyPipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Training } from '../../core/models/api.models';

@Component({
  selector: 'app-training',
  imports: [ReactiveFormsModule, NgClass, DatePipe, CurrencyPipe],
  templateUrl: './training.component.html',
})
export class TrainingComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  trainings = signal<Training[]>([]);
  selectedTraining = signal<Training | null>(null);
  loading = signal(true);
  submitting = signal(false);
  submitted = signal(false);

  regForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    company: ['', Validators.required],
    qualification: ['', Validators.required],
    experience: ['', Validators.required],
    trainingId: ['', Validators.required],
    message: [''],
  });

  ngOnInit(): void {
    this.api.getTrainings().subscribe({
      next: r => { r.data && this.trainings.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  selectTraining(training: Training): void {
    this.selectedTraining.set(training);
    this.regForm.patchValue({ trainingId: training._id });
    document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  onSubmit(): void {
    if (this.regForm.invalid) { this.regForm.markAllAsTouched(); return; }
    this.submitting.set(true);
    const trainingId = this.regForm.value.trainingId!;
    const training = this.trainings().find(t => t._id === trainingId);
    this.api.registerForTraining({ ...this.regForm.value, trainingName: training?.name } as any).subscribe({
      next: () => {
        this.submitted.set(true);
        this.submitting.set(false);
        this.toast.success('Registration submitted! We will contact you soon.');
        this.regForm.reset();
        this.selectedTraining.set(null);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Registration failed. Please try again.');
        this.submitting.set(false);
      },
    });
  }
}
