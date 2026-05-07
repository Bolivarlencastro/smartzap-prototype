import { UserWorkspaceDialogViewMode, UserWorkspacesDialogViewModel } from 'app/main/users/users.types';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { UserWorkspacesActions } from '../actions';
import {
  ApplicationWithRoles,
  UserApplicationRoles,
  WorkspaceListDto,
} from '@keeps-platform-frontend-workspace/kp-keeps';

export interface UserWorkspacesState extends EntityState<WorkspaceListDto> {
  isLoading: boolean;
  isError: boolean;
  viewMode: UserWorkspaceDialogViewMode;
  selectedWorkspaceId: string | undefined;
  adminWorkspaces: WorkspaceListDto[];
  workspaceApplications: ApplicationWithRoles[];
  userApplicationRolesInWorkspace: UserApplicationRoles[];
  loadingWorkspaceRoles: boolean;
  loadingWorkspaceApplications: boolean;
  isSaving: boolean;
}

export const userWorkspacesAdapter: EntityAdapter<WorkspaceListDto> = createEntityAdapter<WorkspaceListDto>();

export const userWorkspacesInitialState: UserWorkspacesState = userWorkspacesAdapter.getInitialState({
  isLoading: true,
  isError: false,
  viewMode: 'selectRoles',
  selectedWorkspaceId: undefined,
  adminWorkspaces: [],
  workspaceApplications: [],
  userApplicationRolesInWorkspace: [],
  loadingWorkspaceRoles: false,
  loadingWorkspaceApplications: false,
  isSaving: false,
});

const userWorkspacesReducer = createReducer(
  userWorkspacesInitialState,

  on(UserWorkspacesActions.resetState, (): UserWorkspacesState => userWorkspacesInitialState),

  on(UserWorkspacesActions.loadUserWorkspacesSuccess, (_state, { workspaces }): UserWorkspacesState => {
    return userWorkspacesAdapter.setAll(workspaces, {
      ...userWorkspacesInitialState,
      isLoading: false,
      isError: false,
    });
  }),

  on(UserWorkspacesActions.loadUserWorkspacesFailure, (state): UserWorkspacesState => {
    return { ...state, isLoading: false, isError: true };
  }),

  on(UserWorkspacesActions.openAddWorkspaceDialog, (state): UserWorkspacesState => {
    return { ...state, selectedWorkspaceId: undefined, viewMode: 'selectWorkspace' };
  }),

  on(UserWorkspacesActions.openEditWorkspaceDialog, (state, { workspaceId }): UserWorkspacesState => {
    return { ...state, viewMode: 'selectRoles', selectedWorkspaceId: workspaceId };
  }),

  on(UserWorkspacesActions.loadAdminWorkspacesSuccess, (state, { workspaces }): UserWorkspacesState => {
    return { ...state, adminWorkspaces: workspaces };
  }),

  on(UserWorkspacesActions.selectWorkspace, (state, { workspaceId }): UserWorkspacesState => {
    return { ...state, selectedWorkspaceId: workspaceId, viewMode: 'selectRoles' };
  }),

  on(UserWorkspacesActions.loadWorkspaceApplications, (state): UserWorkspacesState => {
    return { ...state, loadingWorkspaceApplications: true };
  }),

  on(UserWorkspacesActions.loadWorkspaceApplicationsSuccess, (state, { applications }): UserWorkspacesState => {
    return {
      ...state,
      workspaceApplications: applications,
      loadingWorkspaceApplications: false,
    };
  }),

  on(UserWorkspacesActions.loadWorkspaceUserRoles, (state): UserWorkspacesState => {
    return { ...state, loadingWorkspaceRoles: true };
  }),

  on(UserWorkspacesActions.loadWorkspaceUserRolesSuccess, (state, { roles }): UserWorkspacesState => {
    return { ...state, userApplicationRolesInWorkspace: roles, loadingWorkspaceRoles: false };
  }),

  on(UserWorkspacesActions.saveRoles, (state): UserWorkspacesState => {
    return { ...state, isSaving: true };
  }),

  on(UserWorkspacesActions.removeUserFromWorkspaceSuccess, (state, { workspaceId }): UserWorkspacesState => {
    return userWorkspacesAdapter.removeOne(workspaceId, state);
  }),
);

export const userWorkspacesFeature = createFeature({
  name: 'userWorkspaces',
  reducer: userWorkspacesReducer,
  extraSelectors: ({ selectUserWorkspacesState }) => ({
    selectViewModel: createSelector(
      selectUserWorkspacesState,
      (state): UserWorkspacesDialogViewModel => ({
        viewMode: state.viewMode,
        isLoading: state.isLoading,
        isError: state.isError,
        workspaceApplications: state.workspaceApplications,
        userApplicationRolesInWorkspace: state.userApplicationRolesInWorkspace,
        showRolesForm: !state.loadingWorkspaceRoles && !state.loadingWorkspaceApplications,
        isSaving: state.isSaving,
      }),
    ),
    selectUserWorkspaces: createSelector(
      userWorkspacesAdapter.getSelectors(selectUserWorkspacesState).selectAll,
      (userWorkspaces) => userWorkspaces,
    ),
    adminWorkspacesLoaded: createSelector(selectUserWorkspacesState, (state) => state.adminWorkspaces?.length > 0),
  }),
});

export const selectFilteredAdminWorkspaces = createSelector(
  userWorkspacesFeature.selectAdminWorkspaces,
  userWorkspacesFeature.selectUserWorkspaces,
  (adminWorkspaces, userWorkspaces) => {
    const userWorkspaceIds = userWorkspaces.map((workspace) => workspace.id);
    return adminWorkspaces.filter((workspace) => !userWorkspaceIds.includes(workspace.id));
  },
);
