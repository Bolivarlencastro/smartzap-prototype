import { marker } from '@jsverse/transloco-keys-manager/marker';

export enum DashboardPeriodType {
  MONTH,
  YEAR,
  PERIOD,
}
marker('GENERAL.MONTH');
marker('GENERAL.YEAR');
marker('GENERAL.PERIOD');

export enum DashboardChartType {
  COURSES,
  USERS,
}
marker('GENERAL.COURSES');
marker('GENERAL.USERS');
export interface DashboardCourseTotals {
  type: DashboardPeriodType;
  start_date?: string;
  end_date?: string;
  workspace_id: string;
  chartType: DashboardChartType;
  selectedMonth: number;
  selectedYear: number;
}
