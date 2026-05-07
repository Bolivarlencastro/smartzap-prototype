import { DateRangePipe } from './date-range.pipe';
import { format } from 'date-fns';

jest.mock('date-fns', () => ({
  format: jest.fn(),
}));

describe('DateRangePipe', () => {
  let pipe: DateRangePipe;
  const mockFormat = format as jest.Mock;

  beforeEach(() => {
    pipe = new DateRangePipe();
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string when value is null/undefined', () => {
    expect(pipe.transform(undefined as any)).toBe('');
    expect(pipe.transform(null as any)).toBe('');
    expect(mockFormat).not.toHaveBeenCalled();
  });

  it('should format the date range (start and end) using date-fns', () => {
    const start = new Date(2025, 9, 10, 9, 30); // Oct 10, 2025 09:30 local time
    const end = new Date(2025, 9, 10, 11, 0); // Oct 10, 2025 11:00 local time

    const date = { start_at: start.getTime(), end_at: end.getTime() } as any;

    // First call formats start with the pattern 'EEE, P, HH:mm'
    // Second call formats end with the pattern 'HH:mm'
    mockFormat.mockImplementationOnce(() => 'START_FORMATTED').mockImplementationOnce(() => 'END_FORMATTED');

    const result = pipe.transform(date);

    expect(result).toBe('START_FORMATTED - END_FORMATTED');
    expect(mockFormat).toHaveBeenCalledTimes(2);

    const firstCallArgs = mockFormat.mock.calls[0];
    const secondCallArgs = mockFormat.mock.calls[1];

    expect(firstCallArgs[0]).toBeInstanceOf(Date);
    expect((firstCallArgs[0] as Date).getTime()).toBe(start.getTime());
    expect(firstCallArgs[1]).toBe('EEE, P, HH:mm');

    expect(secondCallArgs[0]).toBeInstanceOf(Date);
    expect((secondCallArgs[0] as Date).getTime()).toBe(end.getTime());
    expect(secondCallArgs[1]).toBe('HH:mm');
  });
});
