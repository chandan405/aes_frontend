import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';

@NgModule({
  imports: [
    DashboardComponent,
    RouterModule.forChild(DashboardRoutes)
  ]
})
export class DashboardModule { }
