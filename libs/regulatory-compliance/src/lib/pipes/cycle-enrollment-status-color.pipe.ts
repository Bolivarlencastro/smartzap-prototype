import { Pipe, PipeTransform } from '@angular/core';
import { KP_STATUS_COLORS } from '@keeps-platform-frontend-workspace/ui/models';
import { EnrollmentCycleStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

const STATUS_COLOR_MAP = new Map<EnrollmentCycleStatus, KP_STATUS_COLORS>([
  ['IN_PROGRESS', KP_STATUS_COLORS.IN_PROGRESS],
  ['EXPIRED', KP_STATUS_COLORS.EXPIRED],
  ['EXPIRING', KP_STATUS_COLORS.EXPIRING],
  ['COMPLETED', KP_STATUS_COLORS.COMPLETED],
  ['DISABLED', KP_STATUS_COLORS.DISABLED],
]);

@Pipe({ name: 'cycleEnrollmentStatusColor' })
export class CycleEnrollmentStatusColorPipe implements PipeTransform {
  transform(status: EnrollmentCycleStatus): string {
    return STATUS_COLOR_MAP.get(status);
  }
}
