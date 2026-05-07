import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUser from '../reducers/user.reducer';

export const selectUserState = createFeatureSelector<fromUser.State>(fromUser.featureKey);

export const selectAll = createSelector(selectUserState, fromUser.selectAll);
export const selectIsLoading = createSelector(selectUserState, (state) => state.isLoading);
export const selectTotal = createSelector(selectUserState, (state) => state.total);
export const selectPage = createSelector(selectUserState, (state) => state.page);
