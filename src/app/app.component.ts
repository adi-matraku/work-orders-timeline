import {ChangeDetectionStrategy, Component} from '@angular/core';
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
      max-width: 1440px;
      width: 100%;
      padding-left: 101px;
    }

    .logo-container {
      width: 100%;
      height: 50px;
      background-color: rgba(255, 255, 255, 1);
      padding: 20px 0;
      margin-bottom: 45px;
    }

    @media (max-width: 768px) {
      .app-container {
        padding-left: 16px;
        padding-right: 16px;
      }

      .logo-container {
        margin-bottom: 24px;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
