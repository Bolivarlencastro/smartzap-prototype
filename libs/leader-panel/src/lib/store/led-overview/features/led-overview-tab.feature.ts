import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { LedOverviewActions, LedOverviewTabActions } from '../actions';
import { LedOverviewTabModel, LedOverviewTabViewModel } from '../../../models/led-overview-tab';

export const LED_OVERVIEW_TAB_FEATURE_KEY = 'lpLedOverviewTab';

export interface LedOverviewTabFeatureState {
  loading: boolean;
  data: LedOverviewTabModel;
}

export const ledOverviewTabInitialState: LedOverviewTabFeatureState = {
  loading: true,
  data: null,
};

export const ledOverviewTabReducer = createReducer(
  ledOverviewTabInitialState,

  on(
    LedOverviewTabActions.fetchDataSuccess,
    (state, { data }): LedOverviewTabFeatureState => ({ ...state, loading: false, data }),
  ),

  on(LedOverviewTabActions.fetchDataFailure, (state): LedOverviewTabFeatureState => ({ ...state, loading: false })),

  on(LedOverviewActions.resetState, (): LedOverviewTabFeatureState => ledOverviewTabInitialState),
);

export const ledOverviewTabFeature = createFeature({
  name: LED_OVERVIEW_TAB_FEATURE_KEY,
  reducer: ledOverviewTabReducer,
  extraSelectors: ({ selectData, selectLoading }) => ({
    selectViewModel: createSelector(
      selectData,
      selectLoading,
      (data, loading): LedOverviewTabViewModel => ({
        data,
        loading,
      }),
    ),
    selectLoaded: createSelector(selectData, (data) => !!data),
  }),
});
