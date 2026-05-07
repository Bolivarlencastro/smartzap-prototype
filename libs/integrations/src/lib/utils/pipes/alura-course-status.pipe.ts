import { Pipe, PipeTransform } from '@angular/core';
import { KpMissionDevelopmentStatusLabelPipe } from '@keeps-platform-frontend-workspace/ui/kp-mission-development-status-label';
import { AluraStatus, MirroredCourseStatus } from '../../models';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

const LABELS_MAP = new Map<AluraStatus | DevelopmentStatus, string>([
  [AluraStatus.DISABLED, marker('INTEGRATIONS.ALURA_STATUS.DISABLED')],
  [AluraStatus.PUBLISHED, marker('INTEGRATIONS.ALURA_STATUS.PUBLISHED')],
  [DevelopmentStatus.DONE, marker('INTEGRATIONS.ALURA_STATUS.PUBLISHED')],
]);

@Pipe({
  name: 'aluraCourseStatus',
  standalone: true,
})
export class AluraCourseStatusPipe extends KpMissionDevelopmentStatusLabelPipe implements PipeTransform {
  override transform(status: MirroredCourseStatus | string): string {
    return LABELS_MAP.get(status as AluraStatus) || super.transform(status as DevelopmentStatus);
  }
}
