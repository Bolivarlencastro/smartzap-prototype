import { PageResponse } from '@core/model/search-api';
import { KpChannelCardModel } from '@keeps-platform-frontend-workspace/ui/kp-channel-card';
import { createAction, props } from '@ngrx/store';
import { ChannelsListParams } from '../../models/params';

export const loadChannels = createAction('[ChannelsList] Load Channels');
export const loadChannelsSuccess = createAction(
  '[ChannelsList] Load Channels Success',
  props<{ payload: PageResponse<KpChannelCardModel> }>(),
);
export const loadChannelsFailure = createAction('[ChannelsList] Load Channels Failure');

export const fetchMoreChannels = createAction('[Channels Collection] Fetch More Channels');

export const fetchMoreChannelsSuccess = createAction(
  '[Channels Collection] Fetch More Channels Success',
  props<{ payload: { response: PageResponse<KpChannelCardModel>; updatedFilter: ChannelsListParams } }>(),
);

export const fetchMoreChannelsFailure = createAction('[Channels Collection] Fetch More Channels Failure');

export const toggleSubscription = createAction(
  '[ChannelsList] Toggle Subscription',
  props<{ channelId: string; subscriptionId: string | null }>(),
);
export const toggleSubscriptionSuccess = createAction(
  '[ChannelsList] Toggle Subscription Success',
  props<{ channelId: string; subscriptionId: string | null }>(),
);
export const toggleSubscriptionFailure = createAction(
  '[ChannelsList] Toggle Subscription Failure',
  props<{ channelId: string; originalSubscriptionId: string }>(),
);
