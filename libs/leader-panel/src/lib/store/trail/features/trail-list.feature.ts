import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ListFilter, ListViewModel } from '../../../models/list';
import { TrailListActions } from '../actions';
import { Trail } from '../../../models/trail';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export const TRAILS_LIST_FEATURE_KEY = 'lpTrailsList';

export interface TrailListFeatureState extends EntityState<Trail> {
  loading: boolean;
  filter: ListFilter;
  count: number;
}

const adapter: EntityAdapter<Trail> = createEntityAdapter<Trail>({ selectId: (t) => t.learning_trail_id });

export const trailListInitialState: TrailListFeatureState = adapter.getInitialState({
  loading: false,
  filter: { page: 1, per_page: 10 },
  count: null,
});

export const trailListReducer = createReducer(
  trailListInitialState,

  on(TrailListActions.fetchTrails, (state): TrailListFeatureState => ({ ...state, loading: true })),

  on(TrailListActions.fetchTrailsSuccess, (state, { response }): TrailListFeatureState => {
    return adapter.setAll(response.items, { ...state, loading: false, count: response.total });
  }),

  on(TrailListActions.fetchTrailsFailure, (state): TrailListFeatureState => ({ ...state, loading: false })),

  on(
    TrailListActions.search,
    (state, { search }): TrailListFeatureState => ({ ...state, filter: { ...state.filter, search, page: 1 } }),
  ),

  on(
    TrailListActions.sort,
    (state, { sort }): TrailListFeatureState => ({ ...state, filter: { ...state.filter, sort } }),
  ),

  on(
    TrailListActions.setPagination,
    (state, { page, per_page }): TrailListFeatureState => ({ ...state, filter: { ...state.filter, page, per_page } }),
  ),
);

export const trailListFeature = createFeature({
  name: TRAILS_LIST_FEATURE_KEY,
  reducer: trailListReducer,
  extraSelectors: ({ selectLpTrailsListState, selectLoading, selectFilter, selectCount }) => ({
    selectViewModel: createSelector(
      adapter.getSelectors(selectLpTrailsListState).selectAll,
      selectLoading,
      selectFilter,
      selectCount,
      (trails, loading, filter, count): ListViewModel<Trail> => ({
        data: trails,
        loading,
        filter,
        count,
      }),
    ),
    selectLoaded: createSelector(adapter.getSelectors(selectLpTrailsListState).selectAll, (items) => !!items?.length),
  }),
});
