import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { createAction, props } from '@ngrx/store';
import { MissionProvider, MissionScreenType, MissionsFilter } from 'app/main/mission/mission.model';

export const init = createAction('[Missions] Init', props<{ screenType: MissionScreenType }>());

export const loadMissions = createAction('[Missions] Load Missions');

export const loadMissionsSuccess = createAction(
  '[Missions] Load Missions Success',
  props<{ missions: LearnContentCardData[]; finished: boolean }>(),
);
export const loadMissionsFailure = createAction('[Missions] Load Missions Failure');

export const loadRecommendationsSuccess = createAction(
  '[Missions] Load Recommendations Success',
  props<{ recommendations: LearnContentCardData[] }>(),
);
export const loadRecommendationsFailure = createAction('[Missions] Load Recommendations Failure');

export const loadMissionProvidersSuccess = createAction(
  '[Missions] Load Mission Providers Success',
  props<{ providers: MissionProvider[] }>(),
);

export const filter = createAction('[Missions] Filter', props<{ filter: Partial<MissionsFilter> }>());

export const loadMoreMissions = createAction('[Missions] Load More Missions');
export const loadMoreMissionsSuccess = createAction(
  '[Missions] Load More Missions Success',
  props<{ missions: LearnContentCardData[]; finished: boolean }>(),
);

export const cleanFilter = createAction('[Missions] Clean Filter');

export const resetState = createAction('[Missions] Reset State');
