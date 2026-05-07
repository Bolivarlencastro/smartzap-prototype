import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, transferDialogFeatureKey } from '../index';
import { TransferStep } from '../../models';

export const selectTransferDialogState = createFeatureSelector<State>(transferDialogFeatureKey);

export const selectFilteredRecipients = createSelector(selectTransferDialogState, (state) => state.filteredRecipients);

export const selectEdRecipient = createSelector(selectTransferDialogState, (state) => state.selectedRecipient);

export const selectTransferData = createSelector(selectTransferDialogState, (state) => state.transferDialogData);

export const selectCurrentUser = createSelector(selectTransferDialogState, (state) => state.currentUser);

export const selectTransferContent = createSelector(
  selectTransferData,
  (transferDialogData) => transferDialogData?.transferContent,
);

export const selectCurrentStep = createSelector(selectTransferDialogState, (state) => state.currentStep);

export const selectLoading = createSelector(selectTransferDialogState, (state) => state.loading);

export const selectPositiveButtonLabel = createSelector(selectCurrentStep, (currentStep) => {
  const labels = {
    [TransferStep.SELECT_RECIPIENT]: 'GENERAL.TRANSFER',
    [TransferStep.CONFIRMATION]: 'GENERAL.CONFIRM',
  };
  return labels[currentStep];
});

export const selectNegativeButtonLabel = createSelector(selectCurrentStep, (currentStep) => {
  const labels = {
    [TransferStep.SELECT_RECIPIENT]: 'GENERAL.CANCEL',
    [TransferStep.CONFIRMATION]: 'GENERAL.BACK',
  };
  return labels[currentStep];
});

export const selectDialogTitle = createSelector(selectTransferData, (transferData) => {
  return `TRANSFER_DIALOG.TITLE.${transferData?.contentType}`;
});

export const selectDialogSubtitle = createSelector(selectTransferData, (transferData) => {
  return `TRANSFER_DIALOG.SUBTITLE.${transferData?.contentType}`;
});
