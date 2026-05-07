import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromChannel from '../reducers/channel.reducer';

export const selectChannelState = createFeatureSelector<fromChannel.State>(fromChannel.featureKey);

export const selectAll = createSelector(selectChannelState, fromChannel.selectAll);
export const selectIsLoading = createSelector(selectChannelState, (state) => state.isLoading);
export const selectTotal = createSelector(selectChannelState, (state) => state.total);
export const selectPage = createSelector(selectChannelState, (state) => state.page);
export const selectLoaded = createSelector(selectChannelState, (state) => selectAll.length >= state.total);
