import { EMPTY, of, throwError } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserWorkspacesService } from './user-workspaces.service';
import { ApplicationsApi, UsersV2Api, WorkspaceApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';

describe('UserWorkspacesService', () => {
  let service: UserWorkspacesService;
  let dialogMock: jest.Mocked<MatDialog>;
  let workspacesApiMock: jest.Mocked<WorkspaceApi>;
  let usersApiMock: jest.Mocked<UsersV2Api>;
  let applicationsApiMock: jest.Mocked<ApplicationsApi>;
  let messageServiceMock: jest.Mocked<KpMessageService>;

  beforeEach(() => {
    const dialogRefMock = {
      close: jest.fn(),
      afterClosed: jest.fn().mockReturnValue(of(true)),
      componentInstance: {} as jest.Mocked<MatDialogRef<any>>,
    };

    dialogMock = {
      open: jest.fn().mockReturnValue(dialogRefMock),
    } as unknown as jest.Mocked<MatDialog>;

    workspacesApiMock = {
      getAdminWorkspaces: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<WorkspaceApi>;

    usersApiMock = {
      getUserWorkspaces: jest.fn().mockReturnValue(of(EMPTY)),
      setUserApplicationRoles: jest.fn().mockReturnValue(of(EMPTY)),
      getUserApplicationRoles: jest.fn().mockReturnValue(of(EMPTY)),
      removeUserFromWorkspace: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<UsersV2Api>;

    applicationsApiMock = {
      getApplicationsWithRoles: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<ApplicationsApi>;

    messageServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn(),
    } as unknown as jest.Mocked<KpMessageService>;

    service = new UserWorkspacesService(
      dialogMock,
      workspacesApiMock,
      usersApiMock,
      applicationsApiMock,
      messageServiceMock,
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Dialogs', () => {
    it('should open roles dialog with expected config', () => {
      service.openRolesDialog();
      expect(dialogMock.open).toHaveBeenCalled();
      const [component, config] = dialogMock.open.mock.calls[0];
      expect(config).toEqual({ width: '512px', autoFocus: 'dialog' });
      expect(component).toBeDefined();
    });

    it('should close dialog when closeDialog is called', () => {
      service.openRolesDialog();
      const dialogRef = dialogMock.open.mock.results[0].value;
      service.closeDialog();
      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should open remove confirmation dialog, set titles and return afterClosed$', (done) => {
      const result$ = service.openRemoveFromWorkspaceConfirmationDialog();

      expect(dialogMock.open).toHaveBeenCalledWith(KpConfirmDialogComponent, { width: '600px' });

      const dialogRef = dialogMock.open.mock.results[0].value;
      expect(dialogRef.componentInstance.confirmMessage).toBe('WORKSPACE_DIALOG.CONFIRM_REMOVE_WORKSPACE');
      expect(dialogRef.componentInstance.confirmTitle).toBe('GENERAL.CONFIRM_ACTION');

      result$.subscribe({
        next: (val) => {
          expect(val).toBe(true);
          done();
        },
      });
    });
  });

  describe('Loaders', () => {
    it('should load admin workspaces', (done) => {
      service.loadAdminWorkspaces().subscribe({
        next: () => {
          expect(workspacesApiMock.getAdminWorkspaces).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should load user workspaces', (done) => {
      const userId = 'user-1';
      service.loadUserWorkspaces(userId).subscribe({
        next: () => {
          expect(usersApiMock.getUserWorkspaces).toHaveBeenCalledWith(userId);
          done();
        },
      });
    });

    it('should load workspace applications', (done) => {
      const wsId = 'ws-1';
      service.loadWorkspaceApplications(wsId).subscribe({
        next: () => {
          expect(applicationsApiMock.getApplicationsWithRoles).toHaveBeenCalledWith(wsId);
          done();
        },
      });
    });
  });

  describe('Roles operations', () => {
    it('should save user roles and show success message', (done) => {
      const userId = 'user-1';
      const workspaceId = 'ws-1';
      const roles: any[] = [{ application: 'app', roles: ['ADMIN'] }];

      service.saveUserRoles(userId, roles, workspaceId).subscribe({
        next: () => {
          expect(usersApiMock.setUserApplicationRoles).toHaveBeenCalledWith(userId, roles, workspaceId);
          expect(messageServiceMock.success).toHaveBeenCalledWith('USER.ROLES_SAVED');
          done();
        },
      });
    });

    it('should load user workspace roles successfully', (done) => {
      const userId = 'user-1';
      const workspaceId = 'ws-1';

      usersApiMock.getUserApplicationRoles.mockReturnValueOnce(of([]));

      service.loadUserWorkspaceRoles(userId, workspaceId).subscribe({
        next: () => {
          expect(usersApiMock.getUserApplicationRoles).toHaveBeenCalledWith(userId, workspaceId);
          expect(messageServiceMock.error).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should show error message when loading user workspace roles fails', (done) => {
      const userId = 'user-1';
      const workspaceId = 'ws-1';

      usersApiMock.getUserApplicationRoles.mockReturnValueOnce(throwError(() => new Error('fail')));

      service.loadUserWorkspaceRoles(userId, workspaceId).subscribe({
        next: () => {},
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('USER.FAILED_TO_LOAD_ROLES');
          done();
        },
      });
    });
  });

  describe('Remove user from workspace', () => {
    it('should remove user from workspace and show success', (done) => {
      const userId = 'user-1';
      const workspaceId = 'ws-1';
      usersApiMock.removeUserFromWorkspace.mockReturnValueOnce(of({} as any));

      service.removeUserFromWorkspace(userId, workspaceId).subscribe({
        next: () => {
          expect(usersApiMock.removeUserFromWorkspace).toHaveBeenCalledWith(userId, workspaceId);
          expect(messageServiceMock.success).toHaveBeenCalledWith('USER.DELETE_USER_SUCCESS');
          done();
        },
      });
    });

    it('should show error when remove user from workspace fails', (done) => {
      const userId = 'user-1';
      const workspaceId = 'ws-1';
      usersApiMock.removeUserFromWorkspace.mockReturnValueOnce(throwError(() => new Error('fail')));

      service.removeUserFromWorkspace(userId, workspaceId).subscribe({
        next: () => {},
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('USER.DELETE_USER_ERROR');
          done();
        },
      });
    });
  });
});
