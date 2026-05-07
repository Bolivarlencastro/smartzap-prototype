import { KpQuizCharcodePipe } from './kp-quiz-charcode.pipe';

describe('KpQuizCharcodePipe', () => {
  describe('transform', () => {
    const pipe = new KpQuizCharcodePipe();

    const cases: any[] = [
      [65, 'A'],
      [97, 'a'],
      [48, '0'],
      [32, ' '],
      [0, undefined],
      [null, undefined],
      [undefined, undefined],
      [90, 'Z'],
      [122, 'z'],
      [49, '1'],
      [10, '\n'],
    ];
    test.each(cases)(
      'should correctly transform ASCII code %p into its corresponding character: %p',
      (value, expectedValue) => {
        expect(pipe.transform(value)).toBe(expectedValue);
      },
    );
  });
});
