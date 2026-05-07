import { KpLinebreakPipe } from './kp-linebreak.pipe';

describe('KpLinebreakPipe', () => {
  describe('transform', () => {
    const pipe = new KpLinebreakPipe();

    const cases = [
      ['Hello\nWorld', 'Hello<br>World'],
      ['Line1\nLine2\nLine3', 'Line1<br>Line2<br>Line3'],
      ['Hello\r\nWorld', 'Hello<br>World'],
      ['Hello\rWorld', 'Hello<br>World'],
      [null, undefined],
      [undefined, undefined],
      ['NoLineBreak', 'NoLineBreak'],
      ['\nStart\nEnd\n', '<br>Start<br>End<br>'],
    ];

    test.each(cases)('should transform "%p" into "%p" by replacing line breaks with <br>', (value, expectedValue) => {
      const result = pipe.transform(value);
      expect(result).toBe(expectedValue);
    });
  });
});
