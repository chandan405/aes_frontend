import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartItem } from '../service/cart/cart';
import { ToastService } from '../shared/toast/toast.service';

@Component({
  selector: 'app-order-items',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-items.component.html',
  styleUrl: './order-items.component.css'
})
export class OrderItemsComponent implements OnInit {
  deliveryCharge = 30; // ₹30 delivery charge

  constructor(
    public cartService: CartService,
    private router: Router,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  get cartItems(): CartItem[] {
    return this.cartService.getCartItems();
  }

  get subtotal(): number {
    return this.cartService.getCartSubtotal();
  }

  get gst(): number {
    // 5% GST
    return Number((this.subtotal * 0.05).toFixed(2));
  }

  get grandTotal(): number {
    if (this.subtotal === 0) return 0;
    return this.subtotal + this.gst + this.deliveryCharge;
  }

  increaseQty(productId: number) {
    this.cartService.updateQuantity(productId, 1);
    this.cdr.detectChanges();
  }

  decreaseQty(productId: number) {
    this.cartService.updateQuantity(productId, -1);
    this.cdr.detectChanges();
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
    this.toastService.warning('Item removed from cart.');
    this.cdr.detectChanges();
  }

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
      this.toastService.warning('Cart cleared.');
      this.cdr.detectChanges();
    }
  }

  proceedToPayment() {
    if (this.cartItems.length === 0) {
      this.toastService.error('Your cart is empty.');
      return;
    }
    this.router.navigate(['/cafe/payment']);
  }
}
