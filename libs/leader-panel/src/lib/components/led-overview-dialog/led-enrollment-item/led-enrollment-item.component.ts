import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Enrollment } from '../../../models/enrollment';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, PercentPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { KpEnrollmentTagTypePipe } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-tag-type';

@Component({
  selector: 'lp-led-enrollment-item',
  imports: [MatIcon, PercentPipe, TranslocoPipe, DatePipe, KpCardTagComponent, KpEnrollmentTagTypePipe],
  template: `
    @let enrollment = this.enrollment();
    <mat-icon class="s-6 text-primary">{{ icon() }}</mat-icon>
    <div class="flex flex-col">
      <p class="text-sm [word-break:break-word] line-clamp-1">
        {{ enrollment?.learn_content_name }}
      </p>
      @if (enrollment?.required || enrollment?.normative) {
        <div class="flex gap-2">
          @if (enrollment?.required) {
            <kp-card-tag [type]="'modifier-required'" [keepOpen]="true"></kp-card-tag>
          }
          @if (enrollment?.normative) {
            <kp-card-tag [type]="'modifier-normative'" [keepOpen]="true"></kp-card-tag>
          }
        </div>
      }
    </div>
    <div class="w-full sm:w-auto ml-auto flex items-center justify-end gap-x-6 gap-y-2 flex-wrap">
      <div class="text-center">
        <p class="text-2xxs font-bold opacity-70">{{ enrollment?.progress | percent }}</p>
        <p class="text-xs">{{ 'LEADER_PANEL.ENROLLMENT.PROGRESS' | transloco }}</p>
      </div>
      <div class="text-center">
        <p class="text-2xxs font-bold opacity-70">{{ enrollment?.performance | percent }}</p>
        <p class="text-xs">{{ 'LEADER_PANEL.ENROLLMENT.PERFORMANCE' | transloco }}</p>
      </div>
      <div class="min-w-28 flex items-center justify-center">
        <kp-card-tag [type]="enrollment?.status | kpEnrollmentTagType" [keepOpen]="true"></kp-card-tag>
      </div>
      <div class="text-center min-w-20">
        @if (enrollment?.goal_date) {
          <p class="text-2xxs font-bold opacity-70">{{ enrollment?.goal_date | date: 'shortDate' }}</p>
        } @else {
          &#8212;
        }
        <p class="text-xs">{{ 'LEADER_PANEL.ENROLLMENT.GOAL_DATE' | transloco }}</p>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
      padding: 0.7rem;
      border-radius: 0.5rem;
      background: var(--mat-sys-surface-container-low);
      transition: background 0.22s cubic-bezier(0.2, 0, 0.1, 1);

      &:hover {
        background: var(--mat-sys-surface-container);
        cursor: pointer;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedEnrollmentItemComponent {
  readonly enrollment = input<Enrollment>();
  readonly icon = computed(() => {
    const enrollment = this.enrollment();
    return enrollment?.learn_content_type === 'course' ? 'rocket_launch' : 'route';
  });
}
