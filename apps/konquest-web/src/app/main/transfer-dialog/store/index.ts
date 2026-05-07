import { createReducer, on } from '@ngrx/store';
import { Recipient, TransferDialogData, TransferStep } from '../models';
import { TransferDialogActions } from './actions';

export const transferDialogFeatureKey = 'transfer-dialog';

export interface State {
  filteredRecipients: Recipient[];
  selectedRecipient: Recipient | null;
  currentStep: TransferStep;
  transferDialogData: TransferDialogData | null;
  currentUser: string;
  loading: boolean;
}

export const initialState: State = {
  filteredRecipients: [],
  selectedRecipient: null,
  currentStep: TransferStep.SELECT_RECIPIENT,
  transferDialogData: null,
  loading: false,
  currentUser: '',
};

export const reducers = createReducer(
  initialState,

  on(TransferDialogActions.setTransferData, (state, { data }): State => {
    return { ...state, transferDialogData: data };
  }),

  on(TransferDialogActions.filterRecipientsSuccess, (state, { response }): State => {
    return { ...state, filteredRecipients: response };
  }),

  on(TransferDialogActions.setRecipient, (state, { recipient }): State => {
    return { ...state, selectedRecipient: recipient };
  }),

  on(TransferDialogActions.removeRecipient, (state): State => {
    return { ...state, selectedRecipient: null };
  }),

  on(TransferDialogActions.setCurrentStep, (state, { step }): State => {
    return { ...state, currentStep: step };
  }),

  on(TransferDialogActions.executeTransfer, (state): State => {
    return { ...state, loading: true };
  }),

  on(TransferDialogActions.executeTransferSuccess, (state, { currentUser }): State => {
    return { ...state, loading: false, currentUser };
  }),

  on(TransferDialogActions.executeTransferFailure, (state): State => {
    return { ...state, loading: false };
  }),

  on(TransferDialogActions.resetState, (): State => initialState),
);
