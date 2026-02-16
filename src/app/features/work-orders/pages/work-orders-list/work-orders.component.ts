import {Component} from '@angular/core';
import {WorkCentersTableComponent} from '../../components/work-centers-table/work-centers-table.component';

@Component({
    selector: 'app-work-orders',
    standalone: true,
    imports: [WorkCentersTableComponent],
    template: `
        <div class="work-orders-container">
            <h1 class="title">Work Orders</h1>
            <div class="work-center-activity-container">
                <app-work-centers-table/>
            </div>
        </div>
    `,
    styles: `
      .work-orders-container {
        width: 100%;
        height: 100%;
      };

      .title {
        width: 142px;
        height: 34px;
        margin-bottom: 26px;
        color: rgba(3, 9, 41, 1);
        font-size: 24px;
        font-weight: 600;
        line-height: 34px;
        letter-spacing: normal;
        text-align: left;
        vertical-align: top;
        box-sizing: border-box;
      }
    `,
})
export class WorkOrdersComponent {
}
