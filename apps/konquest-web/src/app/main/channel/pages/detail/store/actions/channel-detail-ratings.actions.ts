import { createAction, props } from '@ngrx/store';

import { ChannelRating } from '../../../../channel.model';

export const postChannelRatings = createAction('[ChannelDetail] Post Ratings', props<{ payload: ChannelRating }>());

export const postChannelRatingsSuccess = createAction(
  '[ChannelDetail] Post Ratings Success',
  props<{ payload: ChannelRating }>(),
);

export const postChannelRatingsFailure = createAction(
  '[ChannelDetail] Post Ratings Failure',
  props<{ errorMsg: string }>(),
);
