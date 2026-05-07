import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromGroupUser from './group-user.reducer';

export const selectGroupUserState = createFeatureSelector<fromGroupUser.State>(fromGroupUser.groupUserFeatureKey);

export const selectAll = createSelector(selectGroupUserState, fromGroupUser.selectAll);
export const selectIsLoading = createSelector(selectGroupUserState, (state) => state.isLoading);
export const selectQueryParams = createSelector(selectGroupUserState, (state) => state.queryParams);
export const selectGroupId = createSelector(selectGroupUserState, (state) => state.groupId);
export const selectTotal = createSelector(selectGroupUserState, (state) => state.total);
export const selectCurrentPage = createSelector(selectGroupUserState, (state) =>
  Math.max(state.queryParams.page - 1, 0),
);
export const selectPerPage = createSelector(selectGroupUserState, (state) => state.queryParams.per_page);
