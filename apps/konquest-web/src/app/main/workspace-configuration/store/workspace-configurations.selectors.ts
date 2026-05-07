import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromWorkspaceConfigurations from './workspace-configurations.reducer';
import { State } from './workspace-configurations.reducer';

export const selectState = createFeatureSelector<fromWorkspaceConfigurations.State>(
  fromWorkspaceConfigurations.workspaceConfigurationsKey,
);

export const selectWorkspaceConfigurations = createSelector(selectState, (state: State) => ({
  services: state?.services,
  settings: state?.settings,
}));

export const selectIsLoading = createSelector(selectState, (state: State) => state?.isLoading);

export const selectWorkspaceGeneralSettings = createSelector(selectState, (state) => state?.settings);

export const selectAllowListPublicCategories = createSelector(
  selectWorkspaceGeneralSettings,
  (state) => state?.allow_list_public_categories ?? false,
);

export const selectBlockReEnrollment = createSelector(
  selectWorkspaceGeneralSettings,
  (state) => state?.block_reenrollment ?? false,
);
