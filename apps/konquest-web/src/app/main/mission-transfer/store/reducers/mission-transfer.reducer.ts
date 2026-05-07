import { WorkspaceWithUserRoles } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createReducer, on } from '@ngrx/store';
import {
  MissionTransferDestinationType,
  MissionTransferStep,
  MissionTransferType,
} from 'app/main/mission-transfer/models';
import { Mission } from 'app/main/mission/mission.model';
import { TransferDialogFilterRecipient } from 'app/shared/components/transfer-dialog-filter/transfer-dialog-filter-recipient';
import { MissionTransferActions } from '../actions';

export const missionTransferFeatureKey = 'mission-transfer-dialog';

export interface State {
  filteredRecipients: TransferDialogFilterRecipient[];
  selectedRecipient: TransferDialogFilterRecipient | null;
  currentStep: MissionTransferStep;
  selectedMission: Mission | null;
  transferType: MissionTransferType | null;
  transferDestinationType: MissionTransferDestinationType | null;
  userWorkspaces: WorkspaceWithUserRoles[] | null;
  selectedWorkspace: WorkspaceWithUserRoles | null;
  loading: boolean;
}

export const missionTransferInitialState: State = {
  filteredRecipients: [],
  selectedRecipient: null,
  currentStep: MissionTransferStep.SELECT_RECIPIENT,
  selectedMission: null,
  transferType: null,
  transferDestinationType: null,
  userWorkspaces: [],
  selectedWorkspace: null,
  loading: false,
};

export const missionTransferReducers = createReducer(
  missionTransferInitialState,

  on(MissionTransferActions.openDialog, (state, { data }): State => {
    return {
      ...state,
      selectedMission: data.mission,
      transferType: data.transferType,
      transferDestinationType:
        data.transferType === MissionTransferType.SHARE ? MissionTransferDestinationType.OTHER_WORKSPACE : null,
    };
  }),

  on(MissionTransferActions.setTransferDestinationType, (state, { transferDestinationType }): State => {
    return { ...state, transferDestinationType, selectedWorkspace: null, selectedRecipient: null };
  }),

  on(MissionTransferActions.loadUserWorkspacesSuccess, (state, { workspaces }): State => {
    return { ...state, userWorkspaces: workspaces };
  }),

  on(MissionTransferActions.setSelectedWorkspace, (state, { workspace }): State => {
    return { ...state, selectedWorkspace: workspace, selectedRecipient: null, filteredRecipients: [] };
  }),

  on(MissionTransferActions.filterRecipientsSuccess, (state, { response }): State => {
    return { ...state, filteredRecipients: response };
  }),

  on(MissionTransferActions.setRecipient, (state, { recipient }): State => {
    return { ...state, selectedRecipient: recipient };
  }),

  on(MissionTransferActions.removeRecipient, (state): State => {
    return { ...state, selectedRecipient: null };
  }),

  on(MissionTransferActions.setStep, (state, { step }): State => {
    return { ...state, currentStep: step };
  }),

  on(MissionTransferActions.executeTransfer, (state): State => {
    return { ...state, loading: true };
  }),

  on(MissionTransferActions.executeTransferFailure, (state): State => {
    return { ...state, loading: false };
  }),

  on(MissionTransferActions.resetState, (): State => missionTransferInitialState),
);
