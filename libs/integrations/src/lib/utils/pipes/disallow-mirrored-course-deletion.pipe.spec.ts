import { AluraStatus } from '../../models';
import { DisallowMirroredCourseDeletionPipe } from './disallow-mirrored-course-deletion.pipe';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('DisallowMirroredCourseDeletionPipe', () => {
  const cases: any[] = [
    [[{ status: AluraStatus.PUBLISHED }, { status: AluraStatus.DISABLED }], false],
    [[{ status: AluraStatus.PUBLISHED }, { status: DevelopmentStatus.PROCESSING }], true],
  ];

  test.each(cases)('should return the correct value when the configuration is " %p "', (items, expectedValue) => {
    const pipe = new DisallowMirroredCourseDeletionPipe();
    const result = pipe.transform(items);
    expect(result).toBe(expectedValue);
  });
});
