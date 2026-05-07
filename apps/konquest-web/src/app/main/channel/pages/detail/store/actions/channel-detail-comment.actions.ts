import { createAction, props } from '@ngrx/store';

import { ChannelComment, ChannelCommentsFilters } from '../../../../channel.model';
import { Pagination, PaginationParams } from '@core/model';

export const postChannelComment = createAction('[ChannelDetail] Post Comment', props<{ payload: ChannelComment }>());

export const postChannelCommentSuccess = createAction(
  '[ChannelDetail] Post Comment Success',
  props<{ comment: ChannelComment }>(),
);

export const postChannelCommentFailure = createAction(
  '[ChannelDetail] Post Comment Failure',
  props<{ errorMsg: string }>(),
);

export const putChannelComment = createAction(
  '[ChannelDetail] Put Comment',
  props<{ id: string; payload: ChannelComment }>(),
);

export const putChannelCommentSuccess = createAction(
  '[ChannelDetail] Put Comment Success',
  props<{ comment: ChannelComment }>(),
);

export const putChannelCommentFailure = createAction(
  '[ChannelDetail] Put Comment Failure',
  props<{ errorMsg: string }>(),
);

export const deleteChannelComment = createAction(
  '[ChannelDetail] Delete Comment',
  props<{ id: string; channel_id: string }>(),
);

export const deleteChannelCommentSuccess = createAction('[ChannelDetail] Delete Comment Success');

export const deleteChannelCommentFailure = createAction(
  '[ChannelDetail] Delete Comment Failure',
  props<{ errorMsg: string }>(),
);

export const getChannelComments = createAction(
  '[ChannelDetail] Get Comments',
  props<{ payload?: ChannelCommentsFilters; page?: string }>(),
);

export const getChannelCommentsSuccess = createAction(
  '[ChannelDetail] Get Comments Success',
  props<{ payload: Pagination<ChannelComment> }>(),
);

export const getChannelCommentsFailure = createAction(
  '[ChannelDetail] Get Comments Failure',
  props<{ errorMsg: string }>(),
);

export const getChannelCommentsPagination = createAction(
  '[ChannelDetail] Get Comments Pagination',
  props<{
    payload: ChannelCommentsFilters;
    paginationParams?: PaginationParams;
  }>(),
);
