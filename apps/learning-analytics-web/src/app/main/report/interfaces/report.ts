import { ReportType } from '../enums/report';

export interface ReportListType {
  reportType: ReportType;
  icon: string;
}

export interface ReportTopics {
  users?: ReportListType[];
  missions?: ReportListType[];
  trails?: ReportListType[];
  pulses?: ReportListType[] | null;
  pdf?: ReportListType[];
}

export interface ReportStatus {
  name: string;
  color?: string;
  backgroundColor?: string;
  active?: boolean;
}
