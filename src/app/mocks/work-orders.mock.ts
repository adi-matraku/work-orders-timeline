import {WorkCenterDocument, WorkOrderDocument} from '../features/work-orders/models/work-orders.model';

export const MOCK_WORK_CENTERS: WorkCenterDocument[] = [
  {
    docId: 'wc-1',
    docType: 'workCenter',
    data: { name: 'Genesis Hardware' }
  },
  {
    docId: 'wc-2',
    docType: 'workCenter',
    data: { name: 'Rodriques Electrics' }
  },
  {
    docId: 'wc-3',
    docType: 'workCenter',
    data: { name: 'Konsulting Inc' }
  },
  {
    docId: 'wc-4',
    docType: 'workCenter',
    data: { name: 'McMarrow Distribution' }
  },
  {
    docId: 'wc-5',
    docType: 'workCenter',
    data: { name: 'Spartan Manufacturing' }
  }
];

/* ===========================
   Mock Work Orders
=========================== */

export const MOCK_WORK_ORDERS: WorkOrderDocument[] = [
  {
    docId: 'wo-1',
    docType: 'workOrder',
    data: {
      name: 'Aluminum Profiles Batch #42',
      workCenterId: 'wc-1',
      status: 'in-progress',
      startDate: '2025-08-01',
      endDate: '2025-10-30'
    }
  },
  {
    docId: 'wo-2',
    docType: 'workOrder',
    data: {
      name: 'PVC Tubing Run',
      workCenterId: 'wc-1',
      status: 'open',
      startDate: '2025-11-02',
      endDate: '2026-01-25'
    }
  },
  {
    docId: 'wo-3',
    docType: 'workOrder',
    data: {
      name: 'CNC Milling – Housing',
      workCenterId: 'wc-2',
      status: 'complete',
      startDate: '2025-09-05',
      endDate: '2026-01-09'
    }
  },
  {
    docId: 'wo-4',
    docType: 'workOrder',
    data: {
      name: 'Precision Drilling',
      workCenterId: 'wc-2',
      status: 'blocked',
      startDate: '2026-01-15',
      endDate: '2026-04-22'
    }
  },
  {
    docId: 'wo-5',
    docType: 'workOrder',
    data: {
      name: 'Final Assembly – Model X',
      workCenterId: 'wc-3',
      status: 'in-progress',
      startDate: '2025-10-12',
      endDate: '2026-02-28'
    }
  },
  {
    docId: 'wo-6',
    docType: 'workOrder',
    data: {
      name: 'Electrical QA Batch',
      workCenterId: 'wc-4',
      status: 'open',
      startDate: '2026-01-18',
      endDate: '2026-04-21'
    }
  },
  {
    docId: 'wo-7',
    docType: 'workOrder',
    data: {
      name: 'Packaging – Export Pallets',
      workCenterId: 'wc-5',
      status: 'in-progress',
      startDate: '2026-02-08',
      endDate: '2026-05-14'
    }
  },
  {
    docId: 'wo-8',
    docType: 'workOrder',
    data: {
      name: 'Re-Packaging – Damaged Goods',
      workCenterId: 'wc-5',
      status: 'complete',
      startDate: '2025-09-16',
      endDate: '2025-12-19'
    }
  }
];
