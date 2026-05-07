import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UsersImportService } from './users-import.service';
import { MyAccountV2Client, SetUserApplicationRolesDto, UsersApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, of } from 'rxjs';
import { UsersImportDialogComponent } from 'app/main/users/containers';
import { Chance } from 'chance';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

describe('UsersImportService', () => {
  let service: UsersImportService;
  let dialogMock: jest.Mocked<MatDialog>;
  let usersApiMock: jest.Mocked<UsersApi>;
  let matDialogRef: jest.Mocked<MatDialogRef<any>>;
  let myAccountClientMock: jest.Mocked<MyAccountV2Client>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  const chance = new Chance();

  beforeEach(() => {
    matDialogRef = { afterClosed: jest.fn().mockReturnValue(of(EMPTY)), close: jest.fn() } as unknown as jest.Mocked<
      MatDialogRef<any>
    >;

    dialogMock = {
      open: jest.fn().mockReturnValue(matDialogRef),
    } as unknown as jest.Mocked<MatDialog>;

    usersApiMock = {
      importUsersByFile: jest.fn().mockReturnValue(of({ imported: [], errors: [] })),
    } as unknown as jest.Mocked<UsersApi>;

    myAccountClientMock = { get: jest.fn().mockReturnValue(of([])) } as unknown as jest.Mocked<MyAccountV2Client>;

    messageServiceMock = { success: jest.fn(), error: jest.fn() } as unknown as jest.Mocked<KpMessageService>;

    service = new UsersImportService(dialogMock, usersApiMock, myAccountClientMock, messageServiceMock);
  });

  it('should open the import dialog', () => {
    service.openDialog();

    expect(dialogMock.open).toHaveBeenCalledWith(UsersImportDialogComponent, { width: '512px', autoFocus: 'dialog' });
  });

  it('should close the import dialog', () => {
    service.openDialog();

    service.closeDialog();

    expect(matDialogRef.close).toHaveBeenCalled();
  });

  it('should list the user imports', (done) => {
    service.listUserImports().subscribe(() => {
      expect(myAccountClientMock.get).toHaveBeenCalledWith('/user-imports');
      done();
    });
  });

  it('should list the user import errors', (done) => {
    const importId = chance.guid();

    service.listImportErrors(importId).subscribe(() => {
      expect(myAccountClientMock.get).toHaveBeenCalledWith(`/user-imports/${importId}/errors`);
      done();
    });
  });

  describe('importUsers', () => {
    it('should import users from the selected file with the defined roles', (done) => {
      const file = new File([''], 'test.csv', { type: 'text/csv' });
      const app1Roles = [chance.guid(), chance.guid()];
      const app2Roles = [chance.guid(), chance.guid()];
      const expectedRoles = [...app1Roles, ...app2Roles];
      const roles: SetUserApplicationRolesDto[] = [
        {
          applicationId: chance.guid(),
          roles: app1Roles,
        },
        { applicationId: chance.guid(), roles: app2Roles },
      ];

      service.setImportFile(file);
      service.importUsers(roles, true).subscribe(() => {
        expect(usersApiMock.importUsersByFile).toHaveBeenCalledWith(file, expectedRoles, true);
        done();
      });
    });
  });
});
