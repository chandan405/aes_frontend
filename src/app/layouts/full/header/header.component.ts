import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../service/user/user';
import { ToastService } from '../../../shared/toast/toast.service';
import { CartService } from '../../../service/cart/cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: [],
})
export class AppHeaderComponent {
  public userService = inject(User);
  public cartService = inject(CartService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  
  showDropdown = false;

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  logout(): void {
    const name = this.userService.currentUser()?.name || 'User';
    this.userService.logout();
    this.toastService.info(`Goodbye, ${name}. Logged out successfully!`);
    this.closeDropdown();
    this.router.navigate(['/']);
  }
}
