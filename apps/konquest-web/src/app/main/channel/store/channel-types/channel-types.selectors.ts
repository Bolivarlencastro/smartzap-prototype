import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as ChannelTypesReducers from './channel-types.reducers';

export const featureKey = 'channel-types-app';

export const selectChannelTypesAppState = createFeatureSelector<ChannelTypesReducers.State>(featureKey);

// Channel Types

export const selectChannelTypes = createSelector(selectChannelTypesAppState, (state: ChannelTypesReducers.State) => {
  const { channelType = {} } = state;
  return channelType?.results;
});

export const selectChannelTypesLoaded = createSelector(
  selectChannelTypesAppState,
  (state: ChannelTypesReducers.State) => state.loaded,
);

export const selectChannelTypesLoading = createSelector(
  selectChannelTypesAppState,
  (state: ChannelTypesReducers.State) => state.loading,
);
