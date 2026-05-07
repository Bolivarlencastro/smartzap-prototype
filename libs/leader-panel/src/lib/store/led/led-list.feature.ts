import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ListFilter, ListViewModel } from '../../models/list';
import { LedListActions } from './led-list.actions';
import { Led } from '../../models/led';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export const LEDS_LIST_FEATURE_KEY = 'lpLedsList';

export interface LedListFeatureState extends EntityState<Led> {
  loading: boolean;
  filter: ListFilter;
  count: number;
}

const adapter: EntityAdapter<Led> = createEntityAdapter<Led>();

export const ledListInitialState: LedListFeatureState = adapter.getInitialState({
  loading: false,
  filter: { page: 1, per_page: 10 },
  count: null,
});

export const ledListReducer = createReducer(
  ledListInitialState,

  on(LedListActions.fetchLed, (state): LedListFeatureState => ({ ...state, loading: true })),

  on(LedListActions.fetchLedSuccess, (state, { response }): LedListFeatureState => {
    return adapter.setAll(response.results, { ...state, loading: false, count: response.count });
  }),

  on(LedListActions.fetchLedFailure, (state): LedListFeatureState => ({ ...state, loading: false })),

  on(
    LedListActions.search,
    (state, { search }): LedListFeatureState => ({ ...state, filter: { ...state.filter, search, page: 1 } }),
  ),

  on(LedListActions.sort, (state, { sort }): LedListFeatureState => ({ ...state, filter: { ...state.filter, sort } })),

  on(
    LedListActions.setPagination,
    (state, { page, per_page }): LedListFeatureState => ({ ...state, filter: { ...state.filter, page, per_page } }),
  ),
);

export const ledListFeature = createFeature({
  name: LEDS_LIST_FEATURE_KEY,
  reducer: ledListReducer,
  extraSelectors: ({ selectLpLedsListState, selectLoading, selectFilter, selectCount }) => ({
    selectViewModel: createSelector(
      adapter.getSelectors(selectLpLedsListState).selectAll,
      selectLoading,
      selectFilter,
      selectCount,
      (led, loading, filter, count): ListViewModel<Led> => ({
        data: led,
        loading,
        filter,
        count,
      }),
    ),
    selectLoaded: createSelector(adapter.getSelectors(selectLpLedsListState).selectAll, (items) => !!items?.length),
  }),
});
