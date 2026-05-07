import { ChangeDetectionStrategy, Component, output, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpSkeletonComponent } from '@keeps-platform-frontend-workspace/ui/kp-skeleton';
import { Store } from '@ngrx/store';
import { LedEnrollmentItemComponent } from '../../components/led-overview-dialog/led-enrollment-item/led-enrollment-item.component';
import { LedTrailCoursesViewModel } from '../../models/led-trail-courses';
import { ledTrailCoursesFeature } from '../../store/led-overview';

@Component({
  selector: 'lp-led-trail-courses',
  imports: [KpSkeletonComponent, TranslocoPipe, MatIcon, LedEnrollmentItemComponent],
  template: `
    @let loading = this.vm()?.loading;
    @let data = this.vm()?.data;

    @if (loading) {
      <kp-skeleton class="h-6 w-14 bg-default rounded-md mb-4"></kp-skeleton>
      <kp-skeleton class="h-6 w-36 bg-default rounded-md mb-1"></kp-skeleton>
      <kp-skeleton class="h-6 w-36 bg-default rounded-md mb-4"></kp-skeleton>

      <kp-skeleton class="w-full h-13 bg-default rounded-md mb-2.5"></kp-skeleton>
      <kp-skeleton class="w-full h-13 bg-default rounded-md mb-2.5"></kp-skeleton>
      <kp-skeleton class="w-full h-13 bg-default rounded-md"></kp-skeleton>
    } @else {
      <div class="flex gap-2 text-primary w-fit cursor-pointer mb-4" (click)="onGoBack()">
        <mat-icon class="s-6">arrow_back</mat-icon>
        <span class="text-sm">{{ 'LEADER_PANEL.GENERAL.GO_BACK' | transloco }}</span>
      </div>

      <div class="text-lg font-bold">
        {{ 'LEADER_PANEL.LED.TRAIL.TRAIL_COURSES.TITLE_PREFIX' | transloco }}:
        {{ data.learn_content_name }}
      </div>
      <div class="text-sm opacity-70 mb-4">
        {{ 'LEADER_PANEL.LED.TRAIL.TRAIL_COURSES.SUBTITLE' | transloco: { value: data.username } }}
      </div>

      <div class="flex flex-col gap-2.5">
        @for (enrollment of data.course_enrollments; track enrollment.id) {
          <lp-led-enrollment-item
            [enrollment]="enrollment"
            (click)="onCourseSelected(enrollment?.id)"
          ></lp-led-enrollment-item>
        }
      </div>
    }
  `,
  styles: `
    :host {
      @apply flex flex-col;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedTrailCoursesComponent {
  readonly vm: Signal<LedTrailCoursesViewModel>;
  goBack = output<void>();
  courseSelected = output<string>();

  constructor(private readonly store: Store) {
    this.vm = toSignal(this.store.select(ledTrailCoursesFeature.selectViewModel));
  }

  onGoBack() {
    this.goBack.emit();
  }

  onCourseSelected(courseId: string) {
    this.courseSelected.emit(courseId);
  }
}
