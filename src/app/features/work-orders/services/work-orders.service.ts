import {inject, Injectable} from '@angular/core';
import {delay, Observable, of} from 'rxjs';
import {WorkOrderData, WorkOrderDocument} from '../models/work-orders.model';
import {MOCK_WORK_ORDERS} from '../../../mocks/work-orders.mock';
import {generateId} from '../utils/number-generators/numbers-generator.util';
import {LocalStorageService} from '../../../shared/services/local-storage.service';

@Injectable({providedIn: 'root'})
export class WorkOrderService {
  private storageKey = 'work_orders';
  private storage = inject(LocalStorageService);

  private mockDb: WorkOrderDocument[] =
    this.storage.get<WorkOrderDocument[]>(this.storageKey) ?? [...MOCK_WORK_ORDERS];

  // Simulate a get call
  getOrders(): Observable<WorkOrderDocument[]> {
    return of([...this.mockDb]).pipe(delay(800));
  }

  // Simulate a create call
  createOrder(orderData: WorkOrderData): Observable<WorkOrderDocument> {
    const newDoc: WorkOrderDocument = {
      docId: generateId(),
      docType: 'workOrder',
      data: orderData
    };
    return of(newDoc).pipe(delay(1000));
  }

  // Simulate an update call
  updateOrder(doc: WorkOrderDocument): Observable<WorkOrderDocument> {
    return of(doc).pipe(delay(800));
  }

  // Simulate a delete call
  deleteOrder(id: string): Observable<string> {
    return of(id).pipe(delay(1000));
  }
}
