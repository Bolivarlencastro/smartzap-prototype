import { BatchAction } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';

export const toggleTotalSelection = createAction(
  '[Batch Actions] Toggle Total Selection',
  props<{ isTotalSelected: boolean }>(),
);

export const dispatchAction = createAction(
  '[Batch Actions] Dispatch Action',
  props<{ action: BatchAction; enrollmentIds: string[]; total: number }>(),
);

export const resetState = createAction('[Batch Actions] Reset State');
