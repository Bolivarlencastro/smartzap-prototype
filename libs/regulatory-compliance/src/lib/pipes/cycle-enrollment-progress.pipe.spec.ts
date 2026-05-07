import { CycleEnrollmentProgressPipe } from './cycle-enrollment-progress.pipe';
import { EnrollmentCycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('CycleEnrollmentProgressPipe', () => {
  let pipe: CycleEnrollmentProgressPipe;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('May 25 2023 08:00:00 GMT-0300'));
    pipe = new CycleEnrollmentProgressPipe();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it(`should return 0 progress if status is disabled`, () => {
      const mockCycle: EnrollmentCycleDto = { status: 'DISABLED' } as EnrollmentCycleDto;

      expect(pipe.transform(mockCycle)).toBe(0);
    });

    it(`should return 100 progress if deadline is past the current date`, () => {
      jest.useFakeTimers().setSystemTime(new Date('02 Jul 2023 00:00:00 GMT-0300'));

      const mockCycle: EnrollmentCycleDto = { status: 'DISABLED' } as EnrollmentCycleDto;
      expect(pipe.transform(mockCycle)).toBe(0);
    });

    it('should return a percentage based on the past days between the creation date and deadline', () => {
      const expectedProgress = 50;
      const mockCycle: EnrollmentCycleDto = { deadline: '2023-05-30', createdDate: '2023-05-20' } as EnrollmentCycleDto;

      expect(pipe.transform(mockCycle)).toBe(expectedProgress);
    });
  });
});
