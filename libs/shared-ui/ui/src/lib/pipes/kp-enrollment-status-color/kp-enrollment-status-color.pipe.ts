import { Pipe, PipeTransform } from '@angular/core';
import { KpStatusChipColor } from '../../components/kp-status-chip/kp-status-chip.const';

export const ENROLLMENT_STATUS_COLORS_MAP: Record<string, string> = {
  ENROLLED: KpStatusChipColor.DARK_BLUE,
  STARTED: KpStatusChipColor.BLUE,
  COMPLETED: KpStatusChipColor.GREEN,
  PENDING_VALIDATION: KpStatusChipColor.ORANGE,
  WAITING: KpStatusChipColor.ORANGE,
  REFUSED: KpStatusChipColor.PURPLE,
  REPROVED: KpStatusChipColor.RED,
  ENROLLMENT_REPROVED: KpStatusChipColor.RED,
  EXPIRED: KpStatusChipColor.LIGHT_RED,
  REQUEST_EXTENSION: KpStatusChipColor.LIGHT_ORANGE,
  GIVE_UP: KpStatusChipColor.DARK_GRAY,
};

@Pipe({
  name: 'kpEnrollmentStatusColor',
  standalone: true,
})
export class KpEnrollmentStatusColorPipe implements PipeTransform {
  transform(status: string): string {
    return ENROLLMENT_STATUS_COLORS_MAP[status?.toUpperCase()] || '#CCC';
  }
}
