import { UserImportStatusColorPipe } from './user-import-status-color.pipe';
import { USER_IMPORT_STATUS } from '../user-import-types';
import { ACTIVITY_LOG_STATUS_TAG_COLOR } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('UserImportStatusColorPipe', () => {
  let pipe: UserImportStatusColorPipe;

  beforeEach(() => {
    pipe = new UserImportStatusColorPipe();
  });

  describe('transform should map each status to the expected color', () => {
    const CASES: Array<[USER_IMPORT_STATUS, string]> = [
      [USER_IMPORT_STATUS.COMPLETED, ACTIVITY_LOG_STATUS_TAG_COLOR.DONE],
      [USER_IMPORT_STATUS.COMPLETED_WITH_ERRORS, ACTIVITY_LOG_STATUS_TAG_COLOR.DONE_WITH_EXCEPTIONS],
      [USER_IMPORT_STATUS.CONSOLIDATING, ACTIVITY_LOG_STATUS_TAG_COLOR.PROCESSING],
      [USER_IMPORT_STATUS.FAILED, ACTIVITY_LOG_STATUS_TAG_COLOR.ERROR],
      [USER_IMPORT_STATUS.PENDING, ACTIVITY_LOG_STATUS_TAG_COLOR.CREATED],
      [USER_IMPORT_STATUS.PROCESSING, ACTIVITY_LOG_STATUS_TAG_COLOR.PROCESSING],
      [USER_IMPORT_STATUS.READING, ACTIVITY_LOG_STATUS_TAG_COLOR.PROCESSING],
    ];

    it.each(CASES)('status %s should map to %s color', (status, expected) => {
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
