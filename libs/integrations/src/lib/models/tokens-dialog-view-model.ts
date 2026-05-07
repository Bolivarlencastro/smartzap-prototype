import { IntegrationTokensDto } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface TokensDialogViewModel {
  tokens?: IntegrationTokensDto;
  isLoading: boolean;
  showSpinner: boolean;
}
