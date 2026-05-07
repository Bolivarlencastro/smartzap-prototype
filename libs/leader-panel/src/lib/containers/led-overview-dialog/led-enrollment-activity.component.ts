import { DatePipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, output, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpContentIconName } from '@keeps-platform-frontend-workspace/ui/kp-content-icon-name';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { KpSkeletonComponent } from '@keeps-platform-frontend-workspace/ui/kp-skeleton';
import { Store } from '@ngrx/store';
import { LedEnrollmentActivityViewModel } from '../../models/led-enrollment-activity';
import { ledEnrollmentActivityFeature } from '../../store/led-overview';

@Component({
  selector: 'lp-led-enrollment-activity',
  imports: [
    KpSkeletonComponent,
    TranslocoPipe,
    PercentPipe,
    KpDurationPipe,
    KpContentIconName,
    MatIcon,
    DatePipe,
    MatDivider,
  ],
  template: `
    @let loading = this.vm()?.loading;
    @let data = this.vm()?.data;

    @if (loading) {
      <kp-skeleton class="h-6 w-14 bg-default rounded-md"></kp-skeleton>
      <kp-skeleton class="h-6 w-36 bg-default rounded-md"></kp-skeleton>

      <div class="flex gap-4">
        <kp-skeleton class="w-full h-10 bg-default rounded-md"></kp-skeleton>
        <kp-skeleton class="w-full h-10 bg-default rounded-md"></kp-skeleton>
        <kp-skeleton class="w-full h-10 bg-default rounded-md"></kp-skeleton>
        <kp-skeleton class="w-full h-10 bg-default rounded-md"></kp-skeleton>
        <kp-skeleton class="w-full h-10 bg-default rounded-md"></kp-skeleton>
      </div>

      <kp-skeleton class="w-full h-11 bg-default rounded-md"></kp-skeleton>
      <kp-skeleton class="w-full h-11 bg-default rounded-md"></kp-skeleton>
      <kp-skeleton class="w-full h-11 bg-default rounded-md"></kp-skeleton>
    } @else {
      <div class="flex gap-2 text-primary w-fit cursor-pointer" (click)="onGoBack()">
        <mat-icon class="s-6">arrow_back</mat-icon>
        <span class="text-sm">{{ 'LEADER_PANEL.GENERAL.GO_BACK' | transloco }}</span>
      </div>

      <span class="text-lg font-bold">{{ 'LEADER_PANEL.LED.COURSE.ENROLLMENT_ACTIVITY.TITLE' | transloco }}</span>

      <div class="flex gap-1 justify-between">
        <div class="flex flex-col gap-1">
          <span class="text-2xxs opacity-70">{{
            'LEADER_PANEL.LED.COURSE.ENROLLMENT_ACTIVITY.POINTS' | transloco
          }}</span>
          <span class="font-bold text-sm">{{ data?.points }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-2xxs opacity-70">{{
            'LEADER_PANEL.LED.COURSE.ENROLLMENT_ACTIVITY.PROGRESS' | transloco
          }}</span>
          <span class="font-bold text-sm">{{ data?.progress | percent }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-2xxs opacity-70">{{
            'LEADER_PANEL.LED.COURSE.ENROLLMENT_ACTIVITY.PERFORMANCE' | transloco
          }}</span>
          <span class="font-bold text-sm">{{ data?.performance | percent }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-2xxs opacity-70">{{
            'LEADER_PANEL.LED.COURSE.ENROLLMENT_ACTIVITY.STATUS' | transloco
          }}</span>
          <span class="font-bold text-sm">{{ data?.status }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-2xxs opacity-70">{{
            'LEADER_PANEL.LED.COURSE.ENROLLMENT_ACTIVITY.LAST_ACCESS' | transloco
          }}</span>
          <span class="font-bold text-sm">{{ data?.last_access | date: 'shortDate' }}</span>
        </div>
      </div>

      <mat-divider class="my-2"></mat-divider>

      <div class="flex flex-col gap-1">
        <!-- TABLE HEAD -->
        <div class="grid grid-cols-12 gap-6 px-3.5 text-left text-2xxs font-bold opacity-70">
          <div class="col-span-4">{{ 'LEADER_PANEL.LED.COURSE.ENROLLMENT_ACTIVITY.CONTENT' | transloco }}</div>
          <div class="col-span-2">{{ 'LEADER_PANEL.LED.COURSE.ENROLLMENT_ACTIVITY.FIRST_ACCESS' | transloco }}</div>
          <div class="col-span-2">{{ 'LEADER_PANEL.LED.COURSE.ENROLLMENT_ACTIVITY.LAST_ACCESS' | transloco }}</div>
          <div class="col-span-1">{{ 'LEADER_PANEL.LED.COURSE.ENROLLMENT_ACTIVITY.CONSUMPTION' | transloco }}</div>
          <div class="col-span-1">{{ 'LEADER_PANEL.LED.COURSE.ENROLLMENT_ACTIVITY.DURATION' | transloco }}</div>
          <div class="col-span-2 text-center">
            {{ 'LEADER_PANEL.LED.COURSE.ENROLLMENT_ACTIVITY.STATUS' | transloco }}
          </div>
        </div>

        <!-- TABLE BODY -->
        <div class="space-y-2">
          @for (item of data.contents; track item.id) {
            <div class="bg-list-item">
              <div class="grid grid-cols-12 gap-6 px-3.5 py-2.5 items-center h-12">
                <div class="col-span-4 flex items-center gap-3">
                  <mat-icon class="s-4 text-primary" [svgIcon]="item?.content_type | KpContentIconName"></mat-icon>
                  <span class="text-xs font-bold [word-break:break-word] line-clamp-2">{{ item.name }}</span>
                </div>

                <div class="col-span-2 text-xs opacity-70 [word-break:break-word] line-clamp-2">
                  {{ (item.first_access | date: 'shortDate') || '-' }}
                </div>

                <div class="col-span-2 text-xs opacity-70 [word-break:break-word] line-clamp-2">
                  {{ (item.last_access | date: 'shortDate') || '-' }}
                </div>

                <div class="col-span-1 text-xs opacity-70 [word-break:break-word] line-clamp-2">
                  {{ item.consumption | kpDuration }}
                </div>

                <div class="col-span-1 text-xs opacity-70 [word-break:break-word] line-clamp-2">
                  {{ item.duration | kpDuration }}
                </div>

                <div class="col-span-2 text-xs opacity-70 text-center [word-break:break-word] line-clamp-2">
                  {{ item.status }}
                </div>
              </div>
            </div>
          } @empty {
            <div class="text-center py-12 text-2xxs opacity-70 font-bold">
              {{ 'LEADER_PANEL.LED.COURSE.ENROLLMENT_ACTIVITY.EMPTY_MESSAGE' | transloco }}
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      @apply flex flex-col gap-4;
    }

    .bg-list-item {
      @apply rounded-lg;

      background-color: var(--mat-sys-surface);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedEnrollmentActivityComponent {
  readonly vm: Signal<LedEnrollmentActivityViewModel>;
  goBack = output<void>();

  constructor(private readonly store: Store) {
    this.vm = toSignal(this.store.select(ledEnrollmentActivityFeature.selectViewModel));
  }

  onGoBack() {
    this.goBack.emit();
  }
}
