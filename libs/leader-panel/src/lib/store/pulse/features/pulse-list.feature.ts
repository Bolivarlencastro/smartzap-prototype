import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ListFilter, ListViewModel } from '../../../models/list';
import { PulseListActions } from '../actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Pulse } from '../../../models/pulse';

export const PULSES_LIST_FEATURE_KEY = 'lpPulsesList';

export interface PulseListFeatureState extends EntityState<Pulse> {
  loading: boolean;
  filter: ListFilter;
  count: number;
}

const adapter: EntityAdapter<Pulse> = createEntityAdapter<Pulse>();

export const pulseListInitialState: PulseListFeatureState = adapter.getInitialState({
  loading: false,
  filter: { page: 1, per_page: 10 },
  count: null,
});

export const pulseListReducer = createReducer(
  pulseListInitialState,

  on(PulseListActions.fetchPulses, (state): PulseListFeatureState => ({ ...state, loading: true })),

  on(PulseListActions.fetchPulsesSuccess, (state, { response }): PulseListFeatureState => {
    return adapter.setAll(response.results, { ...state, loading: false, count: response.count });
  }),

  on(PulseListActions.fetchPulsesFailure, (state): PulseListFeatureState => ({ ...state, loading: false })),

  on(
    PulseListActions.search,
    (state, { search }): PulseListFeatureState => ({ ...state, filter: { ...state.filter, search, page: 1 } }),
  ),

  on(
    PulseListActions.sort,
    (state, { sort }): PulseListFeatureState => ({ ...state, filter: { ...state.filter, sort } }),
  ),

  on(
    PulseListActions.setPagination,
    (state, { page, per_page }): PulseListFeatureState => ({ ...state, filter: { ...state.filter, page, per_page } }),
  ),
);

export const pulseListFeature = createFeature({
  name: PULSES_LIST_FEATURE_KEY,
  reducer: pulseListReducer,
  extraSelectors: ({ selectLpPulsesListState, selectLoading, selectFilter, selectCount }) => ({
    selectViewModel: createSelector(
      adapter.getSelectors(selectLpPulsesListState).selectAll,
      selectLoading,
      selectFilter,
      selectCount,
      (pulses, loading, filter, count): ListViewModel<Pulse> => ({
        data: pulses,
        loading,
        filter,
        count,
      }),
    ),
    selectLoaded: createSelector(adapter.getSelectors(selectLpPulsesListState).selectAll, (items) => !!items?.length),
  }),
});
