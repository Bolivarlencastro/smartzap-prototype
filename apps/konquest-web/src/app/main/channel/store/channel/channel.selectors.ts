import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as ChannelReducers from './channel.reducers';

export const featureKey = 'channel-store';

export const selectChannelState = createFeatureSelector<ChannelReducers.State>(featureKey);

// Channel

export const selectChannel = createSelector(selectChannelState, (state: ChannelReducers.State) => state.channel);

export const selectChannelSuccess = createSelector(selectChannelState, (state: ChannelReducers.State) => state.success);

export const selectPostChannelLoading = createSelector(
  selectChannelState,
  (state: ChannelReducers.State) => state.loading,
);

export const selectPutChannel = createSelector(selectChannelState, (state: ChannelReducers.State) => state.channel);

export const selectPutChannelSuccess = createSelector(
  selectChannelState,
  (state: ChannelReducers.State) => state.success,
);

export const selectPutChannelLoading = createSelector(
  selectChannelState,
  (state: ChannelReducers.State) => state.loading,
);

export const selectChannelLoading = createSelector(
  selectPostChannelLoading,
  selectPutChannelLoading,
  (postLoading, putLoading) => postLoading || putLoading,
);
