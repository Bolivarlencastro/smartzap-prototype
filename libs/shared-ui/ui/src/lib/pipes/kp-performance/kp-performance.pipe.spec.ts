import { KpPerformancePipe } from './kp-performance.pipe';

describe('PerformancePipe', () => {
  let pipe: KpPerformancePipe;

  beforeEach(async () => {
    pipe = new KpPerformancePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Should return 100% if value is 1', () => {
    expect(pipe.transform(1, '%')).toBe('100%');
  });

  it('should return "-" if no value is given', () => {
    expect(pipe.transform(undefined, '%')).toBe('-');
  });

  it('should return 50% if value 0.5', () => {
    expect(pipe.transform(0.5, '%')).toBe('50%');
  });

  it('should return 54% if value 0.54', () => {
    expect(pipe.transform(0.54, '%')).toBe('54%');
  });

  it('should return 100% if value is bigger then 1', () => {
    expect(pipe.transform(2, '%')).toBe('100%');
  });

  it('should return 0% if value is 0', () => {
    expect(pipe.transform(0, '%')).toBe('0%');
  });

  it('should return 0% if value is smaller 0', () => {
    expect(pipe.transform(-1, '%')).toBe('0%');
  });

  it('Should return 100 if value is 1', () => {
    expect(pipe.transform(1)).toBe('100');
  });

  it('should return "-" if no value is given', () => {
    expect(pipe.transform()).toBe('-');
  });

  it('should return 50 if value 0.5', () => {
    expect(pipe.transform(0.5)).toBe('50');
  });

  it('should return 54 if value 0.54', () => {
    expect(pipe.transform(0.54)).toBe('54');
  });

  it('should return 100 if value is bigger then 1', () => {
    expect(pipe.transform(2)).toBe('100');
  });

  it('should return 0 if value is 0', () => {
    expect(pipe.transform(0)).toBe('0');
  });

  it('should return 0 if value is smaller 0', () => {
    expect(pipe.transform(-1)).toBe('0');
  });
});
