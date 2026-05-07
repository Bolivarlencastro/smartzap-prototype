import { Pipe, PipeTransform } from '@angular/core';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CardTagType } from '../../models';
import { DEVELOPMENT_STATUS_TAG_TYPE_MAP } from '../../helpers';

@Pipe({
  name: 'kpCourseDevelopmentStatusTagType',
})
export class KpCourseDevelopmentStatusTagTypePipe implements PipeTransform {
  transform(value: DevelopmentStatus): CardTagType {
    return DEVELOPMENT_STATUS_TAG_TYPE_MAP.get(value);
  }
}
