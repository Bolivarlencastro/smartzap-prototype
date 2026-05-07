import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserWorkspaceRolesDialogComponent } from '../containers';
import {
  ApplicationsApi,
  SetUserApplicationRolesDto,
  UsersV2Api,
  WorkspaceApi,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { tap } from 'rxjs/operators';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Injectable({
  providedIn: 'root',
})
export class UserWorkspacesService {
  private dialogRef: MatDialogRef<UserWorkspaceRolesDialogComponent>;

  constructor(
    private dialog: MatDialog,
    private workspacesAPI: WorkspaceApi,
    private usersApi: UsersV2Api,
    private applicationsApi: ApplicationsApi,
    private messageService: KpMessageService,
  ) {}

  openRolesDialog() {
    this.dialogRef = this.dialog.open(UserWorkspaceRolesDialogComponent, { width: '512px', autoFocus: 'dialog' });
  }

  closeDialog() {
    this.dialogRef?.close();
  }

  loadAdminWorkspaces() {
    return this.workspacesAPI.getAdminWorkspaces();
  }

  loadUserWorkspaces(userId: string) {
    return this.usersApi.getUserWorkspaces(userId);
  }

  loadWorkspaceApplications(workspaceId: string) {
    return this.applicationsApi.getApplicationsWithRoles(workspaceId);
  }

  saveUserRoles(userId: string, roles: SetUserApplicationRolesDto[], workspaceId: string) {
    return this.usersApi
      .setUserApplicationRoles(userId, roles, workspaceId)
      .pipe(tap({ next: () => this.messageService.success(marker('USER.ROLES_SAVED')) }));
  }

  loadUserWorkspaceRoles(userId: string, workspaceId: string) {
    return this.usersApi
      .getUserApplicationRoles(userId, workspaceId)
      .pipe(tap({ error: () => this.messageService.error(marker('USER.FAILED_TO_LOAD_ROLES')) }));
  }

  openRemoveFromWorkspaceConfirmationDialog() {
    const deleteDialogRef = this.dialog.open(KpConfirmDialogComponent, {
      width: '600px',
    });

    deleteDialogRef.componentInstance.confirmMessage = marker('WORKSPACE_DIALOG.CONFIRM_REMOVE_WORKSPACE');
    deleteDialogRef.componentInstance.confirmTitle = marker('GENERAL.CONFIRM_ACTION');

    return deleteDialogRef.afterClosed();
  }

  removeUserFromWorkspace(userId: string, workspaceId: string) {
    return this.usersApi.removeUserFromWorkspace(userId, workspaceId).pipe(
      tap({
        next: () => this.messageService.success(marker('USER.DELETE_USER_SUCCESS')),
        error: () => this.messageService.error(marker('USER.DELETE_USER_ERROR')),
      }),
    );
  }
}
