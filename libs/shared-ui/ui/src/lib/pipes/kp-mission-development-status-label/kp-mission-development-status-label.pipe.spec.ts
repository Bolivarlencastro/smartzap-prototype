import { KpMissionDevelopmentStatusLabelPipe } from './kp-mission-development-status-label.pipe';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('KpMissionDevelopmentStatusColorPipe', () => {
  let pipe: KpMissionDevelopmentStatusLabelPipe;

  beforeEach(() => {
    pipe = new KpMissionDevelopmentStatusLabelPipe();
  });

  describe('transform', () => {
    const cases: { status: DevelopmentStatus; label: string }[] = [
      { status: DevelopmentStatus.IN_PROGRESS, label: 'UI.KP_TAGS.DEVELOPMENT_CREATING' },
      { status: DevelopmentStatus.PROCESSING, label: 'UI.KP_TAGS.DEVELOPMENT_PROCESSING' },
      { status: DevelopmentStatus.IN_REVIEW, label: 'UI.KP_TAGS.DEVELOPMENT_AWAITING_REVIEW' },
      { status: DevelopmentStatus.DONE, label: 'UI.KP_TAGS.DEVELOPMENT_PUBLISHED' },
      { status: DevelopmentStatus.INACTIVATED, label: 'UI.KP_TAGS.DEVELOPMENT_INACTIVE' },
      { status: DevelopmentStatus.CLOSED, label: 'UI.KP_TAGS.DEVELOPMENT_FINISHED_EVENT' },
    ];

    test.each(cases)(
      'should return the the correct translation for the $status development status',
      ({ status, label }) => {
        expect(pipe.transform(status)).toBe(label);
      },
    );

    it('should return the value if it is not an development status', () => {
      expect(pipe.transform('INVALID_VALUE' as DevelopmentStatus)).toBe('INVALID_VALUE');
    });
  });
});
