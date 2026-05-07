import { createAction, props } from '@ngrx/store';
import { Pulse } from '../../../models/pulse';
import { PulseDialogData } from '../../../models/pulse-dialog';

const openDialog = createAction('[Pulse Dialog] Open Dialog', props<{ selectedPulse: Pulse }>());

const fetchData = createAction('[Pulse Dialog] Fetch Data');
const fetchDataSuccess = createAction('[Pulse Dialog] Fetch Data Success', props<{ data: PulseDialogData }>());
const fetchDataFailure = createAction('[Pulse Dialog] Fetch Data Failure');

const resetState = createAction('[Pulse Dialog] Reset State');

export const PulseDialogActions = {
  openDialog,
  fetchData,
  fetchDataSuccess,
  fetchDataFailure,
  resetState,
};
