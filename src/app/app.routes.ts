import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FullComponent } from './layouts/full/full.component';
import { authGuard } from './service/auth/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'cafe',
    component: FullComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: '/cafe/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'category',
        loadComponent: () => import('./manage-category/manage-category').then(m => m.ManageCategory),
      },
      {
        path: 'product',
        loadComponent: () => import('./manage-product/manage-product').then(m => m.ManageProduct),
      },
      {
        path: 'restaurants',
        loadComponent: () => import('./restaurants/restaurants.component').then(m => m.RestaurantsComponent),
      },
      {
        path: 'restaurants/:restaurantId/menu',
        loadComponent: () => import('./restaurants/menu/menu.component').then(m => m.MenuComponent),
      },
      {
        path: 'order-items',
        loadComponent: () => import('./order-items/order-items.component').then(m => m.OrderItemsComponent),
      },
      {
        path: 'payment',
        loadComponent: () => import('./payment/payment.component').then(m => m.PaymentComponent),
      }
    ]
  },
  { path: '**', component: HomeComponent }
];
