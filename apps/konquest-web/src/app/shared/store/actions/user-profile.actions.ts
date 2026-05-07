import { createAction, props } from '@ngrx/store';

export const setUserProfileData = createAction(
  '[User Profile] Set profile data',
  props<{
    isAdmin: boolean;
    isSuperAdmin: boolean;
  }>(),
);
