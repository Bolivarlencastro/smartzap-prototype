import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WorkspacesReducers } from '../reducers';

const workspacesState = createFeatureSelector<WorkspacesReducers.WorkspacesState>(
  WorkspacesReducers.workspacesFeatureKey,
);

export const getWorkspaces = createSelector(workspacesState, WorkspacesReducers.selectAll);

export const isLoading = createSelector(workspacesState, (state) => state.loading);

export const getViewMode = createSelector(workspacesState, (state) => state.viewMode);

export const canUseListView = createSelector(workspacesState, (state) => state.canUseListView);

export const isEmpty = createSelector(
  getWorkspaces,
  isLoading,
  (workspaces, isLoading) => !isLoading && !workspaces.length,
);
