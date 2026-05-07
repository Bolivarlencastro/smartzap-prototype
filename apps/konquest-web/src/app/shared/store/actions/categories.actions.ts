import { ChannelCategory } from '@app/main/channel/channel.model';
import { MissionCategory } from '@app/main/mission/mission.model';
import { createAction, props } from '@ngrx/store';

export const loadCategories = createAction('[Categories] Load Categories');
export const loadCategoriesSuccess = createAction(
  '[Categories] Load Categories Success',
  props<{ missionsFiltered: MissionCategory[]; channels: ChannelCategory[] }>(),
);

export const loadAllMissionCategories = createAction('[Categories] Load All Mission Categories');
export const loadAllMissionCategoriesSuccess = createAction(
  '[Categories] Load All Mission Categories Success',
  props<{ missions: MissionCategory[] }>(),
);
export const loadAllMissionCategoriesFailure = createAction(
  '[Categories] Load All Mission Categories Failure',
  props<{ error: any }>(),
);
