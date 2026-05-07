import { KpDaysUntil } from './kp-days-until.pipe';

describe('KpDaysUntil', () => {
  let pipe: KpDaysUntil;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('May 25 2023 08:00:00 GMT-0300'));
    pipe = new KpDaysUntil();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should number of days until the provided date', () => {
      const pipe = new KpDaysUntil();

      expect(pipe.transform('2023-05-30')).toBe(5);
      expect(pipe.transform('2023-06-10')).toBe(16);
      expect(pipe.transform('2023-05-01')).toBe(0);
      expect(pipe.transform()).toBe(0);
    });
  });
});
