import {
  GamificationListDto,
  GamificationListFilterDto,
  GamificationListType,
  GamificationViewModel,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { GamificationListActions } from '../actions';

export interface GamificationListFeatureState extends EntityState<GamificationListDto> {
  isLoading: boolean;
  filter: GamificationListFilterDto;
  totalItems: number;
  personalScore: number;
  path: GamificationListType;
  isMobile: boolean;
}

export const adapter = createEntityAdapter<GamificationListDto>();

export const gamificationListInitialState: GamificationListFeatureState = adapter.getInitialState({
  isLoading: false,
  filter: { page: 1, per_page: 10 },
  totalItems: 0,
  personalScore: 0,
  path: null,
  isMobile: false,
});

export const gamificationListReducer = createReducer(
  gamificationListInitialState,

  on(GamificationListActions.init, (state): GamificationListFeatureState => ({ ...state, isLoading: true })),

  on(
    GamificationListActions.setInitialSetting,
    (state, { path, isMobile, personalScore }): GamificationListFeatureState => ({
      ...state,
      path,
      isMobile,
      ...(!!personalScore && { personalScore }),
    }),
  ),

  on(GamificationListActions.loadData, (state): GamificationListFeatureState => ({ ...state, isLoading: true })),

  on(GamificationListActions.loadDataSuccess, (state, { response }): GamificationListFeatureState => {
    return adapter.setAll(response.results, {
      ...state,
      isLoading: false,
      totalItems: response.count,
    });
  }),

  on(
    GamificationListActions.filterByTerm,
    (state, { search }): GamificationListFeatureState => ({ ...state, filter: { ...state.filter, search, page: 1 } }),
  ),

  on(
    GamificationListActions.setPagination,
    (state, { pagination }): GamificationListFeatureState => ({
      ...state,
      filter: { ...state.filter, page: pagination.currentPage, per_page: pagination.perPage },
    }),
  ),

  on(
    GamificationListActions.filterByDateRange,
    (state, { dateRange }): GamificationListFeatureState => ({
      ...state,
      filter: { ...state.filter, start_date: dateRange.startDate, end_date: dateRange.endDate, page: 1 },
    }),
  ),

  on(
    GamificationListActions.cleanFilter,
    (state): GamificationListFeatureState => ({
      ...state,
      filter: gamificationListInitialState.filter,
    }),
  ),

  on(GamificationListActions.cleanDateRangeFilter, (state): GamificationListFeatureState => {
    const search = state.filter.search;
    return {
      ...state,
      filter: { ...(!!search && { search }), ...gamificationListInitialState.filter },
    };
  }),

  on(GamificationListActions.resetState, (): GamificationListFeatureState => gamificationListInitialState),
);

export const gamificationListFeature = createFeature({
  name: 'gamificationList',
  reducer: gamificationListReducer,
  extraSelectors: ({
    selectGamificationListState,
    selectFilter,
    selectTotalItems,
    selectIsLoading,
    selectPersonalScore,
  }) => ({
    selectViewModel: createSelector(
      adapter.getSelectors(selectGamificationListState).selectAll,
      selectFilter,
      selectTotalItems,
      selectIsLoading,
      selectPersonalScore,
      (items, filter, totalItems, isLoading, personalScore): GamificationViewModel => ({
        items,
        currentSearch: filter.search,
        currentDateRange: { startDate: filter.start_date, endDate: filter.end_date },
        isLoading,
        pagination: {
          perPage: filter.per_page,
          currentPage: filter.page - 1, // MatPaginator current page is zero index based
          totalItems,
        },
        hasScore: !!personalScore,
        hasAppliedFilter: !!filter.search || !!(filter.start_date && filter.end_date),
      }),
    ),
  }),
});
