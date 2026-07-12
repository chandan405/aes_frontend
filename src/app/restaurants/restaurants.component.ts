import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface Restaurant {
  id: number;
  name: string;
  rating: number;
  cuisines: string[];
  location: string;
  status: 'Open' | 'Closed';
  image: string;
  deliveryTime: string;
}

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.css'
})
export class RestaurantsComponent implements OnInit {
  restaurants: Restaurant[] = [
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

  searchQuery: string = '';
  sortBy: string = 'rating';

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  onSearchChange() {
    this.cdr.detectChanges();
  }

  onSortChange(event: any) {
    this.sortBy = event.target.value;
    this.cdr.detectChanges();
  }

  get filteredRestaurants(): Restaurant[] {
    let list = this.restaurants.filter(r => 
      r.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      r.cuisines.some(c => c.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );

    if (this.sortBy === 'rating') {
      list = list.sort((a, b) => b.rating - a.rating);
    } else if (this.sortBy === 'delivery') {
      list = list.sort((a, b) => a.deliveryTime.localeCompare(b.deliveryTime));
    }

    return list;
  }

  viewMenu(id: number) {
    this.router.navigate([`/cafe/restaurants/${id}/menu`]);
  }
}
