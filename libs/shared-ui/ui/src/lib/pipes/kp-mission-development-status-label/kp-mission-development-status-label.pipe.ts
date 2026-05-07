import { Pipe, PipeTransform } from '@angular/core';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { marker } from '@jsverse/transloco-keys-manager/marker';

const DEVELOPMENT_STATUS_LABELS: Map<DevelopmentStatus, string> = new Map([
  [DevelopmentStatus.IN_PROGRESS, marker('UI.KP_TAGS.DEVELOPMENT_CREATING')],
  [DevelopmentStatus.PROCESSING, marker('UI.KP_TAGS.DEVELOPMENT_PROCESSING')],
  [DevelopmentStatus.IN_REVIEW, marker('UI.KP_TAGS.DEVELOPMENT_AWAITING_REVIEW')],
  [DevelopmentStatus.DONE, marker('UI.KP_TAGS.DEVELOPMENT_PUBLISHED')],
  [DevelopmentStatus.INACTIVATED, marker('UI.KP_TAGS.DEVELOPMENT_INACTIVE')],
  [DevelopmentStatus.CLOSED, 'UI.KP_TAGS.DEVELOPMENT_FINISHED_EVENT'],
]);

@Pipe({
  name: 'kpMissionDevelopmentStatusLabel',
  standalone: true,
})
export class KpMissionDevelopmentStatusLabelPipe implements PipeTransform {
  transform(status: DevelopmentStatus): string {
    return DEVELOPMENT_STATUS_LABELS.get(status) || status;
  }
}
