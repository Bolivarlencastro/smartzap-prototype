import { createAction, props } from '@ngrx/store';
import { LearnContent } from '@keeps-platform-frontend-workspace/kp-keeps';

export const loadContent = createAction('[Classroom Content] Load Content', props<{ contentId: string }>());

export const loadContentSuccess = createAction(
  '[Classroom Content] Load Content Success',
  props<{ content: LearnContent }>(),
);

export const loadContentFailure = createAction('[Classroom Content] Load Content Failure', props<{ error: Error }>());
