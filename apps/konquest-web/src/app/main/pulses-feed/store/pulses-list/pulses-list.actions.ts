import { createAction, props } from '@ngrx/store';
import { PulseComment } from '../../models/pulse';
import { PulsesListParams, PulsesListResponse } from '../../models/params';

export const openedFromFeed = createAction('[PulsesList] Opened From Feed');

export const loadPulsesList = createAction('[PulsesList] Load Pulses List');
export const loadPulsesListSuccess = createAction(
  '[PulsesList] Load Pulses List Success',
  props<{ payload: PulsesListResponse }>(),
);
export const loadPulsesListFailure = createAction('[PulsesList] Load Pulses List Failure');

export const fetchMorePulses = createAction('[PulsesList] Fetch More Pulses');
export const fetchMorePulsesSuccess = createAction(
  '[PulsesList] Fetch More Pulses Success',
  props<{ payload: { response: PulsesListResponse; updatedFilter: PulsesListParams } }>(),
);
export const fetchMorePulsesFailure = createAction('[PulsesList] Fetch More Pulses Failure');

export const addComment = createAction('[PulsesList] Add Comment', props<{ pulseId: string; comment: PulseComment }>());

export const submitComment = createAction(
  '[PulsesList] Submit Comment',
  props<{ pulseId: string; text: string; displayComment: PulseComment }>(),
);
export const submitCommentFailure = createAction('[PulsesList] Submit Comment Failure', props<{ pulseId: string }>());

export const loadPulseComments = createAction('[PulsesList] Load Pulse Comments', props<{ pulseId: string }>());
export const loadPulseCommentsSuccess = createAction(
  '[PulsesList] Load Pulse Comments Success',
  props<{ pulseId: string; comments: PulseComment[] }>(),
);

export const deleteComment = createAction(
  '[PulsesList] Delete Comment',
  props<{ pulseId: string; commentId: string }>(),
);
export const deleteCommentSuccess = createAction(
  '[PulsesList] Delete Comment Success',
  props<{ pulseId: string; commentId: string }>(),
);
export const deleteCommentFailure = createAction('[PulsesList] Delete Comment Failure');

export const editComment = createAction(
  '[PulsesList] Edit Comment',
  props<{ pulseId: string; commentId: string; text: string }>(),
);
export const editCommentSuccess = createAction(
  '[PulsesList] Edit Comment Success',
  props<{ pulseId: string; commentId: string; text: string }>(),
);
export const editCommentFailure = createAction('[PulsesList] Edit Comment Failure');
