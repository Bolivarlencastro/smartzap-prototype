import { format } from 'date-fns';
import { KpFromNowPipe } from './kp-from-now.pipe';

describe('KpFromNowPipe', () => {
  it('create an instance', () => {
    const pipe = new KpFromNowPipe();
    expect(pipe).toBeTruthy();
  });

  it('should format correctly', () => {
    const pipe = new KpFromNowPipe();
    const date = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
    const value = pipe.transform(date, 'en');
    expect(value).toBe('less than a minute ago');
  });

  it('when passing an invalid date should return "Invalid date"', () => {
    const pipe = new KpFromNowPipe();
    const value = pipe.transform('invalid input');
    expect(value).toBe('Invalid date');
  });

  it('should return empty when passing an empty value', () => {
    const pipe = new KpFromNowPipe();
    const value = pipe.transform('');
    expect(value).toBe('');
  });
});
