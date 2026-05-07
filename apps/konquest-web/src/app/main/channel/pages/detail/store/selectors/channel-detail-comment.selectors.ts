import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChannelDetailCommentReducers } from '../reducers';

export const channelCommentFeatureKey = 'channel-comment-app';

export const selectChannelDetailComponentAppState =
  createFeatureSelector<ChannelDetailCommentReducers.State>(channelCommentFeatureKey);

// Channel Comments
export const selectChannelCommentApp = createSelector(
  selectChannelDetailComponentAppState,
  (state: ChannelDetailCommentReducers.State) => state.comment,
);

export const selectPostChannelCommentLoaded = createSelector(
  selectChannelDetailComponentAppState,
  (state: ChannelDetailCommentReducers.State) => state.loaded,
);

export const selectPostChannelCommentLoading = createSelector(
  selectChannelDetailComponentAppState,
  (state: ChannelDetailCommentReducers.State) => state.loading,
);

export const selectPutChannelCommentLoaded = createSelector(
  selectChannelDetailComponentAppState,
  (state: ChannelDetailCommentReducers.State) => state.loaded,
);

export const selectPutChannelCommentLoading = createSelector(
  selectChannelDetailComponentAppState,
  (state: ChannelDetailCommentReducers.State) => state.loading,
);

// Get Comments

export const getCommentsFeatureKey = 'channel-get-comments-app';

export const selectCommentsAppState =
  createFeatureSelector<ChannelDetailCommentReducers.GetState>(getCommentsFeatureKey);

export const selectChannelComments = createSelector(
  selectCommentsAppState,
  (state: ChannelDetailCommentReducers.GetState) => state.comments,
);

export const selectChannelCommentsLoaded = createSelector(
  selectCommentsAppState,
  (state: ChannelDetailCommentReducers.GetState) => state.loaded,
);

export const selectChannelCommentsLoading = createSelector(
  selectCommentsAppState,
  (state: ChannelDetailCommentReducers.GetState) => state.loading,
);
