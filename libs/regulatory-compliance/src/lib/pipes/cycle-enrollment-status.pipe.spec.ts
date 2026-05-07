import { CycleEnrollmentStatusPipe } from './cycle-enrollment-status.pipe';
import { EnrollmentCycleStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('CycleEnrollmentStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new CycleEnrollmentStatusPipe();
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    const pipe = new CycleEnrollmentStatusPipe();

    const cases: { label: string; enrollmentStatus: EnrollmentCycleStatus }[] = [
      {
        label: 'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.STATUS.EXPIRED',
        enrollmentStatus: 'EXPIRED',
      },
      {
        label: 'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.STATUS.EXPIRING',
        enrollmentStatus: 'EXPIRING',
      },
      { label: 'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.STATUS.IN_PROGRESS', enrollmentStatus: 'IN_PROGRESS' },
      { label: 'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.STATUS.RENEWED', enrollmentStatus: 'COMPLETED' },
      { label: 'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.STATUS.INACTIVE', enrollmentStatus: 'DISABLED' },
    ];

    test.each(cases)(
      'should return the translation key $label for cycle status $enrollmentStatus',
      ({ label, enrollmentStatus }) => {
        const translation: string = pipe.transform(enrollmentStatus);

        expect(translation).toBe(label);
      },
    );

    it('should return the informed value if not a valid translation key', () => {
      const translation: string = pipe.transform('invalid_status' as EnrollmentCycleStatus);

      expect(translation).toBe('invalid_status');
    });
  });
});
