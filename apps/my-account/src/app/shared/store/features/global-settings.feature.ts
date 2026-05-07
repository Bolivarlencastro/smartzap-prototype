import { JobModel } from '@app/main/job-management/models';
import { CustomMenuItem, Workspace } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import * as GlobalSettingsActions from '../actions/global-settings.actions';

export interface GlobalSettingsFeatureState {
  workspace: Workspace;
  customMenuItems: CustomMenuItem[];
  jobs: JobModel[];
  hasMultipleWorkspaces: boolean;
}

export const globalSettingsInitialState: GlobalSettingsFeatureState = {
  workspace: null,
  customMenuItems: [],
  jobs: [],
  hasMultipleWorkspaces: true,
};

const globalSettingsReducer = createReducer(
  globalSettingsInitialState,

  on(
    GlobalSettingsActions.setSettingsOnInit,
    (state, { workspace }): GlobalSettingsFeatureState => ({
      ...state,
      workspace,
      customMenuItems: workspace.custom_menu_items,
    }),
  ),

  on(
    GlobalSettingsActions.updateJobs,
    (state, { jobs }): GlobalSettingsFeatureState => ({
      ...state,
      jobs,
    }),
  ),

  on(
    GlobalSettingsActions.setCustomMenuItems,
    (state, { customMenuItems }): GlobalSettingsFeatureState => ({
      ...state,
      customMenuItems,
    }),
  ),

  on(
    GlobalSettingsActions.updateWorkspaceSuccess,
    (state, { workspace }): GlobalSettingsFeatureState => ({
      ...state,
      workspace: { ...state.workspace, ...workspace },
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
  extraSelectors: ({ selectWorkspace }) => ({
    selectBuildedWorkspace: createSelector(selectWorkspace, (workspace): any => {
      const cacheBuster = new Date().getTime().toString();
      const logo_url = workspace?.logo_url ? workspace?.logo_url.concat('?', cacheBuster) : workspace?.logo_url;
      const icon_url = workspace?.icon_url ? workspace?.icon_url.concat('?', cacheBuster) : workspace?.icon_url;

      return {
        ...workspace,
        logo_url,
        icon_url,
      };
    }),
  }),
});
