import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../service/product/product';
import { CartService } from '../../service/cart/cart';
import { ToastService } from '../../shared/toast/toast.service';
import { Restaurant } from '../restaurants.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  restaurantId!: number;
  restaurant!: Restaurant;
  products: any[] = [];
  filteredProducts: any[] = [];
  
  // State variables
  foodSearchQuery: string = '';
  vegFilter: 'All' | 'Veg' | 'Non-Veg' = 'All';
  itemQuantities: { [productId: number]: number } = {};
  loading: boolean = true;

  // Mock Restaurants list (same as parent)
  restaurantsList: Restaurant[] = [
    {
      id: 1,
      name: 'Pizza Hub',
      rating: 4.8,
      cuisines: ['Italian', 'Fast Food'],
      location: 'Bangalore',
      status: 'Open',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
      deliveryTime: '25-30 mins'
    },
    {
      id: 2,
      name: 'Burger Town',
      rating: 4.5,
      cuisines: ['American', 'Fast Food'],
      location: 'Mumbai',
      status: 'Open',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
      deliveryTime: '20-25 mins'
    },
    {
      id: 3,
      name: 'Coffee Central',
      rating: 4.9,
      cuisines: ['Beverages', 'Desserts'],
      location: 'Delhi',
      status: 'Open',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=80',
      deliveryTime: '15-20 mins'
    },
    {
      id: 4,
      name: 'Sweet Delights',
      rating: 4.7,
      cuisines: ['Desserts', 'Bakery'],
      location: 'Kolkata',
      status: 'Closed',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80',
      deliveryTime: '30-35 mins'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: Product,
    private cartService: CartService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.restaurantId = Number(this.route.snapshot.params['restaurantId']);
    const found = this.restaurantsList.find(r => r.id === this.restaurantId);
    
    if (found) {
      this.restaurant = found;
      this.loadRestaurantMenu();
    } else {
      this.toastService.error('Restaurant not found');
      this.router.navigate(['/cafe/restaurants']);
    }
  }

  loadRestaurantMenu() {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (res: any) => {
        this.products = res || [];
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error fetching menu items:', err);
        this.toastService.error('Failed to load menu items.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  isVegProduct(product: any): boolean {
    const keywords = ['chicken', 'fish', 'meat', 'beef', 'pork', 'egg', 'pepperoni', 'non-veg', 'mutton', 'prawn', 'burger'];
    const text = (product.name + ' ' + (product.description || '')).toLowerCase();
    
    // Specially classify Paneer, Veg, Cheese, Margherita, French Fries, Coffee as Veg
    if (product.name.toLowerCase().includes('paneer') || 
        product.name.toLowerCase().includes('veg') || 
        product.name.toLowerCase().includes('margherita') || 
        product.name.toLowerCase().includes('fries') || 
        product.name.toLowerCase().includes('coffee')) {
      return true;
    }
    
    return !keywords.some(keyword => text.includes(keyword));
  }

  applyFilters() {
    // 1. Filter by Restaurant Cuisine categories
    const resCuisines = this.restaurant.cuisines.map(c => c.toLowerCase());
    let items = this.products.filter(p => {
      const catName = (p.categoryName || '').toLowerCase();
      // Match category name against cuisines or default match to pizza/burger if matching restaurant
      if (this.restaurantId === 1 && (catName.includes('pizza') || catName.includes('fast food') || catName.includes('beverage'))) return true;
      if (this.restaurantId === 2 && (catName.includes('burger') || catName.includes('fast food'))) return true;
      if (this.restaurantId === 3 && (catName.includes('beverage') || catName.includes('coffee') || catName.includes('dessert'))) return true;
      if (this.restaurantId === 4 && (catName.includes('dessert') || catName.includes('bakery'))) return true;
      return resCuisines.some(c => catName.includes(c) || c.includes(catName));
    });

    // Fallback: If no items match, display all products
    if (items.length === 0) {
      items = this.products;
    }

    // 2. Filter by search query
    if (this.foodSearchQuery) {
      items = items.filter(p => p.name.toLowerCase().includes(this.foodSearchQuery.toLowerCase()));
    }

    // 3. Filter by Veg/Non-Veg radio buttons
    if (this.vegFilter === 'Veg') {
      items = items.filter(p => this.isVegProduct(p));
    } else if (this.vegFilter === 'Non-Veg') {
      items = items.filter(p => !this.isVegProduct(p));
    }

    this.filteredProducts = items;

    // Initialize quantities for products
    this.filteredProducts.forEach(p => {
      if (!this.itemQuantities[p.id]) {
        this.itemQuantities[p.id] = 1;
      }
    });

    this.cdr.detectChanges();
  }

  increaseQty(productId: number) {
    this.itemQuantities[productId] = (this.itemQuantities[productId] || 1) + 1;
    this.cdr.detectChanges();
  }

  decreaseQty(productId: number) {
    if ((this.itemQuantities[productId] || 1) > 1) {
      this.itemQuantities[productId]--;
      this.cdr.detectChanges();
    }
  }

  getQty(productId: number): number {
    return this.itemQuantities[productId] || 1;
  }

  addToCart(product: any) {
    const qty = this.getQty(product.id);
    const item = {
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl || '',
      isVeg: this.isVegProduct(product)
    };
    
    this.cartService.addToCart(item, qty);
    this.toastService.success(`Added ${qty}x "${product.name}" to cart!`);
    
    // Reset local selection quantity to 1
    this.itemQuantities[product.id] = 1;
    this.cdr.detectChanges();
  }
}
