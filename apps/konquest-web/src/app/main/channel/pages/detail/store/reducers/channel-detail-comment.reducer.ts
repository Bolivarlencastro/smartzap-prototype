import { createReducer, on } from '@ngrx/store';

import { ChannelDetailCommentActions } from '../actions';
import { ChannelComment } from '../../../../channel.model';
import { Pagination } from '@core/model';
import { formatDistanceToNow } from 'date-fns';

export interface State {
  comment: ChannelComment | null;
  loading: boolean;
  loaded: boolean;
  error: string;
}

export const initialState: State = {
  comment: null,
  loading: false,
  loaded: false,
  error: '',
};

export const reducers = createReducer(
  initialState,
  on(
    ChannelDetailCommentActions.postChannelComment,
    ChannelDetailCommentActions.putChannelComment,
    (state): State => ({
      ...state,
      loading: true,
    }),
  ),
  on(
    ChannelDetailCommentActions.postChannelCommentSuccess,
    ChannelDetailCommentActions.putChannelCommentSuccess,
    (state, { comment }): State => ({
      ...state,
      comment,
      loading: false,
      loaded: true,
    }),
  ),
  on(
    ChannelDetailCommentActions.postChannelCommentFailure,
    ChannelDetailCommentActions.putChannelCommentFailure,
    (state, { errorMsg }): State => ({
      ...state,
      loading: false,
      error: errorMsg,
    }),
  ),
);

// Get Comments

export interface GetState {
  comments: Pagination<ChannelComment> | ChannelComment[] | null;
  error: string | null;
  loading: boolean;
  loaded: boolean;
  finished: boolean;
  started?: boolean;
  next?: string | null;
  previous?: string | null;
}

export const getCommentsInitialState: GetState = {
  comments: null,
  error: null,
  loading: false,
  loaded: false,
  finished: false,
  started: false,
  next: null,
  previous: null,
};

export const getReducers = createReducer(
  getCommentsInitialState,
  on(
    ChannelDetailCommentActions.getChannelComments,
    (state): GetState => ({
      ...state,
      loading: true,
    }),
  ),
  on(ChannelDetailCommentActions.getChannelCommentsSuccess, (state, { payload }): GetState => {
    const { results: comments, next, previous } = payload;
    const results = comments?.map((comment) => ({
      ...comment,
      date: formatDistanceToNow(new Date(comment.created_date)),
    }));
    const finished = !next;
    const started = !previous;

    return {
      ...state,
      error: null,
      loading: false,
      loaded: true,
      comments: { results, finished, started, next, previous },
    };
  }),
  on(
    ChannelDetailCommentActions.getChannelCommentsFailure,
    (state, { errorMsg }): GetState => ({
      ...state,
      loading: false,
      error: errorMsg,
    }),
  ),
);
