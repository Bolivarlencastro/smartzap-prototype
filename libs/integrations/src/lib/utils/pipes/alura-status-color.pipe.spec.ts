import { AluraStatus } from '../../models';
import { AluraStatusColorPipe } from './alura-status-color.pipe';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('AluraStatusColorPipe', () => {
  let pipe: AluraStatusColorPipe;

  beforeEach(() => {
    pipe = new AluraStatusColorPipe();
  });

  describe('transform', () => {
    const cases: { status: AluraStatus | DevelopmentStatus; color: string }[] = [
      { status: AluraStatus.PUBLISHED, color: '#47AB0A' },
      { status: AluraStatus.DISABLED, color: '#CCCCCC' },
      { status: DevelopmentStatus.IN_PROGRESS, color: '#ff7152' },
      { status: DevelopmentStatus.PROCESSING, color: '#e1b258' },
    ];

    test.each(cases)(
      'should return the the correct status color for the $status Alura or development status',
      ({ status, color }) => {
        expect(pipe.transform(status)).toBe(color);
      },
    );
  });
});
