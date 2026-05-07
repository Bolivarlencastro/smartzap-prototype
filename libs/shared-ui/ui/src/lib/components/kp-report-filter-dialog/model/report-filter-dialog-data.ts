import { FilterGroupConfig } from './filter-group-config';

export interface KpReportFilterDialogData {
  title: string;
  selectors: FilterGroupConfig[];
  positiveButtonLabel?: string;
  currentFilter?: any;
}
