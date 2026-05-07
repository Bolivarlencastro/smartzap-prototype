import { createFeature, createReducer, on } from '@ngrx/store';
import { GlobalSettingsActions } from '../actions';
import { CustomMenuItem } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface GlobalSettingsFeatureState {
  customMenuItems: CustomMenuItem[];
  hasMultipleWorkspaces: boolean;
}

export const globalSettingsInitialState: GlobalSettingsFeatureState = {
  customMenuItems: [],
  hasMultipleWorkspaces: true,
};

const globalSettingsReducer = createReducer(
  globalSettingsInitialState,

  on(
    GlobalSettingsActions.setSettingsOnInit,
    (state, { workspace }): GlobalSettingsFeatureState => ({
      ...state,
      customMenuItems: workspace.custom_menu_items,
    }),
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
