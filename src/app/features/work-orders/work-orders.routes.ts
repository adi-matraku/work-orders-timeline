import {Routes} from '@angular/router';

export const WORK_ORDER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/work-orders-list/work-orders.component').then(m => m.WorkOrdersComponent)
  }
];
