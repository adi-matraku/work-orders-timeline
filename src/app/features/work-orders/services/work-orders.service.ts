import {Injectable} from '@angular/core';
import {delay, Observable, of} from 'rxjs';
import {WorkOrderData, WorkOrderDocument} from '../models/work-orders.model';
import {MOCK_WORK_ORDERS} from '../../../mocks/work-orders.mock';

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
      docId: Math.random().toString(36).substring(7),
      docType: 'workOrder',
      data: orderData
    };
    this.mockDb.push(newDoc);
    return of(newDoc).pipe(delay(1000));
  }

  // Simulate a delete call
  deleteOrder(id: string): Observable<string> {
    return of(id).pipe(delay(1000));
  }
}
