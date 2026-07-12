import { Component, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  submitting = signal(false);
  submitted = signal(false);

  services = [
    'Radiographic Testing (RT)',
    'Ultrasonic Testing (UT)',
    'Magnetic Particle Testing (MT)',
    'Dye Penetrant Testing (PT)',
    'Eddy Current Testing (ECT)',
    'Advanced NDT (PAUT/TOFD)',
    'Civil Engineering Testing',
    'Condition Monitoring',
    'NDT Training/Certification',
  ];

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    serviceRequired: [''],
    message: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.api.submitContact(this.contactForm.value as any).subscribe({
      next: () => {
        this.submitted.set(true);
        this.submitting.set(false);
        this.toast.success('Your message has been sent successfully!');
        this.contactForm.reset({ serviceRequired: '' });
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to submit enquiry. Please try again.');
        this.submitting.set(false);
      },
    });
  }
}
