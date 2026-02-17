type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';
export type WorkOrderActionType = 'edit' | 'delete';

export interface WorkCenterDocument {
  docId: string;
  docType: 'workCenter';
  data: {
    name: string;
  };
}

export interface WorkOrderDocument {
  docId: string;
  docType: 'workOrder';
  data: WorkOrderData;
}

export interface WorkOrderData {
  name: string;
  workCenterId: string;
  status: WorkOrderStatus;
  startDate: string;
  endDate: string;
}

export interface WorkOrderForm {
  name: string;
  status: WorkOrderStatus;
  startDate: string;
  endDate: string;
}
