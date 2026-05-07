import { createAction, props } from '@ngrx/store';
import { LedChannelItem } from '../../../models/led-channel-item';

const fetchChannels = createAction('[Led Channel Tab] Fetch Channels');

const fetchChannelsSuccess = createAction(
  '[Led Channel Tab] Fetch Channels Success',
  props<{ channels: LedChannelItem[] }>(),
);

const fetchChannelsFailure = createAction('[Led Channel Tab] Fetch Channels Failure');

export const LedChannelTabActions = {
  fetchChannels,
  fetchChannelsSuccess,
  fetchChannelsFailure,
};
