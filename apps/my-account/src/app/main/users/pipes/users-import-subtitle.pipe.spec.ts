import { UsersImportSubtitlePipe } from './users-import-subtitle.pipe';

describe('UsersImportSubtitlePipe', () => {
  let pipe: UsersImportSubtitlePipe;

  beforeAll(() => {
    pipe = new UsersImportSubtitlePipe();
  });

  it('should return the correct subtitle for "selectRoles"', () => {
    expect(pipe.transform('selectRoles')).toBe('USERS.ROLES_DIALOG.SUBTITLE.ROLES');
  });

  it('should return the correct subtitle for "selectFile"', () => {
    expect(pipe.transform('selectFile')).toBe('USERS.ROLES_DIALOG.SUBTITLE.FILE');
  });
});
