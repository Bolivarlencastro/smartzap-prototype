import { createAction, props } from '@ngrx/store';
import { ScormContent } from 'app/main/mission/models';

export const setScormContent = createAction(
  '[MISSION CREATION] Set Scorm Content',
  props<{
    content: ScormContent;
  }>(),
);
