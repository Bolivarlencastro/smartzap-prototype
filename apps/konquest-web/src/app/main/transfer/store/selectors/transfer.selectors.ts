import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromStore from '../reducers/transfer.reducer';

const selectState = createFeatureSelector<fromStore.State>(fromStore.featureKey);

export const selectTransfers = createSelector(selectState, fromStore.selectAll);

export const selectPage = createSelector(selectState, (state) => state.page);

export const selectCurrentPage = createSelector(selectState, (state) => Math.max(state.page - 1, 0));

export const selectPerPage = createSelector(selectState, (state) => state.perPage);

export const selectTotal = createSelector(selectState, (state) => state.total);

export const selectSearch = createSelector(selectState, (state) => state.search);

export const selectSort = createSelector(selectState, (state) => state.sort);

export const selectFilter = createSelector(selectState, (state) => state.filter);

export const selectIsLoading = createSelector(selectState, (state) => state.isLoading);
