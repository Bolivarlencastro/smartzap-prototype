import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { CyclesListActions } from '../actions';
import { CycleDto, CyclesFilterDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CyclesListViewModel } from '../../models';

export interface CyclesListFeatureState extends EntityState<CycleDto> {
  isLoading: boolean;
  filter: CyclesFilterDto;
  totalItems: number;
}

export const adapter = createEntityAdapter<CycleDto>();

export const cyclesListInitialState: CyclesListFeatureState = adapter.getInitialState({
  isLoading: false,
  filter: { search: '', page: 1, perPage: 10 },
  totalItems: 0,
});

export const reducer = createReducer(
  cyclesListInitialState,

  on(CyclesListActions.loadCycles, (state): CyclesListFeatureState => adapter.removeAll({ ...state, isLoading: true })),

  on(CyclesListActions.loadCyclesSuccess, (state, { response }): CyclesListFeatureState => {
    const updatedState: CyclesListFeatureState = { ...state, totalItems: response.total, isLoading: false };
    return adapter.setAll(response.items, updatedState);
  }),

  on(CyclesListActions.loadCyclesFailure, (state): CyclesListFeatureState => ({ ...state, isLoading: false })),

  on(
    CyclesListActions.setFilter,
    (state, { filter }): CyclesListFeatureState => ({
      ...state,
      filter: { perPage: state.filter.perPage, page: 1, search: filter.search },
    }),
  ),

  on(
    CyclesListActions.setPagination,
    (state, { pagination }): CyclesListFeatureState => ({
      ...state,
      filter: { ...state.filter, page: pagination.page, perPage: pagination.perPage },
    }),
  ),

  on(CyclesListActions.resetState, (): CyclesListFeatureState => cyclesListInitialState),
);

export const cyclesListFeature = createFeature({
  name: 'cyclesList',
  reducer,
  extraSelectors: ({ selectCyclesListState, selectFilter, selectTotalItems, selectIsLoading }) => ({
    selectViewModel: createSelector(
      adapter.getSelectors(selectCyclesListState).selectAll,
      selectFilter,
      selectTotalItems,
      selectIsLoading,
      (items, filter, totalItems, isLoading): CyclesListViewModel => ({
        items,
        currentSearch: filter.search,
        isLoading,
        pagination: {
          perPage: filter.perPage,
          currentPage: filter.page - 1, // MatPaginator current page is zero index based
          totalItems,
        },
      }),
    ),
  }),
});
