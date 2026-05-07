import { createAction, props } from '@ngrx/store';
import { ContentFormData } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';
import { ChannelPulsesManagementFilter, PulseManagementItem } from '../../models/channel-pulses-management.model';
import { Pulse } from '@core/model';

export const init = createAction('[Channel Pulses Management] Init', props<{ channelId: string }>());

export const loadChannelSuccess = createAction(
  '[Channel Pulses Management] Load Channel Success',
  props<{ channelName: string }>(),
);

export const loadChannelFailure = createAction('[Channel Pulses Management] Load Channel Failure');

export const loadPulses = createAction('[Channel Pulses Management] Load Pulses');

export const loadPulsesSuccess = createAction(
  '[Channel Pulses Management] Load Pulses Success',
  props<{ pulses: PulseManagementItem[]; total: number }>(),
);

export const loadPulsesFailure = createAction('[Channel Pulses Management] Load Pulses Failure');

export const setFilter = createAction(
  '[Channel Pulses Management] Set Filter',
  props<{ filter: Partial<ChannelPulsesManagementFilter> }>(),
);

export const setPagination = createAction(
  '[Channel Pulses Management] Set Pagination',
  props<{ page: number; perPage: number }>(),
);

export const reset = createAction('[Channel Pulses Management] Reset');

export const editPulse = createAction('[Channel Pulses Management] Edit Pulse', props<{ pulseId: string }>());
export const editPulseSuccess = createAction('[Channel Pulses Management] Edit Pulse Success');
export const editPulseFailure = createAction('[Channel Pulses Management] Edit Pulse Failure');

export const editContent = createAction(
  '[Channel Pulses Management] Edit Content',
  props<{ pulseId: string; pulseTypeName: string }>(),
);

export const loadPulseForEditionSuccess = createAction(
  '[Channel Pulses Management] Load Pulse For Edition Success',
  props<{ pulse: Pulse }>(),
);

export const editContentSuccess = createAction('[Channel Pulses Management] Edit Content Success');
export const editContentFailure = createAction('[Channel Pulses Management] Edit Content Failure');

export const toggleActivation = createAction(
  '[Channel Pulses Management] Toggle Activation',
  props<{ pulseId: string; isActive: boolean }>(),
);
export const toggleActivationSuccess = createAction('[Channel Pulses Management] Toggle Activation Success');
export const toggleActivationFailure = createAction('[Channel Pulses Management] Toggle Activation Failure');

export const deletePulse = createAction('[Channel Pulses Management] Delete Pulse', props<{ pulseId: string }>());
export const deletePulseSuccess = createAction('[Channel Pulses Management] Delete Pulse Success');
export const deletePulseFailure = createAction('[Channel Pulses Management] Delete Pulse Failure');

export const createPulse = createAction('[Channel Pulses Management] Create Pulse');

export const createNewPulseWithFileUpload = createAction(
  '[Channel Pulses Management] Create New Pulse With File Upload',
  props<{ channelId: string; pulseFormData: ContentFormData }>(),
);
export const createPulseSuccess = createAction('[Channel Pulses Management] Create Pulse Success');
export const createPulseFailure = createAction('[Channel Pulses Management] Create Pulse Failure');
