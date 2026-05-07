import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { KpSkeletonComponent } from '@keeps-platform-frontend-workspace/ui/kp-skeleton';
import { Store } from '@ngrx/store';
import { LedEnrollmentItemComponent } from '../../components/led-overview-dialog/led-enrollment-item/led-enrollment-item.component';
import { Enrollment } from '../../models/enrollment';
import { LedEnrollmentsTabViewMode, LedEnrollmentsTabViewModel } from '../../models/led-overview';
import { LedTrailsTabActions, ledTrailsTabFeature } from '../../store/led-overview';
import { LedTrailCoursesComponent } from './led-trail-courses.component';
import { LedEnrollmentActivityComponent } from './led-enrollment-activity.component';

@Component({
  selector: 'lp-led-trails-tab',
  imports: [KpSkeletonComponent, LedEnrollmentItemComponent, LedTrailCoursesComponent, LedEnrollmentActivityComponent],
  template: `
    @let vm = this.vm();

    @switch (vm.viewMode) {
      @case ('loading') {
        <kp-skeleton class="w-full h-13 bg-default rounded-md"></kp-skeleton>
        <kp-skeleton class="w-full h-13 bg-default rounded-md"></kp-skeleton>
        <kp-skeleton class="w-full h-13 bg-default rounded-md"></kp-skeleton>
      }
      @case ('details') {
        <lp-led-trail-courses
          (goBack)="onSetViewMode('list')"
          (courseSelected)="onCourseSelected($event)"
        ></lp-led-trail-courses>
      }
      @case ('item-details') {
        <lp-led-enrollment-activity (goBack)="onSetViewMode('details')"></lp-led-enrollment-activity>
      }
      @default {
        @for (enrollment of vm.enrollments; track enrollment.id) {
          <lp-led-enrollment-item
            [enrollment]="enrollment"
            (click)="onTrailSelected(enrollment)"
          ></lp-led-enrollment-item>
        }
      }
    }
  `,
  styles: `
    :host {
      @apply p-5 flex flex-col gap-2.5;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedTrailsTabComponent {
  readonly vm: Signal<LedEnrollmentsTabViewModel>;

  constructor(private readonly store: Store) {
    this.store.dispatch(LedTrailsTabActions.fetchTrailEnrollments());
    this.vm = toSignal(this.store.select(ledTrailsTabFeature.selectViewModel));
  }

  onTrailSelected(trailEnrollment: Enrollment) {
    this.store.dispatch(LedTrailsTabActions.goToCourses({ trailEnrollment }));
  }

  onCourseSelected(courseId: string) {
    this.store.dispatch(LedTrailsTabActions.goToCourseDetails({ courseId }));
  }

  onSetViewMode(viewMode: LedEnrollmentsTabViewMode) {
    this.store.dispatch(LedTrailsTabActions.setViewMode({ viewMode }));
  }
}
