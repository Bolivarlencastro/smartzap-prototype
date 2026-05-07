import { createAction, props } from '@ngrx/store';
import { ClassroomStep } from '../../models';

export const loadStepsSuccess = createAction(
  '[Classroom Steps] Load Steps Success',
  props<{
    steps: ClassroomStep[];
  }>(),
);

export const loadStepsFailure = createAction('[Classroom Steps] Load Steps Failure', props<{ error: unknown }>());

export const completeStep = createAction('[Classroom Steps] Complete Step', props<{ step: ClassroomStep }>());

export const completeStepSuccess = createAction(
  '[Classroom Steps] Complete Step Success',
  props<{
    step: ClassroomStep;
    skipped: boolean;
  }>(),
);

export const completeStepFailure = createAction('[Classroom Steps] Complete Step Failure', props<{ error: unknown }>());
