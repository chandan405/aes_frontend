import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './shared/toast/toast-container.component';
import { SignUp } from './sign-up/sign-up';
import { User } from './service/user/user';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent, SignUp],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Portal');

  constructor(public userService: User) {}
}
