import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ReportFiltersActions } from '../actions';

export interface ReportFiltersFeatureState {
  isLoading: boolean;
  categories: KpFilterSelectOption[];
  missions: KpFilterSelectOption[];
  trails: KpFilterSelectOption[];
  providers: KpFilterSelectOption[];
  users: KpFilterSelectOption[];
  creators: KpFilterSelectOption[];
  leaders: KpFilterSelectOption[];
  channels: KpFilterSelectOption[];
  groups: KpFilterSelectOption[];
  activityAreas: KpFilterSelectOption[];
  managers: KpFilterSelectOption[];
  directors: KpFilterSelectOption[];
  jobs: KpFilterSelectOption[];
  jobFunctions: KpFilterSelectOption[];
}

export const reportFiltersInitialState: ReportFiltersFeatureState = {
  isLoading: false,
  categories: [],
  missions: [],
  trails: [],
  providers: [],
  users: [],
  creators: [],
  leaders: [],
  channels: [],
  groups: [],
  activityAreas: [],
  managers: [],
  directors: [],
  jobs: [],
  jobFunctions: [],
};

const featureReducer = createReducer(
  reportFiltersInitialState,
  on(ReportFiltersActions.filterSelectOptions, (state): ReportFiltersFeatureState => ({ ...state, isLoading: true })),

  on(ReportFiltersActions.filterSelectOptionsSuccess, (state, { searchType, results }): ReportFiltersFeatureState => {
    return { ...state, isLoading: false, [searchType as keyof ReportFiltersFeatureState]: results };
  }),

  on(
    ReportFiltersActions.filterSelectOptionsFailure,
    (state): ReportFiltersFeatureState => ({ ...state, isLoading: false }),
  ),

  on(ReportFiltersActions.resetState, (): ReportFiltersFeatureState => reportFiltersInitialState),
);

export const reportFiltersFeature = createFeature({
  name: 'reportsFilters',
  reducer: featureReducer,
  extraSelectors: ({ selectReportsFiltersState }) => ({
    selectViewModel: createSelector(selectReportsFiltersState, (state) => ({ ...state })),
  }),
});
