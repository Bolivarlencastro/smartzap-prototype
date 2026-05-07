import { DeepCopyPlotlyDataPipe } from './deep-copy-plotly-data.pipe';

describe('DeepCopyPlotlyDataPipe', () => {
  let pipe: DeepCopyPlotlyDataPipe;

  beforeEach(() => {
    pipe = new DeepCopyPlotlyDataPipe();
  });

  describe('falsyValues', () => {
    it('should return null for falsy values', () => {
      expect(pipe.transform(null)).toBeNull();
      expect(pipe.transform(undefined)).toBeNull();
      expect(pipe.transform('')).toBeNull();
    });
  });

  describe('truthyValues', () => {
    it('should return a deep copy of the input object', () => {
      const input = { a: 1, b: { c: 2 } };
      const output = pipe.transform(input);

      expect(output).toEqual(input);
      expect(output).not.toBe(input);

      output.b.c = 3;
      expect(input.b.c).toBe(2);
    });

    it('should return a deep copy of the input array', () => {
      const input = [
        [1, 0],
        [2, 3],
      ];
      const output = pipe.transform(input);

      expect(output).toEqual(input);
      expect(output).not.toBe(input);

      output[1][0] = 4;
      expect(input[1][0]).toBe(2);
    });

    it('should return primitive values as-is', () => {
      expect(pipe.transform(42)).toBe(42);
      expect(pipe.transform('test')).toBe('test');
      expect(pipe.transform(true)).toBe(true);
    });
  });
});
