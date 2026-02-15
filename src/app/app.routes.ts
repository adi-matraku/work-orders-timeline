import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'work-orders',
    loadChildren: () =>
      import('./features/work-orders/work-orders.routes').then(m => m.WORK_ORDER_ROUTES)
  },
  {
    path: '',
    redirectTo: 'work-orders',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'work-orders'
  }
];
