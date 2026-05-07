import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  MissionTransferDestinationType,
  MissionTransferStep,
  MissionTransferType,
} from 'app/main/mission-transfer/models';
import { MissionTransferReducer } from '../reducers';
import { marker } from '@jsverse/transloco-keys-manager/marker';

marker('GENERAL.TRANSFER');
marker('GENERAL.SHARE');
marker('GENERAL.DUPLICATE');

const selectMissionTransferState = createFeatureSelector<MissionTransferReducer.State>(
  MissionTransferReducer.missionTransferFeatureKey,
);

export const selectFilteredRecipients = createSelector(selectMissionTransferState, (state) => state.filteredRecipients);

export const selectEdRecipient = createSelector(selectMissionTransferState, (state) => state.selectedRecipient);

export const selectEdMission = createSelector(selectMissionTransferState, (state) => state?.selectedMission);

export const selectTransferType = createSelector(selectMissionTransferState, (state) => state?.transferType);

export const selectCurrentStep = createSelector(selectMissionTransferState, (state) => state.currentStep);

export const selectLoading = createSelector(selectMissionTransferState, (state) => state.loading);

export const selectUserWorkspaces = createSelector(selectMissionTransferState, (state) => state.userWorkspaces);

export const selectShowTransferDestinationSelector = createSelector(
  selectTransferType,
  (transferType) => transferType !== MissionTransferType.SHARE,
);

export const selectEdTransferDestinationType = createSelector(
  selectMissionTransferState,
  (state) => state.transferDestinationType,
);

export const selectShowDestinationWorkspaceSelect = createSelector(
  selectEdTransferDestinationType,
  (selectedTransferDestinationType) =>
    selectedTransferDestinationType === MissionTransferDestinationType.OTHER_WORKSPACE,
);

export const selectEdWorkspace = createSelector(selectMissionTransferState, (state) => state.selectedWorkspace);

export const selectShowUserFilter = createSelector(
  selectEdTransferDestinationType,
  selectEdWorkspace,
  selectTransferType,
  (selectedTransferDestinationType, selectedWorkspace, transferType) => {
    if (transferType === MissionTransferType.SHARE) {
      return false;
    }

    if (selectedWorkspace) {
      return true;
    }
    return selectedTransferDestinationType === MissionTransferDestinationType.SAME_WORKSPACE;
  },
);

export const selectPositiveButtonLabel = createSelector(
  selectCurrentStep,
  selectTransferType,
  (currentStep, transferType) => {
    const labels = {
      [MissionTransferStep.SELECT_RECIPIENT]: `GENERAL.${transferType}`,
      [MissionTransferStep.CONFIRMATION]: 'GENERAL.CONFIRM',
    };
    return labels[currentStep];
  },
);

export const selectNegativeButtonLabel = createSelector(selectCurrentStep, (currentStep) => {
  const labels = {
    [MissionTransferStep.SELECT_RECIPIENT]: 'GENERAL.CANCEL',
    [MissionTransferStep.CONFIRMATION]: 'GENERAL.BACK',
  };
  return labels[currentStep];
});

export const selectSubmitDisabled = createSelector(
  selectTransferType,
  selectEdTransferDestinationType,
  selectEdWorkspace,
  selectEdRecipient,
  selectLoading,
  (transferType, selectedTransferDestinationType, selectedWorkspace, selectedRecipient, loading) => {
    if (loading) {
      return true;
    }

    if (transferType === MissionTransferType.SHARE) {
      return !selectedWorkspace;
    }

    return !selectedRecipient;
  },
);

export const selectDialogTitle = createSelector(selectTransferType, (transferType) => {
  return `MISSION.TRANSFER_DIALOG.TITLE.${transferType}`;
});

export const selectDialogSubtitle = createSelector(selectTransferType, (transferType) => {
  return `MISSION.TRANSFER_DIALOG.SUBTITLE.${transferType}`;
});

export const selectDialogInfo = createSelector(selectTransferType, (transferType) => {
  return `MISSION.TRANSFER_DIALOG.INFO.${transferType}`;
});

export const selectConfirmationLabel = createSelector(selectTransferType, (transferType) => {
  return `MISSION.TRANSFER_DIALOG.CONFIRMATION.TYPE.${transferType}`;
});

export const selectSameWorkspaceSelectLabel = createSelector(selectTransferType, (transferType) => {
  return `MISSION.TRANSFER_DIALOG.DESTINATION_TYPE.${transferType}.SAME_WORKSPACE`;
});

export const selectOtherWorkspaceSelectLabel = createSelector(selectTransferType, (transferType) => {
  return `MISSION.TRANSFER_DIALOG.DESTINATION_TYPE.${transferType}.OTHER_WORKSPACE`;
});
