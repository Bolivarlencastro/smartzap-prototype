import { createEntityAdapter, EntityState, Update } from '@ngrx/entity';
import { CycleManagementSort, CycleManagementViewModel } from '../../models';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { CycleEnrollmentsActions } from '../actions';
import { EnrollmentCycleDto, EnrollmentsCyclesFilter } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface CycleEnrollmentsFeatureState extends EntityState<EnrollmentCycleDto> {
  totalItems: number;
  filter: EnrollmentsCyclesFilter;
  isLoading: boolean;
  sort: CycleManagementSort;
}

const adapter = createEntityAdapter<EnrollmentCycleDto>();

export const cycleEnrollmentsInitialState: CycleEnrollmentsFeatureState = adapter.getInitialState({
  totalItems: 0,
  isLoading: true,
  filter: {
    page: 1,
    perPage: 10,
  },
  sort: null,
});

const featureReducer = createReducer(
  cycleEnrollmentsInitialState,

  on(
    CycleEnrollmentsActions.loadEnrollmentsSuccess,
    (state, { results, totalItems }): CycleEnrollmentsFeatureState =>
      adapter.setAll(results, { ...state, isLoading: false, totalItems }),
  ),

  on(CycleEnrollmentsActions.searchEnrollments, (state, { filter }): CycleEnrollmentsFeatureState => {
    const updatedFilter: EnrollmentsCyclesFilter = structuredClone(state.filter);
    updatedFilter.page = 1;
    updatedFilter.search = filter;

    return adapter.removeAll({ ...state, filter: updatedFilter, isLoading: true });
  }),

  on(CycleEnrollmentsActions.filterEnrollments, (state, { filter }): CycleEnrollmentsFeatureState => {
    const stateFilter: EnrollmentsCyclesFilter = structuredClone(state.filter);

    const updatedFilter: EnrollmentsCyclesFilter = {
      ...filter,
      page: 1,
      perPage: stateFilter.perPage,
      search: stateFilter.search || '',
    };

    return adapter.removeAll({ ...state, filter: updatedFilter, isLoading: true });
  }),

  on(CycleEnrollmentsActions.pageChange, (state, { event }): CycleEnrollmentsFeatureState => {
    const updatedFilter: EnrollmentsCyclesFilter = structuredClone(state.filter);
    updatedFilter.page = event.page;
    updatedFilter.perPage = event.per_page;

    return adapter.removeAll({ ...state, filter: updatedFilter, isLoading: true });
  }),

  on(CycleEnrollmentsActions.inactivateCycleSuccess, (state, { cycle }): CycleEnrollmentsFeatureState => {
    const updatedCycle: Update<EnrollmentCycleDto> = { id: cycle.id, changes: { ...cycle, status: 'DISABLED' } };
    return adapter.updateOne(updatedCycle, { ...state, isLoading: false });
  }),

  on(CycleEnrollmentsActions.renewCycleSuccess, (state, { cycle }): CycleEnrollmentsFeatureState => {
    const updatedCycle: Update<EnrollmentCycleDto> = { id: cycle.id, changes: { ...cycle, status: 'IN_PROGRESS' } };
    return adapter.updateOne(updatedCycle, { ...state, isLoading: false });
  }),

  on(
    CycleEnrollmentsActions.renewCycle,
    CycleEnrollmentsActions.inactivateCycle,
    (state): CycleEnrollmentsFeatureState => ({
      ...state,
      isLoading: false,
    }),
  ),

  on(
    CycleEnrollmentsActions.loadEnrollmentsFailure,
    CycleEnrollmentsActions.renewCycleFailure,
    CycleEnrollmentsActions.inactivateCycleFailure,
    (state): CycleEnrollmentsFeatureState => ({
      ...state,
      isLoading: false,
    }),
  ),

  on(
    CycleEnrollmentsActions.sortEnrollments,
    (state, { sort }): CycleEnrollmentsFeatureState => ({
      ...state,
      sort,
    }),
  ),

  on(CycleEnrollmentsActions.reset, (): CycleEnrollmentsFeatureState => cycleEnrollmentsInitialState),
);
export const cycleEnrollmentsFeature = createFeature({
  name: 'cycleEnrollments',
  reducer: featureReducer,
  extraSelectors: ({ selectCycleEnrollmentsState, selectFilter, selectTotalItems, selectIsLoading }) => ({
    ...adapter.getSelectors(selectCycleEnrollmentsState),
    selectViewModel: createSelector(
      adapter.getSelectors(selectCycleEnrollmentsState).selectAll,
      selectFilter,
      selectTotalItems,
      selectIsLoading,
      (items, filter, totalItems, isLoading): CycleManagementViewModel => ({
        items,
        filter,
        totalItems,
        isLoading,
      }),
    ),
  }),
});
