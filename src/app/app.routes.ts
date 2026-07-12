import { Routes } from '@angular/router';
import { authGuard, adminGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ── Public Website ────────────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () => import('./shared/layouts/public-layout/public-layout.component')
      .then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./public/home/home.component').then(m => m.HomeComponent),
        title: 'AES - Professional NDT Inspection & Training Services',
      },
      {
        path: 'about',
        loadComponent: () => import('./public/about/about.component').then(m => m.AboutComponent),
        title: 'About Us - Abinash Engineering Services',
      },
      {
        path: 'services',
        loadComponent: () => import('./public/services/services.component').then(m => m.ServicesComponent),
        title: 'NDT Services - Abinash Engineering Services',
      },
      {
        path: 'services/:slug',
        loadComponent: () => import('./public/services/service-detail/service-detail.component')
          .then(m => m.ServiceDetailComponent),
      },
      {
        path: 'training',
        loadComponent: () => import('./public/training/training.component').then(m => m.TrainingComponent),
        title: 'NDT Training - Abinash Engineering Services',
      },
      {
        path: 'gallery',
        loadComponent: () => import('./public/gallery/gallery.component').then(m => m.GalleryComponent),
        title: 'Gallery - Abinash Engineering Services',
      },
      {
        path: 'clients',
        loadComponent: () => import('./public/clients/clients.component').then(m => m.ClientsComponent),
        title: 'Our Clients - Abinash Engineering Services',
      },
      {
        path: 'contact',
        loadComponent: () => import('./public/contact/contact.component').then(m => m.ContactComponent),
        title: 'Contact Us - Abinash Engineering Services',
      },
    ],
  },

  // ── Admin Portal ──────────────────────────────────────────────────────────
  {
    path: 'admin/login',
    canActivate: [publicGuard],
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
    title: 'Admin Login - AES',
  },
  {
    path: 'admin/forgot-password',
    canActivate: [publicGuard],
    loadComponent: () => import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    title: 'Forgot Password - AES',
  },
  {
    path: 'admin/reset-password',
    canActivate: [publicGuard],
    loadComponent: () => import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    title: 'Reset Password - AES',
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./shared/layouts/admin-layout/admin-layout.component')
      .then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard - AES Admin',
      },
      {
        path: 'banners',
        loadComponent: () => import('./admin/banner-mgmt/banner-mgmt.component').then(m => m.BannerMgmtComponent),
        title: 'Banner Management - AES Admin',
      },
      {
        path: 'about',
        loadComponent: () => import('./admin/about-mgmt/about-mgmt.component').then(m => m.AboutMgmtComponent),
        title: 'About Management - AES Admin',
      },
      {
        path: 'services',
        loadComponent: () => import('./admin/service-mgmt/service-mgmt.component').then(m => m.ServiceMgmtComponent),
        title: 'Service Management - AES Admin',
      },
      {
        path: 'trainings',
        loadComponent: () => import('./admin/training-mgmt/training-mgmt.component').then(m => m.TrainingMgmtComponent),
        title: 'Training Management - AES Admin',
      },
      {
        path: 'registrations',
        loadComponent: () => import('./admin/student-mgmt/student-mgmt.component').then(m => m.StudentMgmtComponent),
        title: 'Student Registrations - AES Admin',
      },
      {
        path: 'team',
        loadComponent: () => import('./admin/team-mgmt/team-mgmt.component').then(m => m.TeamMgmtComponent),
        title: 'Team Management - AES Admin',
      },
      {
        path: 'clients',
        loadComponent: () => import('./admin/client-mgmt/client-mgmt.component').then(m => m.ClientMgmtComponent),
        title: 'Client Management - AES Admin',
      },
      {
        path: 'gallery',
        loadComponent: () => import('./admin/gallery-mgmt/gallery-mgmt.component').then(m => m.GalleryMgmtComponent),
        title: 'Gallery Management - AES Admin',
      },
      {
        path: 'enquiries',
        loadComponent: () => import('./admin/enquiry-mgmt/enquiry-mgmt.component').then(m => m.EnquiryMgmtComponent),
        title: 'Enquiries - AES Admin',
      },
      {
        path: 'industries',
        loadComponent: () => import('./admin/industry-mgmt/industry-mgmt.component').then(m => m.IndustryMgmtComponent),
        title: 'Industry Management - AES Admin',
      },
      {
        path: 'users',
        loadComponent: () => import('./admin/user-mgmt/user-mgmt.component').then(m => m.UserMgmtComponent),
        title: 'User Management - AES Admin',
      },
      {
        path: 'change-password',
        loadComponent: () => import('./admin/change-password/change-password.component').then(m => m.ChangePasswordComponent),
        title: 'Change Password - AES Admin',
      },
    ],
  },

  // ── Fallback ──────────────────────────────────────────────────────────────
  {
    path: '**',
    redirectTo: '',
  },
];
