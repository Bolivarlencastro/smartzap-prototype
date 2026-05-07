import { CaixaPartner, PartnerType } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { PartnerSelectionActions } from '../actions';
import { PartnerSelectionViewMode, PartnerSelectionViewModel } from '../../models';

export interface PartnerSelectionFeatureState {
  viewMode: PartnerSelectionViewMode;
  partnerType: PartnerType;
  isSaving: boolean;
  partners: CaixaPartner[];
}

export const partnerSelectionInitialState: PartnerSelectionFeatureState = {
  viewMode: 'select-partner-type',
  partnerType: null,
  isSaving: false,
  partners: [],
};

const reducer = createReducer(
  partnerSelectionInitialState,

  on(
    PartnerSelectionActions.setPartnerType,
    (state, { partnerType }): PartnerSelectionFeatureState => ({
      ...state,
      partnerType,
      viewMode: 'search-partner',
    }),
  ),

  on(PartnerSelectionActions.searchPartnerSuccess, (state, { result }): PartnerSelectionFeatureState => {
    return {
      ...state,
      partners: result.items,
    };
  }),

  on(PartnerSelectionActions.reset, (): PartnerSelectionFeatureState => partnerSelectionInitialState),
);

export const partnerSelectionFeature = createFeature({
  name: 'partnerSelection',
  reducer,
  extraSelectors: ({ selectViewMode, selectPartners, selectIsSaving }) => ({
    selectViewModel: createSelector(
      selectViewMode,
      selectPartners,
      selectIsSaving,
      (viewMode, partners, isSaving): PartnerSelectionViewModel => ({
        viewMode,
        partners,
        isSaving,
      }),
    ),
  }),
});
