import { Component } from '@angular/core';

@Component({
  selector: 'app-work-orders',
  standalone: true,
  template: `
    <div class="work-orders-container">
      <p>work centers</p>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
    }
    .work-orders-container {
      width: 1440px;
      height: 1024px;
      background-color: rgba(255, 255, 255, 1);
      box-sizing: border-box;
      padding: 95px 0 0 101px;
    }
  `,
})
export class WorkOrdersComponent {}
