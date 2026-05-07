import { Contributor } from '@core/model/contributor.model';
import { createAction, props } from '@ngrx/store';
import { MissionAutocompleteItem } from '../../components/mission-autocomplete/mission-autocomplete-item';
import { User } from '@keeps-platform-frontend-workspace/kp-keeps';

export const loadContributors = createAction(
  '[MISSION CREATION] Load Mission Contributors',
  props<{ missionId: string }>(),
);

export const loadContributorsSuccess = createAction(
  '[MISSION CREATION] Load Contributors Success',
  props<{
    contributors: Contributor[];
  }>(),
);

export const loadContributorsFailure = createAction(
  '[MISSION CREATION] Load Mission Contributors Failure',
  props<{ error: any }>(),
);

export const filterUsers = createAction('[MISSION CREATION] Filter Users', props<{ filter: string }>());

export const filterUsersSuccess = createAction('[MISSION CREATION] Filter Users Success', props<{ users: User[] }>());

export const filterUsersFailure = createAction('[MISSION CREATION] Filter Users Failure', props<{ error: any }>());

export const addContributor = createAction(
  '[MISSION CREATION] Add Contributor',
  props<{ contributor: MissionAutocompleteItem }>(),
);

export const addContributorSuccess = createAction(
  '[MISSION CREATION] Add Contributor Success',
  props<{ contributor: Contributor }>(),
);

export const addContributorFailure = createAction(
  '[MISSION CREATION] Add Contributor Failure',
  props<{ error: any }>(),
);

export const removeContributor = createAction('[MISSION CREATION] Remove Contributor', props<{ userId: string }>());

export const removeContributorSuccess = createAction(
  '[MISSION CREATION] Remove Contributor Success',
  props<{ userId: string }>(),
);

export const removeContributorFailure = createAction(
  '[MISSION CREATION] Remove Contributor Failure',
  props<{
    error: any;
  }>(),
);
