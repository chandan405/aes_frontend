import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  superAdminOnly?: boolean;
}

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  sidebarOpen = signal(true);

  navItems: NavItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Banner Management', path: '/admin/banners', icon: '🖼️' },
    { label: 'About Management', path: '/admin/about', icon: 'ℹ️' },
    { label: 'Service Management', path: '/admin/services', icon: '⚙️' },
    { label: 'Training Management', path: '/admin/trainings', icon: '🎓' },
    { label: 'Student Registrations', path: '/admin/registrations', icon: '👨‍🎓' },
    { label: 'Team Management', path: '/admin/team', icon: '👥' },
    { label: 'Client Management', path: '/admin/clients', icon: '🏢' },
    { label: 'Gallery Management', path: '/admin/gallery', icon: '🖼️' },
    { label: 'Contact Enquiries', path: '/admin/enquiries', icon: '📨' },
    { label: 'Industry Management', path: '/admin/industries', icon: '🏭' },
    { label: 'User Management', path: '/admin/users', icon: '👤', superAdminOnly: true },
    { label: 'Change Password', path: '/admin/change-password', icon: '🔑' },
  ];

  toggleSidebar(): void { this.sidebarOpen.update(v => !v); }
  closeSidebar(): void { this.sidebarOpen.set(false); }

  logout(): void {
    this.authService.logout();
  }
}
