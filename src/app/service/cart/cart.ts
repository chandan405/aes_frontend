import { Injectable, signal, effect } from '@angular/core';

export interface CartItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  isVeg?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSignal = signal<CartItem[]>([]);

  constructor() {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart');
      if (stored) {
        try {
          this.cartItemsSignal.set(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse cart items:', e);
        }
      }
    }
  }

  // Save to localStorage reactively when items change
  private saveCart(items: CartItem[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }

  getCartItems() {
    return this.cartItemsSignal();
  }

  getCartCount(): number {
    return this.cartItemsSignal().reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartSubtotal(): number {
    return this.cartItemsSignal().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  addToCart(item: Omit<CartItem, 'quantity'>, quantity: number = 1) {
    const items = [...this.cartItemsSignal()];
    const existing = items.find(i => i.productId === item.productId);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ ...item, quantity });
    }

    this.cartItemsSignal.set(items);
    this.saveCart(items);
  }

  updateQuantity(productId: number, delta: number) {
    let items = [...this.cartItemsSignal()];
    const existing = items.find(i => i.productId === productId);

    if (existing) {
      existing.quantity += delta;
      if (existing.quantity <= 0) {
        items = items.filter(i => i.productId !== productId);
      }
      this.cartItemsSignal.set(items);
      this.saveCart(items);
    }
  }

  removeFromCart(productId: number) {
    const items = this.cartItemsSignal().filter(i => i.productId !== productId);
    this.cartItemsSignal.set(items);
    this.saveCart(items);
  }

  clearCart() {
    this.cartItemsSignal.set([]);
    this.saveCart([]);
  }
}
