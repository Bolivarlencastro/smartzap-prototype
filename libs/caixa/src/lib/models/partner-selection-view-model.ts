import { CaixaPartner } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface PartnerSelectionViewModel {
  viewMode: PartnerSelectionViewMode;
  isSaving: boolean;
  partners: CaixaPartner[];
}

export type PartnerSelectionViewMode = 'select-partner-type' | 'search-partner';
