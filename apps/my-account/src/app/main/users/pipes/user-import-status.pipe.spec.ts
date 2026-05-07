import { UserImportStatusPipe } from './user-import-status.pipe';
import { USER_IMPORT_STATUS } from '../user-import-types';

describe('UserImportStatusPipe', () => {
  let pipe: UserImportStatusPipe;

  beforeEach(() => {
    pipe = new UserImportStatusPipe();
  });

  describe('transform should map each status to the expected translation key', () => {
    const CASES: Array<[USER_IMPORT_STATUS, string]> = [
      [USER_IMPORT_STATUS.COMPLETED, 'USERS.IMPORT_STATUS.COMPLETED'],
      [USER_IMPORT_STATUS.COMPLETED_WITH_ERRORS, 'USERS.IMPORT_STATUS.COMPLETED_WITH_ERRORS'],
      [USER_IMPORT_STATUS.CONSOLIDATING, 'USERS.IMPORT_STATUS.PROCESSING'],
      [USER_IMPORT_STATUS.FAILED, 'USERS.IMPORT_STATUS.FAILED'],
      [USER_IMPORT_STATUS.PENDING, 'USERS.IMPORT_STATUS.PENDING'],
      [USER_IMPORT_STATUS.PROCESSING, 'USERS.IMPORT_STATUS.PROCESSING'],
      [USER_IMPORT_STATUS.READING, 'USERS.IMPORT_STATUS.PROCESSING'],
    ];

    it.each(CASES)('status %s should map to %s translation key', (status, expected) => {
      const result = pipe.transform(status);
      expect(result).toBe(expected);
    });
  });

  it('should fallback to the original status when mapping is missing', () => {
    const unknownStatus = 'UNKNOWN_STATUS' as unknown as USER_IMPORT_STATUS;
    const result = pipe.transform(unknownStatus);
    expect(result).toBe('UNKNOWN_STATUS');
  });
});
