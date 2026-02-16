export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay() || 7; // Sunday = 7
  d.setDate(d.getDate() - day + 1);
  return d;
}

export function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
