import { Pipe, PipeTransform } from '@angular/core';
import { AluraStatus, MirroredCourseStatus } from '../../models';
import { KpMissionDevelopmentStatusColorPipe } from '@keeps-platform-frontend-workspace/ui/kp-mission-development-status-color';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

const COLOR_MAP = new Map<AluraStatus, string>([
  [AluraStatus.PUBLISHED, '#47AB0A'],
  [AluraStatus.DISABLED, '#CCCCCC'],
]);

@Pipe({
  name: 'aluraStatusColor',
  standalone: true,
})
export class AluraStatusColorPipe extends KpMissionDevelopmentStatusColorPipe implements PipeTransform {
  override transform(status: MirroredCourseStatus): string {
    return COLOR_MAP.get(status as AluraStatus) || super.transform(status as DevelopmentStatus);
  }
}
