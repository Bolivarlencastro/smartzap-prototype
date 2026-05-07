import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import * as BatchActionsActions from './batch-actions.actions';
import { BatchAction, BatchActionsViewModel } from '@keeps-platform-frontend-workspace/kp-keeps';
import { globalSettingsFeature } from '@app/shared/store';

export const BATCH_ACTIONS_FEATURE_NAME = 'batchActions';

export interface BatchActionsFeatureState {
  isTotalSelected: boolean;
}

export const batchActionsInitialState: BatchActionsFeatureState = {
  isTotalSelected: false,
};

export const batchActionsReducer = createReducer(
  batchActionsInitialState,

  on(
    BatchActionsActions.toggleTotalSelection,
    (state, { isTotalSelected }): BatchActionsFeatureState => ({ ...state, isTotalSelected }),
  ),

  on(BatchActionsActions.resetState, (): BatchActionsFeatureState => batchActionsInitialState),
);

export const batchActionsFeature = createFeature({
  name: BATCH_ACTIONS_FEATURE_NAME,
  reducer: batchActionsReducer,
  extraSelectors: ({ selectIsTotalSelected }) => ({
    selectViewModel: createSelector(
      selectIsTotalSelected,
      globalSettingsFeature.selectBlockReEnrollment,
      (isTotalSelected, blockReEnrollment): BatchActionsViewModel => {
        const actions: BatchAction[] = [
          'APPROVE_ENROLLMENT',
          'REJECT_CERTIFICATE',
          'RESTART_ENROLLMENT',
          'GOAL_DATE_ENROLLMENT',
          'DELETE_ENROLLMENT',
        ];

        if (!blockReEnrollment) {
          actions.splice(3, 0, 'RE_ENROLL_ENROLLMENT');
        }

        return { actions, isTotalSelected };
      },
    ),
  }),
});
