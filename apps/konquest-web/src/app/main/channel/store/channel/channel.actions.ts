import { createAction, props } from '@ngrx/store';

import { Channel } from '../../channel.model';

export const postChannel = createAction('[Channel] Post Channel', props<{ payload: Channel }>());

export const postChannelSuccess = createAction('[Channel] Post Channel Success', props<{ channel: Channel }>());

export const postChannelFailure = createAction('[Channel] Post Channel Failure', props<{ errorMsg: string }>());

export const putChannel = createAction('[Channel] Put Channel', props<{ id: string; payload: Channel }>());

export const putChannelSuccess = createAction('[Channel] Put Channel Success', props<{ channel: Channel }>());

export const putChannelFailure = createAction('[Channel] Put Channel Failure', props<{ errorMsg: string }>());

export const putChannelReset = createAction('[Channel] Put Channel Reset');
