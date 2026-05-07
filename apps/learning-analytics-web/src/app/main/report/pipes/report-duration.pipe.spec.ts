import { ReportDuration } from './report-duration.pipe';

describe('ReportDuration', () => {
  let pipe: ReportDuration;

  beforeEach(() => {
    pipe = new ReportDuration();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it(`should format 80 seconds`, () => {
    const result = pipe.transform(80);
    expect(result).toBe('1m 20s');
  });

  it(`should format 60 seconds`, () => {
    const result = pipe.transform(60);
    expect(result).toBe('1m 00s');
  });

  it(`should format 43 seconds`, () => {
    const result = pipe.transform(43);
    expect(result).toBe('0m 43s');
  });

  it(`should format 0 seconds`, () => {
    const result = pipe.transform(0);
    expect(result).toBe('0m 00s');
  });
});
