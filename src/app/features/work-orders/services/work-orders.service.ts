import {Injectable} from '@angular/core';
import {delay, Observable, of} from 'rxjs';
import {WorkOrderData, WorkOrderDocument} from '../models/work-orders.model';
import {MOCK_WORK_ORDERS} from '../../../mocks/work-orders.mock';
import {generateId} from '../utils/numbers-generator.util';

@Injectable({providedIn: 'root'})
export class WorkOrderService {
  private mockDb: WorkOrderDocument[] = [...MOCK_WORK_ORDERS];

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
