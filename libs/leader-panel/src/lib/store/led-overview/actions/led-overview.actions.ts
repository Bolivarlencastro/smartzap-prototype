import { createAction, props } from '@ngrx/store';
import { LedOverview } from '../../../models/led-overview';
import { Led } from '../../../models/led';

const openDialog = createAction('[Led Overview] Open Dialog', props<{ selectedUser: Led }>());

const loadLedOverview = createAction('[Led Overview] Load Overview');

const loadLedOverviewSuccess = createAction('[Led Overview] Load Overview Success', props<{ result: LedOverview }>());

const loadLedOverviewFailure = createAction('[Led Overview] Load Overview Failure', props<{ error: unknown }>());

const resetState = createAction('[Led Overview] Reset State');

export const LedOverviewActions = {
  openDialog,
  loadLedOverview,
  loadLedOverviewSuccess,
  loadLedOverviewFailure,
  resetState,
};
