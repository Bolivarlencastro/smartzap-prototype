import { CycleEnrollmentStatusColorPipe } from './cycle-enrollment-status-color.pipe';
import { EnrollmentCycleStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('CycleEnrollmentStatusColorPipe', () => {
  it('create an instance', () => {
    const pipe = new CycleEnrollmentStatusColorPipe();
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    const cases: { color: string; enrollmentStatus: EnrollmentCycleStatus }[] = [
      {
        color: '#F43036',
        enrollmentStatus: 'EXPIRED',
      },
      {
        color: '#FF7A00',
        enrollmentStatus: 'EXPIRING',
      },
      { color: '#008FEC', enrollmentStatus: 'IN_PROGRESS' },
      { color: '#00B400', enrollmentStatus: 'COMPLETED' },
      { color: '#CCC', enrollmentStatus: 'DISABLED' },
    ];
    test.each(cases)(
      'should return the status color $color for cycle status $enrollmentStatus',
      ({ color, enrollmentStatus }) => {
        const pipe = new CycleEnrollmentStatusColorPipe();

        expect(pipe.transform(enrollmentStatus)).toBe(color);
      },
    );
  });
});
