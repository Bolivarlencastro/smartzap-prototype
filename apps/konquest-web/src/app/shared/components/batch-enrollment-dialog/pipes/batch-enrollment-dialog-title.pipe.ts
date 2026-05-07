import { Pipe, PipeTransform } from '@angular/core';
import { BatchEnrollmentType } from 'app/shared/services/batch-enrollment.service';

@Pipe({
  name: 'batchEnrollmentDialogTitle',
})
export class BatchEnrollmentDialogTitlePipe implements PipeTransform {
  transform(enrollmentType: BatchEnrollmentType): string {
    if (enrollmentType === 'event') {
      return 'BATCH_ENROLLMENT.EVENTS_TITLE';
    }

    return 'BATCH_ENROLLMENT.TITLE';
  }
}
