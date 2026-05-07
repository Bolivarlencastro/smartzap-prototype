import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { CycleEnrollmentsFilterActions } from '../actions';
import { CycleEnrollmentsFilterResult } from '../../models';

export interface CycleEnrollmentsFilterState {
  isLoading: boolean;
  normatives: KpFilterSelectOption[];
  learningObjects: KpFilterSelectOption[];
  users: KpFilterSelectOption[];
  leaders: KpFilterSelectOption[];
  filterState: CycleEnrollmentsFilterResult | undefined;
}

export const cycleEnrollmentsFilterInitialState: CycleEnrollmentsFilterState = {
  isLoading: false,
  leaders: [],
  learningObjects: [],
  normatives: [],
  users: [],
  filterState: undefined,
};

const featureReducer = createReducer(
  cycleEnrollmentsFilterInitialState,
  on(
    CycleEnrollmentsFilterActions.autocompleteSearch,
    (state): CycleEnrollmentsFilterState => ({
      ...state,
      isLoading: true,
    }),
  ),

  on(
    CycleEnrollmentsFilterActions.autocompleteSearchSuccess,
    (state, { searchType, results }): CycleEnrollmentsFilterState => {
      const stateCopy = { ...state };
      stateCopy[searchType] = results;

      return {
        ...stateCopy,
        isLoading: false,
      };
    },
  ),

  on(
    CycleEnrollmentsFilterActions.autocompleteSearchFailure,
    (state): CycleEnrollmentsFilterState => ({
      ...state,
      isLoading: false,
    }),
  ),

  on(
    CycleEnrollmentsFilterActions.storeFilterControllerState,
    (state, { filterState }): CycleEnrollmentsFilterState => ({
      ...state,
      filterState,
    }),
  ),
);

export const cycleEnrollmentsFilterFeature = createFeature({
  name: 'cycleEnrollmentsFilter',
  reducer: featureReducer,
  extraSelectors: ({ selectCycleEnrollmentsFilterState }) => ({
    selectViewModel: createSelector(selectCycleEnrollmentsFilterState, (state) => ({ ...state })),
  }),
});
