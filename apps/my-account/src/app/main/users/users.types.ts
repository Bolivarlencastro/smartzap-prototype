import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { UserSearchFilterOption, UserSearchRoleFilterGroup } from '@app/shared/model';
import { ApplicationWithRoles, UserApplicationRoles, UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface UsersFilter {
  sort?: Sort;
  pageEvent?: PageEvent;
  search?: string;
  roleId?: string[];
  status?: boolean;
  jobPositions?: string[];
  activityAreas?: string[];
  directors?: string[];
  managers?: string[];
  leadersId?: string[];
}

export interface UpdateUserStatusDto {
  status: boolean;
}

export type UserDetailAction =
  | 'editUser'
  | 'sendInvitation'
  | 'resetPassword'
  | 'close'
  | 'delete'
  | 'save'
  | 'importData';

export type UserDetailViewModel = {
  currentUser: UserProfile | undefined;
  editing: boolean;
  loading: boolean;
  activityAreas: string[];
  directors: string[];
  managers: string[];
  filteredLeaders: UserProfile[];
};

export type UserRolesViewModel = {
  applications: ApplicationWithRoles[];
  userRoles: UserApplicationRoles[];
  userRolesLoaded: boolean;
  applicationsLoaded: boolean;
};

export type UsersImportDialogViewModel = {
  viewMode: UsersImportDialogViewMode;
  isSaving: boolean;
  showTemporaryPasswordToggle: boolean;
};

export type UsersImportDialogViewMode = 'selectRoles' | 'selectFile';

export interface UserFilterLists {
  roles: UserSearchRoleFilterGroup[];
  statuses: UserSearchFilterOption[];
  jobPositions: UserSearchFilterOption[];
  leaders: UserSearchFilterOption[];
  activityAreas: string[];
  directors: string[];
  managers: string[];
}

export type UserWorkspaceDialogViewMode = 'selectWorkspace' | 'selectRoles';

export type UserWorkspacesDialogViewModel = {
  viewMode: UserWorkspaceDialogViewMode;
  isLoading: boolean;
  isError: boolean;
  workspaceApplications: ApplicationWithRoles[];
  userApplicationRolesInWorkspace: UserApplicationRoles[];
  showRolesForm: boolean;
  isSaving: boolean;
};
