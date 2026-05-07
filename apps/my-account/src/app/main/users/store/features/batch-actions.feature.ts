import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { BatchAction, BatchActionsViewModel } from '@keeps-platform-frontend-workspace/kp-keeps';
import { BatchActionsActions } from '../actions';

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
    selectViewModel: createSelector(selectIsTotalSelected, (isTotalSelected): BatchActionsViewModel => {
      const actions: BatchAction[] = ['INVITE_USERS', 'ACTIVATE_USERS', 'DEACTIVATE_USERS'];

      return { actions, isTotalSelected };
    }),
  }),
});
