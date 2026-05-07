import { LedEventItem } from '../models/led-event-item';
import { EventDateRangePipe } from './event-date-range.pipe';

describe('EventDateRangePipe', () => {
  describe('transform', () => {
    const pipe = new EventDateRangePipe();
    const separator = 'a';

    const cases = [
      {
        description: 'same day',
        item: { start_date: '2025-03-15T10:00:00', end_date: '2025-03-15T18:00:00' } as LedEventItem,
        expected: '03/15/2025',
      },
      {
        description: 'different days',
        item: { start_date: '2025-03-15T10:00:00', end_date: '2025-03-20T18:00:00' } as LedEventItem,
        expected: '15 a 03/20/2025',
      },
      {
        description: 'different separator',
        item: { start_date: '2025-03-15T10:00:00', end_date: '2025-03-20T18:00:00' } as LedEventItem,
        separator: '-',
        expected: '15 - 03/20/2025',
      },
    ];

    test.each(cases)(
      'should format correctly for $description',
      ({ item, expected, separator: testSeparator = separator }) => {
        expect(pipe.transform(item, testSeparator)).toBe(expected);
      },
    );
  });
});
