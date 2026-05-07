import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChannelDetailRatingsReducers } from '../reducers';

export const channelRatingFeatureKey = 'channel-rating-app';

export const selectChannelRatingAppState =
  createFeatureSelector<ChannelDetailRatingsReducers.State>(channelRatingFeatureKey);

// Channel
export const selectChannelRatingApp = createSelector(
  selectChannelRatingAppState,
  (state: ChannelDetailRatingsReducers.State) => state.channelRating,
);

export const selectChannelRatingLoaded = createSelector(
  selectChannelRatingAppState,
  (state: ChannelDetailRatingsReducers.State) => state.loaded,
);

export const selectChannelRatingLoading = createSelector(
  selectChannelRatingAppState,
  (state: ChannelDetailRatingsReducers.State) => state.loading,
);
