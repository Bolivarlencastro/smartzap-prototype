import { AluraCourseStatusPipe } from './alura-course-status.pipe';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { AluraStatus } from '../../models';

describe('AluraCourseStatusPipe', () => {
  let pipe: AluraCourseStatusPipe;

  beforeEach(() => {
    pipe = new AluraCourseStatusPipe();
  });

  describe('transform', () => {
    const cases: { status: DevelopmentStatus | AluraStatus; label: string }[] = [
      { status: AluraStatus.DISABLED, label: 'INTEGRATIONS.ALURA_STATUS.DISABLED' },
      { status: AluraStatus.PUBLISHED, label: 'INTEGRATIONS.ALURA_STATUS.PUBLISHED' },
      { status: DevelopmentStatus.DONE, label: 'INTEGRATIONS.ALURA_STATUS.PUBLISHED' },
      { status: DevelopmentStatus.IN_REVIEW, label: 'UI.KP_TAGS.DEVELOPMENT_AWAITING_REVIEW' },
      { status: DevelopmentStatus.INACTIVATED, label: 'UI.KP_TAGS.DEVELOPMENT_INACTIVE' },
    ];

    test.each(cases)(
      'should return the the correct translation for the $status Alura or development status',
      ({ status, label }) => {
        expect(pipe.transform(status)).toBe(label);
      },
    );

    it('should return the value if it is not an Alura or development status', () => {
      expect(pipe.transform('INVALID_VALUE' as DevelopmentStatus)).toBe('INVALID_VALUE');
    });
  });
});
