import { createAction, props } from '@ngrx/store';

import { Channel, ChannelPulsesFilters } from '../../../../channel.model';
import { PulseCardDto } from '@keeps-platform-frontend-workspace/ui/kp-pulse-card';
import { ContentFormData } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';

export const openPulseCreateDialog = createAction(
  '[ChannelDetail] Open Pulse Create Dialog',
  props<{ channelId: string }>(),
);

export const createNewPulseWithFileUpload = createAction(
  '[ChannelDetail] Create New Pulse With File Upload',
  props<{
    channelId: string;
    pulseFormData: ContentFormData;
  }>(),
);

export const createNewPulseUploadSuccess = createAction(
  '[ChannelDetail] Create New Pulse Success',
  props<{ pulse: PulseCardDto }>(),
);

export const createNewPulseWithFileUploadFailure = createAction(
  '[ChannelDetail] Create New Pulse With File Upload Failure',
);

export const getChannel = createAction('[ChannelDetail] Get Channel', props<{ channel_id: string }>());

export const getChannelOnLoadRoute = createAction(
  '[ChannelDetail] Get Channel On Load Route',
  props<{ channel_id: string; params: ChannelPulsesFilters }>(),
);

export const getChannelSuccess = createAction('[ChannelDetail] Get Channel Success', props<{ channel: Channel }>());

export const getChannelFailure = createAction('[ChannelDetail] Get Channel Failure', props<{ errorMsg: string }>());

export const deleteChannel = createAction('[ChannelDetail] Delete Channel', props<{ channel_id?: string }>());

export const deleteChannelSuccess = createAction('[ChannelDetail] Delete Channel Success');

export const deleteChannelFailure = createAction(
  '[ChannelDetail] Delete Channel Failure',
  props<{ errorMsg: string }>(),
);

export const updateChannelRating = createAction('[ChannelDetail] Update Channel Rating', props<{ rating: number }>());

export const getChannelSubscribers = createAction(
  '[ChannelDetail] Get Channel Subscribers',
  props<{ channel_id: string }>(),
);

export const getChannelSubscribersSuccess = createAction(
  '[ChannelDetail] Get Channel Subscribers Success',
  props<{ subscribers: [] }>(),
);

export const getChannelSubscribersFailure = createAction(
  '[ChannelDetail] Get Channel Subscribers Failure',
  props<{ errorMsg: string }>(),
);

export const subscribeToChannel = createAction(
  '[ChannelDetail] Subscribe To Channel',
  props<{ channel: { id: string } }>(),
);

export const unsubscribeFromChannel = createAction(
  '[ChannelDetail] Unsubscribe From Channel',
  props<{ channel: any }>(),
);

export const updateChannelSubscription = createAction(
  '[ChannelDetail] Update Channel Subscription',
  props<{ channel: any; subscription?: string }>(),
);

export const updateChannelDescription = createAction(
  '[ChannelDetail] Update Channel Description',
  props<{ description: string }>(),
);

export const updateChannelDescriptionSuccess = createAction(
  '[ChannelDetail] Update Channel Description Success',
  props<{ description: string }>(),
);

export const updateChannelDescriptionFailure = createAction('[ChannelDetail] Update Channel Description Failure');

export const resetState = createAction('[ChannelDetail] Reset State');
