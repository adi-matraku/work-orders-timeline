import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ToastComponent} from './shared/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <div class="app-container">
      <div class="logo-container">
        <img src="/assets/Naologic-logo.png" alt="Naologic logo" />
      </div>
      <router-outlet/>
      <app-toast />
    </div>
  `,
  styles: `
    .app-container {
      width: 1440px;
      padding-left: 101px;
    }
    .logo-container {
      width: 100%;
      height: 50px;
      background-color: rgba(255, 255, 255, 1);
      padding: 20px 0;
      margin-bottom: 45px;
    }
  `
})
export class AppComponent {}
