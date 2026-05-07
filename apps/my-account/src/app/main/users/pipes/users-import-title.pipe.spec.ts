import { UsersImportTitlePipe } from './users-import-title.pipe';

describe('UsersImportTitlePipe', () => {
  let pipe: UsersImportTitlePipe;

  beforeAll(() => {
    pipe = new UsersImportTitlePipe();
  });

  it('should return the correct title for "selectRoles"', () => {
    expect(pipe.transform('selectRoles')).toBe('USERS.ROLES_DIALOG.TITLE.ROLES');
  });

  it('should return the correct title for "selectFile"', () => {
    expect(pipe.transform('selectFile')).toBe('USERS.ROLES_DIALOG.TITLE.FILE');
  });
});
