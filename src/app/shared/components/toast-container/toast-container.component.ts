import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [NgClass],
  templateUrl: './toast-container.component.html',
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  getIcon(toast: Toast): string {
    const icons: Record<Toast['type'], string> = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    };
    return icons[toast.type];
  }
}
