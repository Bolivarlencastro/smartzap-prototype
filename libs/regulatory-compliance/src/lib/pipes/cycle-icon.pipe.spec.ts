import { CycleIconPipe } from './cycle-icon.pipe';

describe('CycleIconPipe', () => {
  let pipe: CycleIconPipe;

  beforeEach(() => {
    pipe = new CycleIconPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should the mission learning object type icon', () => {
      expect(pipe.transform('798e50d7-8b97-4979-8728-4f9f1599bb05')).toBe('rocket_launch');
    });

    it('should the learning trail learning object type icon', () => {
      expect(pipe.transform('d841e9d8-d669-4d88-9636-1072765d0738')).toBe('conversion_path');
    });

    it('should an empty string when not found', () => {
      expect(pipe.transform('invalid_type_id')).toBe('');
    });

    it('should an empty string when a falsy value is provided', () => {
      expect(pipe.transform('')).toBe('');
    });
  });
});
