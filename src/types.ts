export interface PerformanceData {
  labels: string[];
  users: number[];
  sessions: number[];
  pages: number[];
}

export type PeriodFilter = 'all' | '3months' | '2025' | '2026' | string;
export type ChartType = 'bar' | 'line';
