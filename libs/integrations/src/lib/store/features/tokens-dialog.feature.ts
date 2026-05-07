import { TokensDialogViewModel } from '../../models';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { TokensDialogActions } from '../actions';
import { IntegrationTokensDto } from '@keeps-platform-frontend-workspace/kp-keeps';

export const TOKENS_DIALOG_FEATURE_NAME = 'tokensDialog';

export interface TokensDialogFeatureState {
  isLoading: boolean;
  tokens: IntegrationTokensDto | undefined;
}

export const tokensDialogInitialState: TokensDialogFeatureState = { isLoading: true, tokens: undefined };

const reducer = createReducer(
  tokensDialogInitialState,

  on(TokensDialogActions.loadTokensSuccess, (state, { tokens }): TokensDialogFeatureState => {
    return { ...state, tokens, isLoading: false };
  }),

  on(TokensDialogActions.saveTokens, (state): TokensDialogFeatureState => {
    return { ...state, isLoading: true };
  }),

  on(TokensDialogActions.saveTokensFailure, (state): TokensDialogFeatureState => {
    return { ...state, isLoading: false };
  }),

  on(TokensDialogActions.reset, (): TokensDialogFeatureState => tokensDialogInitialState),
);

export const tokensDialogFeature = createFeature({
  name: TOKENS_DIALOG_FEATURE_NAME,
  reducer,
  extraSelectors: ({ selectTokensDialogState }) => ({
    selectViewModel: createSelector(
      selectTokensDialogState,
      (dialogState): TokensDialogViewModel => ({
        tokens: dialogState.tokens,
        isLoading: dialogState.isLoading,
        showSpinner: !dialogState.tokens && dialogState.isLoading,
      }),
    ),
  }),
});
