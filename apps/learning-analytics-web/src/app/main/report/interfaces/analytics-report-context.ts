import { ReportListType } from './report';

export interface AnalyticsReportContext {
  cols: string;
  icon?: string;
  colored?: boolean;
  title?: string;
  items: ReportListType[];
}
