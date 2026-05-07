import {
  Gamification,
  GamificationItem,
  GamificationMenuResponse,
  GamificationSubModule,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Gamification] Init');

export const loadGamification = createAction('[Gamification] Load Gamification');

export const loadGamificationSubModules = createAction('[Gamification] Load Gamification SubModules');

export const loadGamificationSuccess = createAction(
  '[Gamification] Load Gamification Success',
  props<{ data: Gamification }>(),
);

export const updateGamificationSubModules = createAction(
  '[Gamification] Update Gamification',
  props<{ item: GamificationItem; value: boolean }>(),
);

export const updateGamificationSubModulesSuccess = createAction(
  '[Gamification] Update Gamification Success',
  props<{ data: GamificationSubModule }>(),
);

export const loadGamificationMenu = createAction('[Gamification] Load Gamification Menu');

export const loadGamificationMenuSuccess = createAction(
  '[Gamification] Load Gamification Menu Success',
  props<{ data: GamificationMenuResponse }>(),
);

export const loadPersonalScore = createAction('[Gamification] Load Personal Score');

export const loadPersonalScoreSuccess = createAction(
  '[Gamification] Load Personal Score Success',
  props<{ personalScore: number }>(),
);
