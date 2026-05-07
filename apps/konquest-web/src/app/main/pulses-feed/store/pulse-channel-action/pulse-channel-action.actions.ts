import { createAction, props } from '@ngrx/store';
import { ChannelPulseSideItem } from '../../models/channel';

export const toggleBookmark = createAction(
  '[PulseChannelAction] Toggle Bookmark',
  props<{ pulseId: string; bookmarkId: string | null }>(),
);
export const toggleBookmarkSuccess = createAction(
  '[PulseChannelAction] Toggle Bookmark Success',
  props<{ pulseId: string; bookmarkId: string | null }>(),
);
export const toggleBookmarkFailure = createAction(
  '[PulseChannelAction] Toggle Bookmark Failure',
  props<{ pulseId: string; originalBookmarkId: string }>(),
);

export const ratePulse = createAction('[PulseChannelAction] Rate Pulse', props<{ pulseId: string; rating: number }>());
export const ratePulseSuccess = createAction(
  '[PulseChannelAction] Rate Pulse Success',
  props<{ pulseId: string; averageRating: number }>(),
);
export const ratePulseFailure = createAction('[PulseChannelAction] Rate Pulse Failure', props<{ pulseId: string }>());

export const copyPulseLink = createAction('[PulseChannelAction] Copy Pulse Link', props<{ pulseId: string }>());

export const toggleSubscription = createAction(
  '[PulseChannelAction] Toggle Subscription',
  props<{
    pulseId: string | null;
    channelId: string;
    channelSubscription: string | null;
    channel: ChannelPulseSideItem;
  }>(),
);
export const toggleSubscriptionSuccess = createAction(
  '[PulseChannelAction] Toggle Subscription Success',
  props<{
    pulseId: string | null;
    channelId: string;
    channelSubscription: string | null;
    channel: ChannelPulseSideItem;
  }>(),
);
export const toggleSubscriptionFailure = createAction(
  '[PulseChannelAction] Toggle Subscription Failure',
  props<{ pulseId: string | null; channelId: string; originalChannelSubscription: string | null }>(),
);
