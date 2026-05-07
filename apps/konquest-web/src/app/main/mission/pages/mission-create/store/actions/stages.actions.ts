import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { MissionStage } from 'app/main/mission/mission.model';

export const saveStage = createAction(
  '[MISSION CREATION] Save Stage',
  props<{
    stage: MissionStage;
    missionId: string;
  }>(),
);

export const saveStageSuccess = createAction(
  '[MISSION CREATION] Save Stage Success',
  props<{
    stage: MissionStage;
  }>(),
);

export const saveStageFailure = createAction('[MISSION CREATION] Save Stage Failure', props<{ error: any }>());

export const editStage = createAction('[MISSION CREATION] Edit Stage', props<{ stage: MissionStage }>());

export const editStageSuccess = createAction(
  '[MISSION CREATION] Edit Stage Success',
  props<{
    payload: Update<MissionStage>;
  }>(),
);

export const editStageFailure = createAction('[MISSION CREATION] Edit Stage Failure', props<{ error: any }>());

export const removeStage = createAction('[MISSION CREATION] Remove Stage', props<{ id: string }>());

export const removeStageSuccess = createAction('[MISSION CREATION] Remove Stage Success', props<{ id: string }>());

export const removeStageFailure = createAction('[MISSION CREATION] Remove Stage Failure', props<{ error: any }>());

export const reorderStages = createAction('[MISSION CREATION] Reorder Stages', props<{ stages: MissionStage[] }>());

export const reorderStagesFailure = createAction('[MISSION CREATION] Reorder Stages Failure', props<{ error: any }>());

export const loadStages = createAction('[MISSION CREATION] Load Stages');

export const loadStagesSuccess = createAction(
  '[MISSION CREATION] Load Stages Success',
  props<{
    stages: MissionStage[];
  }>(),
);

export const loadStagesFailure = createAction('[MISSION CREATION] Load Stages Failure', props<{ error: any }>());
