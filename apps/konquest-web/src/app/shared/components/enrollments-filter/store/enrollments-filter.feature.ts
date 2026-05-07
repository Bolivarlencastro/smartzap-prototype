import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { EnrollmentsFilterActions } from '.';
import { EnrollmentFilterResult } from '../model/enrollment-filter';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';

export interface EnrollmentsFilterState {
  isLoading: boolean;
  filterState: Partial<EnrollmentFilterResult> | undefined;
  categories: KpFilterSelectOption[];
  instructors: KpFilterSelectOption[];
}

export const enrollmentsFilterInitialState: EnrollmentsFilterState = {
  isLoading: false,
  filterState: undefined,
  categories: [],
  instructors: [],
};

const featureReducer = createReducer(
  enrollmentsFilterInitialState,

  on(EnrollmentsFilterActions.filterSelectOptions, (state): EnrollmentsFilterState => ({ ...state, isLoading: true })),

  on(EnrollmentsFilterActions.filterSelectOptionsSuccess, (state, { searchType, results }): EnrollmentsFilterState => {
    return { ...state, isLoading: false, [searchType as keyof EnrollmentsFilterState]: results };
  }),

  on(
    EnrollmentsFilterActions.filterSelectOptionsFailure,
    (state): EnrollmentsFilterState => ({ ...state, isLoading: false }),
  ),

  on(
    EnrollmentsFilterActions.storeFilterControllerState,
    (state, { filterState }): EnrollmentsFilterState => ({
      ...state,
      filterState,
    }),
  ),

  on(EnrollmentsFilterActions.resetState, (): EnrollmentsFilterState => enrollmentsFilterInitialState),
);

export const enrollmentsFilterFeature = createFeature({
  name: 'enrollmentsFilter',
  reducer: featureReducer,
  extraSelectors: ({ selectEnrollmentsFilterState }) => ({
    selectViewModel: createSelector(selectEnrollmentsFilterState, (state) => ({ ...state })),
  }),
});
