import {
  ActivityLogItem,
  ActivityLogOption,
  ActivityLogStoreFilter,
  ActivityLogViewModel,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import * as ActivityLogActions from './activity-log.actions';

export const ACTIVITY_LOG_FEATURE_NAME = 'activityLog';

export interface ActivityLogFeatureState extends EntityState<ActivityLogItem> {
  loading: boolean;
  filter: ActivityLogStoreFilter;
  totalItems: number;
  users: ActivityLogOption[];
}

export const adapter = createEntityAdapter<ActivityLogItem>();

export const activityLogInitialState: ActivityLogFeatureState = adapter.getInitialState({
  loading: true,
  filter: { page: 1, perPage: 10 },
  totalItems: 0,
  users: [],
});

export const activityLogReducer = createReducer(
  activityLogInitialState,

  on(ActivityLogActions.setUserOptions, (state, { users }): ActivityLogFeatureState => ({ ...state, users })),

  on(ActivityLogActions.loadData, (state): ActivityLogFeatureState => ({ ...state, loading: true })),

  on(ActivityLogActions.loadDataSuccess, (state, { response }): ActivityLogFeatureState => {
    return adapter.setAll(response.items, {
      ...state,
      loading: false,
      totalItems: response.total,
    });
  }),

  on(ActivityLogActions.loadDataFailure, (state): ActivityLogFeatureState => ({ ...state, loading: false })),

  on(
    ActivityLogActions.filterByTerm,
    (state, { search }): ActivityLogFeatureState => ({ ...state, filter: { ...state.filter, search, page: 1 } }),
  ),

  on(
    ActivityLogActions.setPagination,
    (state, { pagination }): ActivityLogFeatureState => ({
      ...state,
      filter: { ...state.filter, page: pagination.currentPage, perPage: pagination.perPage },
    }),
  ),

  on(
    ActivityLogActions.setFilter,
    (state, { filter }): ActivityLogFeatureState => ({
      ...state,
      filter: {
        ...state.filter,
        ...filter,
        page: 1,
      },
    }),
  ),

  on(ActivityLogActions.resetState, (): ActivityLogFeatureState => activityLogInitialState),
);

export const activityLogFeature = createFeature({
  name: ACTIVITY_LOG_FEATURE_NAME,
  reducer: activityLogReducer,
  extraSelectors: ({ selectActivityLogState, selectLoading, selectFilter, selectTotalItems, selectUsers }) => ({
    selectViewModel: createSelector(
      adapter.getSelectors(selectActivityLogState).selectAll,
      selectLoading,
      selectFilter,
      selectTotalItems,
      selectUsers,
      (items, loading, filter, totalItems, users): ActivityLogViewModel => ({
        items,
        loading,
        pagination: {
          perPage: filter.perPage,
          currentPage: filter.page - 1,
          totalItems,
        },
        filterOptions: {
          status: ['CREATED', 'READY', 'PROCESSING', 'DONE', 'DONE_WITH_EXCEPTIONS', 'ERROR', 'INVALID'],
          actionKey: [
            'KONQUEST.FINISH_MSSION_ENROLLMENTS',
            'KONQUEST.DELETE_MISSION_ENROLLMENTS',
            'KONQUEST.UPDATE_MISSION_ENROLLMENTS_GOAL_DATE',
            'KONQUEST.RECREATE_MISSION_ENROLLMENTS',
            'KONQUEST.APPROVE_MISSION_ENROLLMENTS',
            'KONQUEST.RESTART_MISSION_ENROLLMENTS',
          ],
          users,
        },
      }),
    ),
  }),
});
