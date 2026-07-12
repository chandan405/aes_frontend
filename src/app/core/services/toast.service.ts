import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  private add(type: Toast['type'], message: string, duration = 4000): void {
    const id = Math.random().toString(36).slice(2);
    this.toasts.update(t => [...t, { id, type, message, duration }]);
    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  success(message: string): void { this.add('success', message); }
  error(message: string): void { this.add('error', message, 5000); }
  warning(message: string): void { this.add('warning', message); }
  info(message: string): void { this.add('info', message); }

  remove(id: string): void {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
