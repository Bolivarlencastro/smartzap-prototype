import { createAction, props } from '@ngrx/store';
import { Channel } from '../../../models/channel';
import { ChannelDialogData } from '../../../models/channel-dialog';

const openDialog = createAction('[Channel Dialog] Open Dialog', props<{ selectedChannel: Channel }>());

const fetchData = createAction('[Channel Dialog] Fetch Data');
const fetchDataSuccess = createAction('[Channel Dialog] Fetch Data Success', props<{ data: ChannelDialogData }>());
const fetchDataFailure = createAction('[Channel Dialog] Fetch Data Failure');

const resetState = createAction('[Channel Dialog] Reset State');

export const ChannelDialogActions = {
  openDialog,
  fetchData,
  fetchDataSuccess,
  fetchDataFailure,
  resetState,
};
