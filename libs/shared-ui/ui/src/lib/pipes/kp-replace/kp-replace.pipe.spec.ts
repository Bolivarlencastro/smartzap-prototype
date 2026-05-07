import { KpReplacePipe } from './kp-replace.pipe';

describe('KpReplacePipe', () => {
  describe('transform', () => {
    const pipe = new KpReplacePipe();

    const cases = [
      ['Jasmine', 'Jest', 'Teste Jasmine', 'Teste Jest'],
      ['Jest', null, 'Teste Jest', 'Teste '],
      ['null', 'Jasmine', 'Teste Jest', 'Teste Jest'],
      [null, null, 'Teste Jest', 'Teste Jest'],
    ];
    test.each(cases)(
      'should replace "%s" with "%s" in the base string "%s" and return "%s"',
      (from, to, value, expectedValue) => {
        const result = pipe.transform(value, from, to);
        expect(result).toBe(expectedValue);
      },
    );
  });
});
