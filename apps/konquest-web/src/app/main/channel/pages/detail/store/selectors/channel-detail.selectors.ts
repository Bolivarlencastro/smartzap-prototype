import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Channel, ChannelSubscription } from '../../../../channel.model';
import { ChannelDetailReducers } from '../reducers';

export const channelDetailFeatureKey = 'channel-detail-app';

export const selectChannelDetailAppState = createFeatureSelector<ChannelDetailReducers.State>(channelDetailFeatureKey);

// Channel
export const selectChannelDetailApp = createSelector(
  selectChannelDetailAppState,
  (state: ChannelDetailReducers.State) => state.channel,
);

export const selectChannelDetail = createSelector(selectChannelDetailApp, (channel: Channel | null) => channel);

export const selectChannelDetailId = createSelector(selectChannelDetail, (channel) => channel?.id);

export const selectChannelContributors = createSelector(selectChannelDetail, (channel) => channel?.contributors || []);

export const selectChannelDetailLoaded = createSelector(
  selectChannelDetailAppState,
  (state: ChannelDetailReducers.State) => state.loaded,
);

export const selectChannelSubscribers = createSelector(
  selectChannelDetailAppState,
  (state: ChannelDetailReducers.State) =>
    state.subscribers.map((subscription: ChannelSubscription) => subscription.user),
);

export const selectChannelLoadingSubscribers = createSelector(
  selectChannelDetailAppState,
  (state: ChannelDetailReducers.State) => state.loadingSubscribers,
);

export const selectChannelDetailLoading = createSelector(
  selectChannelDetailAppState,
  (state: ChannelDetailReducers.State) => state.loading,
);

// Delete Channel

export const deleteFeatureKey = 'channel-detail-delete';

export const selectDeleteChannelAppState = createFeatureSelector<ChannelDetailReducers.DeleteState>(deleteFeatureKey);

export const selectDeletetChannelDetailLoaded = createSelector(
  selectDeleteChannelAppState,
  (state: ChannelDetailReducers.DeleteState) => state.loaded,
);

export const selectDeleteChannelDetailLoading = createSelector(
  selectDeleteChannelAppState,
  (state: ChannelDetailReducers.DeleteState) => state.loading,
);
