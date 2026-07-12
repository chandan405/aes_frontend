import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AboutContent } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-about-mgmt',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './about-mgmt.component.html',
})
export class AboutMgmtComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  loading = signal(true);
  submitting = signal(false);

  aboutData = signal<AboutContent | null>(null);

  // Separate signal for dynamic list of mission statements
  missionItems = signal<string[]>([]);

  // Files signals
  aboutImageFile = signal<File | null>(null);
  aboutImagePreview = signal<string | null>(null);
  visionImageFile = signal<File | null>(null);
  visionImagePreview = signal<string | null>(null);

  aboutForm = this.fb.group({
    companyProfile: ['', Validators.required],
    vision: ['', Validators.required],
    stats: this.fb.group({
      experience: ['20+', Validators.required],
      customers: ['500+', Validators.required],
      projects: ['1000+', Validators.required],
      engineers: ['50+', Validators.required],
    }),
  });

  ngOnInit(): void {
    this.loadAbout();
  }

  loadAbout(): void {
    this.api.getAbout().subscribe({
      next: r => {
        if (r.data) {
          this.aboutData.set(r.data);
          this.missionItems.set(r.data.mission || []);
          this.aboutForm.patchValue({
            companyProfile: r.data.companyProfile,
            vision: r.data.vision,
            stats: r.data.stats,
          });
          if (r.data.aboutImageUrl) this.aboutImagePreview.set(r.data.aboutImageUrl);
          if (r.data.visionImageUrl) this.visionImagePreview.set(r.data.visionImageUrl);
        }
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load about details');
        this.loading.set(false);
      },
    });
  }

  addMissionItem(): void {
    this.missionItems.update(items => [...items, '']);
  }

  updateMissionItem(idx: number, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.missionItems.update(items => {
      const copy = [...items];
      copy[idx] = val;
      return copy;
    });
  }

  removeMissionItem(idx: number): void {
    this.missionItems.update(items => items.filter((_, i) => i !== idx));
  }

  onFileChange(event: Event, target: 'about' | 'vision'): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (target === 'about') {
          this.aboutImageFile.set(file);
          this.aboutImagePreview.set(reader.result as string);
        } else {
          this.visionImageFile.set(file);
          this.visionImagePreview.set(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.aboutForm.invalid) return;
    this.submitting.set(true);

    const formData = new FormData();
    formData.append('companyProfile', this.aboutForm.value.companyProfile!);
    formData.append('vision', this.aboutForm.value.vision!);
    formData.append('mission', JSON.stringify(this.missionItems().filter(x => x.trim() !== '')));
    formData.append('stats', JSON.stringify(this.aboutForm.value.stats));

    if (this.aboutImageFile()) {
      formData.append('aboutImage', this.aboutImageFile()!);
    }
    if (this.visionImageFile()) {
      formData.append('visionImage', this.visionImageFile()!);
    }

    this.api.updateAbout(formData).subscribe({
      next: () => {
        this.toast.success('About content updated successfully');
        this.submitting.set(false);
        this.loadAbout();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to save about details');
        this.submitting.set(false);
      },
    });
  }
}
