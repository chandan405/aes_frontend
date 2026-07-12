import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../service/cart/cart';
import { OrderApiService } from '../service/order-api/order-api';
import { ToastService } from '../shared/toast/toast.service';
import { User } from '../service/user/user';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  paymentMethod: 'Credit Card' | 'Debit Card' | 'UPI' | 'Cash On Delivery' = 'Credit Card';
  submitted: boolean = false;

  // Form Fields
  cardName: string = '';
  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  upiId: string = '';
  contactNumber: string = '';

  constructor(
    public cartService: CartService,
    private orderApiService: OrderApiService,
    private toastService: ToastService,
    private router: Router,
    private userService: User,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.cartService.getCartItems().length === 0) {
      this.toastService.error('Your cart is empty.');
      this.router.navigate(['/cafe/restaurants']);
    }

    // Prefill contact number from user if available
    const user = this.userService.currentUser();
    if (user && user.contactNumber) {
      this.contactNumber = user.contactNumber;
    }
  }

  get grandTotal(): number {
    const subtotal = this.cartService.getCartSubtotal();
    const gst = Number((subtotal * 0.05).toFixed(2));
    const deliveryCharge = 30;
    return subtotal + gst + deliveryCharge;
  }

  setPaymentMethod(method: 'Credit Card' | 'Debit Card' | 'UPI' | 'Cash On Delivery') {
    this.paymentMethod = method;
    this.cdr.detectChanges();
  }

  handlePayment() {
    this.submitted = true;
    this.cdr.detectChanges();

    const user = this.userService.currentUser() || { name: 'Customer', email: 'customer@example.com' };
    const subtotal = this.cartService.getCartSubtotal();
    const cartItems = this.cartService.getCartItems();

    // Map checkout parameters
    const checkoutData = {
      customerName: user.name,
      contactNumber: this.contactNumber || '0000000000',
      paymentMethod: this.paymentMethod,
      totalPrice: subtotal,
      restaurantName: 'Pizza Hub', // default restaurant
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };

    this.orderApiService.checkout(checkoutData).subscribe({
      next: (res: any) => {
        this.toastService.success('Order placed successfully! Invoicing in progress...');
        
        // Trigger invoice PDF generation and download
        const billData = {
          name: user.name,
          contactNumber: this.contactNumber || '0000000000',
          paymentMethod: this.paymentMethod,
          totalAmount: this.grandTotal,
          items: cartItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
          })),
          productDetails: cartItems.map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          orderId: res.orderId
        };

        this.orderApiService.downloadBill(billData).subscribe({
          next: (blob: Blob) => {
            if (typeof window !== 'undefined') {
              const fileURL = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = fileURL;
              link.download = `Invoice_${res.invoiceId || 'bill'}.pdf`;
              link.click();
              URL.revokeObjectURL(fileURL);
            }
            this.toastService.success('Invoice PDF downloaded!');
            this.finalizeCheckout();
          },
          error: (billErr) => {
            console.error('Invoice download error:', billErr);
            this.toastService.warning('Order completed. PDF download failed.');
            this.finalizeCheckout();
          }
        });
      },
      error: (err) => {
        console.error('Payment checkout error:', err);
        this.toastService.error(err.error?.message || 'Transaction failed. Please try again.');
        this.submitted = false;
        this.cdr.detectChanges();
      }
    });
  }

  private finalizeCheckout() {
    this.cartService.clearCart();
    this.submitted = false;
    this.router.navigate(['/cafe/dashboard']);
    this.cdr.detectChanges();
  }
}
