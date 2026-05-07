import { UserSearchFilterOption } from '@app/shared/model';
import { createAction, props } from '@ngrx/store';

export const fetchJobPositions = createAction(
  '[Users List Filter] Fetch Job Positions',
  props<{ jobPositions: UserSearchFilterOption[] }>(),
);

export const fetchLeaders = createAction(
  '[Users List Filter] Fetch Leaders',
  props<{ leaders: UserSearchFilterOption[] }>(),
);

export const fetchActivityAreas = createAction(
  '[Users List Filter] Fetch Activity Areas',
  props<{ activityAreas: string[] }>(),
);

export const fetchDirectors = createAction('[Users List Filter] Fetch Directors', props<{ directors: string[] }>());

export const fetchManagers = createAction('[Users List Filter] Fetch Managers', props<{ managers: string[] }>());

export const clear = createAction('[Users List Filter] Clear State');
