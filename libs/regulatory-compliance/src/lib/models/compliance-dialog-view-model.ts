import { ComplianceListItem } from './compliance';

export interface ComplianceDialogViewModel {
  filter: string;
  listItems: ComplianceListItem[];
  itemsTotal: number;
  selectedTotal: number;
  normativeInputValue: string;
  isLoading: boolean;
}
