import { createAction, props } from '@ngrx/store';
import { Recipient, TransferDialogData, TransferStep } from '../../models';

export const filterRecipients = createAction('[Transfer Dialog] Filter Recipients', props<{ searchTerm: string }>());

export const filterRecipientsSuccess = createAction(
  '[Transfer Dialog] Filter Recipients Success',
  props<{ response: Recipient[] }>(),
);

export const filterRecipientsFailure = createAction(
  '[Transfer Dialog] Filter Recipients Failure',
  props<{ error: Error }>(),
);

export const setRecipient = createAction('[Transfer Dialog] Set Recipient', props<{ recipient: Recipient }>());

export const removeRecipient = createAction('[Transfer Dialog] Remove Recipient');

export const positiveButtonClick = createAction('[Transfer Dialog] Positive Button Click');

export const negativeButtonClick = createAction('[Transfer Dialog] Negative Button Click');

export const setCurrentStep = createAction('[Transfer Dialog] Set Current Step', props<{ step: TransferStep }>());

export const setTransferData = createAction(
  '[Transfer Dialog] Set Transfer Data',
  props<{ data: TransferDialogData }>(),
);

export const executeTransfer = createAction('[Transfer Dialog] Execute Transfer');

export const executeTransferSuccess = createAction(
  '[Transfer Dialog] Execute Transfer Success',
  props<{ currentUser: string }>(),
);

export const executeTransferFailure = createAction(
  '[Transfer Dialog] Execute Transfer Failure',
  props<{ error: Error }>(),
);

export const closeDialog = createAction('[Transfer Dialog] Close Dialog');

export const openDialog = createAction('[Transfer Dialog] Open Dialog', props<{ dialogData: TransferDialogData }>());

export const resetState = createAction('[Transfer Dialog] Reset State');
