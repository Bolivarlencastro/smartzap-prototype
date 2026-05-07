import { createAction, props } from '@ngrx/store';
import { ClassroomStep } from '../../models';

export const navigate = createAction('[Classroom Navigation] Navigate', props<{ stepId: string }>());

export const goToStep = createAction(
  '[Classroom Navigation] Go To Step',
  props<{
    stepId: string;
    countdownFinished: boolean;
  }>(),
);

export const next = createAction('[Classroom Navigation] Next Step');

export const previous = createAction('[Classroom Navigation] Previous Step', props<{ countdownFinished: boolean }>());

export const completeStepOnNavigation = createAction(
  '[Classroom Navigation] Complete Step On Navigate',
  props<{ countdownFinished: boolean; currentStep: ClassroomStep; targetStepId: string }>(),
);

export const showBlockedContentDialog = createAction('[Classroom Navigation] Show Blocked Content Dialog');
