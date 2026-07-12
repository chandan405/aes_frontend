import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../shared/toast/toast.service';

interface MenuItem {
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
  rating: number;
}

@Component({
  selector: 'app-best-seller',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './best-seller.component.html',
  styleUrls: ['./best-seller.component.css']
})
export class BestSellerComponent implements OnInit {
  selectedCategory = 'all';

  categories = [
    { id: 'all', name: 'Full Menu' },
    { id: 'coffee', name: 'Brews & Espresso' },
    { id: 'meals', name: 'Main Dishes' },
    { id: 'desserts', name: 'Sweet Delights' }
  ];

  menuItems: MenuItem[] = [
    {
      name: 'Caramel Macchiato',
      price: '$5.25',
      description: 'Rich espresso with steamed milk, vanilla syrup, and a decadent caramel drizzle.',
      image: 'assets/img/4.jpg',
      category: 'coffee',
      rating: 4.9
    },
    {
      name: 'Artisan Cafe Latte',
      price: '$4.50',
      description: 'Double shot of espresso combined with silky microfoam and signature latte art.',
      image: 'assets/img/4.jpg',
      category: 'coffee',
      rating: 4.8
    },
    {
      name: 'Classic Margherita Pizza',
      price: '$14.99',
      description: 'Crispy stone-baked thin crust topped with fresh mozzarella, cherry tomatoes, and basil leaves.',
      image: 'assets/img/1.jpg',
      category: 'meals',
      rating: 5.0
    },
    {
      name: 'Aromatic Chicken Biryani',
      price: '$16.50',
      description: 'Fragrant basmati rice cooked with layered spices, saffron, and tender marinated chicken.',
      image: 'assets/img/2.jpg',
      category: 'meals',
      rating: 4.9
    },
    {
      name: 'Creamy Pesto Alfredo Pasta',
      price: '$13.25',
      description: 'Tossed in a rich cream sauce with fresh basil pesto, parmesan, and grilled garlic bread.',
      image: 'assets/img/3.jpg',
      category: 'meals',
      rating: 4.7
    },
    {
      name: 'Molten Chocolate Lava Cake',
      price: '$7.50',
      description: 'Warm chocolate cake with a molten, gooey center. Served with powdered sugar and vanilla bean gelato.',
      image: 'assets/img/4.jpg',
      category: 'desserts',
      rating: 5.0
    }
  ];

  get filteredItems(): MenuItem[] {
    if (this.selectedCategory === 'all') {
      return this.menuItems;
    }
    return this.menuItems.filter(item => item.category === this.selectedCategory);
  }

  setCategory(catId: string): void {
    this.selectedCategory = catId;
  }

  addToOrder(itemName: string): void {
    this.toastService.success(`Added "${itemName}" to your order!`);
  }

  constructor(private toastService: ToastService) { }

  ngOnInit(): void { }
}
