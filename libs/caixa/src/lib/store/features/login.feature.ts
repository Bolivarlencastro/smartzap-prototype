import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { CaixaSmartZapUser } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LoginActions, PartnerSelectionActions } from '../actions';

interface LoginState {
  currentUser: CaixaSmartZapUser | null;
  isInLoginProcess: boolean;
}

export const loginInitialState: LoginState = {
  currentUser: null,
  isInLoginProcess: false,
};

export const loginReducer = createReducer(
  loginInitialState,

  on(
    LoginActions.setUser,
    (state, { user }): LoginState => ({
      ...state,
      currentUser: user,
    }),
  ),

  on(
    PartnerSelectionActions.selectPartner,
    (state, { partner }): LoginState => ({
      ...state,
      currentUser: {
        ...state.currentUser,
        related_partner: partner,
      },
    }),
  ),

  on(LoginActions.resetDialogState, (state): LoginState => ({ ...loginInitialState, currentUser: state.currentUser })),

  on(LoginActions.clearCurrentUser, (): LoginState => ({ ...loginInitialState, currentUser: null })),

  on(LoginActions.searchUserForLogin, (): LoginState => ({ ...loginInitialState, isInLoginProcess: true })),

  on(
    LoginActions.searchUserForLoginSuccess,
    LoginActions.searchUserForLoginFailure,
    (): LoginState => ({ ...loginInitialState, isInLoginProcess: false }),
  ),
);

export const loginFeature = createFeature({
  name: 'login',
  reducer: loginReducer,
  extraSelectors: ({ selectCurrentUser }) => ({
    selectCurrentUser,
    selectIsLoggedIn: createSelector(selectCurrentUser, (user) => !!user?.id),
  }),
});
