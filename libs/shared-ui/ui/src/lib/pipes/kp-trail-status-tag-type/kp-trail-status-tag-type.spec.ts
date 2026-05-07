import { KpTrailStatusTagTypePipe } from './kp-trail-status-tag-type.pipe';

describe('KpTrailStatusTagTypePipe', () => {
  let pipe: KpTrailStatusTagTypePipe;

  beforeEach(() => {
    pipe = new KpTrailStatusTagTypePipe();
  });

  it('should return "development-published" when isActive is true', () => {
    const result = pipe.transform(true);
    expect(result).toBe('development-published');
  });

  it('should return "development-inactive" when isActive is false', () => {
    const result = pipe.transform(false);
    expect(result).toBe('development-inactive');
  });
});
