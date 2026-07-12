import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../shared/toast/toast.service';
import { Dashboard } from '../service/dashboard/dashboard';
import { User } from '../service/user/user';

interface Order {
  id: number;
  totalPrice: number;
  orderDate: string;
  status: string;
  customerName: string;
}

interface PopularItem {
  name: string;
  sales: number;
  revenue: string;
  percentage: number;
}

interface CategorySale {
  name: string;
  sales: string;
  percentage: number;
}

interface OrderStatus {
  status: string;
  count: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  today = new Date();
  loading = true;
  errorMsg = '';
  dashboardData: any = null;
  
  stats: any[] = [
    { label: 'Total Revenue', value: '$0.00', change: '', positive: true, icon: 'revenue' },
    { label: 'Orders Processed', value: '0', change: '', positive: true, icon: 'orders' },
    { label: 'Total Customers', value: '0', change: '', positive: true, icon: 'customers' },
    { label: 'Average Order Value', value: '$0.00', change: '', positive: true, icon: 'average' }
  ];

  recentOrders: Order[] = [];
  popularItems: PopularItem[] = [];
  categorySales: CategorySale[] = [];
  orderStatusSummary: OrderStatus[] = [];

  // SVG Chart Properties
  chartPath = '';
  chartFillPath = '';
  chartPoints: Array<{ x: number; y: number; label: string; revenue: number }> = [];
  chartYGridLabels: Array<{ y: number; val: string }> = [];

  constructor(
    private toastService: ToastService,
    private dashboardService: Dashboard,
    public userService: User,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.errorMsg = '';
    this.cdr.detectChanges();
    this.dashboardService.getDashboardSummary().subscribe({
      next: (data: any) => {
        this.dashboardData = data;
        this.loading = false;
        this.processDashboardData(data);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Failed to load dashboard statistics from backend.';
        this.toastService.error(this.errorMsg);
        this.cdr.detectChanges();
      }
    });
  }

  processDashboardData(data: any): void {
    if (!data) return;

    // 1. Process Stats
    const statsInfo = data.stats || { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, averageOrderValue: 0 };
    this.stats = [
      { label: 'Total Revenue', value: `$${(statsInfo.totalRevenue || 0).toFixed(2)}`, change: '', positive: true, icon: 'revenue' },
      { label: 'Orders Processed', value: `${statsInfo.totalOrders || 0}`, change: '', positive: true, icon: 'orders' },
      { label: 'Total Customers', value: `${statsInfo.totalCustomers || 0}`, change: '', positive: true, icon: 'customers' },
      { label: 'Average Order Value', value: `$${(statsInfo.averageOrderValue || 0).toFixed(2)}`, change: '', positive: true, icon: 'average' }
    ];

    // 2. Process Recent Orders
    this.recentOrders = data.recentOrders || [];

    // 3. Process Popular Products
    const popular = data.popularProducts || [];
    const maxSold = Math.max(...popular.map((p: any) => p.totalSold || 0), 1);
    this.popularItems = popular.map((p: any) => ({
      name: p.productName,
      sales: p.totalSold || 0,
      revenue: `$${(p.totalRevenue || 0).toFixed(2)}`,
      percentage: Math.round(((p.totalSold || 0) / maxSold) * 100)
    }));

    // 4. Process Category Sales
    const categories = data.categorySales || [];
    const totalSalesSum = categories.reduce((sum: number, c: any) => sum + (c.sales || 0), 0) || 1;
    this.categorySales = categories.map((c: any) => ({
      name: c.categoryName,
      sales: `$${(c.sales || 0).toFixed(2)}`,
      percentage: Math.round(((c.sales || 0) / totalSalesSum) * 100)
    }));

    // 5. Process Order Status Summary
    this.orderStatusSummary = data.orderStatus || [];

    // 6. Process Monthly Revenue Chart
    this.generateChartData(data.monthlyRevenue || []);
  }

  generateChartData(monthlyRevenue: any[]): void {
    if (!monthlyRevenue || monthlyRevenue.length === 0) {
      this.chartPath = '';
      this.chartFillPath = '';
      this.chartPoints = [];
      return;
    }

    // Sort chronologically (YYYY-MM)
    const sortedData = [...monthlyRevenue].sort((a, b) => a.month.localeCompare(b.month));

    const X_START = 60;
    const X_END = 540;
    const Y_MAX = 190; // $0
    const Y_MIN = 40;  // max val

    const revenues = sortedData.map(d => d.revenue || 0);
    const maxRev = Math.max(...revenues, 100);
    const maxYValue = Math.ceil(maxRev / 100) * 100;

    // Generate Y grid lines labels
    this.chartYGridLabels = [
      { y: Y_MIN, val: `$${maxYValue.toFixed(2)}` },
      { y: (Y_MAX + Y_MIN) / 2, val: `$${(maxYValue / 2).toFixed(2)}` },
      { y: Y_MAX, val: '$0.00' }
    ];

    const n = sortedData.length;
    this.chartPoints = sortedData.map((d, i) => {
      const x = n > 1 ? X_START + (i * (X_END - X_START)) / (n - 1) : (X_START + X_END) / 2;
      const y = Y_MAX - ((d.revenue || 0) / maxYValue) * (Y_MAX - Y_MIN);
      return {
        x,
        y,
        label: d.month,
        revenue: d.revenue
      };
    });

    // Build the SVG path
    if (this.chartPoints.length > 0) {
      let path = `M ${this.chartPoints[0].x},${this.chartPoints[0].y}`;
      let fill = `M ${this.chartPoints[0].x},${Y_MAX} L ${this.chartPoints[0].x},${this.chartPoints[0].y}`;
      
      for (let i = 1; i < this.chartPoints.length; i++) {
        path += ` L ${this.chartPoints[i].x},${this.chartPoints[i].y}`;
        fill += ` L ${this.chartPoints[i].x},${this.chartPoints[i].y}`;
      }
      
      fill += ` L ${this.chartPoints[this.chartPoints.length - 1].x},${Y_MAX} Z`;
      
      this.chartPath = path;
      this.chartFillPath = fill;
    }
  }

  triggerNewOrder(): void {
    this.toastService.success('New Order initiated successfully!');
  }

  triggerInventoryUpdate(): void {
    this.toastService.warning('Opening Inventory Manager.');
  }
}
