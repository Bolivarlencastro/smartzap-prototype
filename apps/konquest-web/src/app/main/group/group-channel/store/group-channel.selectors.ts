import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromGroupChannel from '../store/group-channel.reducer';

export const selectGroupChannelState = createFeatureSelector<fromGroupChannel.State>(
  fromGroupChannel.groupChannelsFeatureKey,
);

export const selectAll = createSelector(selectGroupChannelState, fromGroupChannel.selectAll);
export const selectIsLoading = createSelector(selectGroupChannelState, (state) => state.isLoading);
export const selectTotal = createSelector(selectGroupChannelState, (state) => state.total);
export const selectCurrentPage = createSelector(selectGroupChannelState, (state) => Math.max(state.page - 1, 0));
export const selectPerPage = createSelector(selectGroupChannelState, (state) => state.per_page);
