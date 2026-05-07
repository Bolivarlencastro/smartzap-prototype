import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Course } from '../../../model';
import { CourseActions } from '../../../store/actions';
import { CourseSelectors } from '../../../store/selectors';
import { CourseFormSettingsComponent } from '../components/information/course-form-settings.component';

@Component({
  selector: 'app-course-settings',
  template: `
    @if (course()) {
      <app-course-form-settings
        [course]="course()"
        [isLoadingCourse]="isLoadingCourse()"
        (save)="onSave($event)"
      ></app-course-form-settings>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CourseFormSettingsComponent],
})
export class CourseSettingsComponent {
  course: Signal<Course>;
  isLoadingCourse: Signal<boolean>;

  constructor(private readonly store: Store) {
    this.course = toSignal(store.select(CourseSelectors.selectCourse));
    this.isLoadingCourse = toSignal(store.select(CourseSelectors.selectIsLoading));
  }

  onSave(course: Partial<Course>): void {
    const currentCourse = this.course();
    const id = currentCourse?.id;

    if (!id) {
      return;
    }

    this.store.dispatch(
      CourseActions.updateCourse({
        id,
        course: { ...currentCourse, ...course },
        nextRoute: ['/courses', id, 'form', 'contents'],
      }),
    );
  }
}
