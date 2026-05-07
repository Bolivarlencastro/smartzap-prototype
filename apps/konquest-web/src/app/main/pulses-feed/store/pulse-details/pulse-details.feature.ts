import { createFeature, createReducer, on } from '@ngrx/store';
import { LearnContent } from '@core/model';
import { ChannelDetailsApiResponse, PulseDetailsApiComment, PulseDetailsApiResponse } from '../../models/pulse-details';
import * as PulseDetailsActions from './pulse-details.actions';
import * as PulseChannelActions from '../pulse-channel-action/pulse-channel-action.actions';

export interface PulseDetailsFeatureState {
  pulseId: string;
  loading: boolean;
  pulse: PulseDetailsApiResponse | null;
  comments: PulseDetailsApiComment[];
  content: LearnContent | null;
  channel: ChannelDetailsApiResponse | null;
  rollbackTrailId: string | undefined;
}

const initialState: PulseDetailsFeatureState = {
  pulseId: null,
  loading: false,
  pulse: null,
  comments: [],
  content: null,
  channel: null,
  rollbackTrailId: undefined,
};

const pulseDetailsReducer = createReducer(
  initialState,

  on(
    PulseDetailsActions.openPulseDetails,
    (state, { pulseId, rollbackTrailId }): PulseDetailsFeatureState => ({ ...state, pulseId, rollbackTrailId }),
  ),

  on(PulseDetailsActions.loadPulseDetails, (state): PulseDetailsFeatureState => ({ ...state, loading: true })),
  on(
    PulseDetailsActions.loadPulseDetailsSuccess,
    (state, { data }): PulseDetailsFeatureState => ({ ...state, loading: false, ...data }),
  ),
  on(PulseDetailsActions.loadPulseDetailsFailure, (state): PulseDetailsFeatureState => ({ ...state, loading: false })),

  on(PulseChannelActions.toggleSubscription, (state, { channelId, channelSubscription }): PulseDetailsFeatureState => {
    if (!state.channel || state.channel.id !== channelId) return state;
    return {
      ...state,
      channel: { ...state.channel, subscription: channelSubscription ? undefined : { active_subscription: true } },
    };
  }),
  on(
    PulseChannelActions.toggleSubscriptionSuccess,
    (state, { channelId, channelSubscription }): PulseDetailsFeatureState => {
      if (!state.channel || state.channel.id !== channelId) return state;
      return {
        ...state,
        channel: {
          ...state.channel,
          subscription: channelSubscription ? { id: channelSubscription, active_subscription: true } : undefined,
        },
      };
    },
  ),
  on(
    PulseChannelActions.toggleSubscriptionFailure,
    (state, { channelId, originalChannelSubscription }): PulseDetailsFeatureState => {
      if (!state.channel || state.channel.id !== channelId) return state;
      return {
        ...state,
        channel: {
          ...state.channel,
          subscription: originalChannelSubscription
            ? { id: originalChannelSubscription, active_subscription: true }
            : undefined,
        },
      };
    },
  ),

  on(
    PulseDetailsActions.submitCommentSuccess,
    (state, { comment }): PulseDetailsFeatureState => ({
      ...state,
      comments: [comment, ...state.comments],
    }),
  ),

  on(
    PulseDetailsActions.deleteCommentSuccess,
    (state, { commentId }): PulseDetailsFeatureState => ({
      ...state,
      comments: state.comments.filter((c) => c.id !== commentId),
    }),
  ),

  on(
    PulseDetailsActions.editCommentSuccess,
    (state, { commentId, text }): PulseDetailsFeatureState => ({
      ...state,
      comments: state.comments.map((c) => (c.id === commentId ? { ...c, comment: text } : c)),
    }),
  ),

  on(PulseChannelActions.ratePulseSuccess, (state, { pulseId, averageRating }): PulseDetailsFeatureState => {
    if (!state.pulse || state.pulse.id !== pulseId) return state;
    return { ...state, pulse: { ...state.pulse, rating_avg: averageRating } };
  }),

  on(PulseChannelActions.toggleBookmark, (state, { pulseId, bookmarkId }): PulseDetailsFeatureState => {
    if (!state.pulse || state.pulse.id !== pulseId) return state;
    return {
      ...state,
      pulse: { ...state.pulse, bookmark_id: bookmarkId ? '' : `bm-optimistic-${pulseId}` },
    };
  }),

  on(PulseChannelActions.toggleBookmarkSuccess, (state, { pulseId, bookmarkId }): PulseDetailsFeatureState => {
    if (!state.pulse || state.pulse.id !== pulseId) return state;
    return { ...state, pulse: { ...state.pulse, bookmark_id: bookmarkId ?? '' } };
  }),

  on(PulseChannelActions.toggleBookmarkFailure, (state, { pulseId, originalBookmarkId }): PulseDetailsFeatureState => {
    if (!state.pulse || state.pulse.id !== pulseId) return state;
    return { ...state, pulse: { ...state.pulse, bookmark_id: originalBookmarkId } };
  }),

  on(PulseDetailsActions.reset, (): PulseDetailsFeatureState => initialState),
);

export const pulseDetailsFeature = createFeature({
  name: 'pulseDetails',
  reducer: pulseDetailsReducer,
});
