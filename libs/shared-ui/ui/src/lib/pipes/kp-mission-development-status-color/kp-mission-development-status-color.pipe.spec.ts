import { KpMissionDevelopmentStatusColorPipe } from './kp-mission-development-status-color.pipe';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('KpMissionDevelopmentStatusColorPipe', () => {
  let pipe: KpMissionDevelopmentStatusColorPipe;

  beforeEach(() => {
    pipe = new KpMissionDevelopmentStatusColorPipe();
  });

  describe('transform', () => {
    const cases: { status: DevelopmentStatus; color: string }[] = [
      { status: DevelopmentStatus.IN_PROGRESS, color: '#ff7152' },
      { status: DevelopmentStatus.PROCESSING, color: '#e1b258' },
      { status: DevelopmentStatus.IN_REVIEW, color: '#ff9706' },
      { status: DevelopmentStatus.DONE, color: '#01d89b' },
      { status: DevelopmentStatus.INACTIVATED, color: '#b5b5b5' },
      { status: DevelopmentStatus.CLOSED, color: '#ff3700' },
    ];

    test.each(cases)(
      'should return the the correct status color for the $status development status',
      ({ status, color }) => {
        expect(pipe.transform(status)).toBe(color);
      },
    );

    it('should return the value if it is not an development status', () => {
      expect(pipe.transform('INVALID_VALUE' as DevelopmentStatus)).toBe('INVALID_VALUE');
    });
  });
});
