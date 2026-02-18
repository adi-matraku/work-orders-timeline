import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {EscCloseDirective} from '../../features/work-orders/directives/esc-close.directive';
import {AutoFocusDirective} from '../../features/work-orders/directives/auto-focus.directive';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="dialog-overlay" role="presentation" escClose
         (esc)="canceled.emit()" (click)="onCancel()">
      <div class="dialog-card"
           role="dialog"
           aria-modal="true"
           aria-labelledby="confirm-dialog-title"
           aria-describedby="confirm-dialog-message"
           (click)="$event.stopPropagation()">
        <h3 class="dialog-title" id="confirm-dialog-title">{{ title() }}</h3>
        <p class="dialog-message" id="confirm-dialog-message">{{ message() }}</p>

        <div class="dialog-actions">
          <button class="btn-cancel" (click)="onCancel()" autoFocusElement>Cancel</button>
          <button class="btn-danger" (click)="onConfirm()">{{ confirmText() }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(3, 9, 41, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(2px);
    }

    .dialog-card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      width: 100%;
      max-width: 350px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .dialog-title {
      margin: 0 0 8px 0;
      color: #030929;
      font-size: 18px;
      font-weight: 600;
    }

    .dialog-message {
      color: #5e6278;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 24px;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  `],
  imports: [
    EscCloseDirective,
    AutoFocusDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
  title = input<string>('Confirm Action');
  message = input<string>('Are you sure you want to proceed?');
  confirmText = input<string>('Delete');

  confirmed = output<void>();
  canceled = output<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.canceled.emit();
  }
}
