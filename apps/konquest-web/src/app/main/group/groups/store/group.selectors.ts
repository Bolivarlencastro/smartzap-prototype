import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromGroup from './group.reducer';

export const selectGroupState = createFeatureSelector<fromGroup.State>(fromGroup.groupFeatureKey);

export const selectAll = createSelector(selectGroupState, fromGroup.selectAll);

export const selectPage = createSelector(selectGroupState, (state) => state.page);

export const selectCurrentPage = createSelector(selectGroupState, (state) => Math.max(state.page - 1, 0));

export const selectPerPage = createSelector(selectGroupState, (state) => state.per_page);

export const selectTotal = createSelector(selectGroupState, (state) => state.total);

export const selectIsLoading = createSelector(selectGroupState, (state) => state.isLoading);

export const selectSearch = createSelector(selectGroupState, (state) => state.search);
