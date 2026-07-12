import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../service/user/user';
import { ToastService } from '../shared/toast/toast.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.html'
})
export class SignUp implements OnInit {
  // Form definition
  authForm = new FormGroup({
    name: new FormControl(''),
    contactNumber: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('')
  });
  
  // Submit state
  loading = signal(false);

  constructor(
    public userService: User,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.resetForm();
  }

  setTab(tab: 'login' | 'signup' | 'forgot'): void {
    this.userService.authModalTab.set(tab);
    this.resetForm();
  }

  resetForm(): void {
    this.authForm.reset({
      name: '',
      contactNumber: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    const tab = this.userService.authModalTab();
    if (tab === 'signup') {
      this.authForm.get('name')?.setValidators([Validators.required]);
      this.authForm.get('contactNumber')?.setValidators([Validators.required]);
      this.authForm.get('confirmPassword')?.setValidators([Validators.required]);
      this.authForm.get('password')?.setValidators([Validators.required]);
    } else if (tab === 'login') {
      this.authForm.get('name')?.clearValidators();
      this.authForm.get('contactNumber')?.clearValidators();
      this.authForm.get('confirmPassword')?.clearValidators();
      this.authForm.get('password')?.setValidators([Validators.required]);
    } else {
      // tab === 'forgot'
      this.authForm.get('name')?.clearValidators();
      this.authForm.get('contactNumber')?.clearValidators();
      this.authForm.get('confirmPassword')?.clearValidators();
      this.authForm.get('password')?.clearValidators();
    }
    this.authForm.get('name')?.updateValueAndValidity();
    this.authForm.get('contactNumber')?.updateValueAndValidity();
    this.authForm.get('confirmPassword')?.updateValueAndValidity();
    this.authForm.get('password')?.updateValueAndValidity();
  }

  closeModal(): void {
    this.userService.showAuthModal.set(false);
  }

  onSubmit(): void {
    const currentTab = this.userService.authModalTab();
    if (currentTab === 'login') {
      this.handleLogin();
    } else if (currentTab === 'signup') {
      this.handleSignUp();
    } else if (currentTab === 'forgot') {
      this.handleForgotPassword();
    }
  }

  private handleLogin(): void {
    const emailControl = this.authForm.get('email');
    const passwordControl = this.authForm.get('password');

    if (emailControl?.invalid || passwordControl?.invalid) {
      this.toastService.warning('Please fill in all fields.');
      return;
    }
    
    this.loading.set(true);
    const emailValue = emailControl?.value ?? '';
    const passwordValue = passwordControl?.value ?? '';
    const loginData = { email: emailValue, password: passwordValue };

    this.userService.login(loginData).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        const token = response?.authToken || 'authToken';
        const userObj = response?.user || { name: emailValue.split('@')[0], email: emailValue };
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userObj));
        }
        this.userService.isLoggedIn.set(true);
        this.userService.currentUser.set(userObj);
        this.toastService.success(`Welcome back, ${userObj.name || 'User'}!`);
        this.closeModal();
      },
      error: (error: any) => {
        // console.warn('Backend login offline, falling back to mock login.', error);
        
          this.loading.set(false);
            this.toastService.error(error.error.message);

      }
    });
  }

  private handleSignUp(): void {
    if (this.authForm.invalid) {
      this.toastService.warning('Please fill in all fields.');
      return;
    }

    const { name, contactNumber, email, password, confirmPassword } = this.authForm.value;

    if (password !== confirmPassword) {
      this.toastService.error('Passwords do not match.');
      return;
    }

    this.loading.set(true);
    const signupData = {
      name: name ?? '',
      contactNumber: contactNumber ?? '',
      email: email ?? '',
      password: password ?? ''
    };

    this.userService.signUp(signupData).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        this.toastService.success('Account created successfully! Please sign in.');
        this.setTab('login');
      },
      error: (error: any) => {
        console.warn('Backend signup offline, falling back to mock signup.', error);
        
        setTimeout(() => {
          this.loading.set(false);
          this.toastService.success('Registration successful! (Mock Sign-Up)');
          this.setTab('login');
          this.authForm.patchValue({ email: signupData.email });
        }, 800);
      }
    });
  }

  private handleForgotPassword(): void {
    const emailControl = this.authForm.get('email');

    if (emailControl?.invalid) {
      this.toastService.warning('Please enter a valid email address.');
      return;
    }
    
    this.loading.set(true);
    const emailValue = emailControl?.value ?? '';
    const forgotData = { email: emailValue };

    this.userService.forgotPassword(forgotData).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        this.toastService.success(response?.message || 'Password reset link sent successfully.');
        this.setTab('login');
      },
      error: (error: any) => {
        this.loading.set(false);
        this.toastService.error(error?.error?.message || 'An error occurred. Please try again.');
      }
    });
  }
}
  