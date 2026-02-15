import {Component} from '@angular/core';
import {WorkCenterTableComponent} from '../../components/work-center-table/work-center-table.component';
import {TimescaleSelectorComponent} from '../../components/timescale-selector/timescale-selector.component';

@Component({
  selector: 'app-work-orders',
  standalone: true,
  imports: [TimescaleSelectorComponent, WorkCenterTableComponent],
  template: `
    <div class="work-orders-container">
      <h1 class="title">Work Orders</h1>
      <div class="timescale-selector-container">
        <app-timescale-selector/>
      </div>
      <div class="work-center-activity-container">
        <app-work-center-table/>
      </div>
    </div>
  `,
  styles: `
    .work-orders-container {
      width: 100%;
      height: 100%;
    }

    ;
    .title {
      width: 142px;
      height: 34px;
      margin-bottom: 26px;
      color: rgba(3, 9, 41, 1);
      font-family: "Circular-Std", sans-serif;
      font-size: 24px;
      font-weight: 600;
      line-height: 34px;
      letter-spacing: auto;
      text-align: left;
      vertical-align: top;
      box-sizing: border-box;
    }
  `,
})
export class WorkOrdersComponent {
}
