import { createAction, props } from '@ngrx/store';
import { MissionProvider } from 'app/main/mission/mission.model';

export const loadProviders = createAction('[Providers] Load Providers');
export const loadProvidersSuccess = createAction(
  '[Providers] Load Providers Success',
  props<{
    providers: MissionProvider[];
  }>(),
);
export const loadProvidersFailure = createAction('[Providers] Load Providers Failure', props<{ error: unknown }>());
