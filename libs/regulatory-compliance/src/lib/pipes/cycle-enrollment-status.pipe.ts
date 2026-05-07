import { Pipe, PipeTransform } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { EnrollmentCycleStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

const TRANSLATIONS_MAP = new Map<EnrollmentCycleStatus, string>([
  ['EXPIRED', marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.STATUS.EXPIRED')],
  ['EXPIRING', marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.STATUS.EXPIRING')],
  ['IN_PROGRESS', marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.STATUS.IN_PROGRESS')],
  // To keep consistency with the other apis, the backend returns COMPLETED for the renewed status
  ['COMPLETED', marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.STATUS.RENEWED')],
  ['DISABLED', marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.STATUS.INACTIVE')],
]);

@Pipe({ name: 'cycleEnrollmentStatus' })
export class CycleEnrollmentStatusPipe implements PipeTransform {
  transform(status: EnrollmentCycleStatus): string {
    return TRANSLATIONS_MAP.get(status) || status;
  }
}
