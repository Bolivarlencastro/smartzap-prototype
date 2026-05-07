import { createAction, props } from '@ngrx/store';
import { MissionProvider } from 'app/main/mission/mission.model';

export const filterProviders = createAction('[MISSION CREATION] Filter Providers', props<{ filter: string }>());

export const filterProvidersSuccess = createAction(
  '[MISSION CREATION] Filter Providers Success',
  props<{
    providers: MissionProvider[];
  }>(),
);

export const filterProvidersFailure = createAction(
  '[MISSION CREATION] Filter Providers Failure',
  props<{
    error: any;
  }>(),
);
