import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Product } from '../service/product/product';
import { Category } from '../service/category/category';
import { ToastService } from '../shared/toast/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-product.html',
  styleUrl: './manage-product.css',
})
export class ManageProduct implements OnInit {
  tableData: any[] = [];
  categories: any[] = [];
  submitted: boolean = false;

  @ViewChild('productForm')
  productForm!: NgForm;

  productObj: any = {
    id: undefined,
    name: '',
    description: '',
    price: null,
    categoryId: '',
    imageUrl: '',
    isAvailable: true
  };

  constructor(
    private productService: Product,
    private categoryService: Category,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAllCategory();
    this.getAllProduct();
  }

  getAllCategory() {
    this.categoryService.getAll().subscribe({
      next: (res: any) => {
        this.categories = res || [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.toastService.error(err.error?.message || 'Error fetching categories');
        this.cdr.detectChanges();
      }
    });
  }

  getAllProduct() {
    this.productService.getAll().subscribe({
      next: (res: any) => {
        this.tableData = res || [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.toastService.error(err.error?.message || 'Error fetching products');
        this.cdr.detectChanges();
      }
    });
  }

  handleSubmit() {
    this.submitted = true;
    this.cdr.detectChanges();

    const requestData = {
      name: this.productObj.name,
      description: this.productObj.description,
      price: Number(this.productObj.price),
      categoryId: Number(this.productObj.categoryId),
      imageUrl: this.productObj.imageUrl || null,
      isAvailable: this.productObj.isAvailable ? 1 : 0
    };

    if (this.productObj.id) {
      // Update product
      this.productService.update(this.productObj.id, requestData).subscribe({
        next: (res: any) => {
          this.toastService.success(res.message || 'Product updated successfully');
          this.resetForm();
          this.getAllProduct();
        },
        error: (err: any) => {
          this.toastService.error(err.error?.message || 'Error updating product');
          this.submitted = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // Add product
      this.productService.add(requestData).subscribe({
        next: (res: any) => {
          this.toastService.success(res.message || 'Product added successfully');
          this.resetForm();
          this.getAllProduct();
        },
        error: (err: any) => {
          this.toastService.error(err.error?.message || 'Error adding product');
          this.submitted = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  editProduct(product: any) {
    this.productObj = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl || '',
      isAvailable: product.isAvailable === 1 || product.isAvailable === true || product.status === 'true'
    };
  }

  deleteProduct(id: any) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(id).subscribe({
        next: (res: any) => {
          this.toastService.success(res.message || 'Product deleted successfully');
          this.getAllProduct();
        },
        error: (err: any) => {
          this.toastService.error(err.error?.message || 'Error deleting product');
          this.cdr.detectChanges();
        }
      });
    }
  }

  resetForm() {
    this.productObj = {
      id: undefined,
      name: '',
      description: '',
      price: null,
      categoryId: '',
      imageUrl: '',
      isAvailable: true
    };
    if (this.productForm) {
      this.productForm.resetForm({ isAvailable: true });
    }
    this.submitted = false;
    this.cdr.detectChanges();
  }
}
