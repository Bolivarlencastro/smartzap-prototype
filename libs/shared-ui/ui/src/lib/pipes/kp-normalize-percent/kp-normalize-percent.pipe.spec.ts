import { KpNormalizePercentPipe } from './kp-normalize-percent.pipe';

const defaultLocale = 'en';

const buildPipe = (locale = defaultLocale) => new KpNormalizePercentPipe(locale);

describe('KpNormalizePercentPipe', () => {
  it('should return a formatted percentage', () => {
    const value = '0.5';
    const expectedValue = '50%';
    const pipe = buildPipe();

    const result = pipe.transform(value);

    expect(result).toEqual(expectedValue);
  });

  it('should return a formatted percentage without decimals', () => {
    const value = '0.533333333';
    const expectedValue = '53%';
    const pipe = buildPipe();

    const result = pipe.transform(value);

    expect(result).toEqual(expectedValue);
  });

  it('should return 100% if percentage exceeds the maximum value', () => {
    const value = '1.5';
    const expectedValue = '100%';
    const pipe = buildPipe();

    const result = pipe.transform(value);

    expect(result).toEqual(expectedValue);
  });

  it('should return 0% if value is not a valid number', () => {
    const value = 'not a valid number';
    const expectedValue = '0%';
    const pipe = buildPipe();

    const result = pipe.transform(value);

    expect(result).toEqual(expectedValue);
  });

  it('should return 0% if value is undefined', () => {
    const value = undefined;
    const expectedValue = '0%';
    const pipe = buildPipe();

    const result = pipe.transform(value);

    expect(result).toEqual(expectedValue);
  });
});
