import { CycleDurationTypePipe } from './cycle-duration-type.pipe';
import { CyclePeriodType } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('CycleDurationTypePipe', () => {
  it('create an instance', () => {
    const pipe = new CycleDurationTypePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return the provided value if it is not an DurationType', () => {
    const pipe = new CycleDurationTypePipe();
    expect(pipe.transform('invalid_value' as CyclePeriodType)).toBe('invalid_value');
    expect(pipe.transform(null as CyclePeriodType)).toBe(null);
    expect(pipe.transform(undefined as CyclePeriodType)).toBe(undefined);
  });

  describe('transform', () => {
    const pipe = new CycleDurationTypePipe();

    const cases: { typeTranslation: string; periodType: CyclePeriodType }[] = [
      { typeTranslation: 'REGULATORY_COMPLIANCE.DURATION.DAYS', periodType: 'DAY' },
      { typeTranslation: 'REGULATORY_COMPLIANCE.DURATION.MONTHS', periodType: 'MONTH' },
      { typeTranslation: 'REGULATORY_COMPLIANCE.DURATION.YEARS', periodType: 'YEAR' },
    ];

    test.each(cases)(
      'should return the the correct translation for the $periodType.type cycle period type',
      ({ typeTranslation, periodType }) => {
        expect(pipe.transform(periodType)).toBe(typeTranslation);
      },
    );
  });
});
