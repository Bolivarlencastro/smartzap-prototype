import { CaixaPartner } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface UserRegistrationViewModel {
  viewMode: UserRegistrationViewMode;
  isSaving: boolean;
  partners: CaixaPartner[];
}

export type UserRegistrationViewMode = 'select-partner-type' | 'user-details';
