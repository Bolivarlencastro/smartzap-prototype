import { createAction, props } from '@ngrx/store';
import { MissionInstructor, NewInstructorData } from 'app/main/mission/mission.model';

export const setInstructors = createAction(
  '[MISSION CREATION] Set Instructors',
  props<{ instructors: MissionInstructor[] }>(),
);

export const filterInstructors = createAction('[MISSION CREATION] Filter Instructors', props<{ filter: string }>());

export const filterInstructorsSuccess = createAction(
  '[MISSION CREATION] Filter Instructors Success',
  props<{ instructors: MissionInstructor[] }>(),
);

export const filterInstructorsFailure = createAction(
  '[MISSION CREATION] Filter Instructors Failure',
  props<{ error: any }>(),
);

export const addInstructor = createAction(
  '[MISSION CREATION] Add Instructor',
  props<{ instructor: MissionInstructor }>(),
);

export const addInstructorSuccess = createAction(
  '[MISSION CREATION] Add Instructor Success',
  props<{ instructor: MissionInstructor }>(),
);

export const addInstructorFailure = createAction('[MISSION CREATION] Add Instructor Failure', props<{ error: any }>());

export const removeInstructor = createAction(
  '[MISSION CREATION] Remove Instructor',
  props<{ instructor: MissionInstructor }>(),
);

export const removeInstructorSuccess = createAction(
  '[MISSION CREATION] Remove Instructor Success',
  props<{ instructor: MissionInstructor }>(),
);

export const removeInstructorFailure = createAction(
  '[MISSION CREATION] Remove Instructor Failure',
  props<{ error: any }>(),
);

export const registerInstructor = createAction(
  '[MISSION CREATION] Register Instructor',
  props<{ instructorData: NewInstructorData }>(),
);

export const registerInstructorSuccess = createAction(
  '[MISSION CREATION] Register Instructor Success',
  props<{ instructor: MissionInstructor }>(),
);

export const registerInstructorFailure = createAction(
  '[MISSION CREATION] Register Instructor Failure',
  props<{ error: string }>(),
);

export const openNewInstructorDialog = createAction('[MISSION CREATION] Open New Instructor Dialog');
