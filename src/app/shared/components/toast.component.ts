import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {ToastService} from '../services/toast.service';

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

      color: #fff;

      font-size: 13px;
      font-weight: 500;

      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      animation: slide-in 160ms ease-out;
    }

    .error {
      background: rgba(255, 92, 92, 0.95);
    }

    .success {
      background: rgba(46, 184, 92, 0.95);
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}
