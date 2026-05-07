import { Pipe, PipeTransform } from '@angular/core';
import { CyclePeriodType } from '@keeps-platform-frontend-workspace/kp-keeps';
import { marker } from '@jsverse/transloco-keys-manager/marker';

marker('REGULATORY_COMPLIANCE.DURATION.DAYS.SINGULAR');
marker('REGULATORY_COMPLIANCE.DURATION.DAYS.PLURAL');

marker('REGULATORY_COMPLIANCE.DURATION.MONTHS.SINGULAR');
marker('REGULATORY_COMPLIANCE.DURATION.MONTHS.PLURAL');

marker('REGULATORY_COMPLIANCE.DURATION.YEARS.SINGULAR');
marker('REGULATORY_COMPLIANCE.DURATION.YEARS.PLURAL');

const CYCLE_DURATION_TRANSLATIONS = new Map<CyclePeriodType, string>([
  ['DAY', 'REGULATORY_COMPLIANCE.DURATION.DAYS'],
  ['MONTH', 'REGULATORY_COMPLIANCE.DURATION.MONTHS'],
  ['YEAR', 'REGULATORY_COMPLIANCE.DURATION.YEARS'],
]);

@Pipe({ name: 'cycleDurationType' })
export class CycleDurationTypePipe implements PipeTransform {
  transform(periodType: CyclePeriodType): string {
    return CYCLE_DURATION_TRANSLATIONS.get(periodType) || periodType;
  }
}
