import { Mission, MissionEnrollmentAttendance } from '@app/main/mission/mission.model';
import { createAction, props } from '@ngrx/store';
import { EventManagementAction } from '../../models/actions';
import { EventManagementFilter } from '../../models/filter';

export const init = createAction('[Event Management] Init', props<{ eventId: string }>());

export const loadEvent = createAction('[Event Management] Load Event');
export const loadEventSuccess = createAction('[Event Management] Load Event Success', props<{ event: Mission }>());
export const loadEventFailure = createAction('[Event Management] Load Event Failure');

export const loadUsers = createAction('[Event Management] Load Users');
export const loadUsersSuccess = createAction(
  '[Event Management] Load Users Success',
  props<{ users: MissionEnrollmentAttendance[] }>(),
);
export const loadUsersFailure = createAction('[Event Management] Load Users Failure');

export const setFilter = createAction('[Event Management] Set Filter', props<{ filter: EventManagementFilter }>());

export const dispatchAction = createAction(
  '[Event Management] Dispatch Action',
  props<{ action: EventManagementAction }>(),
);

export const enrollUsers = createAction('[Event Management] Enroll Users', props<{ remainingSeats: number }>());

export const reset = createAction('[Event Management] Reset');
