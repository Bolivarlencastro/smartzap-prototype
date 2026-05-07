import { createAction, props } from '@ngrx/store';
import { Trail } from '../../../models/trail';
import { TrailDialogData } from '../../../models/trail-dialog';

const openDialog = createAction('[Trail Dialog] Open Dialog', props<{ selectedTrail: Trail }>());

const fetchData = createAction('[Trail Dialog] Fetch Data');
const fetchDataSuccess = createAction('[Trail Dialog] Fetch Data Success', props<{ data: TrailDialogData }>());
const fetchDataFailure = createAction('[Trail Dialog] Fetch Data Failure');

const resetState = createAction('[Trail Dialog] Reset State');

export const TrailDialogActions = {
  openDialog,
  fetchData,
  fetchDataSuccess,
  fetchDataFailure,
  resetState,
};
