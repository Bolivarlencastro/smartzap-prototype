import { BatchEnrollmentDialogTitlePipe } from './batch-enrollment-dialog-title.pipe';

describe('BatchEnrollmentDialogTitlePipe', () => {
  let pipe: BatchEnrollmentDialogTitlePipe;

  beforeEach(() => {
    pipe = new BatchEnrollmentDialogTitlePipe();
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return EVENTS_TITLE when enrollment type is event', () => {
    const result = pipe.transform('event');
    expect(result).toBe('BATCH_ENROLLMENT.EVENTS_TITLE');
  });

  it('should return TITLE when enrollment type is mission', () => {
    const result = pipe.transform('mission');
    expect(result).toBe('BATCH_ENROLLMENT.TITLE');
  });

  it('should return TITLE when enrollment type is learning-trail', () => {
    const result = pipe.transform('learning-trail');
    expect(result).toBe('BATCH_ENROLLMENT.TITLE');
  });
});
