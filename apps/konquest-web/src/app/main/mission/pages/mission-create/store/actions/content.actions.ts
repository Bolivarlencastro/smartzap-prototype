import { createAction, props } from '@ngrx/store';
import { MissionStage, MissionStageContent } from 'app/main/mission/mission.model';
import { ContentFormData } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';

export const editStageContent = createAction(
  '[MISSION CREATE] Edit Stage Content',
  props<{
    content: MissionStageContent;
  }>(),
);

export const editStageContentSuccess = createAction('[MISSION CREATION] Edit Stage Content Success');

export const editStageContentFailure = createAction(
  '[MISSION CREATION] Edit Stage Content Failure',
  props<{
    error: string;
  }>(),
);

export const deleteStageContent = createAction('[MISSION CREATION] Delete Stage Content', props<{ id: string }>());

export const deleteStageContentSuccess = createAction('[MISSION CREATION] Delete Stage Content Success');

export const deleteStageContentFailure = createAction(
  '[MISSION CREATION] Delete Stage Content Failure',
  props<{
    error: any;
  }>(),
);

export const reorderStageContent = createAction(
  '[MISSION CREATION] Reorder Stage Content',
  props<{
    id: string;
    contents: MissionStageContent[];
  }>(),
);

export const reorderStageContentFailure = createAction(
  '[MISSION CREATION] Reorder Stage Content Failure',
  props<{
    error: any;
  }>(),
);

export const uploadFile = createAction(
  '[MISSION CREATION] Upload File',
  props<{
    stage: MissionStage;
    content: ContentFormData;
  }>(),
);
