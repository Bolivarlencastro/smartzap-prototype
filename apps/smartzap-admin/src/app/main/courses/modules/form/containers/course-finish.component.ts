import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { CourseActions } from '../../../store/actions';
import { CourseSelectors } from '../../../store/selectors';
import { CoursePublishComponent } from '../components/publish/course-publish.component';

@Component({
  selector: 'app-course-finish',
  template: ` <app-course-publish [courseStatus]="course()?.status" (publish)="onPublish()"></app-course-publish> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CoursePublishComponent],
})
export class CourseFinishComponent {
  private readonly store = inject(Store);

  course = toSignal(this.store.select(CourseSelectors.selectCourse));

  onPublish(): void {
    const id = this.course()?.id;
    if (id) {
      this.store.dispatch(CourseActions.startPublish({ id }));
    }
  }
}
