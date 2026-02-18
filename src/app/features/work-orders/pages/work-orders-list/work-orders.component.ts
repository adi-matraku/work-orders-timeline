import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {WorkCentersTableComponent} from '../../components/work-centers-table/work-centers-table.component';
import {WorkOrderStore} from "../../services/work-orders.store";
import {LoadingSpinnerComponent} from "../../../../shared/loading-spinner.component";

@Component({
    selector: 'app-work-orders',
    standalone: true,
    imports: [WorkCentersTableComponent, LoadingSpinnerComponent],
    template: `
        @if (store.isLoading()) {
            <app-loading-spinner message="Updating schedule..."></app-loading-spinner>
        }

        <div class="work-orders-container">
            <h1 class="title">Work Orders</h1>
            <div class="work-center-activity-container">
                <app-work-centers-table
                        [workOrders]="store.items()"
                        (onCreate)="store.addOrder($event)"
                        (onUpdate)="store.updateOrder($event)"
                        (onDelete)="store.removeOrder($event)"
                />
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
        font-size: 24px;
        font-weight: 600;
        line-height: 34px;
        letter-spacing: normal;
        text-align: left;
        vertical-align: top;
        box-sizing: border-box;
      }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkOrdersComponent implements OnInit {
    readonly store = inject(WorkOrderStore);

    ngOnInit() {
        this.store.loadOrders();
    }
}
