import { MissionListingConfig } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';

export const loadConfig = createAction(
  '[Mission Listing Config] Load Config',
  props<{ workspaceId: string; config: Partial<MissionListingConfig>[] }>(),
);

export const updateConfig = createAction(
  '[Mission Listing Config] Update Config',
  props<{ config: Partial<MissionListingConfig>; checked: boolean }>(),
);

export const updateConfigSuccess = createAction(
  '[Mission Listing Config] Update Config Success',
  props<{ config: Partial<MissionListingConfig>; checked: boolean }>(),
);

export const updateConfigFailure = createAction(
  '[Mission Listing Config] Update Config Failure',
  props<{ config: Partial<MissionListingConfig> }>(),
);
