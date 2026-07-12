import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BestSellerComponent } from '../best-seller/best-seller.component';
import { User } from '../service/user/user';
import { ToastService } from '../shared/toast/toast.service';

interface Testimonial {
  name: string;
  role: string;
  comment: string;
  stars: number;
}

interface Feature {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, BestSellerComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  isScrolled = false;

  features: Feature[] = [
    {
      title: 'Artisanal Coffee',
      description: 'Carefully sourced single-origin beans, roasted to perfection by master baristas.',
      icon: '☕'
    },
    {
      title: 'Freshly Baked Goods',
      description: 'Daily selection of hand-crafted pastries, gourmet croissants, and artisan breads.',
      icon: '🥐'
    },
    {
      title: 'Warm & Cozy Ambiance',
      description: 'A perfect space designed for remote work, relaxing chats, or getting lost in a book.',
      icon: '✨'
    }
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Liam Henderson',
      role: 'Coffee Connoisseur',
      comment: 'Hands down the best espresso in town. The subtle undertones of caramel and cherry in their house blend are unforgettable.',
      stars: 5
    },
    {
      name: 'Sophia Patel',
      role: 'Remote Software Engineer',
      comment: 'Aura Cafe is my go-to remote workspace. Excellent Wi-Fi, fantastic lighting, and the chocolate molten cake is pure joy.',
      stars: 5
    },
    {
      name: 'Olivia Martinez',
      role: 'Local Resident',
      comment: 'The staff makes you feel like family. I visit every morning for my latte and croissant. A neighborhood gem!',
      stars: 5
    }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  showUserDropdown = false;

  constructor(
    public userService: User,
    private toastService: ToastService
  ) {}

  openLoginModal(): void {
    this.userService.authModalTab.set('login');
    this.userService.showAuthModal.set(true);
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  closeUserDropdown(): void {
    this.showUserDropdown = false;
  }

  logout(): void {
    const name = this.userService.currentUser()?.name || 'User';
    this.userService.logout();
    this.toastService.info(`Goodbye, ${name}. Logged out successfully!`);
    this.closeUserDropdown();
  }

  ngOnInit(): void { }
}
