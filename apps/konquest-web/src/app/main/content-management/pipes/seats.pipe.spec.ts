import { SeatsPipe } from './seats.pipe';
import { LearnContentListItem } from '../models/learn-content-list-item';

describe('SeatsPipe', () => {
  describe('transform', () => {
    const pipe = new SeatsPipe();

    const cases: any[] = [
      ['should return only enrolledCount when seats is null', { meta: { seats: null, enrolledCount: 5 } }, 5],
      ['should return only enrolledCount when seats is undefined', { meta: { seats: undefined, enrolledCount: 5 } }, 5],
      ['should return only enrolledCount when seats is 0', { meta: { seats: 0, enrolledCount: 5 } }, 5],
      ['should return "enrolledCount / seats" when seats exists', { meta: { seats: 10, enrolledCount: 5 } }, '5 / 10'],
      ['should return "0 / seats" when enrolledCount is 0', { meta: { seats: 10, enrolledCount: 0 } }, '0 / 10'],
      [
        'should return "enrolledCount / seats" when enrolledCount equals seats',
        { meta: { seats: 10, enrolledCount: 10 } },
        '10 / 10',
      ],
      [
        'should return "enrolledCount / seats" when enrolledCount exceeds seats',
        { meta: { seats: 10, enrolledCount: 15 } },
        '15 / 10',
      ],
    ];

    test.each(cases)('%s', (_, item: any, expectedValue: string | undefined) => {
      expect(pipe.transform(item as LearnContentListItem)).toBe(expectedValue);
    });
  });
});
