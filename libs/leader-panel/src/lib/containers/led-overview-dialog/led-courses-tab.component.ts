import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { KpSkeletonComponent } from '@keeps-platform-frontend-workspace/ui/kp-skeleton';
import { Store } from '@ngrx/store';
import { LedEnrollmentItemComponent } from '../../components/led-overview-dialog/led-enrollment-item/led-enrollment-item.component';
import { LedEnrollmentsTabViewModel } from '../../models/led-overview';
import { LedCoursesTabActions, ledCoursesTabFeature } from '../../store/led-overview';
import { LedEnrollmentActivityComponent } from './led-enrollment-activity.component';

@Component({
  selector: 'lp-led-courses-tab',
  imports: [LedEnrollmentItemComponent, KpSkeletonComponent, LedEnrollmentActivityComponent],
  template: `
    @let vm = this.vm();

    @switch (vm.viewMode) {
      @case ('loading') {
        <kp-skeleton class="w-full h-13 bg-default rounded-md"></kp-skeleton>
        <kp-skeleton class="w-full h-13 bg-default rounded-md"></kp-skeleton>
        <kp-skeleton class="w-full h-13 bg-default rounded-md"></kp-skeleton>
      }
      @case ('details') {
        <lp-led-enrollment-activity (goBack)="onGoBack()"></lp-led-enrollment-activity>
      }
      @default {
        @for (enrollment of vm.enrollments; track enrollment.id) {
          <lp-led-enrollment-item
            [enrollment]="enrollment"
            (click)="onCourseSelected(enrollment?.id)"
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
export class LedCoursesTabComponent {
  readonly vm: Signal<LedEnrollmentsTabViewModel>;

  constructor(private readonly store: Store) {
    this.store.dispatch(LedCoursesTabActions.fetchCourseEnrollments());
    this.vm = toSignal(this.store.select(ledCoursesTabFeature.selectViewModel));
  }

  onCourseSelected(courseId: string) {
    this.store.dispatch(LedCoursesTabActions.goToCourseDetails({ courseId }));
  }

  onGoBack() {
    this.store.dispatch(LedCoursesTabActions.setViewMode({ viewMode: 'list' }));
  }
}
