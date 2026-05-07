import { ReportType } from '../enums/report';

export interface SimpleFilterListItem {
  id: string;
  label: string;
}

export interface SimpleFilterListResult {
  value: string;
  label: string;
}

export interface SimpleFilterReportModel {
  page?: number;
  reportType?: ReportType;
  search: string;
}
