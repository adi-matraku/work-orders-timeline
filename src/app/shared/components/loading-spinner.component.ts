import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-overlay">
      <div class="spinner-container">
        <div class="cool-loader"></div>
        @if (message()) {
          <p class="loading-text">{{ message() }}</p>
        }
      </div>
    </div>
  `,
  styles: `
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(255, 255, 255, 0.5);
      -webkit-backdrop-filter: blur(4px);

      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: all 0.3s ease;
    }

    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .cool-loader {
      width: 50px;
      padding: 8px;
      aspect-ratio: 1;
      border-radius: 50%;
      background: #2563eb; // Your primary blue
      --_m: conic-gradient(#0000 10%, #000),
      linear-gradient(#000 0 0) content-box;
      -webkit-mask: var(--_m);
      mask: var(--_m);
      -webkit-mask-composite: source-out;
      mask-composite: subtract;
      animation: s3 1s infinite linear;
    }

    @keyframes s3 {
      to {
        transform: rotate(1turn);
      }
    }

    .loading-text {
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      color: #1e293b;
      margin: 0;
      letter-spacing: 0.5px;
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent {
  // Optional message to show under the spinner
  message = input<string>('');
}
