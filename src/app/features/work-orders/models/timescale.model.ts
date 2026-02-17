import {WorkOrderDocument} from './work-orders.model';

export type Timescale = 'hour' | 'day' | 'week' | 'month';

export interface PositionedWorkOrder extends WorkOrderDocument {
  left: number;
  width: number;
}

export interface TimelineColumn {
  date: Date;
  label: string;
  subLabel?: string | null;
}

export interface TimescaleConfig {
  columns: number;
  cellWidth: number;
}

export const TIMESCALE_CONFIG: Record<Timescale, TimescaleConfig> = {
  hour: {
    columns: 24,   // ±12 hours
    cellWidth: 80
  },
  day: {
    columns: 28,   // ±14 days
    cellWidth: 100
  },
  week: {
    columns: 16,   // ±8 weeks
    cellWidth: 160
  },
  month: {
    columns: 12,   // ±6 months
    cellWidth: 114
  }
};
