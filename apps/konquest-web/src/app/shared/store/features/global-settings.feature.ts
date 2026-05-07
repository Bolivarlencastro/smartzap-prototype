import { createFeature, createReducer, on } from '@ngrx/store';
import { GlobalSettingsActions } from '../actions';
import { CustomMenuItem } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface GlobalSettingsFeatureState {
  blockReEnrollment: boolean;
  customMenuItems: CustomMenuItem[];
  hasMultipleWorkspaces: boolean;
}

export const globalSettingsInitialState: GlobalSettingsFeatureState = {
  blockReEnrollment: false,
  customMenuItems: [],
  hasMultipleWorkspaces: true,
};

const globalSettingsReducer = createReducer(
  globalSettingsInitialState,

  on(GlobalSettingsActions.loadWorkspaceDetailsSuccess, (state, { workspace }): GlobalSettingsFeatureState => {
    return {
      ...state,
      blockReEnrollment: workspace.block_reenrollment,
      customMenuItems: workspace.custom_menu_items,
    };
  }),

  on(
    GlobalSettingsActions.updateBlockReEnrollment,
    (state, { blockReEnrollment }): GlobalSettingsFeatureState => ({ ...state, blockReEnrollment }),
  ),

  on(
    GlobalSettingsActions.loadWorkspacesSuccess,
    (state, { hasMultipleWorkspaces }): GlobalSettingsFeatureState => ({ ...state, hasMultipleWorkspaces }),
  ),
);

export const globalSettingsFeature = createFeature({
  name: 'globalSettingsFeature',
  reducer: globalSettingsReducer,
});
