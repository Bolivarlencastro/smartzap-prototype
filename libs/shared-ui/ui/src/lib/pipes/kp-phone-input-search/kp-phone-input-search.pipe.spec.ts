import { KpPhoneInputSearchPipe } from './kp-phone-input-search.pipe';

describe('KpPhoneInputSearchPipe', () => {
  describe('transform', () => {
    const pipe = new KpPhoneInputSearchPipe();

    const cases: any[] = [
      [true, 'United', { name: 'United States', dialCode: '+1' }],
      [true, '55', { name: 'Brazil', dialCode: '+55' }],
      [false, 'Argentina', { name: 'Brazil', dialCode: '+55' }],
      [true, '', { name: 'Canada', dialCode: '+1' }],
      [true, undefined, { name: 'Mexico', dialCode: '+52' }],
      [false, 'germany+1', { name: 'Germany', dialCode: '+49' }],
    ];

    test.each(cases)(
      'should return %p when searching "%s" for this country: "%s"',
      (expectedValue, searchCriteria, country) => {
        const result = pipe.transform(country, searchCriteria);
        expect(result).toBe(expectedValue);
      },
    );
  });
});
