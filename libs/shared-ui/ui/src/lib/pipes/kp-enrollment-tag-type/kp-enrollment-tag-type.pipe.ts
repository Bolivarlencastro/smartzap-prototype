import { Pipe, PipeTransform } from '@angular/core';
import { ENROLLMENT_STATUS_TAG_TYPE_MAP } from '../../helpers';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CardTagType } from '../../models';

@Pipe({
  name: 'kpEnrollmentTagType',
  standalone: true,
})
export class KpEnrollmentTagTypePipe implements PipeTransform {
  transform(value: EnrollmentStatuses): CardTagType {
    return ENROLLMENT_STATUS_TAG_TYPE_MAP.get(value);
  }
}
