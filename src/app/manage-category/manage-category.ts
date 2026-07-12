import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Category } from '../service/category/category';
import { ToastService } from '../shared/toast/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-category.html',
  styleUrl: './manage-category.css',
})
export class ManageCategory implements OnInit {
  tableData: any[] = [];
  submitted: boolean = false;

  @ViewChild('categoryForm')
  categoryForm!: NgForm;

  categoryObj: any = {
    id: undefined,
    name: ''
  };

  constructor(
    private categoryService: Category,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAllCategory();
  }

  getAllCategory() {
    this.categoryService.getAll().subscribe({
      next: (res: any) => {
        this.tableData = res || [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.toastService.error(err.error?.message || 'Error fetching categories');
        this.cdr.detectChanges();
      }
    });
  }

  handleSubmit() {
    this.submitted = true;
    this.cdr.detectChanges();
    
    if (this.categoryObj.id) {
      // Update Category
      this.categoryService.update(this.categoryObj.id, this.categoryObj).subscribe({
        next: (res: any) => {
          this.toastService.success(res.message || 'Category updated successfully');
          this.resetForm();
          this.getAllCategory();
        },
        error: (err: any) => {
          this.toastService.error(err.error?.message || 'Error updating category');
          this.submitted = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // Add Category
      this.categoryService.add(this.categoryObj).subscribe({
        next: (res: any) => {
          this.toastService.success(res.message || 'Category added successfully');
          this.resetForm();
          this.getAllCategory();
        },
        error: (err: any) => {
          this.toastService.error(err.error?.message || 'Error adding category');
          this.submitted = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  editCategory(category: any) {
    this.categoryObj = { ...category };
  }

  deleteCategory(id: any) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.delete(id).subscribe({
        next: (res: any) => {
          this.toastService.success(res.message || 'Category deleted successfully');
          this.getAllCategory();
        },
        error: (err: any) => {
          this.toastService.error(err.error?.message || 'Error deleting category');
          this.cdr.detectChanges();
        }
      });
    }
  }

  resetForm() {
    this.categoryObj = { id: undefined, name: '' };
    if (this.categoryForm) {
      this.categoryForm.resetForm();
    }
    this.submitted = false;
    this.cdr.detectChanges();
  }
}
