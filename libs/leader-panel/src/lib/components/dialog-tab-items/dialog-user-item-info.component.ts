import { DatePipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { KpEnrollmentTagTypePipe } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-tag-type';

@Component({
  selector: 'lp-dialog-user-item-info',
  imports: [PercentPipe, TranslocoPipe, DatePipe, KpCardTagComponent, KpEnrollmentTagTypePipe],
  template: `
    <div class="w-full sm:w-auto ml-auto flex items-center justify-end gap-x-6 gap-y-2 flex-wrap">
      <div class="text-center">
        <p class="text-2xxs font-bold opacity-70">{{ progress() | percent }}</p>
        <p class="text-xs">{{ 'LEADER_PANEL.ENROLLMENT.PROGRESS' | transloco }}</p>
      </div>
      <div class="min-w-28 flex items-center justify-center">
        <kp-card-tag [type]="status() | kpEnrollmentTagType" [keepOpen]="true"></kp-card-tag>
      </div>
      <div class="text-center min-w-20">
        @if (goal_date()) {
          <p class="text-2xxs font-bold opacity-70">{{ goal_date() | date: 'shortDate' }}</p>
        } @else {
          &#8212;
        }
        <p class="text-xs">{{ 'LEADER_PANEL.ENROLLMENT.GOAL_DATE' | transloco }}</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogUserItemInfoComponent {
  readonly progress = input<number>();
  readonly status = input<EnrollmentStatuses>();
  readonly goal_date = input<string>();
}
