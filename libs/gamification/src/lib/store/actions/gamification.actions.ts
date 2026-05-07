import { GamificationSubModule } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';

export const loadSubModules = createAction('[Gamification] Load Sub Modules');

export const loadSubModulesSuccess = createAction(
  '[Gamification] Load Sub Modules Success',
  props<{ subModules: GamificationSubModule[] }>(),
);

export const setAdminPermission = createAction(
  '[Gamification] Set Admin Permission',
  props<{ hasAdminPermission: boolean }>(),
);

export const resetState = createAction('[Gamification] Reset State');
