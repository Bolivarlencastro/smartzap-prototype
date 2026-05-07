import { CaixaPartner, PartnerType } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { UserRegistrationActions } from '../actions';
import { UserRegistrationViewMode, UserRegistrationViewModel } from '../../models';

export interface UserRegistrationFeatureState {
  viewMode: UserRegistrationViewMode;
  partnerType: PartnerType;
  isSaving: boolean;
  partners: CaixaPartner[];
}

export const userRegistrationInitialState: UserRegistrationFeatureState = {
  viewMode: 'select-partner-type',
  partnerType: null,
  isSaving: false,
  partners: [],
};

export const userRegistrationReducer = createReducer(
  userRegistrationInitialState,

  on(
    UserRegistrationActions.setPartnerType,
    (state, { partnerType }): UserRegistrationFeatureState => ({
      ...state,
      partnerType,
      viewMode: 'user-details',
    }),
  ),

  on(UserRegistrationActions.searchPartnerSuccess, (state, { result }): UserRegistrationFeatureState => {
    return {
      ...state,
      partners: result.items,
    };
  }),

  on(UserRegistrationActions.signUpUser, (state): UserRegistrationFeatureState => {
    return {
      ...state,
      isSaving: true,
    };
  }),

  on(
    UserRegistrationActions.signUpUserSuccess,
    UserRegistrationActions.signUpUserFailure,
    (state): UserRegistrationFeatureState => {
      return {
        ...state,
        isSaving: false,
      };
    },
  ),

  on(UserRegistrationActions.reset, (): UserRegistrationFeatureState => userRegistrationInitialState),
);

export const userRegistrationFeature = createFeature({
  name: 'userRegistration',
  reducer: userRegistrationReducer,
  extraSelectors: ({ selectViewMode, selectPartners, selectIsSaving }) => ({
    selectViewModel: createSelector(
      selectViewMode,
      selectPartners,
      selectIsSaving,
      (viewMode, partners, isSaving): UserRegistrationViewModel => ({
        viewMode,
        partners,
        isSaving,
      }),
    ),
  }),
});
