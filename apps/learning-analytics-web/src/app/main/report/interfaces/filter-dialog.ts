import { ReportType } from '../enums/report';

export interface FilterDialogData {
  title: string;
  subtitle: string;
  reportType: ReportType;
  columnTitle: string;
  selectionLabel: string;
}
