import { createAction, props } from '@ngrx/store';
import { CMI } from '@keeps-platform-frontend-workspace/kp-keeps';

export const loadScormCMI = createAction('[Classroom Scorm] Load Scorm CMI');

export const loadScormCMISuccess = createAction('[Classroom Scorm] Load Scorm CMI Success', props<{ cmi: CMI }>());

export const loadScormCMIFailure = createAction('[Classroom Scorm] Load Scorm CMI Failure', props<{ error: Error }>());

export const saveScormCMI = createAction('[Classroom Scorm] Save Scorm CMI', props<{ cmi: CMI }>());

export const saveScormCMISuccess = createAction('[Classroom Scorm] Save Scorm CMI Success', props<{ cmi: CMI }>());

export const saveScormCMIFailure = createAction('[Classroom Scorm] Save Scorm CMI Failure', props<{ error: Error }>());

export const storeLastEmittedScormCMI = createAction(
  '[Classroom Scorm] Store Last Emitted Scorm CMI',
  props<{
    cmi: CMI;
  }>(),
);

export const saveLastEmittedScormCMI = createAction('[Classroom Scorm] Save Last Emitted Scorm CMI');
