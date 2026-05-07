import { Pipe, PipeTransform } from '@angular/core';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

const DEVELOPMENT_STATUS_COLORS: Map<DevelopmentStatus, string> = new Map([
  [DevelopmentStatus.IN_PROGRESS, '#ff7152'],
  [DevelopmentStatus.PROCESSING, '#e1b258'],
  [DevelopmentStatus.IN_REVIEW, '#ff9706'],
  [DevelopmentStatus.DONE, '#01d89b'],
  [DevelopmentStatus.INACTIVATED, '#b5b5b5'],
  [DevelopmentStatus.CLOSED, '#ff3700'],
]);

@Pipe({
  name: 'kpMissionDevelopmentStatusColor',
  standalone: true,
})
export class KpMissionDevelopmentStatusColorPipe implements PipeTransform {
  transform(status: DevelopmentStatus): string {
    return DEVELOPMENT_STATUS_COLORS.get(status) || status;
  }
}
