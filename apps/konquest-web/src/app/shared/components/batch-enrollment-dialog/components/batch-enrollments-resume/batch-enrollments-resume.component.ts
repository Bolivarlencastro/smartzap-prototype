import { ChangeDetectionStrategy, Component } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';

marker('BATCH_ENROLLMENT.RESUME.WILL_ENROLL.SINGULAR');
marker('BATCH_ENROLLMENT.RESUME.WILL_ENROLL.PLURAL');
marker('BATCH_ENROLLMENT.FINISH.SUCCESSFULLY_ENROLLED.PLURAL');
marker('BATCH_ENROLLMENT.FINISH.SUCCESSFULLY_ENROLLED.SINGULAR');
marker('BATCH_ENROLLMENT.FINISH.ENROLLED.PLURAL');
marker('BATCH_ENROLLMENT.FINISH.ENROLLED.SINGULAR');

@Component({
  selector: 'app-batch-enrollments-resume',
  template: `
    <div class="border-t">
      <div class="h-[calc(65vh_-_172px)] flex flex-col items-center justify-center">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchEnrollmentsResumeComponent {}
