import { createAction, props } from '@ngrx/store';

export const getReport = createAction(
  '[Report] Get Report',
  props<{ filter: { reportType: any; data?: any; objectId?: string; objectIds?: string[] } }>(),
);

export const getReportSuccess = createAction('[Report] Get Report Success');

export const getReportFailure = createAction('[Report] Get Report Failure');

export const getMissions = createAction('[Report] Get Missions', props<{ queryParams?: any }>());

export const getMissionsSuccess = createAction('[Report] Get Missions Success', props<{ response: [] }>());

export const getMissionsFailure = createAction('[Report] Get Missions Failure');

export const getUsers = createAction('[Report] Get Users', props<{ queryParams?: any }>());

export const getUsersSuccess = createAction('[Report] Get Users Success', props<{ response: [] }>());

export const getUsersFailure = createAction('[Report] Get Users Failure');
