import {TimelineColumn, Timescale, TIMESCALE_CONFIG} from '../models/timescale.model';
import {getStartOfWeek, getWeekNumber} from './date-utils';

export function getDurationPerCell(view: Timescale): number {
  if (view === 'day') return 24 * 60 * 60 * 1000;
  if (view === 'week') return 7 * 24 * 60 * 60 * 1000;
  return 30 * 24 * 60 * 60 * 1000; // Approx month
}

export function buildDayColumns(): TimelineColumn[] {
  const columns: TimelineColumn[] = [];

  const today = new Date();
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 14
  );

  for (let i = 0; i < TIMESCALE_CONFIG.day.columns; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    columns.push({
      date,
      label: date.getDate().toString(),
      subLabel: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        year: 'numeric'
      })
    });
  }

  return columns;
}


export function buildHourColumns(): TimelineColumn[] {
  const columns: TimelineColumn[] = [];

  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  for (let hour = 0; hour < TIMESCALE_CONFIG.hour.columns; hour++) {
    const date = new Date(startOfDay);
    date.setHours(hour);

    columns.push({
      date,
      label: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
      }),
      subLabel: date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short'
      })
    });
  }

  return columns;
}

export function buildWeekColumns(): TimelineColumn[] {
  const columns: TimelineColumn[] = [];

  const today = new Date();
  const mondayThisWeek = getStartOfWeek(today);

  const start = new Date(mondayThisWeek);
  start.setDate(start.getDate() - 8 * 7);

  for (let i = 0; i < TIMESCALE_CONFIG.week.columns; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i * 7);

    columns.push({
      date,
      label: `Week ${getWeekNumber(date)}`,
      subLabel: date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      })
    });
  }

  return columns;
}


export function buildMonthColumns(): TimelineColumn[] {
  const columns: TimelineColumn[] = [];

  const today = new Date();
  const start = new Date(
    today.getFullYear(),
    today.getMonth() - 6,
    1
  );

  for (let i = 0; i < TIMESCALE_CONFIG.month.columns; i++) {
    const date = new Date(start);
    date.setMonth(start.getMonth() + i);

    columns.push({
      date,
      label: date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      }),
      subLabel: null
    });
  }

  return columns;
}
