import { KpNumberToTimePipe } from './kp-number-to-time.pipe';

describe('KpNumberToTimePipe', () => {
  let pipe: KpNumberToTimePipe;

  beforeEach(() => {
    pipe = new KpNumberToTimePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  [
    { hoursFraction: 0.5270773069946854, expected: '0h 32m' },
    { hoursFraction: 1.016666667, expected: '1h 01m' },
    { hoursFraction: 23.983333333, expected: '23h 59m' },
  ].forEach(({ hoursFraction: hoursFraction, expected }) => {
    it(`should format hour fraction ${hoursFraction} to ${expected}`, () => {
      const result = pipe.transform(hoursFraction);
      expect(result).toBe(expected);
    });
  });

  [
    { seconds: 5000, expected: '1h 23m' },
    { seconds: 60, expected: '0h 01m' },
    { seconds: 3600, expected: '1h 00m' },
    { seconds: 3600, expected: '1h 00m' },
    { seconds: 86340, expected: '23h 59m' },
  ].forEach(({ seconds, expected }) => {
    it(`should format ${seconds} seconds to be ${expected}`, () => {
      const result = pipe.transform(seconds, 's');
      expect(result).toBe(expected);
    });
  });

  [null, undefined, -1].forEach((value) => {
    it('should return "0h 00m" when invalid values is given', () => {
      const result = pipe.transform(value as any);
      expect(result).toBe('0h 00m');
    });
  });
});
