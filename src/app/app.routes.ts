import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./work-orders/work-orders.component').then((m) => m.WorkOrdersComponent),
  },
];
