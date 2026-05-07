import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Channel, ChannelCardInfo } from '../../../../channel.model';
import { ChannelFormReducers } from '../reducers';

export const featureKey = 'channel-form-app';

export const selectChannelFormAppState = createFeatureSelector<ChannelFormReducers.State>(featureKey);

// Channel
export const selectChannelFormApp = createSelector(
  selectChannelFormAppState,
  (state: ChannelFormReducers.State) => state?.channel,
);

export const selectChannelForm = createSelector(selectChannelFormApp, (channel: Channel | undefined) => channel);

export const selectChannelFormLoaded = createSelector(
  selectChannelFormAppState,
  (state: ChannelFormReducers.State) => state?.loaded,
);

export const selectChannelFormLoading = createSelector(
  selectChannelFormAppState,
  (state: ChannelFormReducers.State) => state?.loading,
);

export const selectIsSubmitted = createSelector(
  selectChannelFormAppState,
  (state: ChannelFormReducers.State) => state?.submitted,
);

export const selectIsLoadedAndSubmitted = createSelector(
  selectChannelFormLoaded,
  selectIsSubmitted,
  (loaded, submitted) => loaded && submitted,
);

export const selectChannelCardInfo = createSelector(selectChannelForm, (channel) => new ChannelCardInfo(channel));
