import { ImageResponse } from '@core/model';
import { createAction, props } from '@ngrx/store';

import { Channel } from '../../../../channel.model';

export const getChannel = createAction('[ChannelForm] Get Channel', props<{ channel_id: string }>());

export const getChannelSuccess = createAction('[ChannelForm] Get Channel Success', props<{ channel: Channel }>());

export const getChannelFailure = createAction('[ChannelForm] Get Channel Failure', props<{ errorMsg: string }>());

export const getChannelReset = createAction('[ChannelForm] Get Channel Reset');

export const submit = createAction('[ChannelForm] Submit', props<{ id?: string; channel: Channel }>());

export const submitSuccess = createAction('[ChannelForm] Submit Success', props<{ channel: Channel }>());

export const submitFailure = createAction('[ChannelForm] Submit Failure', props<{ errorMsg: string }>());

export const getChannelCover = createAction(
  '[ChannelForm] Get channel cover',
  props<{ image: File; id: string; channel: Channel }>(),
);

export const getChannelCoverSuccess = createAction(
  '[ChannelForm] Get channel cover Success',
  props<{ payload: ImageResponse }>(),
);

export const getChannelCoverFailure = createAction(
  '[ChannelForm] Get channel cover Failure',
  props<{ errorMsg: string }>(),
);

export const goToChannel = createAction('[ChannelForm] Go to channel');
