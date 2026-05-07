import { createAction, props } from '@ngrx/store';

import { ChannelSubscription, ChannelSubscriptionsFilters } from '../../../../channel.model';

export const postChannelSubscriptions = createAction(
  '[ChannelDetail] Post Subscriptions',
  props<{ payload: ChannelSubscription }>(),
);

export const postChannelSubscriptionsSuccess = createAction(
  '[ChannelDetail] Post Subscriptions Success',
  props<{ payload: ChannelSubscription }>(),
);

export const postChannelSubscriptionsFailure = createAction(
  '[ChannelDetail] Post Subscriptions Failure',
  props<{ errorMsg: string }>(),
);

export const deleteChannelSubscriptions = createAction(
  '[ChannelDetail] Delete Subscriptions',
  props<{ payload: ChannelSubscriptionsFilters }>(),
);

export const deleteChannelSubscriptionsSuccess = createAction(
  '[ChannelDetail] Delete Subscriptions Success',
  props<{ sucess: boolean }>(),
);

export const deleteChannelSubscriptionsFailure = createAction(
  '[ChannelDetail] Delete Subscriptions Failure',
  props<{ errorMsg: string }>(),
);
