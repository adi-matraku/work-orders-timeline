import {inject} from '@angular/core';
import {getState, patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {catchError, of, pipe, switchMap, tap} from 'rxjs';
import {WorkOrderData, WorkOrderDocument} from '../models/work-orders.model';
import {WorkOrderService} from './work-orders.service';
import {ToastService} from '../../../shared/services/toast.service';

export interface WorkOrderState {
  items: WorkOrderDocument[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkOrderState = {
  items: [],
  isLoading: false,
  error: null,
};

export const WorkOrderStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((store, service = inject(WorkOrderService), toast = inject(ToastService)) => {

    /**
     * Internal helper to check for date overlaps within the same Work Center.
     */
    const hasOverlap = (newData: WorkOrderData, excludeDocId?: string): boolean => {
      const {items} = getState(store); // Using getState helper
      return items.some(item => {
        if (item.docId === excludeDocId) return false;
        if (item.data.workCenterId !== newData.workCenterId) return false;

        const s1 = new Date(newData.startDate).getTime();
        const e1 = new Date(newData.endDate).getTime();
        const s2 = new Date(item.data.startDate).getTime();
        const e2 = new Date(item.data.endDate).getTime();

        return s1 < e2 && e1 > s2;
      });
    };

    /**
     * Handle errors by updating state and showing a toast notification.
     */
    const handleError = (msg: string) => {
      patchState(store, {error: msg, isLoading: false});
      toast.show(msg, 'error');
      return of(null);
    };

    return {
      /**
       * Initial load of work orders.
       */
      loadOrders: rxMethod<void>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap(() => service.getOrders().pipe(
            tap(items => patchState(store, {items, isLoading: false})),
            catchError(() =>
              handleError('Failed to load schedule')
            )
          ))
        )
      ),

      /**
       * Creates a new Work Order.
       */
      addOrder: rxMethod<WorkOrderData>(
        pipe(
          tap(() => patchState(store, {isLoading: true, error: null})),
          switchMap((orderData) => {
            console.log(orderData);
            if (hasOverlap(orderData)) {
              return handleError('Overlap detected! Choose another time.');
            }

            return service.createOrder(orderData).pipe(
              tap(newDoc => {
                const currentState = getState(store);
                patchState(store, {
                  items: [...currentState.items, newDoc],
                  isLoading: false
                });
              }),
              catchError(() => handleError('Save failed'))
            );
          })
        )
      ),

      /**
       * Updates an existing Work Order.
       */
      // updateOrder: rxMethod<{ docId: string; data: WorkOrderData }>(
      //   pipe(
      //     tap(() => patchState(store, { isLoading: true, error: null })),
      //     switchMap(({ docId, data }) => {
      //       if (hasOverlap(data, docId)) {
      //         patchState(store, { error: 'Update failed: Schedule overlap.', isLoading: false });
      //         return of(null);
      //       }
      //
      //       return service.updateOrder(docId, data).pipe(
      //         tap(updatedDoc => {
      //           const { items } = getState(store);
      //           patchState(store, {
      //             items: items.map(i => i.docId === docId ? updatedDoc : i),
      //             isLoading: false
      //           });
      //         }),
      //         catchError(() => {
      //           patchState(store, { error: 'Update failed', isLoading: false });
      //           return of(null);
      //         })
      //       );
      //     })
      //   )
      // ),

      /**
       * Removes a Work Order by docId.
       */
      removeOrder: rxMethod<string>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap(docId => service.deleteOrder(docId).pipe(
            tap(() => {
              const {items} = getState(store);
              patchState(store, {
                items: items.filter(i => i.docId !== docId),
                isLoading: false
              });
            }),
            catchError(() => handleError('Delete failed'))
          ))
        )
      ),
      clearError: () => patchState(store, {error: null})
    };
  })
);
