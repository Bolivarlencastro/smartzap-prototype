import { WorkspaceWithUserRoles } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';
import {
  MissionTransferDestinationType,
  MissionTransferDialogData,
  MissionTransferStep,
} from 'app/main/mission-transfer/models';
import { TransferDialogFilterRecipient } from 'app/shared/components/transfer-dialog-filter/transfer-dialog-filter-recipient';

export const filterRecipients = createAction('[Mission Transfer] Filter Recipients', props<{ search: string }>());

export const filterRecipientsSuccess = createAction(
  '[Mission Transfer] Filter Recipients Success',
  props<{ response: TransferDialogFilterRecipient[] }>(),
);

export const filterRecipientsFailure = createAction(
  '[Mission Transfer] Filter Recipients Failure',
  props<{ error: Error }>(),
);

export const setRecipient = createAction(
  '[Mission Transfer] Set Recipient',
  props<{ recipient: TransferDialogFilterRecipient }>(),
);

export const setTransferDestinationType = createAction(
  '[Mission Transfer] Set Transfer Destination Type',
  props<{ transferDestinationType: MissionTransferDestinationType }>(),
);

export const loadUserWorkspaces = createAction('[Mission Transfer] Load User Workspaces');

export const loadUserWorkspacesSuccess = createAction(
  '[Mission Transfer] Load User Workspaces Success',
  props<{ workspaces: WorkspaceWithUserRoles[] }>(),
);

export const loadUserWorkspacesFailure = createAction(
  '[Mission Transfer] Load User Workspaces Failure',
  props<{ error: Error }>(),
);

export const setSelectedWorkspace = createAction(
  '[Mission Transfer] Set Selected Workspace',
  props<{ workspace: WorkspaceWithUserRoles }>(),
);

export const removeRecipient = createAction('[Mission Transfer] Remove Recipient');

export const positiveButtonClick = createAction('[Mission Transfer] Positive Button Click');

export const negativeButtonClick = createAction('[Mission Transfer] Negative Button Click');

export const setStep = createAction('[Mission Transfer] Set Step', props<{ step: MissionTransferStep }>());

export const executeTransfer = createAction('[Mission Transfer] Execute Transfer');

export const executeTransferFailure = createAction(
  '[Mission Transfer] Execute Transfer Failure',
  props<{ error: Error }>(),
);

export const closeDialog = createAction('[Mission Transfer] Close Dialog');

export const openDialog = createAction('[Mission Transfer] Open Dialog', props<{ data: MissionTransferDialogData }>());

export const resetState = createAction('[Mission Transfer] Reset State');
