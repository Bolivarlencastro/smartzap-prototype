import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChannelDetailSubscriptionsReducers } from '../reducers';

export const channelSubscriptionsFeatureKey = 'channel-subscriptions-app';

export const selectChannelSubscriptionsAppState =
  createFeatureSelector<ChannelDetailSubscriptionsReducers.State>(channelSubscriptionsFeatureKey);

// Channel
export const selectChannelSubscriptionsApp = createSelector(
  selectChannelSubscriptionsAppState,
  (state: ChannelDetailSubscriptionsReducers.State) => state.channelSubscriptions,
);

export const selectChannelSubscriptionsLoaded = createSelector(
  selectChannelSubscriptionsAppState,
  (state: ChannelDetailSubscriptionsReducers.State) => state.loaded,
);

export const selectChannelSubscriptionsLoading = createSelector(
  selectChannelSubscriptionsAppState,
  (state: ChannelDetailSubscriptionsReducers.State) => state.loading,
);
