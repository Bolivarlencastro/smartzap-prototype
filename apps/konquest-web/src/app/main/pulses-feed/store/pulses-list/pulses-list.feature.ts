import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Pulse } from '../../models/pulse';
import { PulsesListParams } from '../../models/params';
import { PulsesListViewModel } from '../../models/view-models';
import * as FeedActions from '../feed/feed.actions';
import * as PulsesListActions from './pulses-list.actions';
import * as PulseDetailsActions from '../pulse-details/pulse-details.actions';
import * as PulseChannelActions from '../pulse-channel-action/pulse-channel-action.actions';

export interface PulsesListFeatureState extends EntityState<Pulse> {
  loading: boolean;
  loadingMore: boolean;
  finished: boolean;
  filter: PulsesListParams;
  openedFromFeed: boolean;
}

export const pulsesListAdapter: EntityAdapter<Pulse> = createEntityAdapter<Pulse>();

export const pulsesListInitialState: PulsesListFeatureState = pulsesListAdapter.getInitialState({
  loading: false,
  loadingMore: false,
  finished: false,
  filter: { per_page: 20 },
  openedFromFeed: false,
});

const pulsesListReducer = createReducer(
  pulsesListInitialState,

  on(FeedActions.init, (): PulsesListFeatureState => pulsesListInitialState),

  on(PulsesListActions.openedFromFeed, (state): PulsesListFeatureState => ({ ...state, openedFromFeed: true })),

  on(PulseDetailsActions.reset, (state): PulsesListFeatureState => ({ ...state, openedFromFeed: false })),

  on(PulsesListActions.loadPulsesList, (): PulsesListFeatureState => {
    return pulsesListAdapter.removeAll({ ...pulsesListInitialState, loading: true });
  }),

  on(PulsesListActions.loadPulsesListSuccess, (state, { payload }): PulsesListFeatureState => {
    const { items, next_cursor } = payload;
    return pulsesListAdapter.setAll(items || [], {
      ...state,
      loading: false,
      finished: !next_cursor,
      filter: { ...pulsesListInitialState.filter, ...(next_cursor ? { cursor: next_cursor } : {}) },
    });
  }),

  on(PulsesListActions.loadPulsesListFailure, (state): PulsesListFeatureState => ({ ...state, loading: false })),

  on(
    PulsesListActions.fetchMorePulses,
    (state): PulsesListFeatureState => ({ ...state, loadingMore: !state.finished }),
  ),

  on(PulsesListActions.fetchMorePulsesSuccess, (state, { payload }): PulsesListFeatureState => {
    const { response, updatedFilter } = payload;
    const { items, next_cursor } = response;
    return pulsesListAdapter.addMany(items || [], {
      ...state,
      loadingMore: false,
      finished: !next_cursor,
      filter: { ...pulsesListInitialState.filter, ...updatedFilter },
    });
  }),

  on(PulsesListActions.fetchMorePulsesFailure, (state): PulsesListFeatureState => ({ ...state, loadingMore: false })),

  on(PulseChannelActions.toggleBookmark, (state, { pulseId, bookmarkId }): PulsesListFeatureState => {
    const pulse = state.entities[pulseId];
    if (!pulse) return state;
    return pulsesListAdapter.updateOne(
      { id: pulseId, changes: { bookmark_id: bookmarkId ? '' : `bm-optimistic-${pulseId}` } },
      state,
    );
  }),

  on(PulseChannelActions.toggleBookmarkSuccess, (state, { pulseId, bookmarkId }): PulsesListFeatureState => {
    return pulsesListAdapter.updateOne({ id: pulseId, changes: { bookmark_id: bookmarkId ?? '' } }, state);
  }),

  on(PulseChannelActions.toggleBookmarkFailure, (state, { pulseId, originalBookmarkId }): PulsesListFeatureState => {
    return pulsesListAdapter.updateOne({ id: pulseId, changes: { bookmark_id: originalBookmarkId } }, state);
  }),

  on(PulseChannelActions.toggleSubscription, (state, { pulseId, channelSubscription }): PulsesListFeatureState => {
    if (!pulseId) return state;
    const pulse = state.entities[pulseId];
    if (!pulse) return state;
    return pulsesListAdapter.updateOne(
      {
        id: pulseId,
        changes: { channel_subscription_id: channelSubscription ? '' : `sub-optimistic-${pulseId}` },
      },
      state,
    );
  }),

  on(
    PulseChannelActions.toggleSubscriptionSuccess,
    (state, { channelId, channelSubscription }): PulsesListFeatureState => {
      const updates = Object.values(state.entities)
        .filter((pulse): pulse is Pulse => !!pulse && pulse.channel_id === channelId)
        .map((pulse) => ({ id: pulse.id, changes: { channel_subscription_id: channelSubscription ?? '' } }));
      return pulsesListAdapter.updateMany(updates, state);
    },
  ),

  on(
    PulseChannelActions.toggleSubscriptionFailure,
    (state, { pulseId, originalChannelSubscription }): PulsesListFeatureState => {
      if (!pulseId) return state;
      return pulsesListAdapter.updateOne(
        { id: pulseId, changes: { channel_subscription_id: originalChannelSubscription ?? '' } },
        state,
      );
    },
  ),

  on(PulsesListActions.loadPulseCommentsSuccess, (state, { pulseId, comments }): PulsesListFeatureState => {
    return pulsesListAdapter.updateOne({ id: pulseId, changes: { comments } }, state);
  }),

  on(PulsesListActions.addComment, (state, { pulseId, comment }): PulsesListFeatureState => {
    const pulse = state.entities[pulseId];
    if (!pulse) return state;
    const hasLoadedComments = pulse.comments !== undefined;
    return pulsesListAdapter.updateOne(
      {
        id: pulseId,
        changes: {
          ...(hasLoadedComments ? { comments: [comment, ...pulse.comments] } : {}),
          comments_count: pulse.comments_count + 1,
        },
      },
      state,
    );
  }),

  on(PulsesListActions.deleteCommentSuccess, (state, { pulseId, commentId }): PulsesListFeatureState => {
    const pulse = state.entities[pulseId];
    if (!pulse) return state;
    const hasLoadedComments = pulse.comments !== undefined;
    return pulsesListAdapter.updateOne(
      {
        id: pulseId,
        changes: {
          ...(hasLoadedComments ? { comments: pulse.comments?.filter((c) => c.id !== commentId) } : {}),
          comments_count: Math.max(0, pulse.comments_count - 1),
        },
      },
      state,
    );
  }),

  on(PulseChannelActions.ratePulseSuccess, (state, { pulseId, averageRating }): PulsesListFeatureState => {
    return pulsesListAdapter.updateOne({ id: pulseId, changes: { average_rating: averageRating } }, state);
  }),

  on(PulsesListActions.editCommentSuccess, (state, { pulseId, commentId, text }): PulsesListFeatureState => {
    const pulse = state.entities[pulseId];
    if (!pulse) return state;
    if (pulse.comments === undefined) return state;
    return pulsesListAdapter.updateOne(
      {
        id: pulseId,
        changes: {
          comments: pulse.comments.map((c) => (c.id === commentId ? { ...c, comment: text } : c)),
        },
      },
      state,
    );
  }),
);

export const pulsesListFeature = createFeature({
  name: 'pulsesList',
  reducer: pulsesListReducer,
  extraSelectors: ({ selectPulsesListState, selectLoading, selectLoadingMore }) => {
    const { selectAll } = pulsesListAdapter.getSelectors(selectPulsesListState);
    return {
      selectAll,
      selectPulsesListViewModel: createSelector(
        selectAll,
        selectLoading,
        selectLoadingMore,
        (pulses, loading, loadingMore): PulsesListViewModel => ({ pulses, loading, loadingMore }),
      ),
    };
  },
});
