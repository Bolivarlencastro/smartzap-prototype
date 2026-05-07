import { createAction, props } from '@ngrx/store';
import { EventDialogData } from '../../../models/event-dialog';
import { Event } from '../../../models/events';

const openDialog = createAction('[Event Dialog] Open Dialog', props<{ selectedEvent: Event }>());

const fetchData = createAction('[Event Dialog] Fetch Data');
const fetchDataSuccess = createAction('[Event Dialog] Fetch Data Success', props<{ data: EventDialogData }>());
const fetchDataFailure = createAction('[Event Dialog] Fetch Data Failure');

const resetState = createAction('[Event Dialog] Reset State');

export const EventDialogActions = {
  openDialog,
  fetchData,
  fetchDataSuccess,
  fetchDataFailure,
  resetState,
};
