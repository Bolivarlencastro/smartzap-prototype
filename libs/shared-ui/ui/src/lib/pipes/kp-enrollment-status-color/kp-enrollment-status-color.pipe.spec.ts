import { KpEnrollmentStatusColorPipe } from './kp-enrollment-status-color.pipe';

describe('KpEnrollmentStatusColorPipe', () => {
  it('create an instance', () => {
    const pipe = new KpEnrollmentStatusColorPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return grey when the status is not found', () => {
    const pipe = new KpEnrollmentStatusColorPipe();
    const value = pipe.transform('##invalid_status##');
    expect(value).toBe('#CCC');
  });
});
