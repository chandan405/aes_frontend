import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <div *ngFor="let toast of toasts()" 
           [class.border-emerald-100]="toast.type === 'success'"
           [class.border-rose-100]="toast.type === 'error'"
           [class.border-amber-100]="toast.type === 'warning'"
           [class.border-blue-100]="toast.type === 'info'"
           class="toast-card pointer-events-auto flex items-start gap-3.5 rounded-2xl border bg-white/95 p-4 shadow-xl backdrop-blur-md relative overflow-hidden transition-all duration-300">
        
        <!-- Icon -->
        <div class="shrink-0 mt-0.5">
          <!-- Success -->
          <svg *ngIf="toast.type === 'success'" class="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <!-- Error -->
          <svg *ngIf="toast.type === 'error'" class="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <!-- Warning -->
          <svg *ngIf="toast.type === 'warning'" class="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <!-- Info -->
          <svg *ngIf="toast.type === 'info'" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.083.984l-.04.022-1.135.568a.75.75 0 00-.411.666v1.282c0 .414.336.75.75.75h1.282a.75.75 0 00.75-.75v-.511m-6 0a9 9 0 1118 0 9 9 0 01-18 0z" />
          </svg>
        </div>

        <!-- Content -->
        <div class="flex-1 pr-6">
          <p class="text-sm font-bold text-slate-800">
            <span *ngIf="toast.type === 'success'">Success</span>
            <span *ngIf="toast.type === 'error'">Error</span>
            <span *ngIf="toast.type === 'warning'">Alert</span>
            <span *ngIf="toast.type === 'info'">Information</span>
          </p>
          <p class="mt-0.5 text-xs font-semibold text-slate-500 leading-relaxed">{{ toast.message }}</p>
        </div>

        <!-- Close Button -->
        <button (click)="removeToast(toast.id)" class="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition duration-150 p-1 rounded-lg hover:bg-slate-50">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Progress Bar Indicator -->
        <div class="absolute bottom-0 left-0 right-0 h-1 origin-left"
             [class.bg-emerald-500]="toast.type === 'success'"
             [class.bg-rose-500]="toast.type === 'error'"
             [class.bg-amber-500]="toast.type === 'warning'"
             [class.bg-blue-500]="toast.type === 'info'"
             [style.animation]="'shrinkProgress ' + toast.duration + 'ms linear forwards'">
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes shrinkProgress {
      from { transform: scaleX(1); }
      to { transform: scaleX(0); }
    }
    .toast-card {
      animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class ToastContainerComponent {
  private toastService = inject(ToastService);
  toasts = this.toastService.toasts;

  removeToast(id: number): void {
    this.toastService.remove(id);
  }
}
