import { createAction, props } from '@ngrx/store';
import { ChannelPulseSideItem } from '../../models/channel';
import { PulseType } from '../../models/pulse';

export const init = createAction('[Pulses Feed] Init', props<{ isCurator: boolean }>());

export const loadFavoritePulsesSuccess = createAction(
  '[Pulses Feed] Load Favorite Pulses Success',
  props<{ favoritePulses: ChannelPulseSideItem[] }>(),
);
export const loadFavoritePulsesFailure = createAction('[Pulses Feed] Load Favorite Pulses Failure');

export const addFavoritePulse = createAction(
  '[Pulses Feed] Add Favorite Pulse',
  props<{ pulse: ChannelPulseSideItem }>(),
);
export const removeFavoritePulse = createAction('[Pulses Feed] Remove Favorite Pulse', props<{ pulseId: string }>());

export const reloadChannelsFilterCreatedByMe = createAction('[Pulses Feed] Reload Channels Filter Created By Me');
export const loadChannelsFilterCreatedByMeSuccess = createAction(
  '[Pulses Feed] Load Channels Filter Created By Me Success',
  props<{ items: ChannelPulseSideItem[] }>(),
);
export const loadChannelsFilterCreatedByMeFailure = createAction(
  '[Pulses Feed] Load Channels Filter Created By Me Failure',
);

export const loadChannelsFilterSubscribedSuccess = createAction(
  '[Pulses Feed] Load Channels Filter Subscribed Success',
  props<{ items: ChannelPulseSideItem[] }>(),
);
export const loadChannelsFilterSubscribedFailure = createAction(
  '[Pulses Feed] Load Channels Filter Subscribed Failure',
);

export const addSubscribedChannel = createAction(
  '[Pulses Feed] Add Subscribed Channel',
  props<{ channel: ChannelPulseSideItem }>(),
);
export const removeSubscribedChannel = createAction(
  '[Pulses Feed] Remove Subscribed Channel',
  props<{ channelId: string }>(),
);

export const selectChannel = createAction('[Pulses Feed] Select Channel', props<{ channelId: string | null }>());

export const loadPulseTypes = createAction('[Pulses Feed] Load Pulse Types');
export const loadPulseTypesSuccess = createAction(
  '[Pulses Feed] Load Pulse Types Success',
  props<{ pulseTypes: PulseType[] }>(),
);
export const loadPulseTypesFailure = createAction('[Pulses Feed] Load Pulse Types Failure');

export const setSideFilters = createAction(
  '[Pulses Feed] Set Side Filters',
  props<{ general?: string | null; languages?: string[]; types?: string[]; categories?: string[] }>(),
);
export const clearSideFilters = createAction('[Pulses Feed] Clear Side Filters');

export const setTab = createAction('[Pulses Feed] Set Tab', props<{ tab: 'feed' | 'channels' }>());
export const setFeedLayout = createAction('[Pulses Feed] Set Feed Layout', props<{ layout: 'list' | 'grid' }>());
