import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from './header/header.component';
import { AppSidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-full-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AppHeaderComponent, AppSidebarComponent],
  templateUrl: 'full.component.html',
  styleUrls: []
})
export class FullComponent {
  public sidebarOpen = false;

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
