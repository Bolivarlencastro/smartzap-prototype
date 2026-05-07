import { HasReachedVacancyLimitPipe } from './has-reached-vacancy-limit.pipe';
import { LearnContentListItem } from '../models/learn-content-list-item';

describe('HasReachedVacancyLimitPipe', () => {
  describe('transform', () => {
    const pipe = new HasReachedVacancyLimitPipe();

    const cases: any[] = [
      ['should return false when seats is null', { meta: { seats: null, enrolledCount: 5 } }, false],
      ['should return false when seats is undefined', { meta: { seats: undefined, enrolledCount: 5 } }, false],
      ['should return false when seats is 0', { meta: { seats: 0, enrolledCount: 5 } }, false],
      ['should return false when enrolledCount is less than seats', { meta: { seats: 10, enrolledCount: 5 } }, false],
      [
        'should return false when enrolledCount is equal to seats minus one',
        { meta: { seats: 10, enrolledCount: 9 } },
        false,
      ],
      ['should return true when enrolledCount equals seats', { meta: { seats: 10, enrolledCount: 10 } }, true],
      ['should return true when enrolledCount exceeds seats', { meta: { seats: 10, enrolledCount: 15 } }, true],
    ];

    test.each(cases)('%s', (_, item: any, expectedValue: boolean) => {
      expect(pipe.transform(item as LearnContentListItem)).toBe(expectedValue);
    });
  });
});
