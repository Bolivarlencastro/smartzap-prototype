import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { TransfersFiltersActions } from '../actions';
import { TransfersFiltersResult } from '../../models/transfers-filters-result';

export interface TransfersFiltersFeatureState {
  isLoading: boolean;
  origin: KpFilterSelectOption[];
  destination: KpFilterSelectOption[];
  filterState: TransfersFiltersResult | undefined;
}

export const transfersFiltersInitialState: TransfersFiltersFeatureState = {
  isLoading: false,
  origin: [],
  destination: [],
  filterState: undefined,
};

const featureReducer = createReducer(
  transfersFiltersInitialState,
  on(
    TransfersFiltersActions.filterSelectOptions,
    (state): TransfersFiltersFeatureState => ({
      ...state,
      isLoading: true,
    }),
  ),

  on(
    TransfersFiltersActions.filterSelectOptionsSuccess,
    (state, { searchType, results }): TransfersFiltersFeatureState => {
      return { ...state, isLoading: false, [searchType as keyof TransfersFiltersFeatureState]: results };
    },
  ),

  on(TransfersFiltersActions.initialFilterSelectOptionsSuccess, (state, { results }): TransfersFiltersFeatureState => {
    return { ...state, isLoading: false, origin: results, destination: results };
  }),

  on(
    TransfersFiltersActions.filterSelectOptionsFailure,
    (state): TransfersFiltersFeatureState => ({ ...state, isLoading: false }),
  ),

  on(
    TransfersFiltersActions.storeFilterControllerState,
    (state, { filterState }): TransfersFiltersFeatureState => ({
      ...state,
      filterState,
    }),
  ),
);

export const transfersFiltersFeature = createFeature({
  name: 'transfersFilters',
  reducer: featureReducer,
  extraSelectors: ({ selectTransfersFiltersState }) => ({
    selectViewModel: createSelector(selectTransfersFiltersState, (state) => ({ ...state })),
  }),
});
