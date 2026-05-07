import { TrackingPercetangePositionPipe } from './tracking-percetange-position.pipe';

describe('TrackingPercetangePositionPipe', () => {
  it('create an instance', () => {
    const pipe = new TrackingPercetangePositionPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return position inside progress bar', () => {
    const percent = 23;
    const pipe = new TrackingPercetangePositionPipe();
    expect(pipe.transform(percent)).toEqual(`calc(${percent}% + 4px)`);
  });

  it('should return position outside progress bar', () => {
    const percent = 25;
    const pipe = new TrackingPercetangePositionPipe();
    expect(pipe.transform(percent)).toEqual(`calc(${percent}% - 24px)`);
  });

  it('check if user watched more than on time', () => {
    const percent = 110;
    const pipe = new TrackingPercetangePositionPipe();
    expect(pipe.transform(percent)).toEqual(`70px`);
  });
});
