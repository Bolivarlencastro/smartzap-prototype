import { createAction, props } from '@ngrx/store';
import { PulseDetailsApiComment, PulseDetailsData } from '../../models/pulse-details';

export const openPulseDetails = createAction(
  '[Pulse Details] Init',
  props<{ pulseId: string; rollbackTrailId?: string }>(),
);

export const dialogDestroy = createAction('[Pulse Details] Dialog Destroy');

export const loadPulseDetails = createAction('[Pulse Details] Load Pulse Details');
export const loadPulseDetailsSuccess = createAction(
  '[Pulse Details] Load Pulse Details Success',
  props<{ data: PulseDetailsData }>(),
);
export const loadPulseDetailsFailure = createAction('[Pulse Details] Load Pulse Details Failure');

export const submitComment = createAction(
  '[Pulse Details] Submit Comment',
  props<{ text: string; displayComment: PulseDetailsApiComment }>(),
);
export const submitCommentSuccess = createAction(
  '[Pulse Details] Submit Comment Success',
  props<{ comment: PulseDetailsApiComment }>(),
);
export const submitCommentFailure = createAction('[Pulse Details] Submit Comment Failure');

export const deleteComment = createAction('[Pulse Details] Delete Comment', props<{ commentId: string }>());
export const deleteCommentSuccess = createAction(
  '[Pulse Details] Delete Comment Success',
  props<{ commentId: string }>(),
);
export const deleteCommentFailure = createAction('[Pulse Details] Delete Comment Failure');

export const editComment = createAction('[Pulse Details] Edit Comment', props<{ commentId: string; text: string }>());
export const editCommentSuccess = createAction(
  '[Pulse Details] Edit Comment Success',
  props<{ commentId: string; text: string }>(),
);
export const editCommentFailure = createAction('[Pulse Details] Edit Comment Failure');

export const reset = createAction('[Pulse Details] Reset');
