import {Component, inject, input} from '@angular/core';
import {ToastService} from './services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (toastService.toast()) {
      <div class="toast-panel" [class]="toastService.toast()!.type">
        {{ toastService.toast()!.message }}
      </div>
    }
  `,
  styles: `
    .toast-panel {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;

      padding: 12px 16px;
      border-radius: 8px;

      background: rgba(255, 92, 92, 0.95);
      color: #fff;

      font-size: 12px;
      font-weight: 500;

      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      animation: slide-in 160ms ease-out;
    }

    @keyframes slide-in {
      from {
        transform: translateY(-8px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  // message = input.required<string>();
}
