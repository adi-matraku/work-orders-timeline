import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <div class="logo-container">
        <img src="images/Naologic-logo.png" alt="Naologic logo" />
      </div>
      <router-outlet/>
    </div>
  `,
  styles: `
    .app-container {
      width: 1440px;
      margin-left: 101px;
      min-height: 100vh;
      box-sizing: border-box;
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
