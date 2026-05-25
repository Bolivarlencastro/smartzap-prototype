import { PushCampaignModel } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { PushHistoryActions } from '../actions/push-history.actions';

export interface PushHistoryState {
  data: PushCampaignModel[] | null;
  total: number;
  loading: boolean;
  page: number;
  limit: number;
  search: string;
  sortBy: string[];
}

export const pushHistoryInitialState: PushHistoryState = {
  data: null,
  total: 0,
  loading: false,
  page: 1,
  limit: 10,
  search: '',
  sortBy: [],
};

const reducer = createReducer(
  pushHistoryInitialState,

  on(PushHistoryActions.load, (state): PushHistoryState => ({ ...state, loading: true })),

  on(
    PushHistoryActions.search,
    (state, { search }): PushHistoryState => ({ ...state, search, page: 1, loading: true }),
  ),

  on(PushHistoryActions.sort, (state, { sortBy }): PushHistoryState => ({ ...state, sortBy, page: 1, loading: true })),

  on(
    PushHistoryActions.changePage,
    (state, { page, limit }): PushHistoryState => ({ ...state, page, limit, loading: true }),
  ),

  on(
    PushHistoryActions.loadSuccess,
    (state, { data, total }): PushHistoryState => ({ ...state, data, total, loading: false }),
  ),

  on(PushHistoryActions.loadFailure, (state): PushHistoryState => ({ ...state, loading: false })),
);

export const pushHistoryFeature = createFeature({
  name: 'pmPushHistory',
  reducer,
  extraSelectors: ({ selectPage, selectLimit, selectSearch, selectSortBy }) => ({
    selectFilters: createSelector(
      selectPage,
      selectLimit,
      selectSearch,
      selectSortBy,
      (page, limit, search, sortBy) => ({
        page,
        limit,
        search,
        sortBy,
      }),
    ),
  }),
});
