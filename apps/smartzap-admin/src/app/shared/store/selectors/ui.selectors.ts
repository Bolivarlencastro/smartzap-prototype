import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUI from '../reducers/ui.reducer';

export const selectUIState = createFeatureSelector<fromUI.State>(fromUI.featureKey);

export const selectLanguages = createSelector(selectUIState, (state) => state.languages);

export const selectWorkspace = createSelector(selectUIState, (state) => state.selectedWorkspace);

export const selectWorkspaceName = createSelector(selectWorkspace, (workspace) => workspace?.name ?? '');

export const selectApplicationRoles = createSelector(selectUIState, (state) => state.apps);

export const selectNotifications = createSelector(selectUIState, (state) => state.notifications);
