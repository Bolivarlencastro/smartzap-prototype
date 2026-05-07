import { Pagination } from '@core/model';
import { createAction, props } from '@ngrx/store';
import { Channel } from 'app/main/channel/channel.model';

export const loadChannels = createAction(
  '[Channel/API] Load Channels',
  props<{ queryParams?: Record<string, unknown> }>(),
);

export const filterChannels = createAction(
  '[Channel/API] Filter Channels',
  props<{ queryParams?: Record<string, unknown> }>(),
);

export const loadChannelsSuccess = createAction(
  '[Channel/API] Load Channels Success',
  props<{ channels: Pagination<Channel> }>(),
);

export const loadChannelsFailure = createAction('[Channel/API] Load Channels Failure', props<{ error: Error }>());

export const clearCache = createAction('[Channel] Clear Channels Cache');
